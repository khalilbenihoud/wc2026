import { useState, useMemo } from "react";
import { TournamentData, TournamentAnalysis } from "../types";
import { getTeamFlag, getTeamName } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Search, X, Sparkles, Filter, Info } from "lucide-react";

interface ResultsPanelProps {
  data: TournamentData & { _year: number };
  analysis: TournamentAnalysis;
  onSelectMatch: (round: string, idx: number) => void;
}

type RoundKey = "r16" | "qf" | "sf" | "final";

const ROUND_COLS: { key: RoundKey; label: string; count: number }[] = [
  { key: "r16", label: "Round of 16", count: 8 },
  { key: "qf", label: "Quarter-finals", count: 4 },
  { key: "sf", label: "Semi-finals", count: 2 },
  { key: "final", label: "Final", count: 1 },
];

export default function ResultsPanel({
  data,
  analysis,
  onSelectMatch,
}: ResultsPanelProps) {
  const [activeRound, setActiveRound] = useState<"all" | RoundKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const isFuture = data.seeded;
  const hasR32Panel = !!data.r32 || !data.r16;
  const champCode =
    analysis.champ !== null ? data.teams[analysis.champ] : null;

  // Resolves the two teams for a given match
  const getCompetitors = (round: string, idx: number): [string, string] => {
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

  // Filter/search check
  const isMatchHighlighted = (ta: string, tb: string) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const nameA = getTeamName(ta).toLowerCase();
    const nameB = getTeamName(tb).toLowerCase();
    const codeA = ta.toLowerCase();
    const codeB = tb.toLowerCase();
    return nameA.includes(q) || nameB.includes(q) || codeA.includes(q) || codeB.includes(q);
  };

  // Count matches in current view that fit search query
  const matchingMatchesCount = useMemo(() => {
    let count = 0;
    const roundsToCheck = activeRound === "all" ? (["r16", "qf", "sf", "final"] as RoundKey[]) : [activeRound];
    
    roundsToCheck.forEach((roundKey) => {
      const matches = data[roundKey];
      if (!matches) return;
      const totalCount = roundKey === "final" ? 1 : matches.length;
      for (let i = 0; i < totalCount; i++) {
        const [ta, tb] = getCompetitors(roundKey, i);
        if (isMatchHighlighted(ta, tb)) {
          count++;
        }
      }
    });
    return count;
  }, [activeRound, searchQuery, data, analysis]);

  // Handle r32 / partial tournament state
  if (hasR32Panel) {
    const r32 = data.r32;
    return (
      <div className="results-wrap max-w-[1120px] mx-auto my-4 px-5 animate-[floatUp_0.9s_cubic-bezier(0.2,0.7,0.2,1)_0.2s_both]">
        <div className="results relative overflow-hidden bg-gradient-to-b from-brand-panel to-brand-bg border border-brand-line rounded-[22px] p-7 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-md">
          <div className="absolute top-0 left-[14%] right-[14%] h-[1px] bg-gradient-to-r from-transparent via-brand-gold/55 to-transparent" />

          <div className="res-head flex justify-between items-end gap-4 flex-wrap pb-5 mb-5 border-b border-brand-line">
            <div>
              <div className="res-kicker text-[10px] tracking-[0.34em] uppercase text-brand-muted mb-1.5">
                {data._year} · Round of 16
              </div>
              <h2 className="res-title font-unbounded font-bold text-2xl md:text-3xl tracking-tight text-brand-text leading-none">
                {r32 ? "Match results" : "Bracket not yet set"}
              </h2>
            </div>
            <div className="res-champ font-unbounded font-semibold text-base tracking-wide text-brand-gold pb-1 max-md:mt-2">
              🔮 Champion T.B.D.
            </div>
          </div>

          {r32 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {r32.map((m, i) => {
                  if (m.ta === "TBD" && m.tb === "TBD") return null;
                  const played = m.s !== null && m.w !== null;
                  const wA = played && m.w === 0;
                  const wB = played && m.w === 1;
                  const notes: string[] = [];
                  if (m.x) notes.push(m.x.trim());
                  if (m.p) notes.push(`${m.p.replace("-", "–")} pen`);

                  return (
                    <div
                      key={i}
                      className={`relative p-4 rounded-2xl flex flex-col gap-3 ${
                        played
                          ? "bg-brand-panel/45 border border-brand-line/75"
                          : "bg-brand-bg/40 border-2 border-dashed border-brand-steel/40"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase font-semibold">
                          Match {i + 1}
                        </span>
                        {notes.length > 0 && (
                          <span className="text-[8.5px] font-sans font-medium text-brand-gold-hi bg-brand-gold/10 px-1.5 py-0.5 rounded">
                            {notes.join(" · ")}
                          </span>
                        )}
                        {!played && (
                          <span className="text-[8.5px] font-mono text-brand-muted/50 tracking-widest uppercase">
                            TBD
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl leading-none flex-none select-none">{getTeamFlag(m.ta)}</span>
                          <span className={`truncate font-medium ${wA ? "text-brand-text font-semibold" : played ? "text-brand-muted" : "text-brand-text/70"}`}>
                            {getTeamName(m.ta)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-none">
                          {wA && <span className="text-brand-gold text-xs font-bold">✓</span>}
                          <span className={`font-mono font-bold text-base w-5 text-right ${wA ? "text-brand-gold-hi" : "text-brand-muted"}`}>
                            {played ? m.s![0] : "–"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl leading-none flex-none select-none">{getTeamFlag(m.tb)}</span>
                          <span className={`truncate font-medium ${wB ? "text-brand-text font-semibold" : played ? "text-brand-muted" : "text-brand-text/70"}`}>
                            {getTeamName(m.tb)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-none">
                          {wB && <span className="text-brand-gold text-xs font-bold">✓</span>}
                          <span className={`font-mono font-bold text-base w-5 text-right ${wB ? "text-brand-gold-hi" : "text-brand-muted"}`}>
                            {played ? m.s![1] : "–"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* R16 section — shown when round of 16 results exist */}
              {data.r16 && (
                <>
                  <div className="flex items-center gap-4 py-1">
                    <div className="flex-1 h-[1px] bg-brand-line" />
                    <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-brand-gold/70 font-semibold">
                      Round of 16
                    </span>
                    <div className="flex-1 h-[1px] bg-brand-line" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.r16.map((m, i) => {
                      const ta = data.teams[2 * i];
                      const tb = data.teams[2 * i + 1];
                      const wA = m.w === 0;
                      const wB = m.w === 1;
                      const notes: string[] = [];
                      if (m.x) notes.push(m.x.trim());
                      if (m.p) notes.push(`${m.p.replace("-", "–")} pen`);
                      return (
                        <div
                          key={i}
                          className="relative p-4 rounded-2xl border border-brand-line/75 bg-brand-panel/45 flex flex-col gap-3"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase font-semibold">
                              Match {i + 1}
                            </span>
                            {notes.length > 0 && (
                              <span className="text-[8.5px] font-sans font-medium text-brand-gold-hi bg-brand-gold/10 px-1.5 py-0.5 rounded">
                                {notes.join(" · ")}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xl leading-none flex-none select-none">{getTeamFlag(ta)}</span>
                              <span className={`truncate font-medium ${wA ? "text-brand-text font-semibold" : "text-brand-muted"}`}>{getTeamName(ta)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-none">
                              {wA && <span className="text-brand-gold text-xs font-bold">✓</span>}
                              <span className={`font-mono font-bold text-base w-5 text-right ${wA ? "text-brand-gold-hi" : "text-brand-muted"}`}>{m.s[0]}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xl leading-none flex-none select-none">{getTeamFlag(tb)}</span>
                              <span className={`truncate font-medium ${wB ? "text-brand-text font-semibold" : "text-brand-muted"}`}>{getTeamName(tb)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-none">
                              {wB && <span className="text-brand-gold text-xs font-bold">✓</span>}
                              <span className={`font-mono font-bold text-base w-5 text-right ${wB ? "text-brand-gold-hi" : "text-brand-muted"}`}>{m.s[1]}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-3.5 bg-[rgba(var(--overlay-rgb),0.02)] border border-[rgba(var(--overlay-rgb),0.05)] rounded-xl p-4">
              <Info className="w-5 h-5 text-brand-gold/80 flex-none mt-0.5" />
              <p className="res-note-big text-brand-muted text-sm leading-relaxed">
                The {data._year} bracket has not been drawn yet. Team fixtures and live match scores will populate this section once the tournament kicks off.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="results-wrap max-w-[1120px] mx-auto my-8 px-5">
      {/* Outer Glow Wrapper Container */}
      <div className="results relative overflow-hidden bg-gradient-to-b from-brand-panel to-brand-bg border border-brand-line rounded-[24px] p-6 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
        {/* Top subtle golden light flare */}
        <div className="absolute top-0 left-[10%] right-[10%] h-[1.5px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />

        {/* Header section with Champion banner */}
        <div className="res-head flex justify-between items-center gap-6 flex-wrap pb-6 mb-6 border-b border-brand-line">
          <div>
            <div className="res-kicker text-[10px] tracking-[0.32em] uppercase text-brand-gold font-semibold mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> MATCH WINNERS & PHASE RESULTS
            </div>
            <h2 className="res-title font-unbounded font-bold text-2xl md:text-3xl tracking-tight text-brand-text leading-none">
              {data._year} Knockout Stage
            </h2>
          </div>
          {champCode && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
              className="res-champ flex items-center gap-3 bg-brand-gold/10 border border-brand-gold/30 rounded-full py-2 px-5 shadow-[0_0_20px_rgba(246,196,83,0.1)]"
            >
              <Trophy className="w-5 h-5 text-brand-gold animate-bounce" />
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-widest text-brand-gold/80 font-semibold leading-none mb-0.5">CHAMPION</p>
                <p className="font-unbounded font-bold text-sm tracking-wide text-brand-text leading-none">
                  {getTeamName(champCode)}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Interactive Controls Panel (Tabs + Search) */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          {/* Segmented Tab Switched Control */}
          <div className="flex items-center p-1 bg-brand-bg-2/85 border border-brand-line rounded-xl overflow-x-auto scrollbar-none gap-0.5">
            <button
              onClick={() => setActiveRound("all")}
              className={`px-3.5 py-1.5 text-xs font-unbounded font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeRound === "all"
                  ? "bg-brand-gold text-brand-bg shadow-sm font-semibold"
                  : "text-brand-muted hover:text-brand-text hover:bg-[rgba(var(--overlay-rgb),0.05)]"
              }`}
            >
              All Phases
            </button>
            {ROUND_COLS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveRound(key)}
                className={`px-3.5 py-1.5 text-xs font-unbounded font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeRound === key
                    ? "bg-brand-gold text-brand-bg shadow-sm font-semibold"
                    : "text-brand-muted hover:text-brand-text hover:bg-[rgba(var(--overlay-rgb),0.05)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Quick Team Filter Search */}
          <div className="relative flex-1 max-w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              placeholder="Search team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-brand-bg-2/85 border border-brand-line rounded-xl text-xs text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-1.5 focus:ring-brand-gold/60 focus:border-brand-gold/40 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-[rgba(var(--overlay-rgb),0.1)] text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Display Grid */}
        <AnimatePresence mode="wait">
          {matchingMatchesCount === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-12 text-center bg-[rgba(var(--overlay-rgb),0.01)] border border-dashed border-brand-line rounded-2xl"
            >
              <div className="p-4 rounded-full bg-[rgba(var(--overlay-rgb),0.02)] border border-[rgba(var(--overlay-rgb),0.04)] mb-3 text-brand-muted">
                <Filter className="w-6 h-6 opacity-60" />
              </div>
              <h3 className="font-unbounded font-semibold text-brand-text text-sm mb-1">No Matches Found</h3>
              <p className="text-brand-muted text-xs max-w-xs mb-4">
                We couldn't find matches involving "{searchQuery}" in the selected phase.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-1.5 bg-brand-steel-dim border border-brand-line rounded-lg text-xs text-brand-gold font-medium hover:bg-brand-line transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </motion.div>
          ) : activeRound === "all" ? (
            /* Multi-Column Phase Lanes View */
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="res-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {ROUND_COLS.map(({ key, label, count }) => {
                const matches = data[key];
                return (
                  <div
                    key={key}
                    className="flex flex-col bg-brand-bg-2/30 border border-brand-line/55 rounded-2xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.015)]"
                  >
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-brand-line">
                      <span className="font-unbounded font-semibold text-xs tracking-tight text-brand-text">
                        {label}
                      </span>
                      <span className="font-mono text-[10px] text-brand-gold font-semibold bg-brand-gold/10 px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </div>

                    <div className="space-y-3.5 flex-1 flex flex-col justify-center">
                      {Array.from({ length: count }).map((_, i) => {
                        const m = matches
                          ? key === "final"
                            ? matches[0]
                            : matches[i]
                          : null;
                        if (!m) return null;

                        const [ta, tb] = getCompetitors(key, i);
                        const isQueryMatched = isMatchHighlighted(ta, tb);
                        const hasActiveQuery = searchQuery.length > 0;

                        const wTop = m.w === 0;
                        const notes: string[] = [];
                        if (m.x) notes.push(m.x.trim());
                        if (m.p) notes.push(`${m.p.replace("-", "–")} pen`);

                        return (
                          <div
                            key={i}
                            onClick={() => onSelectMatch(key, i)}
                            className={`group relative p-3 bg-brand-panel/40 border rounded-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                              hasActiveQuery
                                ? isQueryMatched
                                  ? "border-brand-gold ring-1.5 ring-brand-gold/30 bg-brand-gold/[0.02]"
                                  : "border-brand-line/40 opacity-30 scale-95 select-none pointer-events-none"
                                : "border-brand-line/75 hover:border-brand-gold/40 hover:bg-brand-panel/85 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:-translate-y-[1px]"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[8.5px] font-mono tracking-widest text-brand-muted group-hover:text-brand-gold/80 transition-colors uppercase font-semibold">
                                Match {i + 1}
                              </span>
                              {notes.length > 0 && (
                                <span className="text-[8.5px] font-sans font-medium text-brand-gold-hi bg-brand-gold/10 px-1 py-0.5 rounded">
                                  {notes.join(" · ")}
                                </span>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              {/* Team A */}
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-base flex-none select-none">{getTeamFlag(ta)}</span>
                                  <span className={`truncate ${wTop ? "text-brand-text font-semibold" : "text-brand-muted"}`}>
                                    {getTeamName(ta)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {wTop && <span className="text-brand-gold text-[10px] font-bold">✓</span>}
                                  <span className={`font-mono font-bold w-5 text-right ${wTop ? "text-brand-gold-hi text-sm" : "text-brand-muted"}`}>
                                    {m.s[0]}
                                  </span>
                                </div>
                              </div>

                              {/* Team B */}
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-base flex-none select-none">{getTeamFlag(tb)}</span>
                                  <span className={`truncate ${!wTop ? "text-brand-text font-semibold" : "text-brand-muted"}`}>
                                    {getTeamName(tb)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {!wTop && <span className="text-brand-gold text-[10px] font-bold">✓</span>}
                                  <span className={`font-mono font-bold w-5 text-right ${!wTop ? "text-brand-gold-hi text-sm" : "text-brand-muted"}`}>
                                    {m.s[1]}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : activeRound === "final" ? (
            /* Special Large Final Championship Centerpiece Card */
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="max-w-2xl mx-auto py-4"
            >
              {(() => {
                const matches = data.final;
                const m = matches ? matches[0] : null;
                if (!m) return null;
                const [ta, tb] = getCompetitors("final", 0);
                const wTop = m.w === 0;

                const notes: string[] = [];
                if (m.x) notes.push(m.x.toUpperCase().trim());
                if (m.p) notes.push(`PENALTIES: ${m.p.replace("-", "–")}`);

                return (
                  <div
                    onClick={() => onSelectMatch("final", 0)}
                    className="relative group p-8 bg-gradient-to-b from-brand-panel via-brand-panel/90 to-brand-bg border-2 border-brand-gold/30 hover:border-brand-gold/60 rounded-3xl cursor-pointer transition-all duration-300 shadow-[0_30px_70px_rgba(0,0,0,0.6),0_0_40px_rgba(246,196,83,0.04)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.75),0_0_50px_rgba(246,196,83,0.08)] text-center overflow-hidden"
                  >
                    {/* Golden sparkles bg details */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,196,83,0.05),transparent_65%)] pointer-events-none" />

                    <div className="mb-6">
                      <span className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full py-1 px-4 text-[10px] tracking-[0.25em] text-brand-gold font-unbounded font-semibold uppercase">
                        <Trophy className="w-3.5 h-3.5 text-brand-gold animate-pulse" /> Grand Final
                      </span>
                    </div>

                    <div className="grid grid-cols-7 items-center gap-4 max-w-lg mx-auto">
                      {/* Contender Left */}
                      <div className="col-span-3 flex flex-col items-center">
                        <span className="text-5xl md:text-6xl mb-4 select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)] block transition-transform group-hover:scale-110 duration-300">
                          {getTeamFlag(ta)}
                        </span>
                        <h4 className={`font-unbounded text-sm md:text-base tracking-tight leading-tight ${wTop ? "text-brand-gold-hi font-bold" : "text-brand-muted"}`}>
                          {getTeamName(ta)}
                        </h4>
                        {wTop && (
                          <span className="mt-2 inline-flex items-center gap-1 text-[9px] uppercase tracking-wider bg-brand-win/15 text-brand-win border border-brand-win/20 font-bold px-2.5 py-0.5 rounded-full font-sans">
                            🏆 Champion
                          </span>
                        )}
                      </div>

                      {/* Versus & Scores Center */}
                      <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`font-mono text-3xl md:text-4xl font-extrabold ${wTop ? "text-brand-gold" : "text-brand-muted"}`}>
                            {m.s[0]}
                          </span>
                          <span className="text-brand-muted/40 font-light text-xl">:</span>
                          <span className={`font-mono text-3xl md:text-4xl font-extrabold ${!wTop ? "text-brand-gold" : "text-brand-muted"}`}>
                            {m.s[1]}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono tracking-widest text-brand-muted/70 mt-3 uppercase font-semibold">VS</span>
                      </div>

                      {/* Contender Right */}
                      <div className="col-span-3 flex flex-col items-center">
                        <span className="text-5xl md:text-6xl mb-4 select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)] block transition-transform group-hover:scale-110 duration-300">
                          {getTeamFlag(tb)}
                        </span>
                        <h4 className={`font-unbounded text-sm md:text-base tracking-tight leading-tight ${!wTop ? "text-brand-gold-hi font-bold" : "text-brand-muted"}`}>
                          {getTeamName(tb)}
                        </h4>
                        {!wTop && (
                          <span className="mt-2 inline-flex items-center gap-1 text-[9px] uppercase tracking-wider bg-brand-win/15 text-brand-win border border-brand-win/20 font-bold px-2.5 py-0.5 rounded-full font-sans">
                            🏆 Champion
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Match Notes Footer */}
                    {notes.length > 0 && (
                      <div className="mt-8 pt-4 border-t border-brand-line max-w-md mx-auto">
                        <p className="text-[10px] font-mono tracking-wider text-brand-gold/70 bg-brand-gold/5 border border-brand-gold/10 inline-block px-3 py-1 rounded-md">
                          {notes.join(" · ")}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          ) : (
            /* Selected Stage Grid View */
            <motion.div
              key={activeRound}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {(() => {
                const matches = data[activeRound];
                const count = ROUND_COLS.find((r) => r.key === activeRound)?.count || 0;
                return Array.from({ length: count }).map((_, i) => {
                  const m = matches
                    ? activeRound === "final"
                      ? matches[0]
                      : matches[i]
                    : null;
                  if (!m) return null;

                  const [ta, tb] = getCompetitors(activeRound, i);
                  const isQueryMatched = isMatchHighlighted(ta, tb);
                  const hasActiveQuery = searchQuery.length > 0;

                  // Skip rendering completely if not matched during filtering
                  if (hasActiveQuery && !isQueryMatched) return null;

                  const wTop = m.w === 0;
                  const notes: string[] = [];
                  if (m.x) notes.push(m.x.trim());
                  if (m.p) notes.push(`${m.p.replace("-", "–")} pen`);

                  return (
                    <motion.div
                      key={i}
                      layout
                      onClick={() => onSelectMatch(activeRound, i)}
                      className="group relative p-4 bg-brand-panel/45 hover:bg-brand-panel/85 border border-brand-line hover:border-brand-gold/40 rounded-2xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] flex flex-col justify-between min-h-[120px] hover:-translate-y-[1.5px]"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono tracking-widest text-brand-muted group-hover:text-brand-gold/80 transition-colors uppercase font-semibold">
                          Match {i + 1}
                        </span>
                        {notes.length > 0 && (
                          <span className="text-[9px] font-sans font-medium text-brand-gold-hi bg-brand-gold/10 px-1.5 py-0.5 rounded">
                            {notes.join(" · ")}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {/* Team A */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl leading-none select-none flex-none">{getTeamFlag(ta)}</span>
                            <span className={`truncate font-medium ${wTop ? "text-brand-text font-semibold" : "text-brand-muted"}`}>
                              {getTeamName(ta)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-none">
                            {wTop && <span className="text-brand-gold text-xs font-bold">✓</span>}
                            <span className={`font-mono font-bold text-base w-6 text-right ${wTop ? "text-brand-gold-hi" : "text-brand-muted"}`}>
                              {m.s[0]}
                            </span>
                          </div>
                        </div>

                        {/* Team B */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl leading-none select-none flex-none">{getTeamFlag(tb)}</span>
                            <span className={`truncate font-medium ${!wTop ? "text-brand-text font-semibold" : "text-brand-muted"}`}>
                              {getTeamName(tb)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-none">
                            {!wTop && <span className="text-brand-gold text-xs font-bold">✓</span>}
                            <span className={`font-mono font-bold text-base w-6 text-right ${!wTop ? "text-brand-gold-hi" : "text-brand-muted"}`}>
                              {m.s[1]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                });
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
