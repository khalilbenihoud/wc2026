import { useEffect } from "react";
import { TournamentData, TournamentAnalysis } from "../types";
import { getTeamFlag, getTeamName } from "../data";

interface MatchDetailsModalProps {
  isOpen: boolean;
  round: string;
  idx: number;
  data: TournamentData & { _year: number };
  analysis: TournamentAnalysis;
  onClose: () => void;
}

const ROUND_NAME: Record<string, string> = {
  r16: "Round of 16",
  qf: "Quarter-final",
  sf: "Semi-final",
  final: "Final",
};

const ROUND_SUB: Record<string, string> = {
  r16: "Last 16",
  qf: "Last 8",
  sf: "Last 4",
  final: "The Decider",
};

export default function MatchDetailsModal({
  isOpen,
  round,
  idx,
  data,
  analysis,
  onClose,
}: MatchDetailsModalProps) {
  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Competitor resolution logic
  const getCompetitors = (): [string, string] => {
    if (round === "r16") {
      return [data.teams[2 * idx], data.teams[2 * idx + 1]];
    }
    if (round === "qf") {
      return [
        data.teams[analysis.w1[2 * idx]],
        data.teams[analysis.w1[2 * idx + 1]],
      ];
    }
    if (round === "sf") {
      return [
        data.teams[analysis.w2[2 * idx]],
        data.teams[analysis.w2[2 * idx + 1]],
      ];
    }
    return [data.teams[analysis.w3[0]], data.teams[analysis.w3[1]]];
  };

  const isSeeded = data.seeded;
  const matches = data[round as "r16" | "qf" | "sf" | "final"];
  const m = matches ? (round === "final" ? matches[0] : matches[idx]) : null;

  let ta = "";
  let tb = "";
  if (data.teams && data.teams.length) {
    [ta, tb] = getCompetitors();
  }

  const winTop = m ? m.w === 0 : false;
  const winnerCode = winTop ? ta : tb;

  const notes: string[] = [];
  if (m) {
    if (m.x) notes.push(m.x.trim());
    if (m.p) notes.push(`Penalties ${m.p.replace("-", "–")}`);
  }

  return (
    <div
      className="overlay fixed inset-0 z-50 flex items-center justify-center p-5 bg-brand-bg/75 backdrop-blur-md animate-[fade_0.25s_ease]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card relative w-full max-w-[440px] bg-gradient-to-b from-[#18181b] to-[#09090b] border border-brand-line rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(246,196,83,0.06)] animate-[rise_0.3s_cubic-bezier(0.2,0.8,0.2,1)]">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-brand-muted hover:text-brand-text text-xl cursor-pointer leading-none bg-none border-none transition-colors duration-200"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {isSeeded || !m ? (
          /* Seeded Match View */
          <>
            <div className="round-tag font-unbounded tracking-[0.14em] text-base text-brand-gold text-center pt-8 pb-1">
              {ROUND_NAME[round]}
            </div>
            <div className="stage-line text-center text-brand-muted text-xs tracking-wide pb-4">
              {data._year} · {data.host}
            </div>
            <div className="teams grid grid-cols-1 justify-items-center gap-1.5 px-6 pb-8 pt-2">
              <div className="side text-center">
                <div className="nm font-unbounded text-lg tracking-wide text-brand-text mb-2">
                  Not yet played
                </div>
                <div className="stage-line text-xs text-brand-muted max-w-[280px] leading-relaxed">
                  This fixture hasn't been decided yet. Check back once the {data._year} tournament is underway.
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Real Match View */
          <>
            <div className="round-tag font-unbounded tracking-[0.14em] text-base text-brand-gold text-center pt-8 pb-1">
              {ROUND_NAME[round]}
            </div>
            <div className="stage-line text-center text-brand-muted text-[11px] tracking-wider pb-4">
              {data._year} · {data.host} · {ROUND_SUB[round]}
            </div>

            <div className="teams grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 px-6 pb-6">
              {/* Team A */}
              <div className="side text-center">
                <div className="fl text-[52px] leading-none">
                  {getTeamFlag(ta)}
                </div>
                <div
                  className={`nm font-unbounded text-lg tracking-wide mt-1.5 break-words max-w-[120px] mx-auto line-clamp-2 ${
                    winTop ? "text-brand-gold-hi" : "text-brand-text"
                  }`}
                >
                  {getTeamName(ta)}
                </div>
                <div
                  className={`wintag inline-block mt-1.5 text-[9px] tracking-widest text-brand-gold border border-brand-gold/40 rounded-full px-2 py-0.5 transition-opacity duration-300 ${
                    winTop ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Advanced
                </div>
              </div>

              {/* Score */}
              <div className="score font-unbounded text-[40px] tracking-normal text-brand-text flex items-center gap-2 px-1.5 select-none">
                <span>{m.s[0]}</span>
                <span className="sep text-brand-steel text-2xl">–</span>
                <span>{m.s[1]}</span>
              </div>

              {/* Team B */}
              <div className="side text-center">
                <div className="fl text-[52px] leading-none">
                  {getTeamFlag(tb)}
                </div>
                <div
                  className={`nm font-unbounded text-lg tracking-wide mt-1.5 break-words max-w-[120px] mx-auto line-clamp-2 ${
                    !winTop ? "text-brand-gold-hi" : "text-brand-text"
                  }`}
                >
                  {getTeamName(tb)}
                </div>
                <div
                  className={`wintag inline-block mt-1.5 text-[9px] tracking-widest text-brand-gold border border-brand-gold/40 rounded-full px-2 py-0.5 transition-opacity duration-300 ${
                    !winTop ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Advanced
                </div>
              </div>
            </div>

            {/* Match Notes / Penalties */}
            {notes.length > 0 && (
              <div className="note text-center text-brand-muted text-xs border-t border-brand-line py-3 px-4 bg-white/[0.015]">
                {notes.map((n, i) => (
                  <span key={i}>
                    {i > 0 && <span className="mx-2 text-brand-steel">·</span>}
                    <b className="text-brand-gold font-semibold">{n}</b>
                  </span>
                ))}
              </div>
            )}

            {/* Winner footer declaration */}
            <div className="note text-center text-xs text-brand-gold py-3 px-4 bg-white/[0.015] border-t border-brand-line/50">
              🏆{" "}
              <span className="font-semibold">{getTeamName(winnerCode)}</span>{" "}
              {round === "final" ? "lift the trophy" : "advance to the next round"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
