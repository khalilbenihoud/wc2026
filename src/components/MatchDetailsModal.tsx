import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TournamentData, TournamentAnalysis } from "../types";
import { getTeamFlag, getTeamName } from "../data";
import { ROUND_NAME, resolveCompetitors, getMatchNotes } from "../constants";
import { getScorers } from "../scorers";
import { getStats } from "../stats";
import { getStats2026 } from "../stats2026";
import { getHighlights } from "../highlights";
import { getPlayerOfMatch } from "../motm";
import MatchGoals from "./MatchGoals";

interface MatchDetailsModalProps {
  isOpen: boolean;
  round: string;
  idx: number;
  data: TournamentData & { _year: number };
  analysis: TournamentAnalysis;
  onClose: () => void;
  onNavigateCountry?: (code: string) => void;
}

// Horizontal comparison bar (borrowed from the scoreboard modal, restyled to
// our brand tokens). Left segment = home team (gold), right = away (steel).
function StatBar({ label, a, b }: { label: string; a: number; b: number }) {
  const total = a + b || 1;
  const pctA = (a / total) * 100;
  const pctB = (b / total) * 100;
  const tied = a === b;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[11px] font-mono">
        <span className="text-brand-text tabular-nums w-6">{a}</span>
        <span className="text-brand-muted uppercase tracking-[0.18em] font-semibold text-[10px]">
          {label}
        </span>
        <span className="text-brand-text tabular-nums w-6 text-right">{b}</span>
      </div>
      <div className="h-2 w-full bg-[rgba(var(--overlay-rgb),0.05)] rounded-full overflow-hidden flex">
        <div
          className={`h-full transition-all duration-500 ${tied || a > b ? "bg-brand-gold" : "bg-brand-steel"}`}
          style={{ width: `${pctA}%` }}
        />
        <div
          className={`h-full transition-all duration-500 ${tied || b > a ? "bg-brand-gold" : "bg-brand-steel"}`}
          style={{ width: `${pctB}%` }}
        />
      </div>
    </div>
  );
}

const countCard = (arr: string[], emoji: string) =>
  arr.filter((c) => c.includes(emoji)).length;

export default function MatchDetailsModal({
  isOpen,
  round,
  idx,
  data,
  analysis,
  onClose,
  onNavigateCountry,
}: MatchDetailsModalProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  // Remember what had focus before the dialog opened, so we can restore it on
  // close (WCAG 2.4.3). Captured on open, focus returned in the cleanup.
  const triggerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    return () => {
      triggerRef.current?.focus?.();
      triggerRef.current = null;
    };
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && isOpen) {
        const drawer = document.getElementById("match-drawer");
        if (!drawer) return;
        const focusable = drawer.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
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

  // Move focus into the dialog once it has mounted, so keyboard and screen
  // reader users land inside it (and the Tab trap has somewhere to cycle).
  // Focusing the labelled container lets a screen reader announce the dialog.
  useEffect(() => {
    if (isOpen && rendered) drawerRef.current?.focus();
  }, [isOpen, rendered]);

  if (!rendered) return null;

  const isR32 = round === "r32";
  const isSeeded = data.seeded;
  const r32Match = isR32 ? data.r32?.[idx] ?? null : null;
  const matchDate = r32Match?.date ?? null;
  const matches = isR32 ? null : data[round as "r16" | "qf" | "sf" | "final"];
  const m = isR32
    ? r32Match && r32Match.s !== null && r32Match.w !== null
      ? { s: r32Match.s, w: r32Match.w, p: r32Match.p, x: r32Match.x, g: r32Match.g }
      : null
    : matches
    ? (round === "final" ? matches[0] : matches[idx])
    : null;

  let ta = "";
  let tb = "";
  if (isR32 || (data.teams && data.teams.length)) {
    [ta, tb] = resolveCompetitors(data, analysis, round, idx);
  }

  const knownTeams = ta && ta !== "TBD" && tb && tb !== "TBD";
  const winTop = m && m.w !== null ? m.w === 0 : false;
  const winnerCode = winTop ? ta : m && m.w === 1 ? tb : "";

  // Resolve goal data: inline g: field first, then scorers lookup
  const goals: [string[], string[]] | null =
    (m as any)?.g ?? getScorers(data._year, ta, tb);

  // Resolve match stats: historical from the generated jfjelstul set, 2026 from
  // the ESPN-sourced set.
  const stats = getStats(data._year, ta, tb) ?? getStats2026(data._year, ta, tb);

  // Highlights (YouTube embed — 2026 only for now).
  const highlight = getHighlights(data._year, ta, tb);

  // Superior Player of the Match (2026 only for now).
  const motm = getPlayerOfMatch(data._year, ta, tb);

  const notes = getMatchNotes(m);

  const played = !isSeeded && !!m && m.w !== null;

  // Derive per-team numbers for the comparison bars from the data we actually
  // have (goals, bookings, subs, shootout conversions).
  const cardsA = stats?.cards[0] ?? [];
  const cardsB = stats?.cards[1] ?? [];
  const subsA = stats?.subs[0] ?? [];
  const subsB = stats?.subs[1] ?? [];
  const pensA = stats?.pens[0] ?? [];
  const pensB = stats?.pens[1] ?? [];

  const statRows: { label: string; a: number; b: number }[] = [];
  if (played && m) {
    statRows.push({ label: "Goals", a: m.s[0], b: m.s[1] });
    if (stats?.possession) {
      statRows.push({
        label: "Possession %",
        a: parseInt(stats.possession[0]) || 0,
        b: parseInt(stats.possession[1]) || 0,
      });
    }
    if (stats?.totalShots && (stats.totalShots[0] > 0 || stats.totalShots[1] > 0)) {
      statRows.push({ label: "Total Shots", a: stats.totalShots[0], b: stats.totalShots[1] });
    }
    if (stats?.fouls && (stats.fouls[0] > 0 || stats.fouls[1] > 0)) {
      statRows.push({ label: "Fouls", a: stats.fouls[0], b: stats.fouls[1] });
    }
    if (pensA.length || pensB.length) {
      statRows.push({
        label: "Penalty Kicks",
        a: countCard(pensA, "✓"),
        b: countCard(pensB, "✓"),
      });
    }
    if (cardsA.length || cardsB.length) {
      statRows.push({ label: "Bookings", a: cardsA.length, b: cardsB.length });
    }
    if (subsA.length || subsB.length) {
      statRows.push({ label: "Substitutions", a: subsA.length, b: subsB.length });
    }
  }

  const goalsA = goals?.[0] ?? [];
  const goalsB = goals?.[1] ?? [];
  const hasGoals = goalsA.length > 0 || goalsB.length > 0;

  // Hide the stats card when goals are the only "stat" — it would just restate
  // the scoreline already shown above. Show it only for richer data.
  const showStatsCard = statRows.some((r) => r.label !== "Goals");

  const yellowA = countCard(cardsA, "🟨");
  const yellowB = countCard(cardsB, "🟨");
  const redA = countCard(cardsA, "🟥");
  const redB = countCard(cardsB, "🟥");
  const hasCards = cardsA.length > 0 || cardsB.length > 0;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${
          isClosing ? "animate-[fadeOut_0.2s_ease_forwards]" : "animate-[fadeIn_0.2s_ease]"
        }`}
        onClick={onClose}
      />

      {/* Side drawer */}
      <div
        ref={drawerRef}
        id="match-drawer"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-label={`${data._year} ${ROUND_NAME[round]} — Match ${idx + 1}`}
        className={`absolute top-0 right-0 h-full w-full max-md:max-w-none max-w-[520px] bg-brand-panel border-l border-brand-line shadow-[-30px_0_80px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar focus:outline-none ${
          isClosing
            ? "animate-[slideOutRight_0.25s_cubic-bezier(0.4,0,0.6,1)_forwards]"
            : "animate-[slideInRight_0.3s_cubic-bezier(0.2,0.8,0.2,1)]"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between px-6 pt-6 pb-4 bg-brand-panel border-b border-brand-line">
          <div>
            <div className="font-mono font-semibold text-[10px] tracking-[0.28em] uppercase text-brand-gold mb-1.5">
              {matchDate && `${matchDate.split("·")[0].trim()} `}
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
          <div className="relative overflow-hidden rounded-2xl border border-brand-line bg-[rgba(var(--overlay-rgb),0.02)] p-6">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
            {knownTeams ? (
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div className="text-center">
                  <button
                    onClick={() => onNavigateCountry?.(ta)}
                    className="mx-auto block hover:opacity-80 cursor-pointer transition-opacity"
                    aria-label={`View ${getTeamName(ta)} country page`}
                  >
                    <div className="text-[44px] leading-none mb-2">{getTeamFlag(ta)}</div>
                  </button>
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
                  <div className="font-unbounded text-[32px] flex items-center gap-1.5 px-1 select-none">
                    <span className={winTop ? "text-brand-gold-hi" : "text-brand-muted"}>{m!.s[0]}</span>
                    <span className="text-brand-steel text-xl">:</span>
                    <span className={!winTop ? "text-brand-gold-hi" : "text-brand-muted"}>{m!.s[1]}</span>
                  </div>
                ) : (
                  <div className="font-unbounded text-lg text-brand-steel px-1 select-none">vs</div>
                )}

                <div className="text-center">
                  <button
                    onClick={() => onNavigateCountry?.(tb)}
                    className="mx-auto block hover:opacity-80 cursor-pointer transition-opacity"
                    aria-label={`View ${getTeamName(tb)} country page`}
                  >
                    <div className="text-[44px] leading-none mb-2">{getTeamFlag(tb)}</div>
                  </button>
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

            {played && motm && (
              <div className="mt-4 pt-4 border-t border-brand-line">
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-brand-muted">
                    Superior Player
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/5">
                    <span className="text-lg leading-none">{getTeamFlag(motm.team)}</span>
                    <span className="font-semibold text-sm text-brand-gold-hi">{motm.name}</span>
                  </div>
                </div>
              </div>
            )}

            {hasGoals && (
              <div className="mt-4 pt-4 border-t border-brand-line">
                <div className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-muted mb-3">
                  Goals
                </div>
                <MatchGoals ta={ta} tb={tb} goalsA={goalsA} goalsB={goalsB} />
              </div>
            )}

            {played && round === "final" && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 py-2.5 px-4">
                <span>🏆</span>
                <span className="font-unbounded font-semibold text-sm text-brand-gold-hi">
                  Champion: {getTeamName(winnerCode)}
                </span>
              </div>
            )}
          </div>

          {/* Match highlights — YouTube embed (2026 only for now). */}
          {played && highlight && (
            <div className="relative overflow-hidden rounded-2xl border border-brand-line bg-[rgba(var(--overlay-rgb),0.02)] p-6">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
              <div className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-muted mb-4">
                Highlights
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${highlight.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full aspect-video rounded-xl overflow-hidden border border-brand-line bg-black cursor-pointer group"
              >
                {highlight.thumbnail ? (
                  <img
                    src={highlight.thumbnail}
                    alt={highlight.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity group-hover:opacity-80"
                  />
                ) : (
                  <div className="absolute inset-0 bg-brand-steel/20" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-brand-danger/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg width="22" height="24" viewBox="0 0 22 24" fill="white">
                      <path d="M0 0v24l22-12z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                  <p className="text-white text-[11px] leading-snug line-clamp-2">{highlight.title}</p>
                </div>
              </a>
              <a
                href={`https://www.youtube.com/watch?v=${highlight.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-brand-muted hover:text-brand-gold transition-colors font-mono"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Watch on YouTube
              </a>
            </div>
          )}

          {/* Match statistics — comparison bars (borrowed from scoreboard modal).
              Hidden when goals are the only stat, since that just restates the score. */}
          {showStatsCard && (
            <div className="relative overflow-hidden rounded-2xl border border-brand-line bg-[rgba(var(--overlay-rgb),0.02)] p-6">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
              <div className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-muted mb-4">
                Match Statistics
              </div>

              <div className="space-y-3.5">
                {statRows.map((row) => (
                  <div key={row.label}>
                    <StatBar label={row.label} a={row.a} b={row.b} />
                  </div>
                ))}
              </div>

              {hasCards && (
                <div className="mt-4 pt-4 border-t border-brand-line grid grid-cols-2 gap-3">
                  {[
                    { y: yellowA, r: redA },
                    { y: yellowB, r: redB },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="flex justify-around items-center rounded-xl border border-brand-line bg-[rgba(var(--overlay-rgb),0.02)] py-2.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-4 bg-yellow-400 rounded-sm" />
                        <span className="text-xs font-mono font-bold text-brand-text tabular-nums">
                          {c.y}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-4 bg-brand-danger rounded-sm" />
                        <span className="text-xs font-mono font-bold text-brand-text tabular-nums">
                          {c.r}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mobile close button — easier to reach than the corner X */}
          <button
            className="md:hidden w-full rounded-xl border border-brand-line bg-brand-gold/[0.08] text-brand-gold-hi font-unbounded font-semibold text-sm py-3.5 mt-2 tracking-wide"
            onClick={onClose}
          >
            Close
          </button>

          {/* Fallback note when the fixture hasn't been decided yet */}
          {!matchDate && !played && (
            <p className="text-xs text-brand-muted leading-relaxed px-1">
              This fixture hasn't been decided yet. Check back once the {data._year} tournament is underway.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
