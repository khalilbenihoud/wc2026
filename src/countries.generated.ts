import { TOURNAMENTS, TEAMS, getTeamName, getTeamFlag } from "./data";
import {
  CountryProfile,
  Milestone,
  VideoHighlight,
  EDITIONS,
  RESULT_LABEL,
  ResultLevel,
} from "./countries.mock";
import { COUNTRY_STATS } from "./countryStats.generated";
import { ROUND_NAME } from "./constants";
import { HIGHLIGHTS } from "./highlights";

type RoundResult = {
  year: number;
  result: ResultLevel;
  note?: string;
};

function getResultForTeam(code: string, year: number): RoundResult {
  const t = TOURNAMENTS[year];
  if (!t) return { year, result: "DNE" };

  const hasR32 = !!(t.r32 && t.r32.length);
  const inR32 = hasR32 && t.r32!.some((m) => m.ta === code || m.tb === code);
  const inTeams = t.teams.indexOf(code) !== -1;
  if (!inTeams && !inR32) return { year, result: "DNE" };

  // A team's result is the DEEPEST round it reached. Each reached* helper below
  // returns the teams that played in that round (i.e. won their way into it), so
  // a team present in round N but not N+1 was eliminated in N. Champion and
  // runner-up come straight off the final. (The previous logic labelled the
  // WINNERS of a round with that round's name, shifting every knockout finish
  // down a stage — semi-finalists showed as "QF", R16 teams as "GS", etc.)
  if (getChampion(t, year) === code) return { year, result: "W" };
  if (getFinalist(t, year) === code) return { year, result: "F" };
  if (reachedSemis(t, year).includes(code)) return { year, result: "3RD" };
  // 1930 had no quarter-finals: 4 groups → semi‑finals → final.
  // Teams that didn't reach the semis went out in the group stage.
  if (year === 1930) return { year, result: "GS" };
  if (reachedQuarters(t, year).includes(code)) return { year, result: "QF" };
  if (reachedR16(t, year).includes(code)) return { year, result: "R16" };
  if (inR32) return { year, result: "R32" };
  if (inTeams) return { year, result: "GS" };
  return { year, result: "DNE" };
}

// ── Teams that reached (contested) each knockout round ───────────────────────
// Winners of the previous round advance INTO the next, so "reached the semis" =
// "won a quarter-final", and so on.
function reachedSemis(t: typeof TOURNAMENTS[number], year: number): string[] {
  return getQFWinnerTeams(t, year);
}
function reachedQuarters(t: typeof TOURNAMENTS[number], year: number): string[] {
  if (t.r16 && t.r16.length) return getR16WinnerTeams(t, year);
  // 8-team knockouts (1930, 1950, 1954–1982) have no R16; the qf round is fed
  // positionally from the first eight listed teams.
  if (t.qf && t.qf.length) return t.teams.slice(0, 8).filter((c) => c !== "TBD");
  return [];
}
function reachedR16(t: typeof TOURNAMENTS[number], year: number): string[] {
  if (t.r32 && t.r32.length) return getR32WinnerTeams(t, year);
  if (t.r16 && t.r16.length) return t.teams.filter((c) => c !== "TBD");
  return [];
}
function getR32WinnerTeams(t: typeof TOURNAMENTS[number], year: number): string[] {
  void year;
  if (!t.r32) return [];
  const out: string[] = [];
  for (const m of t.r32) {
    if (m.w === null || m.w === undefined) continue;
    out.push(m.w === 0 ? m.ta : m.tb);
  }
  return out;
}

function getChampion(t: typeof TOURNAMENTS[number], year: number): string | null {
  if (!t.final?.[0] || t.final[0].w === null) return null;
  const f = t.final[0];
  const sfTeams = getSemiFinalistTeams(t, year);
  if (sfTeams.length < 2) return null;
  return f.w === 0 ? sfTeams[0] : sfTeams[1];
}

function getFinalist(t: typeof TOURNAMENTS[number], year: number): string | null {
  if (!t.final?.[0] || t.final[0].w === null) return null;
  const f = t.final[0];
  const sfTeams = getSemiFinalistTeams(t, year);
  if (sfTeams.length < 2) return null;
  return f.w === 0 ? sfTeams[1] : sfTeams[0];
}

function getSemiFinalistTeams(t: typeof TOURNAMENTS[number], year: number): string[] {
  if (!t.sf) return [];
  const qfWinners = getQFWinnerTeams(t, year);
  if (qfWinners.length < 4) return [];
  const result: string[] = [];
  for (let i = 0; i < 2; i++) {
    const m = t.sf[i];
    if (!m || m.w === null) continue;
    result.push(m.w === 0 ? qfWinners[2 * i] : qfWinners[2 * i + 1]);
  }
  return result;
}

function getSemiFinalists(t: typeof TOURNAMENTS[number], year: number): string[] {
  const sfTeams = getSemiFinalistTeams(t, year);
  const champ = getChampion(t, year);
  const finalist = getFinalist(t, year);
  return sfTeams.filter((c) => c !== champ && c !== finalist);
}

function getQFWinnerTeams(t: typeof TOURNAMENTS[number], year: number): string[] {
  if (!t.qf) return [];
  const r16Winners = getR16WinnerTeams(t, year);
  const result: string[] = [];
  for (let i = 0; i < 4; i++) {
    const m = t.qf[i];
    if (!m || m.w === null) continue;
    if (r16Winners.length >= 8) {
      result.push(m.w === 0 ? r16Winners[2 * i] : r16Winners[2 * i + 1]);
    } else if (t.teams.length >= 8) {
      result.push(m.w === 0 ? t.teams[2 * i] : t.teams[2 * i + 1]);
    }
  }
  return result;
}

function getQFTeams(t: typeof TOURNAMENTS[number], year: number): string[] {
  return getQFWinnerTeams(t, year);
}

function getR16WinnerTeams(t: typeof TOURNAMENTS[number], year: number): string[] {
  if (!t.r16) return [];
  const result: string[] = [];
  for (let i = 0; i < 8; i++) {
    const m = t.r16[i];
    if (!m || m.w === null) continue;
    result.push(m.w === 0 ? t.teams[2 * i] : t.teams[2 * i + 1]);
  }
  return result;
}

function getR16Teams(t: typeof TOURNAMENTS[number], year: number): string[] {
  return getR16WinnerTeams(t, year);
}

function countMatchResults(
  code: string
): { w: number; d: number; l: number; gf: number; ga: number } {
  let w = 0, d = 0, l = 0, gf = 0, ga = 0;

  for (const year of Object.keys(TOURNAMENTS).map(Number)) {
    const t = TOURNAMENTS[year];

    if (t.r32) {
      for (const m of t.r32) {
        if (m.ta !== code && m.tb !== code) continue;
        if (!m.s) continue;
        const isA = m.ta === code;
        const goalsFor = isA ? m.s[0] : m.s[1];
        const goalsAgainst = isA ? m.s[1] : m.s[0];
        gf += goalsFor;
        ga += goalsAgainst;
        if (m.w === null) { d++; continue; }
        const won = (isA && m.w === 0) || (!isA && m.w === 1);
        if (won) w++; else l++;
      }
    }

    const teamIdx = t.teams.indexOf(code);
    if (teamIdx === -1) continue;

    const rounds: ("r16" | "qf" | "sf" | "final")[] = ["r16", "qf", "sf", "final"];
    for (const round of rounds) {
      const matches = t[round];
      if (!matches) continue;
      for (const m of matches) {
        if (!m) continue;
        const involved = getTeamsInMatch(t, year, round, m);
        if (!involved.includes(code)) continue;
        gf += m.s[code === involved[0] ? 0 : 1];
        ga += m.s[code === involved[0] ? 1 : 0];
        if (m.w === null) { d++; continue; }
        const winner = m.w === 0 ? involved[0] : involved[1];
        if (winner === code) w++; else l++;
      }
    }
  }

  return { w, d, l, gf, ga };
}

function getTeamsInMatch(
  t: typeof TOURNAMENTS[number],
  _year: number,
  round: string,
  m: { s: [number, number]; w: number | null }
): string[] {
  if (round === "r16" && t.r16) {
    const idx = t.r16.indexOf(m as typeof t.r16[number]);
    if (idx >= 0) return [t.teams[2 * idx], t.teams[2 * idx + 1]];
  }
  if (round === "qf" && t.qf) {
    const r16w = getR16WinnerTeams(t, _year);
    const idx = t.qf.indexOf(m as typeof t.qf[number]);
    if (idx >= 0 && r16w.length >= 8) {
      return [r16w[2 * idx], r16w[2 * idx + 1]];
    }
    if (idx >= 0) return [t.teams[2 * idx], t.teams[2 * idx + 1]];
  }
  if (round === "sf" && t.sf) {
    const qfw = getQFWinnerTeams(t, _year);
    const idx = t.sf.indexOf(m as typeof t.sf[number]);
    if (idx >= 0 && qfw.length >= 4) {
      return [qfw[2 * idx], qfw[2 * idx + 1]];
    }
  }
  if (round === "final" && t.final) {
    const sfw = getSemiFinalistTeams(t, _year);
    if (sfw.length >= 2) return [sfw[0], sfw[1]];
  }
  return [];
}

function getTopScorers(code: string, minYear?: number): { name: string; goals: number; span: string }[] {
  const goalsByPlayer: Record<string, number> = {};
  const yearsByPlayer: Record<string, Set<number>> = {};

  for (const year of Object.keys(TOURNAMENTS).map(Number)) {
    if (minYear !== undefined && year < minYear) continue;
    const t = TOURNAMENTS[year];
    const allGoals: [string[], string[]][] = [];

    if (t.r32) {
      for (const m of t.r32) {
        if (m.ta !== code && m.tb !== code) continue;
        if (!m.g) continue;
        const isA = m.ta === code;
        allGoals.push(isA ? [m.g[0], m.g[1]] : [m.g[1], m.g[0]]);
      }
    }

    const teamIdx = t.teams.indexOf(code);
    if (teamIdx === -1 && !t.r32) continue;

    const rounds: ("r16" | "qf" | "sf" | "final")[] = ["r16", "qf", "sf", "final"];
    for (const round of rounds) {
      const matches = t[round];
      if (!matches) continue;
      for (const m of matches) {
        if (!m || !m.g) continue;
        const involved = getTeamsInMatch(t, year, round, m);
        if (!involved.includes(code)) continue;
        const isA = code === involved[0];
        allGoals.push(isA ? [m.g[0], m.g[1]] : [m.g[1], m.g[0]]);
      }
    }

    for (const [teamGoals] of allGoals) {
      for (const g of teamGoals) {
        const name = g.replace(/\s*\d+'.*$/, "").replace(/\s*\(.*\)$/, "").trim();
        if (!name) continue;
        goalsByPlayer[name] = (goalsByPlayer[name] || 0) + 1;
        if (!yearsByPlayer[name]) yearsByPlayer[name] = new Set();
        yearsByPlayer[name].add(year);
      }
    }
  }

  return Object.entries(goalsByPlayer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, goals]) => {
      const years = Array.from(yearsByPlayer[name]).sort();
      const span = years.length === 1
        ? String(years[0])
        : `${years[0]}–${years[years.length - 1]}`;
      return { name, goals, span };
    });
}

type MatchInfo = {
  year: number;
  roundKey: string;
  opponent: string;
  ourScore: number;
  theirScore: number;
  outcome: "W" | "D" | "L";
};

function getTeamMatches(code: string): MatchInfo[] {
  const matches: MatchInfo[] = [];

  for (const year of Object.keys(TOURNAMENTS).map(Number).sort((a, b) => b - a)) {
    const t = TOURNAMENTS[year];

    if (t.r32) {
      for (const m of t.r32) {
        if (m.ta !== code && m.tb !== code) continue;
        if (!m.s) continue;
        const isA = m.ta === code;
        matches.push({
          year,
          roundKey: "r32",
          opponent: isA ? m.tb : m.ta,
          ourScore: isA ? m.s[0] : m.s[1],
          theirScore: isA ? m.s[1] : m.s[0],
          outcome: m.w === null ? "D" : (isA ? (m.w === 0 ? "W" : "L") : (m.w === 1 ? "W" : "L")),
        });
      }
    }

    const teamIdx = t.teams.indexOf(code);
    if (teamIdx === -1) continue;

    const rounds: { key: string; resolve: (t: typeof TOURNAMENTS[number], m: typeof t.r16[number]) => string[] }[] = [
      { key: "r16", resolve: (_t, m) => {
        const idx = _t.r16?.indexOf(m as typeof _t.r16[number]) ?? -1;
        return idx >= 0 ? [_t.teams[2 * idx], _t.teams[2 * idx + 1]] : [];
      }},
      { key: "qf", resolve: (_t, m) => {
        const r16w = getR16WinnerTeams(_t, year);
        const idx = _t.qf?.indexOf(m as typeof _t.qf[number]) ?? -1;
        if (idx >= 0 && r16w.length >= 8) return [r16w[2 * idx], r16w[2 * idx + 1]];
        if (idx >= 0) return [_t.teams[2 * idx], _t.teams[2 * idx + 1]];
        return [];
      }},
      { key: "sf", resolve: (_t, m) => {
        const qfw = getQFWinnerTeams(_t, year);
        const idx = _t.sf?.indexOf(m as typeof _t.sf[number]) ?? -1;
        if (idx >= 0 && qfw.length >= 4) return [qfw[2 * idx], qfw[2 * idx + 1]];
        return [];
      }},
    ];

    for (const { key, resolve } of rounds) {
      const arr = t[key as "r16" | "qf" | "sf"];
      if (!arr) continue;
      for (const m of arr) {
        if (!m) continue;
        const involved = resolve(t, m);
        if (!involved.includes(code)) continue;
        const isA = involved[0] === code;
        matches.push({
          year,
          roundKey: key,
          opponent: isA ? involved[1] : involved[0],
          ourScore: isA ? m.s[0] : m.s[1],
          theirScore: isA ? m.s[1] : m.s[0],
          outcome: m.w === null ? "D" : (isA ? (m.w === 0 ? "W" : "L") : (m.w === 1 ? "W" : "L")),
        });
      }
    }

    // Final
    if (t.final && t.final[0]) {
      const f = t.final[0];
      if (f.w !== null) {
        const sfw = getSemiFinalistTeams(t, year);
        if (sfw.length >= 2 && [sfw[0], sfw[1]].includes(code)) {
          const isA = sfw[0] === code;
          matches.push({
            year,
            roundKey: "final",
            opponent: isA ? sfw[1] : sfw[0],
            ourScore: isA ? f.s[0] : f.s[1],
            theirScore: isA ? f.s[1] : f.s[0],
            outcome: (isA ? (f.w === 0 ? "W" : "L") : (f.w === 1 ? "W" : "L")),
          });
        }
      }
    }
  }

  return matches;
}

function deriveForm(code: string): { label: string; fixture: string; outcome: "W" | "D" | "L" }[] {
  return getTeamMatches(code).slice(0, 5).map((m) => ({
    label: `${m.year} · ${ROUND_NAME[m.roundKey] ?? m.roundKey}`,
    fixture: `${getTeamName(code)} ${m.ourScore}–${m.theirScore} ${getTeamName(m.opponent)}`,
    outcome: m.outcome,
  }));
}

function deriveDefiningMatches(code: string): { year: number; round: string; fixture: string; note: string }[] {
  const all = getTeamMatches(code);
  const defining: { year: number; round: string; fixture: string; note: string }[] = [];

  for (const m of all) {
    if (m.roundKey === "final") {
      const verb = m.outcome === "W" ? "champions" : "runners-up";
      defining.push({
        year: m.year,
        round: "Final",
        fixture: `${getTeamName(code)} ${m.ourScore}–${m.theirScore} ${getTeamName(m.opponent)}`,
        note: `${getTeamName(code)} finished as ${verb} of the ${m.year} FIFA World Cup.`,
      });
    } else if (m.roundKey === "sf" && m.outcome === "W") {
      defining.push({
        year: m.year,
        round: "Semi-final",
        fixture: `${getTeamName(code)} ${m.ourScore}–${m.theirScore} ${getTeamName(m.opponent)}`,
        note: `A semi-final victory that sent ${getTeamName(code)} to the ${m.year} final.`,
      });
    }
  }

  return defining;
}

// How notable each World Cup outcome is, used to rank a nation's milestones and
// keep the strongest ones when we cap the list. Titles rank highest; a debut
// appearance is the gentle floor so even minnows get at least one card.
const RUN_RANK: Partial<Record<ResultLevel, number>> = {
  F: 90, "3RD": 80, "4TH": 70, QF: 60, R16: 50, R32: 40,
};

// One-line description of a deep run, phrased per finish.
function runDetail(name: string, year: number, result: ResultLevel): string {
  switch (result) {
    case "F": return `${name} finished runners-up at the ${year} World Cup.`;
    case "3RD": return `${name} finished third at the ${year} World Cup.`;
    case "4TH": return `${name} finished fourth at the ${year} World Cup.`;
    case "QF": return `${name} reached the quarter-finals in ${year}.`;
    case "R16": return `${name} reached the round of 16 in ${year}.`;
    default: return `${name} reached the round of 32 in ${year}.`;
  }
}

// Factual career milestones derived from the bracket data: every title, each
// notable knockout run, and the nation's World Cup debut. These are NOT presented
// as news — no source or publication date, only the tournament year (each card
// links to that edition's page on this site). Ranked by notability, capped, then
// shown newest first.
function deriveMilestones(code: string, name: string, titles: { year: number; final: string }[]): Milestone[] {
  type Candidate = { year: number; rank: number; headline: string; detail: string };
  const byYear = new Map<number, Candidate>();
  // One milestone per year; if two apply (e.g. debut year that also reached a
  // knockout round), keep the more notable framing.
  const add = (c: Candidate) => {
    const existing = byYear.get(c.year);
    if (!existing || c.rank > existing.rank) byYear.set(c.year, c);
  };

  titles.forEach((t, i) => add({
    year: t.year,
    rank: 100,
    headline: `World champions — ${t.year}`,
    detail: `${name} lifted the trophy for the ${i === 0 ? "first" : ordinal(i + 1)} time after a ${t.final} final.`,
  }));

  let debutYear = Infinity;
  for (const year of EDITIONS) {
    if (!TOURNAMENTS[year]) continue;
    const result = getResultForTeam(code, year).result;
    if (result === "DNE") continue;
    if (year < debutYear) debutYear = year;
    const rank = RUN_RANK[result];
    if (rank !== undefined) {
      add({ year, rank, headline: `${RESULT_LABEL[result]} — ${year}`, detail: runDetail(name, year, result) });
    }
  }

  if (debutYear !== Infinity) add({
    year: debutYear,
    rank: 10,
    headline: `World Cup debut — ${debutYear}`,
    detail: `${name} made their first World Cup appearance in ${debutYear}.`,
  });

  return Array.from(byYear.values())
    .sort((a, b) => b.rank - a.rank) // keep the most notable when capping
    .slice(0, 6)
    .sort((a, b) => b.year - a.year) // display newest first
    .map((c) => ({ year: c.year, headline: c.headline, detail: c.detail }));
}

function ordinal(n: number): string {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

// The highlights dataset is keyed by fixture, but the auto-fetcher sometimes
// mapped a key to the wrong clip (typically the tournament final) when it could
// not find the exact match. The clip's *title* is always truthful about what it
// shows, so we gate on the title: a video only appears on a nation's page if its
// title actually names that nation. Aliases cover historical names and the short
// forms that show up in YouTube titles.
const TEAM_TITLE_ALIASES: Record<string, string[]> = {
  USA: ["United States", "USA"],
  KOR: ["South Korea", "Korea Republic"],
  PRK: ["North Korea", "Korea DPR", "DPR Korea"],
  NED: ["Netherlands", "Holland"],
  URS: ["Soviet Union", "USSR"],
  RUS: ["Russia"],
  FRG: ["West Germany", "W. Germany", "Germany"],
  GDR: ["East Germany"],
  GER: ["Germany"],
  TCH: ["Czechoslovakia"],
  CZE: ["Czech Republic", "Czechia"],
  YUG: ["Yugoslavia"],
  ZAI: ["Zaire", "DR Congo"],
  COD: ["DR Congo", "Congo"],
  IRL: ["Ireland"],
  NIR: ["Northern Ireland"],
  TUR: ["Türkiye", "Turkey"],
  CIV: ["Côte d'Ivoire", "Ivory Coast"],
  IDN: ["Dutch East Indies", "Indonesia"],
  RSA: ["South Africa"],
  BIH: ["Bosnia"],
  KSA: ["Saudi Arabia"],
};

function titleAliases(code: string): string[] {
  return TEAM_TITLE_ALIASES[code] ?? [getTeamName(code)];
}

// Does a clip title reference this nation? Full-name aliases match case-
// insensitively; the 3-letter code matches only as a whole word (upper-case) so
// short codes like "GER" don't false-match inside words such as "Nigeria".
function titleNamesTeam(code: string, title: string): boolean {
  const lower = title.toLowerCase();
  if (titleAliases(code).some((a) => lower.includes(a.toLowerCase()))) return true;
  return new RegExp(`\\b${code}\\b`).test(title);
}

// A clip is confidently mis-keyed only when its title names some *other* team
// but not this one (e.g. the "Italy 2-1 Czechoslovakia" final keyed under
// Austria). Titles we can't parse — foreign-language ones like "Angleterre –
// Argentine" or "Nizozemska - Jugoslavija" — name no recognised team, so we fall
// through and keep trusting the fixture key rather than hide a real match.
function titleIsAboutOtherTeams(code: string, title: string): boolean {
  if (titleNamesTeam(code, title)) return false;
  return Object.keys(TEAMS).some((other) => other !== code && titleNamesTeam(other, title));
}

function deriveVideos(code: string): VideoHighlight[] {
  const seen = new Set<string>();
  const videos: VideoHighlight[] = [];

  for (const [key, h] of Object.entries(HIGHLIGHTS)) {
    const parts = key.split("_");
    const [, ta, tb] = parts;
    if (ta !== code && tb !== code) continue;
    // Skip clips whose title is demonstrably a different fixture (mis-keyed).
    if (titleIsAboutOtherTeams(code, h.title)) continue;
    if (seen.has(h.videoId)) continue;
    seen.add(h.videoId);
    videos.push({
      title: h.title,
      thumbnail: h.thumbnail,
      url: `https://www.youtube.com/watch?v=${h.videoId}`,
      duration: "",
    });
    if (videos.length >= 3) break;
  }

  return videos;
}

const CONFEDERATION_MAP: Record<string, string> = {
  GER: "UEFA", BRA: "CONMEBOL", PAR: "CONMEBOL", USA: "CONCACAF",
  MEX: "CONCACAF", ESP: "UEFA", IRL: "UEFA", KOR: "AFC",
  ITA: "UEFA", ENG: "UEFA", DEN: "UEFA", BEL: "UEFA",
  SEN: "CAF", SWE: "UEFA", TUR: "UEFA", JPN: "AFC",
  ARG: "CONMEBOL", ECU: "CONMEBOL", POR: "UEFA", NED: "UEFA",
  AUS: "AFC", SUI: "UEFA", UKR: "UEFA", GHA: "CAF",
  FRA: "UEFA", URU: "CONMEBOL", SVK: "UEFA", CHI: "CONMEBOL",
  COL: "CONMEBOL", CRC: "CONCACAF", GRE: "UEFA", NGA: "CAF",
  ALG: "CAF", CRO: "UEFA", RUS: "UEFA", POL: "UEFA",
  MAR: "CAF", CAN: "CONCACAF", YUG: "UEFA", NOR: "UEFA",
  ROU: "UEFA", BUL: "UEFA", KSA: "AFC", FRG: "UEFA",
  TCH: "UEFA", CMR: "CAF", URS: "UEFA", RSA: "CAF",
  CIV: "CAF", COD: "CAF", BIH: "UEFA", AUT: "UEFA",
  SCO: "UEFA", CPV: "CAF", TUN: "CAF", EGY: "CAF",
  IRQ: "AFC", UZB: "AFC", NZL: "OFC", CZE: "UEFA",
  QAT: "AFC", CUW: "CONCACAF", JOR: "AFC", HAI: "CONCACAF",
  PAN: "CONCACAF", IRN: "AFC", HUN: "UEFA", CUB: "CONCACAF",
  IDN: "AFC", BOL: "CONMEBOL", NIR: "UEFA", WAL: "UEFA",
  PRK: "AFC", PER: "CONMEBOL", ZAI: "CAF",
  GDR: "UEFA", HON: "CONCACAF", KUW: "AFC", PLE: "AFC", SLV: "CONCACAF",
};

export function generateCountryProfiles(): Record<string, CountryProfile> {
  const profiles: Record<string, CountryProfile> = {};
  const allCodes = new Set<string>();

  for (const year of Object.keys(TOURNAMENTS).map(Number)) {
    const t = TOURNAMENTS[year];
    for (const code of t.teams) allCodes.add(code);
    if (t.r32) {
      for (const m of t.r32) {
        allCodes.add(m.ta);
        allCodes.add(m.tb);
      }
    }
  }

  for (const code of allCodes) {
    if (code === "TBD") continue;
    if (!TEAMS[code]) continue;

    const timeline: Partial<Record<number, { result: ResultLevel; note?: string }>> = {};
    let appearances = 0;
    let firstApp = Infinity;

    for (const year of EDITIONS) {
      if (!TOURNAMENTS[year]) continue;
      const r = getResultForTeam(code, year);
      if (r.result !== "DNE") {
        timeline[year] = { result: r.result };
        appearances++;
        if (year < firstApp) firstApp = year;
      }
    }

    if (appearances === 0) continue;

    // Prefer the real, group-stage-inclusive stats (jfjelstul, 1930–2022). Fall
    // back to the knockout-only derivation for nations outside that dataset
    // (e.g. 2026 debutants), so every profile still gets a record.
    const stats = COUNTRY_STATS[code];
    const record = stats
      ? { ...stats.record }
      : { ...countMatchResults(code), pensWon: 0, pensLost: 0 };
    const historical = stats ? stats.topScorers : getTopScorers(code);
    const recent = getTopScorers(code, 2026);
    const merged = new Map<string, { name: string; goals: number; years: Set<number> }>();
    for (const s of historical) {
      merged.set(s.name, { name: s.name, goals: s.goals, years: new Set(s.span.split("–").map(Number)) });
    }
    for (const s of recent) {
      const existing = merged.get(s.name);
      if (existing) {
        existing.goals = Math.max(existing.goals, s.goals);
        for (const y of s.span.split("–").map(Number)) existing.years.add(y);
      } else {
        merged.set(s.name, { name: s.name, goals: s.goals, years: new Set(s.span.split("–").map(Number)) });
      }
    }
    // Rank by goals, then break ties by recency (most recent scorer first) so a
    // nation's current stars surface above long-retired players on the same
    // tally — e.g. Ounahi (2026) ahead of Khairi (1986) at two goals apiece.
    const topScorers = Array.from(merged.values())
      .map((s) => ({ ...s, lastYear: Math.max(...s.years) }))
      .sort((a, b) => b.goals - a.goals || b.lastYear - a.lastYear)
      .slice(0, 5)
      .map((s) => {
        const ys = Array.from(s.years).sort();
        return { name: s.name, goals: s.goals, span: ys.length === 1 ? `${ys[0]}` : `${ys[0]}–${ys[ys.length - 1]}` };
      });
    const rivalries = stats
      ? stats.rivalries.map((r) => ({
          code: r.code,
          name: getTeamName(r.code),
          flag: getTeamFlag(r.code),
          played: r.played,
          w: r.w,
          d: r.d,
          l: r.l,
        }))
      : [];

    const titles: { year: number; final: string }[] = [];
    let bestResult = "Group stage";

    for (const year of EDITIONS) {
      const entry = timeline[year];
      if (!entry) continue;
      if (entry.result === "W") {
        const t = TOURNAMENTS[year];
        const f = t.final?.[0];
        const finalStr = f ? `${f.s[0]}–${f.s[1]}` : "";
        titles.push({ year, final: finalStr });
      }
    }

    if (titles.length > 0) {
      bestResult = `Champions ×${titles.length}`;
    } else {
      const order: ResultLevel[] = ["F", "3RD", "4TH", "QF", "R16", "R32", "GS"];
      let bestLevel: ResultLevel | null = null;
      let bestYear = 0;
      for (const year of EDITIONS) {
        const entry = timeline[year];
        if (!entry) continue;
        for (const level of order) {
          if (entry.result === level) {
            if (!bestLevel || order.indexOf(level) < order.indexOf(bestLevel)) {
              bestLevel = level;
              bestYear = year;
            }
            break;
          }
        }
      }
      if (bestLevel) {
        const labels: Record<string, string> = {
          F: "Runner-up", "3RD": "Third place", "4TH": "Fourth place",
          QF: "Quarter-final", R16: "Round of 16", R32: "Round of 32", GS: "Group stage",
        };
        bestResult = `${labels[bestLevel]} — ${bestYear}`;
      }
    }

    profiles[code] = {
      code,
      name: getTeamName(code),
      flag: getTeamFlag(code),
      confederation: CONFEDERATION_MAP[code] || "Unknown",
      epithet: generateEpithet(code, appearances, titles),
      appearances,
      firstAppearance: firstApp === Infinity ? 1930 : firstApp,
      titles,
      bestResult,
      timeline,
      record,
      ranking: 0,
      form: deriveForm(code),
      topScorers,
      rivalries,
      definingMatches: deriveDefiningMatches(code),
      milestones: deriveMilestones(code, getTeamName(code), titles),
      videos: deriveVideos(code),
    };
  }

  return profiles;
}

function generateEpithet(code: string, appearances: number, titles: { year: number }[]): string {
  if (titles.length >= 3) return `${titles.length}-time champions — a dynasty etched in gold.`;
  if (titles.length === 1) return `Crowned in ${titles[0].year} — a single star that burns forever.`;
  if (appearances >= 15) return `${appearances} tournaments deep — a constant of the beautiful game.`;
  if (appearances >= 10) return `${appearances} appearances and counting.`;
  if (appearances >= 5) return `${appearances} World Cups — each one a chapter still being written.`;
  return `${appearances} appearance${appearances > 1 ? "s" : ""} on the world's biggest stage.`;
}
