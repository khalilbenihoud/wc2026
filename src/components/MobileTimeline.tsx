import { useEffect, useRef } from "react";
import { TOURNAMENTS, getTeamFlag } from "../data";
import { TOURNAMENT_YEARS } from "../constants";
import { TournamentAnalysis } from "../types";

interface Props {
  activeYear: number;
  onSelectYear: (year: number) => void;
  analyses: Record<number, TournamentAnalysis>;
}

// Champion flag for a given edition — 🔮 for upcoming/undecided, mirroring the
// desktop Timeline.
function champFlag(year: number, analyses: Record<number, TournamentAnalysis>): string {
  const d = TOURNAMENTS[year];
  if (d.seeded) return "🔮";
  const a = analyses[year];
  return a && a.champ !== null ? getTeamFlag(d.teams[a.champ]) : "🔮";
}

// Mobile tournament picker — a horizontally-scrollable rail of champion-flag +
// year chips, replacing the old native <select>. The active edition is gold and
// auto-scrolls to centre. Chips are ≥48px tall for comfortable thumb targets.
export default function MobileTimeline({ activeYear, onSelectYear, analyses }: Props) {
  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activeYear]);

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-brand-bg via-brand-bg/95 to-transparent pt-6 px-3 z-50"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory" aria-label="Select tournament">
        {TOURNAMENT_YEARS.map((year) => {
          const active = year === activeYear;
          return (
            <button
              key={year}
              ref={active ? activeRef : undefined}
              onClick={() => onSelectYear(year)}
              aria-current={active ? "true" : undefined}
              className={`snap-center shrink-0 flex items-center gap-2 rounded-2xl border min-h-[48px] px-4 py-3 transition-colors ${
                active
                  ? "bg-brand-gold/[0.12] border-brand-gold/40 text-brand-gold-hi"
                  : "border-brand-line text-brand-muted active:bg-[rgba(var(--overlay-rgb),0.06)]"
              }`}
            >
              <span className="text-base leading-none">{champFlag(year, analyses)}</span>
              <span className="font-unbounded font-semibold text-[15px] tracking-tight leading-none">{year}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
