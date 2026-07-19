import { TOURNAMENTS } from "./data";
import { TournamentData, TournamentAnalysis } from "./types";

export const ROUND_NAME: Record<string, string> = {
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarter-final",
  sf: "Semi-final",
  tp: "Third-place play-off",
  final: "Final",
};

export const TOURNAMENT_YEARS: number[] = Object.keys(TOURNAMENTS)
  .map(Number)
  .sort((a, b) => b - a);

export function resolveCompetitors(
  data: TournamentData,
  analysis: TournamentAnalysis,
  round: string,
  idx: number
): [string, string] {
  if (round === "r32") {
    const rm = data.r32?.[idx];
    return [rm?.ta ?? "TBD", rm?.tb ?? "TBD"];
  }
  // Pre-1986 (8-team) format has no Round of 16: the quarter-finals are the
  // opening round played by the raw team list, semis are fed by QF winners
  // (w1), and the final by SF winners (w2).
  if (!data.r16) {
    if (round === "qf") {
      return [data.teams[2 * idx] ?? "TBD", data.teams[2 * idx + 1] ?? "TBD"];
    }
    if (round === "sf") {
      return [
        analysis.w1[2 * idx] != null ? data.teams[analysis.w1[2 * idx]!] : "TBD",
        analysis.w1[2 * idx + 1] != null ? data.teams[analysis.w1[2 * idx + 1]!] : "TBD",
      ];
    }
    if (round === "final") {
      return [
        analysis.w2[0] != null ? data.teams[analysis.w2[0]!] : "TBD",
        analysis.w2[1] != null ? data.teams[analysis.w2[1]!] : "TBD",
      ];
    }
    if (round === "tp") {
      // Third-place play-off: the two semi-final losers. Here w1 holds the four
      // semi-finalists and w2 the two finalists (semi winners).
      const sf1Loser = analysis.w2[0] != null
        ? [analysis.w1[0], analysis.w1[1]].find((x) => x != null && x !== analysis.w2[0]) ?? null : null;
      const sf2Loser = analysis.w2[1] != null
        ? [analysis.w1[2], analysis.w1[3]].find((x) => x != null && x !== analysis.w2[1]) ?? null : null;
      return [
        sf1Loser != null ? data.teams[sf1Loser] : "TBD",
        sf2Loser != null ? data.teams[sf2Loser] : "TBD",
      ];
    }
  }
  if (round === "r16") {
    return [data.teams[2 * idx], data.teams[2 * idx + 1]];
  }
  if (round === "qf") {
    return [
      analysis.w1[2 * idx] != null ? data.teams[analysis.w1[2 * idx]!] : "TBD",
      analysis.w1[2 * idx + 1] != null ? data.teams[analysis.w1[2 * idx + 1]!] : "TBD",
    ];
  }
  if (round === "sf") {
    return [
      analysis.w2[2 * idx] != null ? data.teams[analysis.w2[2 * idx]!] : "TBD",
      analysis.w2[2 * idx + 1] != null ? data.teams[analysis.w2[2 * idx + 1]!] : "TBD",
    ];
  }
  if (round === "tp") {
    // Third-place play-off: the two semi-final losers. w2 holds the four
    // semi-finalists and w3 the two finalists (semi winners).
    const sf1Loser = analysis.w3[0] != null
      ? [analysis.w2[0], analysis.w2[1]].find((x) => x != null && x !== analysis.w3[0]) ?? null : null;
    const sf2Loser = analysis.w3[1] != null
      ? [analysis.w2[2], analysis.w2[3]].find((x) => x != null && x !== analysis.w3[1]) ?? null : null;
    return [
      sf1Loser != null ? data.teams[sf1Loser] : "TBD",
      sf2Loser != null ? data.teams[sf2Loser] : "TBD",
    ];
  }
  return [
    analysis.w3[0] != null ? data.teams[analysis.w3[0]!] : "TBD",
    analysis.w3[1] != null ? data.teams[analysis.w3[1]!] : "TBD",
  ];
}

export function getMatchNotes(m: { x?: string | null; p?: string | null } | null): string[] {
  if (!m) return [];
  const notes: string[] = [];
  if (m.x) notes.push(m.x.trim());
  if (m.p) notes.push(`Penalties ${m.p.replace("-", "–")}`);
  return notes;
}
