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
import { getHighlights } from "../src/highlights";
import { tournamentEvent, matchEvent, breadcrumbList, videoObject, faqPage, profilePage, itemList, videoObjectForMatch, SITE_NAME } from "../src/schema";
import { generateCountryProfiles } from "../src/countries.generated";
import { applyMockOverrides, RESULT_LABEL, CountryProfile } from "../src/countries.mock";
import { COUNTRY_CODES, slugForCode } from "../src/countrySlug";
import { champion, runnerUp, thirdFourth } from "./tournament-result";
import { getHubData } from "../src/countriesHub";
import { comparePath } from "../src/router";
import { computeComparison, comparisonMeta, comparisonJsonLd, pairsWithMeetings, Comparison } from "../src/compare";

const BASE = "https://worldcuparchive.net";
const DIST = resolve(process.cwd(), "dist");
const template = readFileSync(resolve(DIST, "index.html"), "utf8");

const years = Object.keys(TOURNAMENTS).map(Number).sort((a, b) => a - b);
const yearsDesc = [...years].sort((a, b) => b - a);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ── Bracket resolution (mirrors TournamentPage helpers) ──────────────────────
type T = (typeof TOURNAMENTS)[number];

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
  content: string,
  // Absolute URL of this page's generated OG card + its alt text. When omitted,
  // the page keeps the generic og-image.webp baked into the template.
  ogImage?: string,
  ogImageAlt?: string
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
  if (ogImage) {
    html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${esc(ogImage)}$2`);
    html = html.replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${esc(ogImage)}$2`);
    if (ogImageAlt) {
      html = html.replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${esc(ogImageAlt)}$2`);
      html = html.replace(/(<meta name="twitter:image:alt" content=")[^"]*(")/, `$1${esc(ogImageAlt)}$2`);
    }
  }
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
  // Replace the whole #root placeholder. Anchor on the closing </div> that
  // precedes the first trailing <script>/<\/body> (rather than requiring </div>
  // to sit directly before </body>) — the built index.html has inline scripts
  // (e.g. PostHog) between #root and </body>, so the old </body>-adjacent match
  // silently failed and shipped every page with no prerendered content.
  const rootBlock = /<div id="root">[\s\S]*?<\/div>\s*(?=<script|<\/body>)/;
  if (!rootBlock.test(html)) {
    throw new Error("prerender: could not locate #root block to inject content — check index.html structure");
  }
  html = html.replace(rootBlock, `<div id="root">${content}${overlay}</div>\n`);
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
    "@graph": [
      tournamentEvent(year, t, champ),
      faqPage([
        { question: `Who won the ${year} FIFA World Cup?`, answer: champName ?? "Not yet decided" },
        { question: `Where was the ${year} World Cup held?`, answer: t.host },
        { question: `Who was the top scorer of the ${year} World Cup?`, answer: t.goldenBoot ? `${t.goldenBoot.name} with ${t.goldenBoot.goals} goals` : "Not yet decided" },
        { question: `How many teams participated in the ${year} World Cup?`, answer: `${t.teams.length} teams` },
      ]),
      breadcrumbList([
        { name: SITE_NAME, url: `${BASE}/` },
        { name: `${year} FIFA World Cup`, url: canonical },
      ]),
    ],
  });

  const teams = [...new Set([...t.teams, ...(t.r32?.flatMap((m) => [m.ta, m.tb]) ?? [])])]
    .filter((c) => c !== "TBD" && TEAMS[c])
    .sort((a, b) => getTeamName(a).localeCompare(getTeamName(b)));

  const championHtml = champName
    ? `<h2>Champion</h2><p><strong>${esc(champName)}</strong> won the ${year} FIFA World Cup` +
      (champScore && ru ? `, beating ${esc(getTeamName(ru))} ${champScore}${finalExtra} in the final` : "") +
      `.</p>`
    : `<h2>Champion</h2><p>The ${year} FIFA World Cup is currently being played — the champion is still to be decided.</p>`;

  // Final standings (1st–4th) — sits between Champion and Awards, matching the
  // app's section order so pre-hydration HTML and the client agree.
  const [thirdCode, fourthCode] = thirdFourth(t);
  const standingsRows: [string, string | null][] = [
    ["Champion", champ],
    ["Runner-up", ru],
    ["Third place", thirdCode],
    ["Fourth place", fourthCode],
  ];
  const standingsHtml =
    champ || thirdCode || fourthCode
      ? `<h2>Final standings</h2><ol>` +
        standingsRows
          .map(([label, code]) => {
            if (!code) return `<li>${label}: to be decided</li>`;
            const cslug = slugForCode(code);
            const name = esc(getTeamName(code));
            const link = cslug ? `<a href="/countries/${cslug}/">${name}</a>` : name;
            return `<li>${label}: ${link}</li>`;
          })
          .join("") +
        `</ol>`
      : "";

  const awardsHtml =
    `<h2>Awards</h2><p>` +
    (t.goldenBoot ? `Golden Boot: ${esc(t.goldenBoot.name)} (${t.goldenBoot.goals} goals). ` : "Golden Boot: to be decided. ") +
    (t.goldenGlove ? `Golden Glove: ${esc(t.goldenGlove.name)}.` : "") +
    `</p>`;

  // Link each nation to its country page — this is the crawlable entry point into
  // the country cluster (the homepage lists only tournaments), so it spreads
  // ranking signal from the tournament pages into the 71 country pages.
  const nationsHtml =
    `<h2>Participating nations (${teams.length})</h2><ul>` +
    teams
      .map((c) => {
        const cslug = slugForCode(c);
        const name = esc(getTeamName(c));
        return cslug ? `<li><a href="/countries/${cslug}/">${name}</a></li>` : `<li>${name}</li>`;
      })
      .join("") + `</ul>`;

  const otherHtml =
    `<h2>Every World Cup</h2><ul>` +
    years.map((y) => `<li><a href="/tournaments/${y}/">${y} FIFA World Cup</a></li>`).join("") + `</ul>`;

  const content =
    `<main class="prerender">` +
    `<p><a href="/">The Road to Glory — World Cup Archive</a></p>` +
    `<h1>${year} FIFA World Cup</h1>` +
    `<p>${esc(t.host)}.${t.quote ? " " + esc(t.quote) : ""}</p>` +
    championHtml +
    // Decided tournaments show standings above Awards; an in-progress one (no
    // champion) shows them below, matching TournamentPage.
    (champ ? standingsHtml + awardsHtml : awardsHtml + standingsHtml) +
    `<h2>Knockout results</h2>${knockout(t, year)}` +
    nationsHtml + otherHtml +
    `</main>`;

  const ogImage = `${BASE}/og/tournaments/${year}.webp`;
  const ogAlt = champName
    ? `${year} FIFA World Cup — ${champName} champions`
    : `${year} FIFA World Cup`;
  return render(title, description, canonical, jsonLd, content, ogImage, ogAlt);
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
    "@graph": [
      matchEvent(year, t.host, taName, tbName, roundName, m.slug),
      ...(getHighlights(year, m.ta, m.tb)
        ? [videoObjectForMatch({
            videoId: getHighlights(year, m.ta, m.tb)!.videoId,
            title: getHighlights(year, m.ta, m.tb)!.title,
            thumbnail: getHighlights(year, m.ta, m.tb)!.thumbnail,
            year,
          })]
        : []),
      breadcrumbList([
        { name: SITE_NAME, url: `${BASE}/` },
        { name: `${year} FIFA World Cup`, url: `${BASE}/tournaments/${year}/` },
        { name: `${taName} ${scoreStr} ${tbName}`, url: canonical },
      ]),
    ],
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

  const videoNodes = p.videos.map(videoObject);
  const sportsTeam = {
    "@type": "SportsTeam",
    name: p.name,
    sport: "Association football",
    description: p.epithet,
    url: canonical,
  };
  const buildDate = "2026-07-30";
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      sportsTeam,
      profilePage(sportsTeam, buildDate, buildDate),
      ...videoNodes,
      breadcrumbList([
        { name: SITE_NAME, url: `${BASE}/` },
        { name: "Countries", url: `${BASE}/countries/` },
        { name: p.name, url: canonical },
      ]),
    ],
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

  const videosHtml = p.videos.length
    ? `<h2>Video highlights</h2><ul>` +
      p.videos
        .map(
          (v) =>
            `<li><a href="${esc(v.url)}">${esc(v.title)}</a>` +
            (v.year ? ` (${v.year})` : "") +
            `</li>`
        )
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
    videosHtml +
    timelineHtml +
    `<p><a href="/">Explore every World Cup bracket, 1930–2026</a></p>` +
    `</main>`;

  const ogImage = `${BASE}/og/countries/${slug}.webp`;
  const ogAlt = `${p.name} at the FIFA World Cup — record and honours`;
  return render(title, description, canonical, jsonLd, content, ogImage, ogAlt);
}

// ── Head-to-head compare pages ───────────────────────────────────────────────
function buildCompare(c: Comparison): string {
  const canonical = `${BASE}${comparePath(c.codeA, c.codeB)}/`;
  const { title, description } = comparisonMeta(c);
  const jsonLd = JSON.stringify(comparisonJsonLd(c));
  const { nameA, nameB, h2h, meetings, titlesYearsA, titlesYearsB } = c;

  const recordHtml =
    h2h.played > 0
      ? `<h2>World Cup head-to-head record</h2>` +
        `<p>Played ${h2h.played} · ${esc(nameA)} ${h2h.wA} · Draws ${h2h.d} · ${esc(nameB)} ${h2h.wB}.</p>`
      : `<h2>World Cup head-to-head record</h2>` +
        `<p>${esc(nameA)} and ${esc(nameB)} have never met at a FIFA World Cup.</p>`;

  const titleLine = (name: string, years: number[]) =>
    years.length > 0
      ? `${esc(name)} — ${years.length}× champion${years.length > 1 ? "s" : ""} (${years.join(", ")})`
      : `${esc(name)} — no World Cup title`;
  const titlesHtml =
    `<h2>World Cup titles</h2><ul>` +
    `<li>${titleLine(nameA, titlesYearsA)}</li>` +
    `<li>${titleLine(nameB, titlesYearsB)}</li>` +
    `</ul>`;

  const meetingsHtml = meetings.length
    ? `<h2>Every World Cup meeting (${meetings.length})</h2><ul>` +
      meetings
        .map((m) => {
          const suffix = m.pens ? ` (${m.pens} pens)` : m.aet ? " a.e.t." : "";
          const outcome = m.winner ? `${esc(m.winner)} won` : "draw";
          const label =
            `${m.year} ${esc(m.round)}: ${esc(nameA)} ${m.scoreA}–${m.scoreB} ${esc(nameB)}${suffix} — ${outcome}`;
          return m.slug
            ? `<li><a href="/tournaments/${m.year}/matches/${m.slug}/">${label}</a></li>`
            : `<li>${label}</li>`;
        })
        .join("") +
      `</ul>`
    : "";

  const slugA = slugForCode(c.codeA);
  const slugB = slugForCode(c.codeB);
  const profileLinks =
    `<p>` +
    (slugA ? `<a href="/countries/${slugA}/">${esc(nameA)} profile</a>` : esc(nameA)) +
    ` · ` +
    (slugB ? `<a href="/countries/${slugB}/">${esc(nameB)} profile</a>` : esc(nameB)) +
    `</p>`;

  const content =
    `<main class="prerender">` +
    `<p><a href="/">← World Cup Archive</a></p>` +
    `<h1>${esc(nameA)} vs ${esc(nameB)} — World Cup Head-to-Head</h1>` +
    recordHtml +
    titlesHtml +
    meetingsHtml +
    profileLinks +
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
    `<p><a href="/countries/">Browse all World Cup nations</a> — every team by confederation, with titles and records.</p>` +
    `</main>`;

  // The homepage keeps its own canonical/OG (already correct in the template);
  // no page-specific JSON-LD (the WebSite schema in the template head stands).
  return render(title, description, canonical, "", content);
}

// ── /countries hub — links every nation, grouped like the client component ───
function buildCountriesHub(): string {
  const { total, champions, groups } = getHubData();
  const canonical = `${BASE}/countries/`;
  const title = `World Cup Nations — All ${total} Teams, Titles & Records · ${SITE_NAME}`;
  const description =
    `Every nation to play a FIFA World Cup, 1930–2026 — champions ranked by titles and all ` +
    `teams by confederation, each linking to its full record, results and top scorers.`;

  const stat = (n: (typeof champions)[number]) =>
    n.titles > 0
      ? `${n.titles}× champion${n.titles > 1 ? "s" : ""}`
      : `${n.appearances} appearance${n.appearances === 1 ? "" : "s"}`;
  const li = (n: (typeof champions)[number]) =>
    `<li><a href="/countries/${n.slug}/">${esc(n.name)}</a> — ${esc(stat(n))}</li>`;

  const honour = `<h2>Roll of honour</h2><ul>${champions.map(li).join("")}</ul>`;
  const grouped = groups
    .map((g) => `<h2>${esc(g.label)} (${g.nations.length})</h2><ul>${g.nations.map(li).join("")}</ul>`)
    .join("");

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: "World Cup Nations", url: canonical },
      itemList(
        groups.flatMap((g) =>
          g.nations.map((n) => ({
            name: n.name,
            url: `${BASE}/countries/${n.slug}/`,
          }))
        )
      ),
      breadcrumbList([
        { name: SITE_NAME, url: `${BASE}/` },
        { name: "Countries", url: canonical },
      ]),
    ],
  });

  const content =
    `<main class="prerender">` +
    `<p><a href="/">← The Road to Glory — World Cup Archive</a></p>` +
    `<h1>World Cup Nations</h1>` +
    `<p>Every one of the ${total} nations to grace a FIFA World Cup, 1930–2026 — the champions ` +
    `ranked by titles, and all teams grouped by confederation.</p>` +
    honour + grouped +
    `</main>`;

  const ogImage = `${BASE}/og/countries.webp`;
  return render(title, description, canonical, jsonLd, content, ogImage, "World Cup Nations — every team, 1930–2026");
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

const countryProfiles = applyMockOverrides(generateCountryProfiles());
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

// Head-to-head compare pages, for every pair that has actually met (1930–2026).
let nCompare = 0;
for (const [a, b] of pairsWithMeetings()) {
  const c = computeComparison(a, b);
  // Dir segment mirrors the canonical /compare/<first>-vs-<second>/ URL.
  const seg = comparePath(c.codeA, c.codeB).replace(/^\/compare\//, "");
  const dir = resolve(DIST, "compare", seg);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), buildCompare(c));
  nCompare++;
}

writeFileSync(resolve(DIST, "index.html"), buildHome());

// Countries hub at dist/countries/index.html — must run after the per-country
// loop above so it never clobbers a dist/countries/<slug>/index.html.
mkdirSync(resolve(DIST, "countries"), { recursive: true });
writeFileSync(resolve(DIST, "countries", "index.html"), buildCountriesHub());

console.log(
  `Prerendered homepage + countries hub + ${nTournaments} tournament pages + ${nMatches} match pages + ${nCountries} country pages + ${nCompare} compare pages → dist/`
);
