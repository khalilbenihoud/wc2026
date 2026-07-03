import { CSSProperties } from "react";
import { TOURNAMENTS, getTeamFlag } from "../data";
import { TournamentAnalysis } from "../types";

interface TimelineProps {
  activeYear: number;
  onSelectYear: (year: number) => void;
  analyses: Record<number, TournamentAnalysis>;
}

export default function Timeline({
  activeYear,
  onSelectYear,
  analyses,
}: TimelineProps) {
  const years = Object.keys(TOURNAMENTS)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <>
      {/* Desktop: vertical timeline */}
      <nav
        className="timeline relative mt-2 pl-10 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar hidden md:block"
        aria-label="Select tournament"
      >
        {/* Desktop Vertical Line */}
        <div className="absolute left-[20px] top-4 bottom-4 w-[2px] rounded bg-gradient-to-b from-transparent via-brand-line to-transparent pointer-events-none" />

        {years.map((year, idx) => {
        const d = TOURNAMENTS[year];
        const analysis = analyses[year];
        const isActive = year === activeYear;
        const isFuture = d.seeded;

        // Get champion flag
        let champFlag = "🔮";
        if (!isFuture && analysis && analysis.champ !== null) {
          const champCode = d.teams[analysis.champ];
          champFlag = getTeamFlag(champCode);
        }

        const delay = idx * 0.04;

        return (
          <button
            key={year}
            onClick={() => onSelectYear(year)}
            className={`tl-item relative flex items-center gap-3 py-2.5 px-3.5 pr-4 pl-3 my-1 rounded-xl cursor-pointer transition-all duration-300 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 border ${
              isActive
                ? "active bg-brand-gold/[0.08] border-brand-gold/30 shadow-[0_4px_20px_rgba(246,196,83,0.06)]"
                : "border-transparent hover:bg-[rgba(var(--overlay-rgb),0.05)] hover:border-[rgba(var(--overlay-rgb),0.02)]"
            } ${isFuture ? "future" : ""}`}
            style={
              {
                "--d": `${delay}s`,
              } as CSSProperties
            }
          >
            {/* Dot indicator */}
            <div
              className={`tl-dot absolute left-[-24px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-brand-gold scale-125 shadow-[0_0_14px_rgba(246,196,83,0.85)] ring-[3px] ring-brand-bg"
                  : isFuture
                  ? "bg-transparent border-[1.5px] border-brand-steel"
                  : "bg-brand-steel ring-[3px] ring-brand-bg"
              }`}
            />

            <span
              className={`tl-year font-unbounded font-semibold text-base tracking-tight transition-colors duration-200 ${
                isActive
                  ? "text-brand-gold-hi font-bold"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {year}
            </span>

            <span
              className={`tl-champ ml-auto leading-none transition-all duration-200 ${
                isActive
                  ? "text-xl opacity-100 drop-shadow-[0_0_8px_rgba(246,196,83,0.5)] scale-110"
                  : "text-base opacity-40 hover:opacity-85"
              }`}
            >
              {champFlag}
            </span>
          </button>
        );
      })}
      </nav>
    </>
  );
}
