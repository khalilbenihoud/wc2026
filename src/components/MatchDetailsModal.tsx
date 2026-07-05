import { useEffect, useState } from "react";
import { TournamentData, TournamentAnalysis } from "../types";
import { getTeamFlag, getTeamName } from "../data";
import { ROUND_NAME, resolveCompetitors, getMatchNotes } from "../constants";
import { getScorers } from "../scorers";
import { getStats } from "../stats";

interface MatchDetailsModalProps {
  isOpen: boolean;
  round: string;
  idx: number;
  data: TournamentData & { _year: number };
  analysis: TournamentAnalysis;
  onClose: () => void;
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

// Split a raw goal string like "Zinedine Zidane 90'+2' (pen.)" into parts so we
// can lay it out (name / minute badge / pen·og tag) instead of a flat line.
interface ParsedGoal {
  name: string;
  minute: string; // display label, e.g. "90'+2'"
  sort: number; // for chronological ordering
  tag: string | null; // "PEN" | "OG" | null
}

function goalTagLabel(raw: string | null): string | null {
  if (!raw) return null;
  const low = raw.toLowerCase();
  if (low.includes("pen")) return "PEN";
  if (low.includes("o.g") || low.includes("og")) return "OG";
  return raw.toUpperCase();
}

function parseGoal(raw: string): ParsedGoal {
  const trimmed = raw.trim();
  const tagMatch = trimmed.match(/\s*\(([^)]+)\)\s*$/);
  const tag = goalTagLabel(tagMatch ? tagMatch[1] : null);
  const body = tagMatch ? trimmed.slice(0, tagMatch.index).trim() : trimmed;
  const minMatch = body.match(/(\d+)'(?:\+(\d+)')?$/);
  if (!minMatch) return { name: body, minute: "", sort: 999, tag };
  const base = parseInt(minMatch[1], 10);
  const stoppage = minMatch[2] ? parseInt(minMatch[2], 10) : 0;
  return {
    name: body.slice(0, minMatch.index).trim(),
    minute: minMatch[0],
    sort: base + stoppage / 100,
    tag,
  };
}

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

  // Resolve match stats: cards, subs, pens
  const stats = getStats(data._year, ta, tb);

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

  // Goal data, parsed once for the three preview layouts below.
  const goalsA = goals?.[0] ?? [];
  const goalsB = goals?.[1] ?? [];
  const hasGoals = goalsA.length > 0 || goalsB.length > 0;
  const parsedA = goalsA.map(parseGoal);
  const parsedB = goalsB.map(parseGoal);

  const yellowA = countCard(cardsA, "🟨");
  const yellowB = countCard(cardsB, "🟨");
  const redA = countCard(cardsA, "🟥");
  const redB = countCard(cardsB, "🟥");
  const hasCards = cardsA.length > 0 || cardsB.length > 0;

  return (
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
        id="match-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${data._year} ${ROUND_NAME[round]} — Match ${idx + 1}`}
        className={`absolute top-0 right-0 h-full w-full max-md:max-w-none max-w-[420px] bg-brand-panel border-l border-brand-line shadow-[-30px_0_80px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar ${
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

            {hasGoals && (
              <div className="mt-4 pt-4 border-t border-brand-line">
                <div className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-muted mb-3">
                  Goals
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { team: ta, list: parsedA },
                    { team: tb, list: parsedB },
                  ]
                    .filter((grp) => grp.list.length > 0)
                    .map((grp) => (
                      <div key={grp.team}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm leading-none">{getTeamFlag(grp.team)}</span>
                          <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-brand-muted">
                            {getTeamName(grp.team)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {grp.list.map((g, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[rgba(var(--overlay-rgb),0.03)] transition-colors"
                            >
                              <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-brand-gold/10 text-[11px]">
                                ⚽
                              </span>
                              <span className="text-xs text-brand-text flex-1 min-w-0 truncate">
                                {g.name}
                              </span>
                              {g.tag && (
                                <span className="shrink-0 font-mono text-[8px] font-bold uppercase tracking-wider text-brand-gold/80 border border-brand-gold/30 rounded px-1 py-px">
                                  {g.tag}
                                </span>
                              )}
                              <span className="shrink-0 font-mono text-[11px] font-semibold text-brand-gold tabular-nums">
                                {g.minute}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
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

          {/* Match statistics — comparison bars (borrowed from scoreboard modal) */}
          {statRows.length > 0 && (
            <div className="relative overflow-hidden rounded-2xl border border-brand-line bg-[rgba(var(--overlay-rgb),0.02)] p-6">
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
    </div>
  );
}
