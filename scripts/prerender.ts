// Post-build prerender: the app is a client-only SPA, so every route otherwise
// ships the same empty #root shell with one generic <title> — bad for indexing
// competitive queries like "2010 FIFA World Cup". This writes real static HTML
// with the right title / meta / canonical / OG / JSON-LD AND real, crawlable
// content baked into #root for:
//   • the homepage                     (dist/index.html)
//   • each tournament                  (dist/tournaments/<year>/index.html)
//   • each played knockout match       (dist/tournaments/<year>/matches/<slug>/index.html)
// createRoot() replaces #root on mount, so the app still takes over client-side
// with no hydration mismatch.
//
// Runs after `vite build` so it inherits the built asset references.

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { TOURNAMENTS, TEAMS, getTeamName } from "../src/data";
import { analyze } from "../src/analysis";
import { enumerateMatches, EnumeratedMatch } from "../src/matches";
import { ROUND_NAME } from "../src/constants";
import { getScorers } from "../src/scorers";
import { getPlayerOfMatch } from "../src/motm";
import { tournamentEvent, matchEvent } from "../src/schema";
import { generateCountryProfiles } from "../src/countries.generated";
import { MOCK_COUNTRIES, RESULT_LABEL, CountryProfile } from "../src/countries.mock";
import { COUNTRY_CODES, slugForCode } from "../src/countrySlug";

const BASE = "https://worldcuparchive.net";
const DIST = resolve(process.cwd(), "dist");
const template = readFileSync(resolve(DIST, "index.html"), "utf8");

const years = Object.keys(TOURNAMENTS).map(Number).sort((a, b) => a - b);
const yearsDesc = [...years].sort((a, b) => b - a);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ── Bracket resolution (mirrors TournamentPage helpers) ──────────────────────
type T = (typeof TOURNAMENTS)[number];

function r16Winners(t: T): string[] {
  if (!t.r16) return [];
  const out: string[] = [];
  for (let i = 0; i < 8; i++) {
    const m = t.r16[i];
    if (!m || m.w === null) continue;
    out.push(m.w === 0 ? t.teams[2 * i] : t.teams[2 * i + 1]);
  }
  return out;
}
function qfWinners(t: T): string[] {
  if (!t.qf) return [];
  const r16w = r16Winners(t);
  const out: string[] = [];
  for (let i = 0; i < 4; i++) {
    const m = t.qf[i];
    if (!m || m.w === null) continue;
    const a = r16w.length >= 8 ? r16w[2 * i] : t.teams[2 * i];
    const b = r16w.length >= 8 ? r16w[2 * i + 1] : t.teams[2 * i + 1];
    out.push(m.w === 0 ? a : b);
  }
  return out;
}
function sfTeams(t: T): string[] {
  if (!t.sf) return [];
  const qfw = qfWinners(t);
  if (qfw.length < 4) return [];
  const out: string[] = [];
  for (let i = 0; i < 2; i++) {
    const m = t.sf[i];
    if (!m || m.w === null) continue;
    out.push(m.w === 0 ? qfw[2 * i] : qfw[2 * i + 1]);
  }
  return out;
}
function champion(t: T): string | null {
  if (!t.final?.[0] || t.final[0].w === null) return null;
  const sf = sfTeams(t);
  if (sf.length < 2) return null;
  return t.final[0].w === 0 ? sf[0] : sf[1];
}
function runnerUp(t: T): string | null {
  if (!t.final?.[0] || t.final[0].w === null) return null;
  const sf = sfTeams(t);
  if (sf.length < 2) return null;
  return t.final[0].w === 0 ? sf[1] : sf[0];
}

// Penalty / extra-time suffix for a match, from the given team's perspective.
function matchNote(m: EnumeratedMatch): string {
  if (m.pens) return ` (${m.pens} pens)`;
  if (m.extra) return ` ${m.extra}`;
  return "";
}

// ── Shared head-injection ────────────────────────────────────────────────────
function render(
  title: string,
  description: string,
  canonical: string,
  jsonLd: string,
  content: string
): string {
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  if (jsonLd) {
    html = html.replace(
      "</head>",
      `<script type="application/ld+json" id="seo-jsonld">${jsonLd}</script>\n</head>`
    );
  }
  // id="seo-jsonld" matches the id the runtime SEO hook (src/seo.ts) uses, so on
  // mount it REPLACES this prerendered event instead of appending a second one —
  // otherwise Googlebot (which runs JS) sees two SportsEvents per page.
  // The prerendered text stays in #root so crawlers (and no-JS visitors) can read
  // it, but human visitors shouldn't watch the raw list flash by while the bundle
  // loads. Paint the branded loading screen fixed on top of it; createRoot()
  // replaces all of #root on mount, so the overlay disappears with the content.
  const overlay =
    `<div class="loading" style="position:fixed;inset:0;z-index:50">` +
    `<div class="kicker">FIFA World Cup Archive</div>` +
    `<h1>The Road to Glory</h1></div>`;
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>\s*<\/body>/,
    `<div id="root">${content}${overlay}</div>\n</body>`
  );
  return html;
}

// ── Knockout results list (links each played match to its detail page) ───────
function knockout(t: T, year: number): string {
  const matches = enumerateMatches(t, analyze(t));
  const order = ["r32", "r16", "qf", "sf", "final"];
  const parts: string[] = [];
  for (const round of order) {
    const rows = matches.filter((m) => m.round === round);
    if (!rows.length) continue;
    const items = rows
      .map((m) => {
        const a = esc(getTeamName(m.ta));
        const b = esc(getTeamName(m.tb));
        if (m.played && m.score) {
          const label = `${a} ${m.score[0]}–${m.score[1]} ${b}${esc(matchNote(m))}`;
          return `<li><a href="/tournaments/${year}/matches/${m.slug}/">${label}</a></li>`;
        }
        return `<li>${a} vs ${b}</li>`;
      })
      .join("");
    parts.push(`<h3>${ROUND_NAME[round]}</h3><ul>${items}</ul>`);
  }
  return parts.join("");
}

// ── Per-year SEO + content ───────────────────────────────────────────────────
function buildTournament(year: number): string {
  const t = TOURNAMENTS[year];
  const champ = champion(t);
  const champName = champ ? getTeamName(champ) : null;
  const ru = runnerUp(t);
  const finalMatch = t.final?.[0];
  // Score from the champion's perspective (final `s` is stored top–bottom).
  const champScore = finalMatch?.s
    ? finalMatch.w === 0
      ? `${finalMatch.s[0]}–${finalMatch.s[1]}`
      : `${finalMatch.s[1]}–${finalMatch.s[0]}`
    : null;
  const flipPens = (p: string) => p.split("-").reverse().join("-");
  const pensChamp = finalMatch?.p ? (finalMatch.w === 0 ? finalMatch.p : flipPens(finalMatch.p)) : null;
  const finalExtra = pensChamp ? ` (${pensChamp} pens)` : finalMatch?.x ? ` ${finalMatch.x}` : "";

  const title = champName
    ? `${year} FIFA World Cup Results — ${champName} Champion · The Road to Glory`
    : `${year} FIFA World Cup — Results, Bracket & Schedule · The Road to Glory`;
  const description =
    `${year} FIFA World Cup in ${t.host}. ${t.quote ? t.quote + " " : ""}` +
    `${champName ? `${champName} were champions. ` : ""}` +
    `Full knockout results, golden boot & glove, and all participating nations.`;
  // Trailing slash = the 200 URL Netlify serves (non-slash 301s here), so the
  // canonical/og:url/JSON-LD point at the real page rather than a redirect.
  const canonical = `${BASE}/tournaments/${year}/`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    ...tournamentEvent(year, t, champ),
  });

  const teams = [...new Set([...t.teams, ...(t.r32?.flatMap((m) => [m.ta, m.tb]) ?? [])])]
    .filter((c) => c !== "TBD" && TEAMS[c])
    .sort((a, b) => getTeamName(a).localeCompare(getTeamName(b)));

  const championHtml = champName
    ? `<h2>Champion</h2><p><strong>${esc(champName)}</strong> won the ${year} FIFA World Cup` +
      (champScore && ru ? `, beating ${esc(getTeamName(ru))} ${champScore}${finalExtra} in the final` : "") +
      `.</p>`
    : `<h2>Champion</h2><p>The ${year} FIFA World Cup is currently being played — the champion is still to be decided.</p>`;

  const awardsHtml =
    `<h2>Awards</h2><p>` +
    (t.goldenBoot ? `Golden Boot: ${esc(t.goldenBoot.name)} (${t.goldenBoot.goals} goals). ` : "Golden Boot: to be decided. ") +
    (t.goldenGlove ? `Golden Glove: ${esc(t.goldenGlove.name)}.` : "") +
    `</p>`;

  const nationsHtml =
    `<h2>Participating nations (${teams.length})</h2><ul>` +
    teams.map((c) => `<li>${esc(getTeamName(c))}</li>`).join("") + `</ul>`;

  const otherHtml =
    `<h2>Every World Cup</h2><ul>` +
    years.map((y) => `<li><a href="/tournaments/${y}/">${y} FIFA World Cup</a></li>`).join("") + `</ul>`;

  const content =
    `<main class="prerender">` +
    `<p><a href="/">The Road to Glory — World Cup Archive</a></p>` +
    `<h1>${year} FIFA World Cup</h1>` +
    `<p>${esc(t.host)}.${t.quote ? " " + esc(t.quote) : ""}</p>` +
    championHtml + awardsHtml +
    `<h2>Knockout results</h2>${knockout(t, year)}` +
    nationsHtml + otherHtml +
    `</main>`;

  return render(title, description, canonical, jsonLd, content);
}

// ── Per-match SEO + content ──────────────────────────────────────────────────
function goalsHtml(year: number, m: EnumeratedMatch): string {
  // Inline goals (2026 matches carry them on the match object) take precedence,
  // then the generated historical scorers set — same order the modal uses.
  const goals = m.goals ?? getScorers(year, m.ta, m.tb);
  const a = goals?.[0] ?? [];
  const b = goals?.[1] ?? [];
  if (!a.length && !b.length) return "";
  const col = (team: string, list: string[]) =>
    `<h3>${esc(getTeamName(team))}</h3>` +
    (list.length ? `<ul>${list.map((g) => `<li>${esc(g)}</li>`).join("")}</ul>` : `<p>No goals.</p>`);
  return `<h2>Goalscorers</h2>${col(m.ta, a)}${col(m.tb, b)}`;
}

function buildMatch(year: number, m: EnumeratedMatch): string {
  const t = TOURNAMENTS[year];
  const taName = getTeamName(m.ta);
  const tbName = getTeamName(m.tb);
  const roundName = ROUND_NAME[m.round];
  const scoreStr = m.score ? `${m.score[0]}–${m.score[1]}` : "";
  const note = matchNote(m);
  const winnerName = m.winner ? getTeamName(m.winner) : null;
  const canonical = `${BASE}/tournaments/${year}/matches/${m.slug}/`;

  const title = `${taName} ${scoreStr} ${tbName} — ${year} FIFA World Cup ${roundName} · The Road to Glory`;
  const description =
    `${taName} vs ${tbName}, ${year} FIFA World Cup ${roundName} in ${t.host}. ` +
    `Final score ${scoreStr}${note}.` +
    (winnerName ? ` ${winnerName} ${m.round === "final" ? "were crowned champions" : "advanced"}.` : "") +
    ` Goalscorers, result, and match details.`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    ...matchEvent(year, t.host, taName, tbName, roundName, m.slug),
  });

  const motm = getPlayerOfMatch(year, m.ta, m.tb);
  const motmHtml = motm
    ? `<h2>Player of the Match</h2><p>${esc(motm.name)} (${esc(getTeamName(motm.team))}).</p>`
    : "";

  const winnerHtml = winnerName
    ? `<p>${esc(winnerName)} ${m.round === "final" ? "were crowned champions" : "advanced to the next round"}.</p>`
    : "";

  const content =
    `<main class="prerender">` +
    `<p><a href="/tournaments/${year}/">← ${year} FIFA World Cup</a></p>` +
    `<h1>${esc(taName)} ${scoreStr} ${esc(tbName)}</h1>` +
    `<p>${year} FIFA World Cup ${roundName} · ${esc(t.host)}${esc(note)}</p>` +
    winnerHtml +
    goalsHtml(year, m) +
    motmHtml +
    `<p><a href="/tournaments/${year}/">All ${year} results</a> · <a href="/">World Cup Archive</a></p>` +
    `</main>`;

  return render(title, description, canonical, jsonLd, content);
}

// ── Per-country SEO + content ────────────────────────────────────────────────
function buildCountry(code: string, p: CountryProfile): string {
  const slug = slugForCode(code)!;
  const canonical = `${BASE}/countries/${slug}/`;
  const n = p.titles.length;

  const title = `${p.name} World Cup History — Record, Results & Top Scorers · The Road to Glory`;
  const description =
    n > 0
      ? `${p.name}: ${n}× FIFA World Cup champion${n > 1 ? "s" : ""}, ${p.appearances} appearances since ${p.firstAppearance}. All-time record, every knockout result, top scorers, and biggest rivalries.`
      : `${p.name} at the FIFA World Cup: ${p.bestResult.toLowerCase()}, ${p.appearances} appearance${p.appearances > 1 ? "s" : ""} since ${p.firstAppearance}. All-time record, results, top scorers, and biggest rivalries.`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: p.name,
    sport: "Association football",
    description: p.epithet,
    url: canonical,
  });

  const titlesHtml =
    n > 0
      ? `<h2>World Cup titles (${n})</h2><ul>` +
        p.titles.map((t) => `<li>${t.year} — won ${esc(t.final)}</li>`).join("") +
        `</ul>`
      : `<h2>Best result</h2><p>${esc(p.bestResult)}.</p>`;

  const rec = p.record;
  const played = rec.w + rec.d + rec.l;
  const recordHtml =
    `<h2>All-time World Cup record</h2>` +
    `<p>Played ${played} · Won ${rec.w} · Drawn ${rec.d} · Lost ${rec.l} · Goals ${rec.gf}–${rec.ga}` +
    (rec.pensWon || rec.pensLost ? ` · Shootouts won ${rec.pensWon}, lost ${rec.pensLost}` : "") +
    `.</p>`;

  const scorersHtml = p.topScorers.length
    ? `<h2>Top World Cup scorers</h2><ul>` +
      p.topScorers
        .map((s) => `<li>${esc(s.name)} — ${s.goals} goal${s.goals === 1 ? "" : "s"} (${esc(s.span)})</li>`)
        .join("") +
      `</ul>`
    : "";

  const rivalriesHtml = p.rivalries.length
    ? `<h2>Biggest rivalries</h2><ul>` +
      p.rivalries
        .map((r) => {
          const rslug = slugForCode(r.code);
          const label = `${esc(r.name)} — played ${r.played} (W${r.w} D${r.d} L${r.l})`;
          return rslug ? `<li><a href="/countries/${rslug}/">${label}</a></li>` : `<li>${label}</li>`;
        })
        .join("") +
      `</ul>`
    : "";

  const definingHtml = p.definingMatches.length
    ? `<h2>Defining matches</h2><ul>` +
      p.definingMatches
        .map((d) => `<li>${d.year} ${esc(d.round)}: ${esc(d.fixture)} — ${esc(d.note)}</li>`)
        .join("") +
      `</ul>`
    : "";

  // Tournament-by-tournament: every edition the nation entered, linking played
  // editions to their tournament pages.
  const timelineRows = years
    .filter((y) => p.timeline[y])
    .map((y) => {
      const e = p.timeline[y]!;
      return `<li><a href="/tournaments/${y}/">${y}</a> — ${esc(RESULT_LABEL[e.result])}${e.note ? ` (${esc(e.note)})` : ""}</li>`;
    })
    .join("");
  const timelineHtml = timelineRows ? `<h2>Tournament by tournament</h2><ul>${timelineRows}</ul>` : "";

  const content =
    `<main class="prerender">` +
    `<p><a href="/">← World Cup Archive</a></p>` +
    `<h1>${esc(p.name)} at the FIFA World Cup</h1>` +
    `<p>${esc(p.epithet)}</p>` +
    `<p>${esc(p.confederation)} · ${p.appearances} appearance${p.appearances > 1 ? "s" : ""} · first in ${p.firstAppearance}.</p>` +
    titlesHtml +
    recordHtml +
    scorersHtml +
    rivalriesHtml +
    definingHtml +
    timelineHtml +
    `<p><a href="/">Explore every World Cup bracket, 1930–2026</a></p>` +
    `</main>`;

  return render(title, description, canonical, jsonLd, content);
}

// ── Homepage ─────────────────────────────────────────────────────────────────
function buildHome(): string {
  const title = "The Road to Glory — World Cup Radial Knockout Bracket, 1930–2026";
  const description =
    "Every FIFA World Cup knockout stage since 1930, drawn as one interactive radial bracket.";
  const canonical = `${BASE}/`;

  const list = yearsDesc
    .map((y) => {
      const t = TOURNAMENTS[y];
      const champ = champion(t);
      const champName = champ ? getTeamName(champ) : null;
      const tail = champName ? ` — ${esc(champName)} champions` : ` — in ${esc(t.host)}`;
      return `<li><a href="/tournaments/${y}/">${y} FIFA World Cup</a>${tail}</li>`;
    })
    .join("");

  const content =
    `<main class="prerender">` +
    `<h1>The Road to Glory — FIFA World Cup Archive</h1>` +
    `<p>Every FIFA World Cup knockout stage from 1930 to 2026, drawn as one interactive ` +
    `radial bracket. Browse all ${years.length} tournaments — hosts, champions, golden boots, ` +
    `and full knockout results from the Round of 16 to the Final.</p>` +
    `<h2>All World Cups</h2><ul>${list}</ul>` +
    `</main>`;

  // The homepage keeps its own canonical/OG (already correct in the template);
  // no page-specific JSON-LD (the WebSite schema in the template head stands).
  return render(title, description, canonical, "", content);
}

// ── Emit ─────────────────────────────────────────────────────────────────────
let nTournaments = 0;
let nMatches = 0;

for (const year of years) {
  const dir = resolve(DIST, "tournaments", String(year));
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), buildTournament(year));
  nTournaments++;

  const played = enumerateMatches(TOURNAMENTS[year], analyze(TOURNAMENTS[year])).filter((m) => m.played);
  for (const m of played) {
    const mdir = resolve(dir, "matches", m.slug);
    mkdirSync(mdir, { recursive: true });
    writeFileSync(resolve(mdir, "index.html"), buildMatch(year, m));
    nMatches++;
  }
}

const countryProfiles = { ...generateCountryProfiles(), ...MOCK_COUNTRIES };
let nCountries = 0;
for (const code of COUNTRY_CODES) {
  const profile = countryProfiles[code];
  const slug = slugForCode(code);
  if (!profile || !slug) {
    console.warn(`prerender: no profile/slug for ${code} — skipping country page`);
    continue;
  }
  const cdir = resolve(DIST, "countries", slug);
  mkdirSync(cdir, { recursive: true });
  writeFileSync(resolve(cdir, "index.html"), buildCountry(code, profile));
  nCountries++;
}

writeFileSync(resolve(DIST, "index.html"), buildHome());

console.log(
  `Prerendered homepage + ${nTournaments} tournament pages + ${nMatches} match pages + ${nCountries} country pages → dist/`
);
