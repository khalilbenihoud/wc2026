//  ╔══════════════════════════════════════╗
//  ║  Inspired by Emilio Sansolini        ║
//  ╚══════════════════════════════════════╝
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { TournamentData, TournamentAnalysis } from "./types";
import { TOURNAMENTS, getTeamFlag, getTeamName } from "./data";
import { ROUND_NAME, resolveCompetitors, getMatchNotes } from "./constants";
import Timeline from "./components/Timeline";
import RadialBracket from "./components/RadialBracket";
import BracketList from "./components/BracketList";
import MatchDetailsModal from "./components/MatchDetailsModal";
import Splash from "./components/Splash";
import PlayerAvatar from "./components/PlayerAvatar";
import HeaderMeta from "./components/HeaderMeta";
import HeaderMetaMobile from "./components/HeaderMetaMobile";
import MobileTimeline from "./components/MobileTimeline";
import ChampionsWall, { ChampionsTrigger } from "./components/ChampionsWall";

// Light/dark toggle is currently hidden on all breakpoints — flip to true to
// bring the ☀️/🌙 button back (the theme logic underneath is left intact).
const SHOW_THEME_TOGGLE = false;

// Reused sidebar divider style (avoids recreating a 5-line style object every render).
const SIDEBAR_DIVIDER_STYLE: Record<string, string> = {
  background:
    "linear-gradient(to bottom, transparent 0%, var(--gold) 2%, var(--gold) 10%, var(--line) 14%, var(--line) 42%, transparent 48%, transparent 50%, var(--gold) 52%, var(--gold) 60%, var(--line) 64%, var(--line) 92%, transparent 100%)",
  backgroundSize: "100% 200%",
};

// Wikipedia award-winner → page slug override (special characters / split names).
const WIKI_SLUG_OVERRIDE: Record<string, string> = {
  "Ronaldo": "Ronaldo_Nazário",
  "Michel Preud'homme": "Michel_Preud'homme",
  "Emiliano Martínez": "Emiliano_Martínez",
  "Oldřich Nejedlý": "Oldřich_Nejedlý",
  "Leônidas": "Leônidas",
  "Salvatore Schillaci": "Salvatore_Schillaci",
  "Hristo Stoichkov / Oleg Salenko": "Hristo_Stoichkov",
  "Davor Šuker": "Davor_Šuker",
  "Miroslav Klose": "Miroslav_Klose",
  "Thomas Müller": "Thomas_Müller",
  "James Rodríguez": "James_Rodríguez",
  "Harry Kane": "Harry_Kane",
  "Kylian Mbappé": "Kylian_Mbappé",
};

// Wikipedia slug for an award-winner name (handles "A / B" ties and "(disamb)").
const gbSlug = (name: string) =>
  WIKI_SLUG_OVERRIDE[name] || name.split("/")[0].split(" (")[0].trim();


// Prefetch a winner's Wikipedia thumbnail as soon as the name changes (not on
// hover): check the in-memory + localStorage cache first, otherwise fetch once,
// preload the image, and persist it so it's instant next time. Returns the photo
// URL, or null while loading / when Wikipedia has no thumbnail.
function useWikiPhoto(name: string | null | undefined): string | null {
  const [photo, setPhoto] = useState<string | null>(null);
  const cache = useRef<Record<string, string>>({});
  useEffect(() => {
    if (!name) {
      setPhoto(null);
      return;
    }
    const slug = gbSlug(name);
    const cached =
      cache.current[slug] ??
      (typeof localStorage !== "undefined" ? localStorage.getItem(`gb:${slug}`) : null);
    if (cached) {
      cache.current[slug] = cached;
      setPhoto(cached);
      return;
    }
    setPhoto(null);
    let cancelled = false;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const src: string | undefined = data?.thumbnail?.source;
        if (!src || cancelled) return;
        cache.current[slug] = src;
        try {
          localStorage.setItem(`gb:${slug}`, src);
        } catch {
          /* storage full / unavailable — in-memory cache still applies */
        }
        new Image().src = src; // warm the browser cache before render
        setPhoto(src);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [name]);
  return photo;
}

// Tournament analysis calculator
function analyze(d: TournamentData): TournamentAnalysis {
  if (!d.r16) {
    return analyzeNoR16(d);
  }
  const w1: (number | null)[] = [];
  const w2: (number | null)[] = [];
  const w3: (number | null)[] = [];

  for (let i = 0; i < 8; i++) {
    const m = d.r16[i];
    w1[i] = m && m.w !== null ? 2 * i + m.w : null;
  }
  if (d.qf) {
    for (let i = 0; i < 4; i++) {
      const m = d.qf[i];
      const a = w1[2 * i];
      const b = w1[2 * i + 1];
      if (m && m.w !== null && a != null && b != null) {
        w2[i] = m.w === 0 ? a : b;
      } else {
        w2[i] = null;
      }
    }
  }
  if (d.sf) {
    for (let i = 0; i < 2; i++) {
      const m = d.sf[i];
      const a = w2[2 * i];
      const b = w2[2 * i + 1];
      if (m && m.w !== null && a != null && b != null) {
        w3[i] = m.w === 0 ? a : b;
      } else {
        w3[i] = null;
      }
    }
  }
  const f = d.final?.[0];
  const champ = (f && f.w !== null && w3[0] != null && w3[1] != null)
    ? (f.w === 0 ? w3[0] : w3[1]) : null;

  const adv = new Array(16).fill(0);
  for (let leaf = 0; leaf < 16; leaf++) {
    let a = 0;
    const r16w = w1[Math.floor(leaf / 2)];
    if (r16w != null && r16w === leaf) {
      a = 1;
      const qfw = w2[Math.floor(leaf / 4)];
      if (qfw != null && qfw === leaf) {
        a = 2;
        const sfw = w3[Math.floor(leaf / 8)];
        if (sfw != null && sfw === leaf) {
          a = 3;
          if (champ === leaf) a = 4;
        }
      }
    }
    adv[leaf] = a;
  }

  return { champ, adv, w1, w2, w3 };
}

function analyzeNoR16(d: TournamentData): TournamentAnalysis {
  const w1: (number | null)[] = [null, null, null, null, null, null, null, null];
  const w2: (number | null)[] = [null, null, null, null];
  const w3: (number | null)[] = [null, null];
  let champ: number | null = null;

  if (d.qf) {
    for (let i = 0; i < 4; i++) {
      const m = d.qf[i];
      // QF matches use teams at positions 2*i and 2*i+1
      w1[i] = m && m.w !== null ? (2 * i + m.w) : null;
    }
  }
  if (d.sf) {
    for (let i = 0; i < 2; i++) {
      const m = d.sf[i];
      const a = w1[2 * i];
      const b = w1[2 * i + 1];
      if (m && m.w !== null && a != null && b != null) {
        w2[i] = m.w === 0 ? a : b;
      }
    }
  }
  const f = d.final?.[0];
  if (f && f.w !== null && w2[0] != null && w2[1] != null) {
    champ = f.w === 0 ? w2[0] : w2[1];
    w3[0] = champ;
  }

  const adv = new Array(16).fill(0);
  for (let leaf = 0; leaf < 16; leaf++) {
    let a = 0;
    const qfSlot = Math.floor(leaf / 2);
    if (qfSlot < 4 && w1[qfSlot] === leaf) {
      a = 1;
      const sfSlot = Math.floor(leaf / 4);
      if (sfSlot < 2 && w2[sfSlot] === leaf) {
        a = 2;
        if (champ === leaf) a = 3;
      }
    }
    adv[leaf] = a;
  }

  return { champ, adv, w1, w2, w3 };
}

export default function App() {
  const [splashDone, setSplashDone] = useState(
    () => sessionStorage.getItem("wc-splash-done") === "1"
  );
  const [splashExiting, setSplashExiting] = useState(false);

  const handleSplashEnter = useCallback(() => {
    setSplashExiting(true);
    setTimeout(() => {
      setSplashDone(true);
      sessionStorage.setItem("wc-splash-done", "1");
    }, 800);
  }, []);

  const [lightMode, setLightMode] = useState<boolean>(
    () => localStorage.getItem("wc-classic-mode") === "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", lightMode);
    localStorage.setItem("wc-classic-mode", lightMode ? "light" : "dark");
  }, [lightMode]);

  const [activeYear, setActiveYear] = useState<number>(2026);
  const [viewMode, setViewMode] = useState<"radial" | "list">(
    () => typeof window !== "undefined" && window.innerWidth < 768 ? "list" : "radial"
  );

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

  const [championsOpen, setChampionsOpen] = useState(false);
  const openChampions = useCallback(() => setChampionsOpen(true), []);
  const closeChampions = useCallback(() => setChampionsOpen(false), []);

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

  const handleSelectYear = useCallback((year: number) => setActiveYear(year), []);
  const handleCloseModal = useCallback(() => setSelectedMatch(null), []);

  const getTooltipContent = useCallback(() => {
    if (!tooltip.visible || !tooltip.round) return null;
    const d = TOURNAMENTS[activeYear];
    const analysis = analyses[activeYear];
    const round = tooltip.round;
    const idx = tooltip.idx;

    if (round !== "r16" && !d[round as "qf" | "sf" | "final"]) return null;

    const [ta, tb] = resolveCompetitors(d, analysis, round, idx);
    const matches = d[round as "r16" | "qf" | "sf" | "final"];
    const m = matches ? (round === "final" ? matches[0] : matches[idx]) : null;
    const wA = m && m.w === 0;
    const wB = m && m.w === 1;
    const score = m ? `${m.s[0]}–${m.s[1]}` : "vs";
    const notes = getMatchNotes(m);

    return (
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
    );
  }, [tooltip, activeYear, analyses]);

  const tooltipContent = useMemo(
    () => (tooltip.visible && tooltip.round ? getTooltipContent() : null),
    [tooltip, activeYear, analyses, getTooltipContent]
  );

  const champCode =
    currentAnalysis.champ !== null
      ? currentData.teams[currentAnalysis.champ]
      : null;

  const gbName = currentData.goldenBoot?.name;
  const gbGoals = currentData.goldenBoot?.goals;
  const ggName = currentData.goldenGlove?.name;

  // Prefetch both award-winner photos as soon as the year changes (not on hover).
  const gbPhoto = useWikiPhoto(gbName);
  const ggPhoto = useWikiPhoto(ggName);

  // FIFA World Cup editions run every 4 years from 1930, skipping 1942/1946
  // (WWII). 1986 was the 13th edition, so this holds for every year on our
  // timeline (all >= 1986, stepping by 4).
  const editionsCount = Math.floor((activeYear - 1930) / 4) + 1 - (activeYear > 1938 ? 2 : 0);

  useEffect(() => {
    const champName = champCode ? getTeamName(champCode) : "TBD";
    document.title = `${activeYear} World Cup Bracket — ${champName} · The Road to Glory`;
  }, [activeYear, champCode]);

  return (
    <>
      {!splashDone && <Splash onEnter={handleSplashEnter} exiting={splashExiting} />}

      <div className="relative z-[1] min-h-screen md:h-screen md:overflow-hidden text-brand-text flex flex-col">
        {/* Mobile notice */}
      <div className="flex-none md:hidden text-center text-[11px] tracking-wide text-brand-gold/80 bg-brand-gold/[0.06] border-b border-brand-gold/15 py-2 px-4">
        Best viewed on desktop
      </div>
      {/* Dynamic Background Layout Frame */}
      <div className="app relative grid grid-cols-1 md:grid-cols-[300px_1fr] md:min-h-0 md:flex-1 items-stretch">
        {/* Sidebar divider — pinned to the full height of the app frame, gradient effect */}
        <div
          className="hidden md:block absolute top-0 bottom-0 left-[300px] w-px pointer-events-none opacity-30 animate-[shimmerDown_20s_linear_infinite]"
          style={SIDEBAR_DIVIDER_STYLE}
        />

        {/* Left Rail: Brand + Timeline */}
        <aside className="rail relative z-20 flex flex-col md:min-h-0 px-4 pt-4 pb-3 md:p-6 md:py-9 md:pr-6 md:pl-9 bg-gradient-to-b from-[rgba(var(--overlay-rgb),0.016)] to-transparent max-md:animate-none md:animate-[riseIn_0.8s_cubic-bezier(0.2,0.7,0.2,1)_both] max-md:border-b border-brand-line/40">
          <div className="brand relative mb-4 md:mb-6 max-md:text-center">
            {/* Light/dark toggle — hidden via SHOW_THEME_TOGGLE, code kept intact */}
            {SHOW_THEME_TOGGLE && (
              <button
                onClick={() => setLightMode((v) => !v)}
                aria-label="Toggle light/dark mode"
                className="absolute top-0 right-0 w-9 h-9 md:w-7 md:h-7 flex items-center justify-center rounded-full border border-brand-line bg-brand-panel/60 backdrop-blur-sm text-brand-muted hover:text-brand-text transition-colors cursor-pointer text-sm md:text-xs"
              >
                {lightMode ? "🌙" : "☀️"}
              </button>
            )}

            <div className="kicker inline-flex items-center gap-2.5 font-mono font-semibold tracking-[0.3em] uppercase text-[11px] text-brand-gold md:mb-3.5 max-md:mb-2">
              FIFA World Cup Archive
            </div>
            <h1 className="relative m-0 font-unbounded font-bold text-2xl md:text-3xl lg:text-4xl leading-none tracking-tight">
              <span className="tt bg-clip-text text-transparent bg-gradient-to-b from-brand-gold-hi via-brand-gold to-brand-gold-deep filter drop-shadow-[0_6px_22px_rgba(246,196,83,0.2)]">
                The Road to Glory
              </span>
            </h1>
            <p className="sub text-brand-muted text-sm mt-2 md:mt-3 leading-relaxed max-w-[280px] max-md:mx-auto">
              Every knockout bracket since 1930 one radial map, from Round of 16 to final
            </p>
          </div>

          {/* View toggle */}

          {/* Mobile summary — the desktop header is hidden on phones, so surface
              the same host / champion / awards here, in the chosen variant. */}
          <HeaderMetaMobile
            year={activeYear}
            host={currentData.host}
            hostFlag={currentData.hostFlag}
            quote={currentData.quote ?? null}
            champFlag={champCode ? getTeamFlag(champCode) : null}
            champName={champCode ? getTeamName(champCode) : null}
            gbName={gbName}
            gbGoals={gbGoals}
            gbPhoto={gbPhoto}
            ggName={ggName}
            ggPhoto={ggPhoto}
          />

          <div className="md:hidden flex justify-center mb-2">
            <ChampionsTrigger onClick={openChampions} />
          </div>

          <Timeline
            activeYear={activeYear}
            onSelectYear={handleSelectYear}
            analyses={analyses}
          />
        </aside>

        {/* Right Main Panel: Interactive Bracket */}
        <main className="main relative z-10 flex flex-col md:min-h-0 items-center max-md:justify-start md:justify-center md:pt-9 px-0 md:px-6 pb-28 md:pb-4">
          {/* Header Metadata */}
          <HeaderMeta
            year={activeYear}
            host={currentData.host}
            hostFlag={currentData.hostFlag}
            quote={currentData.quote ?? null}
            champFlag={champCode ? getTeamFlag(champCode) : null}
            champName={champCode ? getTeamName(champCode) : null}
            gbName={gbName}
            gbGoals={gbGoals}
            gbPhoto={gbPhoto}
            ggName={ggName}
            ggPhoto={ggPhoto}
            editionsCount={editionsCount}
          />

          {/* Bracket Stage */}
          {viewMode === "radial" ? (
            <div className="stage-wrap flex-1 min-h-0 flex justify-center items-center p-1 w-full max-w-[680px] max-md:max-w-none mx-auto max-md:overflow-hidden">
              <div className="stage relative h-full max-h-[680px] w-auto max-w-full aspect-square max-md:animate-none md:animate-[floatUp_1s_cubic-bezier(0.2,0.7,0.2,1)_0.3s_both] before:content-[''] before:absolute before:inset-0 before:z-0 before:pointer-events-none before:bg-[radial-gradient(circle_at_50%_50%,rgba(246,196,83,0.11),rgba(246,196,83,0.03)_24%,transparent_46%)]">
                <RadialBracket
                  data={currentData}
                  analysis={currentAnalysis}
                  onSelectMatch={handleSelectMatch}
                  hoveredLeaf={hoveredLeaf}
                  setHoveredLeaf={setHoveredLeaf}
                  onShowTooltip={handleShowTooltip}
                  variant="full"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 w-full min-h-0">
              <BracketList
                data={currentData}
                analysis={currentAnalysis}
                onSelectMatch={handleSelectMatch}
              />
            </div>
          )}

          {/* View toggle + legend */}
          <div className="flex-none w-full pt-3 pb-6">
            <div className="flex justify-center mb-1">
              <button
                onClick={() => setViewMode(viewMode === "radial" ? "list" : "radial")}
                className="text-[10px] font-mono tracking-wider uppercase text-brand-muted hover:text-brand-gold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {viewMode === "radial" ? "☰ List view" : "◉ Radial view"}
              </button>
            </div>
            <div className="flex gap-6 justify-center flex-wrap items-center text-brand-muted font-mono text-[11px] tracking-wider uppercase relative z-10">
              {viewMode === "radial" ? (
                <>
                  <div className="item flex items-center gap-2 max-md:hidden">
                    <span className="sw rainbow w-5 h-0.5 rounded bg-gradient-to-r from-[#6cc2ef] via-[#ffd21e] to-[#e02531]" />
                    Hover or tap flags to trace runs
                  </div>
                  <div className="item flex items-center gap-2 max-md:hidden">
                    <span className="sw dotc w-2 h-2 rounded-full bg-brand-steel" />
                    Winners advance to center
                  </div>
                </>
              ) : null}
              <ChampionsTrigger onClick={openChampions} />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile tournament picker — fixed to bottom on mobile */}
      <MobileTimeline
        activeYear={activeYear}
        onSelectYear={handleSelectYear}
        analyses={analyses}
      />

      {/* Floating Tooltip */}
      {tooltip.visible && tooltipContent && (
        <div
          className="tip fixed z-50 pointer-events-none select-none -translate-x-1/2 -translate-y-[118%] bg-gradient-to-b from-brand-panel to-brand-bg border border-brand-line rounded-xl py-2 px-3.5 min-w-[180px] shadow-[0_16px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(246,196,83,0.05)] after:content-[''] after:absolute after:left-1/2 after:-bottom-1.5 after:-translate-x-1/2 after:rotate-45 after:w-2.5 after:h-2.5 after:bg-brand-bg after:border-r after:border-b after:border-brand-line transition-all duration-100 ease-out"
          style={{
            left: `${Math.max(100, Math.min(tooltip.x, window.innerWidth - 100))}px`,
            top: `${Math.max(60, Math.min(tooltip.y, window.innerHeight - 60))}px`,
          }}
        >
          {tooltipContent}
        </div>
      )}

      {/* Overlay modal detail wrapper */}
      <MatchDetailsModal
        isOpen={selectedMatch !== null}
        round={selectedMatch?.round || ""}
        idx={selectedMatch?.idx ?? 0}
        data={currentData}
        analysis={currentAnalysis}
        onClose={handleCloseModal}
      />

      </div>

      <ChampionsWall isOpen={championsOpen} onClose={closeChampions} />
    </>
  );
}
