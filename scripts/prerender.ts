// Post-build prerender: the app is a client-only SPA, so every route otherwise
// ships the same empty #root shell with one generic <title> — bad for indexing
// competitive queries like "2010 FIFA World Cup". This writes a real static HTML
// file per tournament (dist/tournaments/<year>/index.html) with the right
// title / meta / canonical / OG / JSON-LD AND real, crawlable content baked into
// #root. createRoot() replaces #root on mount, so the app still takes over
// client-side with no hydration mismatch.
//
// Runs after `vite build` so it inherits the built asset references.

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { TOURNAMENTS, TEAMS, getTeamName } from "../src/data";

const BASE = "https://worldcuparchive.net";
const DIST = resolve(process.cwd(), "dist");
const template = readFileSync(resolve(DIST, "index.html"), "utf8");

const years = Object.keys(TOURNAMENTS).map(Number).sort((a, b) => a - b);

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

interface Row { a: string; b: string; s: [number, number] | null; }
function round(label: string, rows: Row[]): string {
  const items = rows
    .filter((r) => r.a && r.b && r.a !== "TBD" && r.b !== "TBD")
    .map((r) => {
      const score = r.s ? `${r.s[0]}–${r.s[1]}` : "vs";
      return `<li>${esc(getTeamName(r.a))} ${score} ${esc(getTeamName(r.b))}</li>`;
    });
  return items.length ? `<h3>${label}</h3><ul>${items.join("")}</ul>` : "";
}

function knockout(t: T): string {
  const parts: string[] = [];
  if (t.r32) {
    parts.push(round("Round of 32", t.r32.map((m) => ({ a: m.ta, b: m.tb, s: m.s ?? null }))));
  }
  if (t.r16) {
    parts.push(round("Round of 16", t.r16.map((m, i) =>
      m ? { a: t.teams[2 * i], b: t.teams[2 * i + 1], s: m.s } : { a: "", b: "", s: null })));
  }
  if (t.qf) {
    const r16w = r16Winners(t);
    parts.push(round("Quarter-finals", t.qf.map((m, i) => m ? {
      a: r16w.length >= 8 ? r16w[2 * i] : t.teams[2 * i],
      b: r16w.length >= 8 ? r16w[2 * i + 1] : t.teams[2 * i + 1], s: m.s,
    } : { a: "", b: "", s: null })));
  }
  if (t.sf) {
    const qfw = qfWinners(t);
    parts.push(round("Semi-finals", t.sf.map((m, i) => m ? {
      a: qfw[2 * i] ?? "TBD", b: qfw[2 * i + 1] ?? "TBD", s: m.s,
    } : { a: "", b: "", s: null })));
  }
  if (t.final?.[0]) {
    const sf = sfTeams(t);
    parts.push(round("Final", [{ a: sf[0] ?? "TBD", b: sf[1] ?? "TBD", s: t.final[0].s }]));
  }
  return parts.filter(Boolean).join("");
}

// ── Per-year SEO + content ───────────────────────────────────────────────────
function build(year: number): string {
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
  const canonical = `${BASE}/tournaments/${year}`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${year} FIFA World Cup`,
    sport: "Association football",
    startDate: `${year}-06-01`,
    endDate: `${year}-07-31`,
    location: { "@type": "Place", name: t.host },
    description: t.quote || `${year} FIFA World Cup in ${t.host}.`,
    url: canonical,
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
    years.map((y) => `<li><a href="/tournaments/${y}">${y} FIFA World Cup</a></li>`).join("") + `</ul>`;

  const content =
    `<main class="prerender">` +
    `<p><a href="/">The Road to Glory — World Cup Archive</a></p>` +
    `<h1>${year} FIFA World Cup</h1>` +
    `<p>${esc(t.host)}.${t.quote ? " " + esc(t.quote) : ""}</p>` +
    championHtml + awardsHtml +
    `<h2>Knockout results</h2>${knockout(t)}` +
    nationsHtml + otherHtml +
    `</main>`;

  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = html.replace("</head>", `<script type="application/ld+json">${jsonLd}</script>\n</head>`);
  html = html.replace(/<div id="root">[\s\S]*?<\/div>\s*<\/body>/, `<div id="root">${content}</div>\n</body>`);
  return html;
}

let n = 0;
for (const year of years) {
  const dir = resolve(DIST, "tournaments", String(year));
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), build(year));
  n++;
}
console.log(`Prerendered ${n} tournament pages → dist/tournaments/<year>/index.html`);
