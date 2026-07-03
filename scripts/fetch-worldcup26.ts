/**
 * Fetches World Cup 2026 data from the free, no-auth worldcup26.ir REST API
 * (https://github.com/rezarahiminia/worldcup2026) and prints ready-to-paste
 * snippets for src/data.ts: new TEAMS/COLORS entries, the outer `teams`
 * array, and the `r32` / `r16` / `qf` / `sf` / `final` match arrays.
 *
 * Unlike api-football, this API labels every knockout slot with its feeder
 * match (e.g. "Winner Match 74"), so the R32 -> R16 -> QF -> SF -> Final
 * bracket-feed mapping is deterministic — no manual draw-order guessing.
 *
 * Run:  npm run fetch:worldcup26
 */
import { TEAMS } from "../src/data";

const BASE_URL = "https://worldcup26.ir";

interface ApiTeam {
  id: string;
  name_en: string;
  fifa_code: string;
  iso2: string;
  groups: string;
}

interface ApiGame {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  home_penalty_score?: string;
  away_penalty_score?: string;
  finished: string; // "TRUE" | "FALSE"
  type: "group" | "r32" | "r16" | "qf" | "sf" | "third" | "final";
  home_team_label?: string;
  away_team_label?: string;
}

// Regional-indicator flag emoji from a 2-letter ISO code (e.g. "FR" -> 🇫🇷).
// Not all API entries have a valid ISO2 (e.g. Scotland uses "SCO").
function flagEmoji(iso2: string): string | null {
  if (!/^[A-Z]{2}$/i.test(iso2)) return null;
  const codePoints = [...iso2.toUpperCase()].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...codePoints);
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`${path} failed: ${res.status} ${res.statusText}`);
  return res.json();
}

// The API sends absent fields as the literal string "null", not JSON null.
function hasValue(field: string | undefined): field is string {
  return field != null && field !== "null";
}

// 0 = home advances, 1 = away advances, null = not decided (shouldn't happen
// for a finished knockout match, but guarded just in case of bad data).
function winnerIndex(g: ApiGame): 0 | 1 | null {
  if (g.finished !== "TRUE") return null;
  if (hasValue(g.home_penalty_score) && hasValue(g.away_penalty_score)) {
    return Number(g.home_penalty_score) > Number(g.away_penalty_score) ? 0 : 1;
  }
  const hs = Number(g.home_score);
  const as = Number(g.away_score);
  if (hs === as) return null;
  return hs > as ? 0 : 1;
}

function formatMatch(homeCode: string, awayCode: string, g: ApiGame | undefined): string {
  if (!g || g.finished !== "TRUE") {
    return `{ ta: "${homeCode}", tb: "${awayCode}", s: null, w: null }`;
  }
  const hs = Number(g.home_score);
  const as = Number(g.away_score);
  const w = winnerIndex(g);
  const p = hasValue(g.home_penalty_score) && hasValue(g.away_penalty_score)
    ? `, p: "${g.home_penalty_score}-${g.away_penalty_score}"`
    : "";
  return `{ ta: "${homeCode}", tb: "${awayCode}", s: [${hs}, ${as}], w: ${w}${p} }`;
}

async function main() {
  console.log("Fetching World Cup 2026 data from worldcup26.ir...\n");

  const [teamsRes, gamesRes] = await Promise.all([
    fetchJson<{ teams: ApiTeam[] }>("/get/teams"),
    fetchJson<{ games: ApiGame[] }>("/get/games"),
  ]);
  const apiTeams = teamsRes.teams;
  const games = gamesRes.games;

  const teamById = new Map(apiTeams.map((t) => [t.id, t]));
  const gameById = new Map(games.map((g) => [g.id, g]));

  // --- Report any team codes not yet in our TEAMS dict ---
  const missing = apiTeams.filter((t) => !TEAMS[t.fifa_code]);
  if (missing.length > 0) {
    console.log(`// ---- New team codes to add to TEAMS / COLORS in src/data.ts (${missing.length}) ----`);
    for (const t of missing) {
      const flag = flagEmoji(t.iso2) ?? "🏳️";
      console.log(`  ${t.fifa_code}: ["${t.name_en}", "${flag}"],  // COLORS.${t.fifa_code} = "#TODO",`);
    }
    console.log();
  }

  const codeOf = (teamId: string): string => {
    if (teamId === "0") return "TBD";
    const t = teamById.get(teamId);
    return t ? t.fifa_code : "TBD";
  };

  // R16 matches (89-96) define outer bracket order via their feeder R32 match IDs,
  // parsed from labels like "Winner Match 74".
  const r16Games = games.filter((g) => g.type === "r16").sort((a, b) => Number(a.id) - Number(b.id));

  const feederMatchId = (label: string | undefined): string | null => {
    const m = label?.match(/Match (\d+)/);
    return m ? m[1] : null;
  };

  const teamsArr: string[] = [];
  const r32Arr: string[] = [];

  for (const r16Game of r16Games) {
    for (const label of [r16Game.home_team_label, r16Game.away_team_label]) {
      const feederId = feederMatchId(label);
      const feederGame = feederId ? gameById.get(feederId) : undefined;

      if (feederGame) {
        const ta = codeOf(feederGame.home_team_id);
        const tb = codeOf(feederGame.away_team_id);
        r32Arr.push(`  ${formatMatch(ta, tb, feederGame)},`);
        // The team advancing from this R32 match into the outer `teams` slot:
        const w = winnerIndex(feederGame);
        teamsArr.push(w === null ? "TBD" : w === 0 ? ta : tb);
      } else {
        r32Arr.push(`  { ta: "TBD", tb: "TBD", s: null, w: null }, // could not resolve feeder for "${label}"`);
        teamsArr.push("TBD");
      }
    }
  }

  console.log("// ---- teams (outer bracket leaves, in draw order) ----");
  console.log(`teams: [\n  ${teamsArr.map((c) => `"${c}"`).join(", ")}\n],\n`);

  console.log("// ---- r32 (one entry per leaf, feeds into `teams` above) ----");
  console.log(`r32: [\n${r32Arr.join("\n")}\n],\n`);

  const r16AllPlayed = r16Games.every((g) => g.finished === "TRUE");
  console.log("// ---- r16 ----");
  if (r16AllPlayed) {
    console.log("r16: [");
    r16Games.forEach((g) => {
      console.log(`  ${formatMatch(codeOf(g.home_team_id), codeOf(g.away_team_id), g)},`);
    });
    console.log("],\n");
  } else {
    console.log("r16: null,  // not all Round of 16 matches are finished yet\n");
  }

  for (const stage of ["qf", "sf", "final"] as const) {
    const stageGames = games.filter((g) => g.type === stage).sort((a, b) => Number(a.id) - Number(b.id));
    const allPlayed = stageGames.length > 0 && stageGames.every((g) => g.finished === "TRUE");
    console.log(`// ---- ${stage} ----`);
    if (allPlayed) {
      console.log(`${stage}: [`);
      stageGames.forEach((g) => {
        console.log(`  ${formatMatch(codeOf(g.home_team_id), codeOf(g.away_team_id), g)},`);
      });
      console.log("],\n");
    } else {
      console.log(`${stage}: null,\n`);
    }
  }

  console.log(
    "Paste the sections above into the 2026 entry in src/data.ts.\n" +
    "Add any new team codes to TEAMS and COLORS first (see top of output), or\n" +
    "resolveCode-style codes will show as \"TBD\" placeholders instead."
  );
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
