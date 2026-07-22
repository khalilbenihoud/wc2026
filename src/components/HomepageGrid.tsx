import { TOURNAMENTS, getTeamFlag, getTeamName } from "../data";
import { TournamentAnalysis } from "../types";
import { tournamentPath } from "../router";
import { TOURNAMENT_YEARS } from "../constants";
interface Props {
  onNavigate: (path: string) => void;
  analyses: Record<number, TournamentAnalysis>;
  // When embedded under another element (e.g. the winner hero) the grid flows
  // with the page instead of owning its own scroll region.
  embedded?: boolean;
  // Edition already featured elsewhere (the winner hero) — omitted from the grid.
  excludeYear?: number;
}

function getChampion(year: number, analyses: Record<number, TournamentAnalysis>): { code: string | null; flag: string; name: string } {
  const a = analyses[year];
  if (!a || a.champ === null) {
    const t = TOURNAMENTS[year];
    if (t?.seeded) return { code: null, flag: "🔮", name: "Upcoming" };
    return { code: null, flag: "🔮", name: "TBD" };
  }
  const code = TOURNAMENTS[year].teams[a.champ];
  return { code, flag: getTeamFlag(code), name: getTeamName(code) };
}

function getFinalScore(year: number): string | null {
  const f = TOURNAMENTS[year]?.final?.[0];
  return f ? `${f.s[0]}–${f.s[1]}` : null;
}

// Tournament directory: winner-first cards for every edition, most-recent first,
// under one section title. Each card opens its tournament page.
export default function HomepageGrid({ onNavigate, analyses, embedded = false, excludeYear }: Props) {
  const years = TOURNAMENT_YEARS.filter((y) => y !== excludeYear).sort((a, b) => b - a);
  const first = Math.min(...TOURNAMENT_YEARS);
  const last = Math.max(...TOURNAMENT_YEARS);

  return (
    <div className={embedded ? "w-full px-5 pb-10" : "w-full h-full min-h-0 overflow-y-auto pb-24 px-5"}>
      <div className="mb-5">
        <h2 className="font-unbounded font-bold text-2xl  mb-5 mt-9 text-brand-text tracking-tight leading-none">World Cup Timeline</h2>
        {/* <div className="mt-2 font-mono text-[10px] tracking-[0.25em] uppercase text-brand-muted/70">
          {first}–{last} · {TOURNAMENT_YEARS.length} editions
        </div> */}
        {/* <div aria-hidden className="mt-4 h-px bg-gradient-to-r from-brand-gold/40 via-brand-line to-transparent" /> */}
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {years.map((year) => {
          const champ = getChampion(year, analyses);
          const score = getFinalScore(year);
          return (
            <button
              key={year}
              onClick={() => onNavigate(`${tournamentPath(year)}/`)}
              className="flex flex-col items-start gap-2.5 p-4 rounded-xl bg-brand-panel/40 border border-brand-line/40 hover:border-brand-gold/30 hover:bg-brand-panel/60 transition-all cursor-pointer active:scale-[0.98]"
            >
              <span className="font-mono text-[10px] font-semibold tracking-[0.22em] uppercase text-brand-gold/80">{year}</span>
              <div className="flex items-center gap-2 min-w-0 w-full">
                <span className="text-2xl leading-none shrink-0">{champ.flag}</span>
                <span className="font-unbounded font-bold text-[15px] text-brand-text truncate">{champ.name}</span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted/60">
                {score ? `Final · ${score}` : "Champions"}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
