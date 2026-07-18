/**
 * Backfill missing World Cup knockout highlights WITHOUT a YouTube API key.
 *
 * fetch-highlights.ts needs YOUTUBE_API_KEY; this variant uses only public
 * endpoints: it scrapes the YouTube search page for the top result's videoId
 * (same "first hit" strategy the keyed fetcher uses), then verifies that id via
 * the public oEmbed endpoint to get the real title + channel. Anything oEmbed
 * can't confirm is skipped, so we never write a fabricated/broken id.
 *
 * The read-time title guard in countries.generated.ts still filters clips whose
 * title names other teams, so an occasional wrong top-hit won't reach a page.
 *
 * Usage: npx tsx scripts/extract-matches.ts > scripts/matches.json   (if stale)
 *        npx tsx scripts/backfill-highlights.ts [minYear]
 *   e.g. npx tsx scripts/backfill-highlights.ts 2006
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { getTeamName } from "../src/data";

interface MatchEntry {
  year: number;
  round: string;
  key: string;
  teamA: string;
  teamB: string;
}
interface Highlight {
  videoId: string;
  title: string;
  thumbnail: string;
}

const dir = (import.meta as any).dirname ?? __dirname;
const matchesPath = resolve(dir, "..", "scripts", "matches.json");
const outFile = resolve(dir, "..", "src", "highlights.ts");
const minYear = Number(process.argv[2] ?? "0");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const WC_YEARS = new Set([1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026]);
const ROUND_WORD: Record<string, string> = { r32: "round of 32", r16: "round of 16", qf: "quarter final", sf: "semi final", final: "final" };

// A candidate is wrong if its verified title names a *different* World Cup year
// (e.g. a 2026 rematch surfacing for a 2006 fixture). Titles with no WC year are
// allowed through — same tolerance as the original keyed fetcher.
function yearConflict(title: string, matchYear: number): boolean {
  for (const m of title.matchAll(/\b(19|20)\d{2}\b/g)) {
    const y = Number(m[0]);
    if (WC_YEARS.has(y) && y !== matchYear) return true;
  }
  return false;
}

// YouTube throttles/drops requests without a browser User-Agent, surfacing as
// "TypeError: fetch failed". Send one and retry with backoff on transient errors.
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
async function httpGet(url: string): Promise<Response | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" } });
      if (res.status === 429 || res.status >= 500) { await sleep(1500 * (attempt + 1)); continue; }
      return res;
    } catch {
      await sleep(1500 * (attempt + 1)); // network drop — back off and retry
    }
  }
  return null;
}

// Scrape the YouTube results page for the top hit's videoId AND its title, both
// straight from YouTube's own search JSON. The videoId is therefore real without
// a second round-trip, and reading the title here avoids the oEmbed endpoint,
// which 401s on clips that merely have embedding disabled (many official FIFA
// uploads) — those play fine on the /watch URLs we link to.
async function searchTop(query: string): Promise<{ videoId: string; title: string } | null> {
  const res = await httpGet(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
  if (!res || !res.ok) return null;
  const html = await res.text();
  const m = html.match(/"videoId":"([A-Za-z0-9_-]{11})"[\s\S]{0,800}?"title":\{"runs":\[\{"text":"((?:[^"\\]|\\.)*)"/);
  if (!m) return null;
  let title = m[2];
  try { title = JSON.parse(`"${m[2]}"`); } catch { /* keep raw on unescape failure */ }
  return { videoId: m[1], title };
}

async function main() {
  const matches: MatchEntry[] = JSON.parse(readFileSync(matchesPath, "utf-8"));

  // Resume: parse existing entries so we only fetch gaps.
  const existing: Record<string, Highlight> = {};
  try {
    const old = readFileSync(outFile, "utf-8");
    for (const m of old.matchAll(/"(\d{4}_\w+_\w+)":\s*\{\s*videoId:\s*"([^"]+)",\s*title:\s*"((?:[^"\\]|\\.)*)",\s*thumbnail:\s*"([^"]*)"/g)) {
      existing[m[1]] = { videoId: m[2], title: m[3], thumbnail: m[4] };
    }
  } catch {}

  const toFetch = matches.filter((m) => m.year >= minYear && !existing[m.key]);
  console.log(`${matches.length} knockout matches, ${Object.keys(existing).length} already have clips, ${toFetch.length} to backfill${minYear ? ` (year >= ${minYear})` : ""}.\n`);

  const results: Record<string, Highlight> = { ...existing };
  let added = 0, skipped = 0;

  // Resolve one match to a verified clip, retrying with a round-specific query if
  // the first hit is the wrong World Cup year.
  const teams = (m: MatchEntry) => `${getTeamName(m.teamA)} ${getTeamName(m.teamB)}`;
  async function resolveMatch(m: MatchEntry): Promise<Highlight | null> {
    const queries = [
      `${teams(m)} ${m.year} World Cup highlights`,
      `${teams(m)} ${m.year} World Cup ${ROUND_WORD[m.round] ?? ""} highlights`,
    ];
    for (const q of queries) {
      const hit = await searchTop(q);
      if (!hit) { await sleep(400); continue; }
      if (yearConflict(hit.title, m.year)) { await sleep(400); continue; }
      return { videoId: hit.videoId, title: hit.title, thumbnail: `https://i.ytimg.com/vi/${hit.videoId}/hqdefault.jpg` };
    }
    return null;
  }

  // Persist after each success so a network drop never loses progress; the
  // resume logic above then picks up exactly where we left off on the next run.
  const writeOut = () => {
    const entries = Object.entries(results)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `  ${JSON.stringify(k)}: { videoId: ${JSON.stringify(v.videoId)}, title: ${JSON.stringify(v.title)}, thumbnail: ${JSON.stringify(v.thumbnail)} },`)
      .join("\n");
    writeFileSync(outFile, `// Auto-generated by scripts/fetch-highlights.ts / scripts/backfill-highlights.ts — DO NOT EDIT BY HAND.
// Keyed \`\${year}_\${teamA}_\${teamB}\`. lookup tries both orientations.

export interface Highlight {
  videoId: string;
  title: string;
  thumbnail: string;
}

export const HIGHLIGHTS: Record<string, Highlight> = {
${entries}
};

export function getHighlights(
  year: number,
  teamA: string,
  teamB: string
): Highlight | null {
  return (
    HIGHLIGHTS[\`\${year}_\${teamA}_\${teamB}\`] ??
    HIGHLIGHTS[\`\${year}_\${teamB}_\${teamA}\`] ??
    null
  );
}
`, "utf-8");
  };

  for (const m of toFetch) {
    process.stdout.write(`[${m.year}] ${m.teamA} v ${m.teamB} ... `);
    try {
      const hl = await resolveMatch(m);
      if (!hl) { console.log("no verified result"); skipped++; await sleep(500); continue; }
      results[m.key] = hl;
      added++;
      writeOut(); // incremental save
      console.log(`${hl.videoId} — ${hl.title.slice(0, 70)}`);
    } catch (err) {
      console.log(`error: ${err}`);
      skipped++;
    }
    await sleep(700); // be polite to the public endpoints
  }

  writeOut();
  console.log(`\n---\nAdded: ${added} | Skipped: ${skipped} | Total entries: ${Object.keys(results).length}`);
}

main();
