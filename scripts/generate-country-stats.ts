// Generates src/countryStats.generated.ts from the jfjelstul/worldcup dataset
// (MIT-licensed): complete FIFA Men's World Cup records 1930–2022, including the
// group stage that data.ts omits. Produces per-nation W/D/L + goals, shootout
// tallies, real top scorers, and head-to-head rivalries.
//
// Run: npx tsx scripts/generate-country-stats.ts
//
// Conventions:
//   • Penalty-shootout matches count as DRAWS in W/D/L (official FIFA record),
//     with the outcome tracked separately as pensWon / pensLost.
//   • Own goals are excluded from top scorers.
//   • 2026 is not in the dataset (live tournament); its knockout matches are
//     folded in at runtime by countries.generated.ts from data.ts.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { TEAMS } from "../src/data";

const BASE = "https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv";

// ── Team-name → app-code mapping ─────────────────────────────────────────────
// The app uses legacy FIFA codes (GER, NED, ALG…) while jfjelstul uses ISO3, so
// we bridge on team NAME (which also disambiguates West Germany vs Germany, both
// coded DEU in the dataset). A few names differ in spelling — aliased below.

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]/g, "");

// jfjelstul team_name (normalised) → app code, for names the reverse map misses.
const NAME_ALIASES: Record<string, string> = {
  westgermany: "FRG",
  eastgermany: "GDR",
  sovietunion: "URS",
  czechoslovakia: "TCH",
  czechrepublic: "CZE",
  yugoslavia: "YUG",
  zaire: "ZAI",
  republicofireland: "IRL",
  iran: "IRN",
  iriran: "IRN",
  turkey: "TUR",
  dutcheastindies: "IDN",
  bosniaandherzegovina: "BIH",
  ivorycoast: "CIV",
  southkorea: "KOR",
  korearepublic: "KOR",
  northkorea: "PRK",
  koreadpr: "PRK",
  unitedstates: "USA",
  saudiarabia: "KSA",
};

// Reverse map from the app's own team names (handles Türkiye, Côte d'Ivoire…).
const NAME_TO_CODE: Record<string, string> = {};
for (const [code, [name]] of Object.entries(TEAMS)) {
  if (code === "TBD") continue;
  NAME_TO_CODE[norm(name)] = code;
}

const unmatched = new Set<string>();
function toCode(name: string): string | null {
  const n = norm(name);
  const code = NAME_ALIASES[n] ?? NAME_TO_CODE[n] ?? null;
  if (!code) unmatched.add(name);
  return code;
}

// ── Minimal quote-aware CSV parser ───────────────────────────────────────────
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); field = ""; row = []; }
    else if (c === "\r") { /* skip */ }
    else field += c;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  const header = rows.shift()!;
  return rows
    .filter((r) => r.length === header.length)
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

async function fetchCsv(file: string): Promise<Record<string, string>[]> {
  const res = await fetch(`${BASE}/${file}`);
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  return parseCsv(await res.text());
}

const isMens = (tournamentName: string) => tournamentName.includes("Men's");
const yearOf = (tournamentName: string) => parseInt(tournamentName.slice(0, 4), 10);

// ── Aggregation ──────────────────────────────────────────────────────────────

interface Rec { w: number; d: number; l: number; gf: number; ga: number; pensWon: number; pensLost: number }
interface Rivalry { played: number; w: number; d: number; l: number }

const records: Record<string, Rec> = {};
const rivalries: Record<string, Record<string, Rivalry>> = {};
const scorers: Record<string, Record<string, { name: string; goals: number; years: Set<number> }>> = {};

function rec(code: string): Rec {
  return (records[code] ??= { w: 0, d: 0, l: 0, gf: 0, ga: 0, pensWon: 0, pensLost: 0 });
}

async function main() {
  console.log("Fetching jfjelstul dataset…");
  const [appearances, goals] = await Promise.all([
    fetchCsv("team_appearances.csv"),
    fetchCsv("goals.csv"),
  ]);

  // Records + rivalries from per-team match rows.
  for (const a of appearances) {
    if (!isMens(a.tournament_name)) continue;
    const code = toCode(a.team_name);
    if (!code) continue;

    const r = rec(code);
    r.gf += Number(a.goals_for);
    r.ga += Number(a.goals_against);

    const shootout = a.penalty_shootout === "1";
    if (shootout) {
      r.d += 1; // FIFA counts shootout matches as draws
      if (a.result === "win") r.pensWon += 1;
      else if (a.result === "lose") r.pensLost += 1;
    } else if (a.win === "1") r.w += 1;
    else if (a.lose === "1") r.l += 1;
    else r.d += 1;

    // Head-to-head.
    const opp = toCode(a.opponent_name);
    if (opp && opp !== code) {
      const table = (rivalries[code] ??= {});
      const h2h = (table[opp] ??= { played: 0, w: 0, d: 0, l: 0 });
      h2h.played += 1;
      if (shootout || a.draw === "1") h2h.d += 1;
      else if (a.win === "1") h2h.w += 1;
      else h2h.l += 1;
    }
  }

  // Top scorers from per-goal rows (exclude own goals).
  for (const g of goals) {
    if (!isMens(g.tournament_name)) continue;
    if (g.own_goal === "1") continue;
    const code = toCode(g.player_team_name);
    if (!code) continue;
    // jfjelstul uses "not applicable" as a null marker (mononyms like Ronaldo, Pelé).
    const na = (v: string) => (v && v !== "not applicable" ? v : "");
    const name = `${na(g.given_name)} ${na(g.family_name)}`.trim();
    if (!name) continue;
    const table = (scorers[code] ??= {});
    const entry = (table[g.player_id] ??= { name, goals: 0, years: new Set() });
    entry.goals += 1;
    entry.years.add(yearOf(g.tournament_name));
  }

  // ── Assemble output ────────────────────────────────────────────────────────
  const out: Record<string, unknown> = {};
  for (const code of Object.keys(records).sort()) {
    const topScorers = Object.values(scorers[code] ?? {})
      .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
      .slice(0, 5)
      .map((s) => {
        const ys = [...s.years].sort();
        return { name: s.name, goals: s.goals, span: ys.length === 1 ? `${ys[0]}` : `${ys[0]}–${ys[ys.length - 1]}` };
      });

    const riv = Object.entries(rivalries[code] ?? {})
      .sort((a, b) => b[1].played - a[1].played || b[1].w - a[1].w)
      .slice(0, 4)
      .map(([oppCode, h]) => ({ code: oppCode, ...h }));

    out[code] = { record: records[code], topScorers, rivalries: riv };
  }

  const header = `// AUTO-GENERATED by scripts/generate-country-stats.ts — DO NOT EDIT BY HAND.
// Source: jfjelstul/worldcup (MIT). FIFA Men's World Cup 1930–2022, group stage
// included. Shootout matches count as draws; pens tracked separately.

export interface CountryStats {
  record: { w: number; d: number; l: number; gf: number; ga: number; pensWon: number; pensLost: number };
  topScorers: { name: string; goals: number; span: string }[];
  rivalries: { code: string; played: number; w: number; d: number; l: number }[];
}

export const COUNTRY_STATS: Record<string, CountryStats> = ${JSON.stringify(out, null, 2)};
`;

  const outPath = resolve(process.cwd(), "src", "countryStats.generated.ts");
  writeFileSync(outPath, header);

  console.log(`✓ ${Object.keys(out).length} nations → ${outPath}`);
  if (unmatched.size > 0) {
    console.log(`\nUnmatched team names (no app code — excluded):`);
    console.log("  " + [...unmatched].sort().join(", "));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
