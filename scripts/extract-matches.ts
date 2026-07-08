/**
 * Extract all knockout match pairs from data.ts for YouTube highlight fetching.
 * Uses tsx to load the actual data module — no fragile regex parsing.
 *
 * Usage: npx tsx scripts/extract-matches.ts > scripts/matches.json
 */
import { TOURNAMENTS } from "../src/data";
import { resolveCompetitors } from "../src/constants";
import type { TournamentData, TournamentAnalysis, Match, MatchR32 } from "../src/types";

interface MatchEntry {
  year: number;
  round: string;
  key: string;
  teamA: string;
  teamB: string;
}

function computeSeededAnalysis(
  d: TournamentData
): TournamentAnalysis {
  const r16 = d.r16;
  const qf = d.qf;
  const sf = d.sf;
  const f = d.final;

  if (!r16) {
    // Pre-1986 format (8 teams, starts at QF)
    const teams = d.teams;
    const w1: (number | null)[] = [null, null, null, null];
    const w2: (number | null)[] = [null, null];
    const w3: (number | null)[] = [];

    if (qf) {
      for (let i = 0; i < 4; i++) {
        const m = qf[i];
        if (m && m.w !== null) {
          w1[i] = 2 * i + m.w;
        }
      }
    }
    if (sf && w1[0] != null && w1[1] != null && w1[2] != null && w1[3] != null) {
      for (let i = 0; i < 2; i++) {
        const m = sf[i];
        if (m && m.w !== null) {
          w2[i] = m.w === 0 ? w1[2 * i]! : w1[2 * i + 1]!;
        }
      }
    }
    if (f && f[0] && f[0].w !== null && w2[0] != null && w2[1] != null) {
      w3.push(f[0].w === 0 ? w2[0]! : w2[1]!);
    }

    return { champ: null, adv: [], w1, w2, w3 };
  }

  // Standard 16-team bracket
  const w1: (number | null)[] = [null, null, null, null, null, null, null, null];
  const w2: (number | null)[] = [null, null, null, null];
  const w3: (number | null)[] = [];

  for (let i = 0; i < 8; i++) {
    const m = r16[i];
    if (m && m.w !== null) {
      w1[i] = 2 * i + m.w;
    }
  }

  if (qf) {
    for (let i = 0; i < 4; i++) {
      const a = w1[2 * i];
      const b = w1[2 * i + 1];
      if (a == null || b == null) continue;
      const m = qf[i];
      if (m && m.w !== null) {
        w2[i] = m.w === 0 ? a : b;
      }
    }
  }

  if (sf && w2[0] != null && w2[1] != null && w2[2] != null && w2[3] != null) {
    for (let i = 0; i < 2; i++) {
      const m = sf[i];
      if (m && m.w !== null) {
        w3.push(m.w === 0 ? w2[2 * i]! : w2[2 * i + 1]!);
      }
    }
  }

  return { champ: null, adv: [], w1, w2, w3 };
}

function extractYear(year: number, d: TournamentData): MatchEntry[] {
  const entries: MatchEntry[] = [];
  const analysis = computeSeededAnalysis(d);
  const isSeeded = d.seeded !== false; // default to true for historical

  // Determine which rounds exist
  const rounds: string[] = [];
  if (!isSeeded && d.r32) rounds.push("r32");
  if (d.r16) rounds.push("r16");
  else if (!d.r32) rounds.push("qf"); // pre-1986 starts at QF
  if (d.qf) rounds.push("qf");
  if (d.sf) rounds.push("sf");
  if (d.final) rounds.push("final");

  for (const round of rounds) {
    const matches = round === "r32" ? d.r32 : (d as any)[round];
    if (!matches) continue;

    const count = round === "final" ? 1 : Array.isArray(matches) ? matches.length : 0;

    for (let i = 0; i < count; i++) {
      if (round === "r32") {
        const m = (d.r32 as MatchR32[])?.[i];
        if (!m || m.w === null) continue;
        entries.push({ year, round, key: `${year}_${m.ta}_${m.tb}`, teamA: m.ta, teamB: m.tb });
        continue;
      }

      const [ta, tb] = resolveCompetitors(d, analysis, round, i);
      if (ta === "TBD" || tb === "TBD" || ta === "?" || tb === "?") continue;

      const m = round === "final" ? (matches as (Match | null)[])[0] : (matches as (Match | null)[])[i];
      if (!m || m.w === null) continue;

      entries.push({ year, round, key: `${year}_${ta}_${tb}`, teamA: ta, teamB: tb });
    }
  }

  return entries;
}

const all: MatchEntry[] = [];

for (const [yearStr, d] of Object.entries(TOURNAMENTS)) {
  const year = parseInt(yearStr);
  if (isNaN(year)) continue;
  const entries = extractYear(year, d as TournamentData);
  all.push(...entries);
}

// Deduplicate by key
const seen = new Set<string>();
const unique = all.filter(e => {
  if (seen.has(e.key)) return false;
  seen.add(e.key);
  return true;
});

unique.sort((a, b) => a.year - b.year);

console.log(JSON.stringify(unique, null, 2));
