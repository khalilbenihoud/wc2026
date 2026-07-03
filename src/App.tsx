import { useState, useMemo, useEffect, useCallback } from "react";
import { TournamentData, TournamentAnalysis } from "./types";
import { TOURNAMENTS, getTeamFlag, getTeamName, getTeamColor } from "./data";
import Timeline from "./components/Timeline";
import RadialBracket from "./components/RadialBracket";
// ResultsPanel is currently disabled (see below) — re-add this import if reactivating it.
import MatchDetailsModal from "./components/MatchDetailsModal";

const ROUND_NAME: Record<string, string> = {
  r16: "Round of 16",
  qf: "Quarter-final",
  sf: "Semi-final",
  final: "Final",
};

// Tournament analysis calculator
function analyze(d: TournamentData): TournamentAnalysis {
  if (!d.r16) {
    return { champ: null, adv: new Array(16).fill(0), w1: [], w2: [], w3: [] };
  }
  const w1: number[] = [];
  const w2: number[] = [];
  const w3: number[] = [];

  for (let i = 0; i < 8; i++) {
    w1[i] = 2 * i + d.r16[i].w;
  }
  if (d.qf) {
    for (let i = 0; i < 4; i++) {
      const a = w1[2 * i];
      const b = w1[2 * i + 1];
      w2[i] = d.qf[i].w === 0 ? a : b;
    }
  }
  if (d.sf && w2.length === 4) {
    for (let i = 0; i < 2; i++) {
      const a = w2[2 * i];
      const b = w2[2 * i + 1];
      w3[i] = d.sf[i].w === 0 ? a : b;
    }
  }
  const champ = (d.final && w3.length === 2) ? (d.final[0].w === 0 ? w3[0] : w3[1]) : null;

  const adv = new Array(16).fill(0);
  for (let leaf = 0; leaf < 16; leaf++) {
    let a = 0;
    if (w1.length && w1[Math.floor(leaf / 2)] === leaf) {
      a = 1;
      if (w2.length && w2[Math.floor(leaf / 4)] === leaf) {
        a = 2;
        if (w3.length && w3[Math.floor(leaf / 8)] === leaf) {
          a = 3;
          if (champ === leaf) a = 4;
        }
      }
    }
    adv[leaf] = a;
  }

  return { champ, adv, w1, w2, w3 };
}

export default function App() {
  const [lightMode, setLightMode] = useState<boolean>(
    () => localStorage.getItem("wc-classic-mode") === "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", lightMode);
    localStorage.setItem("wc-classic-mode", lightMode ? "light" : "dark");
  }, [lightMode]);

  const [activeYear, setActiveYear] = useState<number>(2022);

  // WebMCP: expose "switch tournament year" as an agent-invokable tool, when
  // the browser supports it. Experimental API (navigator.modelContext isn't
  // in the DOM lib yet), feature-detected so this is a no-op everywhere else.
  useEffect(() => {
    const modelContext = (
      navigator as unknown as {
        modelContext?: { provideContext: (options: unknown) => void };
      }
    ).modelContext;
    if (!modelContext) return;

    modelContext.provideContext({
      tools: [
        {
          name: "select_world_cup_year",
          description:
            "Switch the displayed bracket to a specific FIFA World Cup year, to view that tournament's host, champion, and knockout results.",
          inputSchema: {
            type: "object",
            properties: {
              year: {
                type: "number",
                enum: Object.keys(TOURNAMENTS).map(Number),
                description: "The tournament year to display, e.g. 2022.",
              },
            },
            required: ["year"],
          },
          execute: async ({ year }: { year: number }) => {
            setActiveYear(year);
            return {
              content: [{ type: "text", text: `Now showing the ${year} World Cup bracket.` }],
            };
          },
        },
      ],
    });
  }, []);

  const [hoveredLeaf, setHoveredLeaf] = useState<number | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<{
    round: string;
    idx: number;
  } | null>(null);

  const [tooltip, setTooltip] = useState({
    round: "",
    idx: 0,
    x: 0,
    y: 0,
    visible: false,
  });

  // Pre-calculate tournament analyses
  const analyses = useMemo(() => {
    const result: Record<number, TournamentAnalysis> = {};
    for (const year of Object.keys(TOURNAMENTS).map(Number)) {
      result[year] = analyze(TOURNAMENTS[year]);
    }
    return result;
  }, []);

  const currentData = useMemo(() => {
    return {
      ...TOURNAMENTS[activeYear],
      _year: activeYear,
    };
  }, [activeYear]);

  const currentAnalysis = useMemo(() => {
    return analyses[activeYear];
  }, [analyses, activeYear]);

  const handleSelectMatch = useCallback((round: string, idx: number) => {
    setSelectedMatch({ round, idx });
  }, []);

  const handleShowTooltip = useCallback((
    round: string,
    idx: number,
    x: number,
    y: number,
    visible: boolean
  ) => {
    setTooltip({ round, idx, x, y, visible });
  }, []);

  const getTooltipContent = () => {
    if (!tooltip.visible || !tooltip.round) return null;
    const d = TOURNAMENTS[activeYear];
    const analysis = analyses[activeYear];
    const round = tooltip.round;
    const idx = tooltip.idx;

    let ta = "";
    let tb = "";

    if (round === "r16") {
      ta = d.teams[2 * idx];
      tb = d.teams[2 * idx + 1];
    } else if (!d[round as "qf" | "sf" | "final"]) {
      return null; // seeded tournament (e.g., 2026 QF/SF/Final unknown)
    } else if (round === "qf") {
      ta = d.teams[analysis.w1[2 * idx]];
      tb = d.teams[analysis.w1[2 * idx + 1]];
    } else if (round === "sf") {
      ta = d.teams[analysis.w2[2 * idx]];
      tb = d.teams[analysis.w2[2 * idx + 1]];
    } else {
      ta = d.teams[analysis.w3[0]];
      tb = d.teams[analysis.w3[1]];
    }

    const matches = d[round as "r16" | "qf" | "sf" | "final"];
    const m = matches ? (round === "final" ? matches[0] : matches[idx]) : null;
    const wA = m && m.w === 0;
    const wB = m && m.w === 1;
    const score = m ? `${m.s[0]}–${m.s[1]}` : "vs";

    const notes: string[] = [];
    if (m) {
      if (m.x) notes.push(m.x.trim());
      if (m.p) notes.push(`pens ${m.p.replace("-", "–")}`);
    }

    return (
      <div className="text-center font-sans">
        <div className="tt-round font-unbounded text-[10px] text-brand-gold tracking-widest uppercase mb-1.5 select-none font-medium">
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
          <div className="tt-note mt-2 text-[9px] tracking-wider uppercase text-brand-muted select-none">
            {notes.map((n, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-1 text-brand-steel">·</span>}
                <b className="text-brand-gold font-semibold">{n}</b>
              </span>
            ))}
          </div>
        ) : (
          !m && (
            <div className="tt-note mt-1.5 text-[9px] tracking-wider uppercase text-brand-muted select-none font-medium">
              not yet played
            </div>
          )
        )}
      </div>
    );
  };

  const champCode =
    currentAnalysis.champ !== null
      ? currentData.teams[currentAnalysis.champ]
      : null;

  // FIFA World Cup editions run every 4 years from 1930, skipping 1942/1946
  // (WWII). 1986 was the 13th edition, so this holds for every year on our
  // timeline (all >= 1986, stepping by 4).
  const editionsCount = 13 + (activeYear - 1986) / 4;

  useEffect(() => {
    const champName = champCode ? getTeamName(champCode) : "TBD";
    document.title = `${activeYear} World Cup Bracket — ${champName} · The Road to Glory`;
  }, [activeYear, champCode]);

  return (
    <div className="relative z-[1] min-h-screen md:h-screen md:overflow-hidden text-brand-text flex flex-col">
      {/* Mobile notice — the radial bracket needs room to breathe */}
      <div className="flex-none md:hidden text-center text-[10px] tracking-wide text-brand-gold/80 bg-brand-gold/[0.06] border-b border-brand-gold/15 py-2 px-4">
        For the best experience, view this on a larger screen.
      </div>

      {/* Dynamic Background Layout Frame */}
      <div className="app relative grid grid-cols-1 md:grid-cols-[300px_1fr] md:min-h-0 md:flex-1 items-stretch">
        {/* Sidebar divider — pinned to the full height of the app frame, fading out toward the bottom */}
        <div
          className="hidden md:block absolute top-0 bottom-0 left-[300px] w-px pointer-events-none"
          style={{ background: "linear-gradient(to bottom, var(--line) 0%, var(--line) 70%, transparent 100%)" }}
        />

        {/* Left Rail: Brand + Timeline */}
        <aside className="rail relative z-20 flex flex-col md:min-h-0 p-4 pt-3 md:p-6 md:py-9 md:pr-6 md:pl-9 bg-gradient-to-b from-[rgba(var(--overlay-rgb),0.016)] to-transparent max-md:animate-none md:animate-[riseIn_0.8s_cubic-bezier(0.2,0.7,0.2,1)_both]">
          <div className="brand relative mb-3 md:mb-6 max-md:text-center">
            {/* Light/dark toggle */}
            <button
              onClick={() => setLightMode((v) => !v)}
              aria-label="Toggle light/dark mode"
              className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center rounded-full border border-brand-line bg-brand-panel/60 backdrop-blur-sm text-brand-muted hover:text-brand-text transition-colors cursor-pointer text-xs max-md:static max-md:mb-3 max-md:mx-auto"
            >
              {lightMode ? "🌙" : "☀️"}
            </button>

            <div className="kicker inline-flex items-center gap-2.5 font-sans font-semibold tracking-[0.3em] uppercase text-[9.5px] text-brand-gold mb-3.5">
              FIFA World Cup
            </div>
            <h1 className="relative m-0 font-unbounded font-bold text-2xl md:text-3xl lg:text-4xl leading-none tracking-tight">
              <span className="tt bg-clip-text text-transparent bg-gradient-to-b from-brand-gold-hi via-brand-gold to-brand-gold-deep filter drop-shadow-[0_6px_22px_rgba(246,196,83,0.2)]">
                The Road to Glory
              </span>
            </h1>
            <p className="sub text-brand-muted text-xs mt-3 leading-relaxed max-w-[224px] max-md:mx-auto">
              Every knockout run since 1986, traced from first match to final whistle.
            </p>
          </div>

          <Timeline
            activeYear={activeYear}
            onSelectYear={setActiveYear}
            analyses={analyses}
          />
        </aside>

        {/* Right Main Panel: Interactive Bracket */}
        <main className="main relative z-10 flex flex-col md:min-h-0 items-center justify-center pt-9 pb-4 px-4 md:pb-4 md:px-6">
          {/* Header Metadata */}
          <div className="flex-none w-full max-w-[900px] mb-4 relative z-10 max-md:animate-none md:animate-[riseIn_0.8s_cubic-bezier(0.2,0.7,0.2,1)_0.2s_both]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-t-xl border border-brand-line bg-[rgba(var(--overlay-rgb),0.025)] backdrop-blur-sm px-5 py-4">
              {/* Edition + editorial quote */}
              <div className="text-center md:text-left min-w-0">
                <div className="text-[9px] uppercase tracking-[0.28em] text-brand-muted font-semibold mb-1.5">
                  Edition · {activeYear}
                </div>
                <p className="font-serif italic text-sm md:text-base leading-snug max-w-[380px] mx-auto md:mx-0 text-brand-text">
                  {currentData.quote ?? "The story is still being written."}
                </p>
              </div>

              {/* Host / Champion / Golden Boot chips */}
              <div className="flex items-stretch justify-center rounded-xl border border-brand-line overflow-hidden divide-x divide-brand-line flex-none mx-auto md:mx-0">
                <div className="flex flex-col items-center justify-center py-3 px-4 gap-1.5">
                  <span className="text-[9px] uppercase tracking-[0.28em] text-brand-muted font-semibold whitespace-nowrap">Host Nation</span>
                  <span className="text-brand-text font-bold text-sm uppercase tracking-wide leading-none whitespace-nowrap">
                    {currentData.hostFlag} {currentData.host}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center py-3 px-4 gap-1.5 bg-brand-gold/[0.04]">
                  <span className="text-[9px] uppercase tracking-[0.28em] text-brand-gold/60 font-semibold whitespace-nowrap">Champion</span>
                  <span className="text-brand-gold font-bold text-sm uppercase tracking-wide leading-none whitespace-nowrap">
                    {champCode ? `${getTeamFlag(champCode)} ${getTeamName(champCode)}` : "To be crowned"}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center py-3 px-4 gap-1.5">
                  <span className="text-[9px] uppercase tracking-[0.28em] text-brand-muted font-semibold whitespace-nowrap">Golden Boot</span>
                  <span className="text-brand-text font-bold text-sm uppercase tracking-wide leading-none whitespace-nowrap">
                    {currentData.goldenBoot
                      ? `⚽ ${currentData.goldenBoot.name} · ${currentData.goldenBoot.goals}`
                      : "TBD"}
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary stat strip */}
            <div className="flex items-center justify-between px-5 py-2 border-x border-b border-brand-line rounded-b-xl bg-[rgba(var(--overlay-rgb),0.015)] text-[9px] tracking-[0.2em] uppercase text-brand-muted">
              <span>Est. 1930</span>
              <span className="text-brand-gold/80 font-semibold">{editionsCount} Editions</span>
            </div>
          </div>

          {/* Svg Radial Stage */}
          <div className="stage-wrap flex-1 min-h-0 flex justify-center items-center p-1 w-full max-w-[860px] mx-auto">
            <div className="stage relative h-full max-h-[860px] w-auto max-w-full aspect-square max-md:animate-none md:animate-[floatUp_1s_cubic-bezier(0.2,0.7,0.2,1)_0.3s_both] before:content-[''] before:absolute before:inset-0 before:z-0 before:pointer-events-none before:bg-[radial-gradient(circle_at_50%_50%,rgba(246,196,83,0.11),rgba(246,196,83,0.03)_24%,transparent_46%)]">
              <RadialBracket
                data={currentData}
                analysis={currentAnalysis}
                onSelectMatch={handleSelectMatch}
                hoveredLeaf={hoveredLeaf}
                setHoveredLeaf={setHoveredLeaf}
                onShowTooltip={handleShowTooltip}
              />
            </div>
          </div>

          {/* Radial Legend / Interactive Hints */}
          <div className="legend flex-none flex gap-6 justify-center flex-wrap items-center text-brand-muted text-[11px] tracking-wider uppercase mt-1 mb-4 relative z-10 max-md:animate-none md:animate-[riseIn_0.8s_ease_0.5s_both]">
            <div className="item flex items-center gap-2">
              <span className="sw rainbow w-5 h-0.5 rounded bg-gradient-to-r from-[#6cc2ef] via-[#ffd21e] to-[#e02531]" />
              Hover a flag to trace its run
            </div>
            <div className="item flex items-center gap-2">
              <span className="sw dotc w-2 h-2 rounded-full bg-brand-steel" />
              Winners advance toward the center
            </div>
            <div className="item text-brand-gold/75 font-medium">
              Click any match for the full score
            </div>
          </div>
        </main>
      </div>

      {/* Results details panel list — hidden for now, revisit later */}
      {/* <ResultsPanel
        data={currentData}
        analysis={currentAnalysis}
        onSelectMatch={handleSelectMatch}
      /> */}

      {/* Floating Tooltip */}
      {tooltip.visible && getTooltipContent() && (
        <div
          className="tip fixed z-50 pointer-events-none select-none -translate-x-1/2 -translate-y-[118%] bg-gradient-to-b from-brand-panel to-brand-bg border border-brand-line rounded-xl py-2 px-3.5 min-w-[180px] shadow-[0_16px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(246,196,83,0.05)] after:content-[''] after:absolute after:left-1/2 after:-bottom-1.5 after:-translate-x-1/2 after:rotate-45 after:w-2.5 after:h-2.5 after:bg-brand-bg after:border-r after:border-b after:border-brand-line transition-all duration-100 ease-out"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            opacity: tooltip.visible ? 1 : 0,
          }}
        >
          {getTooltipContent()}
        </div>
      )}

      {/* Overlay modal detail wrapper */}
      <MatchDetailsModal
        isOpen={selectedMatch !== null}
        round={selectedMatch?.round || ""}
        idx={selectedMatch?.idx ?? 0}
        data={currentData}
        analysis={currentAnalysis}
        onClose={() => setSelectedMatch(null)}
      />

    </div>
  );
}
