/**
 * Fetches World Cup 2026 fixtures from API-Football (api-sports.io) and prints
 * them grouped by round, with team names mapped to this project's 3-letter
 * codes, as ready-to-paste snippets for src/data.ts.
 *
 * Setup:
 *   1. Get your key from https://dashboard.api-football.com/profile/access
 *   2. Add it to .env (gitignored):  API_FOOTBALL_KEY=xxxxxxxx
 *   3. Run:  npm run fetch:2026
 *
 * This does NOT write to data.ts automatically — the bracket's `teams` array
 * encodes actual draw position (adjacent slots = opponents), which the API's
 * fixture list order doesn't guarantee. Review the printed output against the
 * official bracket before pasting it in.
 */
import "dotenv/config";
import { TEAMS } from "../src/data";

const API_KEY = process.env.API_FOOTBALL_KEY;
if (!API_KEY) {
  console.error("Missing API_FOOTBALL_KEY. Add it to your .env file.");
  process.exit(1);
}

const BASE_URL = "https://v3.football.api-sports.io";
const WORLD_CUP_LEAGUE_ID = 1; // FIFA World Cup, per API-Football's static league list
const SEASON = 2026;

// API-Football team names don't always match this project's naming
// (e.g. "USA" vs "United States"). Add overrides here as needed.
const NAME_ALIASES: Record<string, string> = {
  "usa": "USA",
  "united states": "USA",
  "ivory coast": "CIV",
  "côte d'ivoire": "CIV",
  "cote d'ivoire": "CIV",
  "dr congo": "COD",
  "congo dr": "COD",
  "bosnia and herzegovina": "BIH",
  "bosnia-herzegovina": "BIH",
  "south korea": "KOR",
  "korea republic": "KOR",
  "türkiye": "TUR",
  "turkey": "TUR",
  "qatar": "QAT",
  "iran": "IRN",
  "wales": "WAL",
  "tunisia": "TUN",
  "serbia": "SRB",
};

const NAME_TO_CODE = new Map<string, string>();
for (const [code, [name]] of Object.entries(TEAMS)) {
  NAME_TO_CODE.set(name.toLowerCase(), code);
}
for (const [alias, code] of Object.entries(NAME_ALIASES)) {
  NAME_TO_CODE.set(alias, code);
}

function resolveCode(apiName: string): string {
  const code = NAME_TO_CODE.get(apiName.toLowerCase());
  if (!code) {
    console.warn(`  ⚠ no code mapping for "${apiName}" — add it to NAME_ALIASES or TEAMS`);
    return apiName.toUpperCase().slice(0, 3);
  }
  return code;
}

interface ApiFixture {
  fixture: { id: number; date: string; status: { short: string } };
  league: { round: string };
  teams: {
    home: { name: string; winner: boolean | null };
    away: { name: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
  score: {
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

async function fetchFixtures(): Promise<ApiFixture[]> {
  const url = `${BASE_URL}/fixtures?league=${WORLD_CUP_LEAGUE_ID}&season=${SEASON}`;
  const res = await fetch(url, {
    headers: { "x-apisports-key": API_KEY! },
  });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  if (json.errors && Object.keys(json.errors).length > 0) {
    throw new Error(`API error: ${JSON.stringify(json.errors)}`);
  }
  return json.response as ApiFixture[];
}

function formatMatch(f: ApiFixture): string {
  const homeCode = resolveCode(f.teams.home.name);
  const awayCode = resolveCode(f.teams.away.name);
  const played = f.fixture.status.short === "FT" || f.fixture.status.short === "AET" || f.fixture.status.short === "PEN";

  if (!played) {
    return `  { ta: "${homeCode}", tb: "${awayCode}", s: null, w: null }, // ${f.teams.home.name} vs ${f.teams.away.name} — not yet played`;
  }

  const homeGoals = f.goals.home ?? 0;
  const awayGoals = f.goals.away ?? 0;
  const winnerIsHome = f.teams.home.winner === true;
  const w = winnerIsHome ? 0 : 1;

  const notes: string[] = [];
  let pens = "";
  if (f.score.penalty.home !== null && f.score.penalty.away !== null) {
    pens = `, p: "${f.score.penalty.home}-${f.score.penalty.away}"`;
    notes.push("pens");
  }
  if (f.score.extratime.home !== null) {
    notes.push("a.e.t.");
  }
  const x = notes.includes("a.e.t.") ? `, x: "a.e.t."` : "";

  return `  { ta: "${homeCode}", tb: "${awayCode}", s: [${homeGoals}, ${awayGoals}], w: ${w}${pens}${x} }, // ${f.teams.home.name} ${homeGoals}-${awayGoals} ${f.teams.away.name}`;
}

async function main() {
  console.log(`Fetching World Cup ${SEASON} fixtures from API-Football...\n`);
  const fixtures = await fetchFixtures();

  if (fixtures.length === 0) {
    console.log("No fixtures returned. The tournament may not have started, or check league/season IDs.");
    return;
  }

  const byRound = new Map<string, ApiFixture[]>();
  for (const f of fixtures) {
    const round = f.league.round;
    if (!byRound.has(round)) byRound.set(round, []);
    byRound.get(round)!.push(f);
  }

  for (const [round, matches] of byRound) {
    console.log(`\n// ---- ${round} (${matches.length} matches) ----`);
    matches
      .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime())
      .forEach((f) => console.log(formatMatch(f)));
  }

  console.log(
    "\n\nReview the above against the official bracket draw order, then paste the\n" +
    "relevant rounds into the r32 / r16 / qf / sf / final arrays in src/data.ts.\n" +
    "Remember: adjacent slots in `teams` must reflect actual bracket pairings,\n" +
    "not necessarily fixture date order."
  );
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
