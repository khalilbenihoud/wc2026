import { TournamentData } from "./types";
import { TOURNAMENTS, getTeamFlag, getTeamName } from "./data";

export interface Champion {
  code: string;
  name: string;
  flag: string;
  stars: number;
  years: number[];
  latestWin: number;
}

// West Germany's pre-1990 titles count toward Germany.
const NATION_ALIAS: Record<string, string> = {
  FRG: "GER",
};

// Trace each tournament's bracket to the champion. Mirrors the resolver in
// App.tsx#analyze but returns the team code directly (we don't need the full
// per-round advancement map here).
function championOfYear(d: TournamentData): string | null {
  const f = d.final?.[0];
  if (!f || f.w === null || !d.teams) return null;

  if (d.r16) {
    const w1 = d.r16.map((m, i) => (m && m.w !== null ? 2 * i + m.w : null));
    const w2: (number | null)[] = [];
    for (let i = 0; i < 4; i++) {
      const m = d.qf?.[i];
      const a = w1[2 * i];
      const b = w1[2 * i + 1];
      w2[i] = m && m.w !== null && a != null && b != null ? (m.w === 0 ? a : b) : null;
    }
    const w3: (number | null)[] = [];
    for (let i = 0; i < 2; i++) {
      const m = d.sf?.[i];
      const a = w2[2 * i];
      const b = w2[2 * i + 1];
      w3[i] = m && m.w !== null && a != null && b != null ? (m.w === 0 ? a : b) : null;
    }
    if (w3[0] == null || w3[1] == null) return null;
    return d.teams[f.w === 0 ? w3[0] : w3[1]] ?? null;
  }

  const w1: (number | null)[] = [];
  for (let i = 0; i < 4; i++) {
    const m = d.qf?.[i];
    w1[i] = m && m.w !== null ? 2 * i + m.w : null;
  }
  const w2: (number | null)[] = [];
  for (let i = 0; i < 2; i++) {
    const m = d.sf?.[i];
    const a = w1[2 * i];
    const b = w1[2 * i + 1];
    w2[i] = m && m.w !== null && a != null && b != null ? (m.w === 0 ? a : b) : null;
  }
  if (w2[0] == null || w2[1] == null) return null;
  return d.teams[f.w === 0 ? w2[0] : w2[1]] ?? null;
}

export function getChampions(): Champion[] {
  const byNation: Record<string, number[]> = {};
  const years = Object.keys(TOURNAMENTS)
    .map(Number)
    .sort((a, b) => a - b);

  for (const year of years) {
    const code = championOfYear(TOURNAMENTS[year]);
    if (!code) continue;
    const nation = NATION_ALIAS[code] ?? code;
    (byNation[nation] ??= []).push(year);
  }

  return Object.entries(byNation)
    .map(([code, ys]) => ({
      code,
      name: getTeamName(code),
      flag: getTeamFlag(code),
      stars: ys.length,
      years: ys.slice().sort((a, b) => a - b),
      latestWin: Math.max(...ys),
    }))
    .sort((a, b) => b.stars - a.stars || b.latestWin - a.latestWin);
}
