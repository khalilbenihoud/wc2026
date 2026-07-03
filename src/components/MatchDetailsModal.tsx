import { useEffect, useState } from "react";
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
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarter-final",
  sf: "Semi-final",
  final: "Final",
};

export default function MatchDetailsModal({
  isOpen,
  round,
  idx,
  data,
  analysis,
  onClose,
}: MatchDetailsModalProps) {
  // ESC key to close
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

  // Keep the drawer mounted for one animation cycle after isOpen goes false,
  // so it can play a matching close transition instead of vanishing instantly.
  const CLOSE_MS = 250;
  const [rendered, setRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      setIsClosing(false);
      return;
    }
    if (rendered) {
      setIsClosing(true);
      const t = setTimeout(() => {
        setRendered(false);
        setIsClosing(false);
      }, CLOSE_MS);
      return () => clearTimeout(t);
    }
  }, [isOpen, rendered]);

  if (!rendered) return null;

  // Competitor resolution logic
  const getCompetitors = (): [string, string] => {
    if (round === "r32") {
      const rm = data.r32?.[idx];
      return [rm?.ta ?? "TBD", rm?.tb ?? "TBD"];
    }
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

  const isR32 = round === "r32";
  const isSeeded = data.seeded;
  const r32Match = isR32 ? data.r32?.[idx] ?? null : null;
  const matchDate = r32Match?.date ?? null;
  const matches = isR32 ? null : data[round as "r16" | "qf" | "sf" | "final"];
  const m = isR32
    ? r32Match && r32Match.s !== null && r32Match.w !== null
      ? { s: r32Match.s, w: r32Match.w, p: r32Match.p, x: r32Match.x }
      : null
    : matches
    ? (round === "final" ? matches[0] : matches[idx])
    : null;

  let ta = "";
  let tb = "";
  if (isR32 || (data.teams && data.teams.length)) {
    [ta, tb] = getCompetitors();
  }

  const knownTeams = ta && ta !== "TBD" && tb && tb !== "TBD";
  const winTop = m ? m.w === 0 : false;
  const winnerCode = winTop ? ta : tb;

  const notes: string[] = [];
  if (m) {
    if (m.x) notes.push(m.x.trim());
    if (m.p) notes.push(`Penalties ${m.p.replace("-", "–")}`);
  }

  const played = !isSeeded && !!m;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${
          isClosing ? "animate-[fadeOut_0.2s_ease_forwards]" : "animate-[fadeIn_0.2s_ease]"
        }`}
        onClick={onClose}
      />

      {/* Side drawer */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-[420px] bg-brand-panel border-l border-brand-line shadow-[-30px_0_80px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar ${
          isClosing
            ? "animate-[slideOutRight_0.25s_cubic-bezier(0.4,0,0.6,1)_forwards]"
            : "animate-[slideInRight_0.3s_cubic-bezier(0.2,0.8,0.2,1)]"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between px-6 pt-6 pb-4 bg-brand-panel border-b border-brand-line">
          <div>
            <div className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-brand-gold mb-1.5">
              {data._year} · {ROUND_NAME[round]}
            </div>
            <h2 className="font-unbounded font-bold text-xl text-brand-text tracking-tight">
              Match {idx + 1}
            </h2>
          </div>
          <button
            className="text-brand-muted hover:text-brand-text text-xl cursor-pointer leading-none bg-none border-none transition-colors duration-200 mt-1"
            onClick={onClose}
            aria-label="Close match details"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Score card */}
          <div className="rounded-2xl border border-brand-line bg-[rgba(var(--overlay-rgb),0.02)] p-6">
            {knownTeams ? (
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div className="text-center">
                  <div className="text-[44px] leading-none mb-2">{getTeamFlag(ta)}</div>
                  <div
                    className={`font-unbounded text-base tracking-wide break-words leading-snug ${
                      winTop ? "text-brand-gold-hi" : "text-brand-text"
                    }`}
                  >
                    {getTeamName(ta)}
                  </div>
                  <div className="inline-block mt-2 text-[9px] font-mono tracking-widest uppercase text-brand-muted bg-[rgba(var(--overlay-rgb),0.05)] border border-brand-line rounded px-1.5 py-0.5">
                    {ta}
                  </div>
                </div>

                {played ? (
                  <div className="font-unbounded text-[32px] text-brand-text flex items-center gap-1.5 px-1 select-none">
                    <span>{m!.s[0]}</span>
                    <span className="text-brand-steel text-xl">:</span>
                    <span>{m!.s[1]}</span>
                  </div>
                ) : (
                  <div className="font-unbounded text-lg text-brand-steel px-1 select-none">vs</div>
                )}

                <div className="text-center">
                  <div className="text-[44px] leading-none mb-2">{getTeamFlag(tb)}</div>
                  <div
                    className={`font-unbounded text-base tracking-wide break-words leading-snug ${
                      !winTop && played ? "text-brand-gold-hi" : "text-brand-text"
                    }`}
                  >
                    {getTeamName(tb)}
                  </div>
                  <div className="inline-block mt-2 text-[9px] font-mono tracking-widest uppercase text-brand-muted bg-[rgba(var(--overlay-rgb),0.05)] border border-brand-line rounded px-1.5 py-0.5">
                    {tb}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center font-unbounded text-base text-brand-text py-4">
                Not yet played
              </div>
            )}

            {notes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-brand-line text-center text-xs text-brand-muted">
                {notes.map((n, i) => (
                  <span key={i}>
                    {i > 0 && <span className="mx-2 text-brand-steel">·</span>}
                    <b className="text-brand-gold font-semibold">{n}</b>
                  </span>
                ))}
              </div>
            )}

            {played && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 py-2.5 px-4">
                <span>🏆</span>
                <span className="font-unbounded font-semibold text-sm text-brand-gold-hi">
                  {round === "final" ? "Champion" : "Winner"}: {getTeamName(winnerCode)}
                </span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 rounded-xl border border-brand-line px-4 py-3 text-sm text-brand-text">
            <span className="text-brand-gold">📍</span>
            {data.host}
          </div>

          {/* Date */}
          {matchDate ? (
            <div className="flex items-center gap-3 rounded-xl border border-brand-line px-4 py-3 text-sm text-brand-text">
              <span className="text-brand-gold">📅</span>
              {matchDate}
            </div>
          ) : (
            !played && (
              <p className="text-xs text-brand-muted leading-relaxed px-1">
                This fixture hasn't been decided yet. Check back once the {data._year} tournament is underway.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
