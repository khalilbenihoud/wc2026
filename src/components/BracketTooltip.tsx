import { TournamentAnalysis } from "../types";
import { TOURNAMENTS, getTeamFlag, getTeamName } from "../data";
import { ROUND_NAME, resolveCompetitors, getMatchNotes } from "../constants";

export interface TooltipState {
  round: string;
  idx: number;
  x: number;
  y: number;
  visible: boolean;
}

interface Props {
  tooltip: TooltipState;
  activeYear: number;
  analyses: Record<number, TournamentAnalysis>;
}

// The floating flag-hover tooltip over the radial bracket. Returns null when the
// hovered slot has no resolvable match, so no empty box appears.
export default function BracketTooltip({ tooltip, activeYear, analyses }: Props) {
  if (!tooltip.visible || !tooltip.round) return null;
  const d = TOURNAMENTS[activeYear];
  const analysis = analyses[activeYear];
  const { round, idx } = tooltip;

  if (round !== "r16" && !d[round as "qf" | "sf" | "final"]) return null;

  const [ta, tb] = resolveCompetitors(d, analysis, round, idx);
  const matches = d[round as "r16" | "qf" | "sf" | "final"];
  const m = matches ? (round === "final" ? matches[0] : matches[idx]) : null;
  const wA = m && m.w === 0;
  const wB = m && m.w === 1;
  const score = m ? `${m.s[0]}–${m.s[1]}` : "vs";
  const notes = getMatchNotes(m);

  return (
    <div
      className="tip fixed z-50 pointer-events-none select-none -translate-x-1/2 -translate-y-[118%] bg-gradient-to-b from-brand-panel to-brand-bg border border-brand-line rounded-xl py-2 px-3.5 min-w-[180px] shadow-[0_16px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(246,196,83,0.05)] after:content-[''] after:absolute after:left-1/2 after:-bottom-1.5 after:-translate-x-1/2 after:rotate-45 after:w-2.5 after:h-2.5 after:bg-brand-bg after:border-r after:border-b after:border-brand-line transition-all duration-100 ease-out"
      style={{
        left: `${Math.max(100, Math.min(tooltip.x, window.innerWidth - 100))}px`,
        top: `${Math.max(60, Math.min(tooltip.y, window.innerHeight - 60))}px`,
      }}
    >
      <div className="text-center font-sans">
        <div className="tt-round font-mono text-[10px] text-brand-gold tracking-widest uppercase mb-1.5 select-none font-medium">
          {ROUND_NAME[round]}
        </div>
        <div className="tt-row flex items-center justify-center gap-2.5 whitespace-nowrap">
          <span
            className={`tt-side flex items-center gap-1.5 text-xs transition-colors duration-200 ${
              wA ? "text-brand-gold-hi font-bold" : "text-brand-muted"
            }`}
          >
            <span className="fg text-base select-none">{getTeamFlag(ta)}</span>
            {getTeamName(ta)}
          </span>
          <span className="tt-sc font-unbounded text-sm tracking-wide text-brand-text select-none px-1">
            {score}
          </span>
          <span
            className={`tt-side flex items-center gap-1.5 text-xs transition-colors duration-200 ${
              wB ? "text-brand-gold-hi font-bold" : "text-brand-muted"
            }`}
          >
            {getTeamName(tb)}
            <span className="fg text-base select-none">{getTeamFlag(tb)}</span>
          </span>
        </div>
        {notes.length > 0 ? (
          <div className="tt-note mt-2 font-mono text-[9px] tracking-wider uppercase text-brand-muted select-none">
            {notes.map((n, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-1 text-brand-steel">·</span>}
                <b className="text-brand-gold font-semibold">{n}</b>
              </span>
            ))}
          </div>
        ) : (
          !m && (
            <div className="tt-note mt-1.5 font-mono text-[9px] tracking-wider uppercase text-brand-muted select-none font-medium">
              not yet played
            </div>
          )
        )}
      </div>
    </div>
  );
}
