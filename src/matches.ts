import { TournamentData, TournamentAnalysis } from "./types";
import { TEAMS, getTeamName } from "./data";
import { resolveCompetitors } from "./constants";

// A knockout match, identified by its (round, idx) slot, with both competitors
// resolved to concrete team codes and a stable, human/SEO-friendly URL slug.
export interface EnumeratedMatch {
  round: string;
  idx: number;
  ta: string; // team code A (top / first competitor)
  tb: string; // team code B (bottom / second competitor)
  slug: string; // e.g. "brazil-vs-germany"
  played: boolean; // has a final result (score + winner)
  score: [number, number] | null; // [ta, tb], null if not played
  winner: string | null; // winning team code, or null (not played / draw→pens)
  pens: string | null; // penalty shootout score, e.g. "4-3"
  extra: string | null; // e.g. "a.e.t."
  goals: [string[], string[]] | null; // inline goalscorers [ta, tb] (2026); null otherwise
}

// URL-safe segment for a team name: strip accents, lowercase, non-alnum → "-".
// e.g. "Côte d'Ivoire" → "cote-d-ivoire", "Türkiye" → "turkiye".
export function slugifyTeam(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function matchSlug(taCode: string, tbCode: string): string {
  return `${slugifyTeam(getTeamName(taCode))}-vs-${slugifyTeam(getTeamName(tbCode))}`;
}

// The single match object backing a (round, idx) slot — mirrors the lookup the
// details modal does, so "played" here means the same thing there.
function matchAt(data: TournamentData, round: string, idx: number) {
  if (round === "r32") {
    const rm = data.r32?.[idx];
    if (!rm || rm.s === null || rm.w === null) return null;
    return { s: rm.s, w: rm.w, p: rm.p ?? null, x: rm.x ?? null, g: rm.g ?? null };
  }
  if (round === "tp") {
    return data.tp ?? null;
  }
  const matches = data[round as "r16" | "qf" | "sf" | "final"];
  const m = matches ? (round === "final" ? matches[0] : matches[idx]) : null;
  return m ?? null;
}

// Every knockout slot whose competitors are both known concrete teams. Within a
// single tournament a given pairing occurs at most once, so slugs are unique.
export function enumerateMatches(
  data: TournamentData,
  analysis: TournamentAnalysis
): EnumeratedMatch[] {
  const out: EnumeratedMatch[] = [];
  const push = (round: string, idx: number) => {
    const [ta, tb] = resolveCompetitors(data, analysis, round, idx);
    if (!ta || !tb || ta === "TBD" || tb === "TBD" || !TEAMS[ta] || !TEAMS[tb]) return;
    const m = matchAt(data, round, idx);
    const played = !!m && m.w !== null;
    out.push({
      round,
      idx,
      ta,
      tb,
      slug: matchSlug(ta, tb),
      played,
      score: m ? m.s : null,
      winner: played ? (m!.w === 0 ? ta : tb) : null,
      pens: m?.p ?? null,
      extra: m?.x ?? null,
      goals: m?.g ?? null,
    });
  };

  if (data.r32) data.r32.forEach((_, i) => push("r32", i));
  if (data.r16) data.r16.forEach((m, i) => { if (m) push("r16", i); });
  if (data.qf) data.qf.forEach((m, i) => { if (m) push("qf", i); });
  if (data.sf) data.sf.forEach((m, i) => { if (m) push("sf", i); });
  if (data.tp) push("tp", 0);
  if (data.final?.[0]) push("final", 0);

  return out;
}

export function findMatchBySlug(
  data: TournamentData,
  analysis: TournamentAnalysis,
  slug: string
): EnumeratedMatch | null {
  return enumerateMatches(data, analysis).find((m) => m.slug === slug) ?? null;
}
