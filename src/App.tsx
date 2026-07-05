//  ╔══════════════════════════════════════╗
//  ║  Inspired by Emilio Sansolini        ║
//  ╚══════════════════════════════════════╝
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { TournamentData, TournamentAnalysis } from "./types";
import { TOURNAMENTS, getTeamFlag, getTeamName } from "./data";
import { ROUND_NAME, TOURNAMENT_YEARS, resolveCompetitors, getMatchNotes } from "./constants";
import Timeline from "./components/Timeline";
import RadialBracket from "./components/RadialBracket";
import MatchDetailsModal from "./components/MatchDetailsModal";

// Reused sidebar divider style (avoids recreating a 5-line style object every render).
const SIDEBAR_DIVIDER_STYLE: Record<string, string> = {
  background:
    "linear-gradient(to bottom, transparent 0%, var(--gold) 2%, var(--gold) 10%, var(--line) 14%, var(--line) 42%, transparent 48%, transparent 50%, var(--gold) 52%, var(--gold) 60%, var(--line) 64%, var(--line) 92%, transparent 100%)",
  backgroundSize: "100% 200%",
};

const CHEVRON_PATH =
  "M8.48633 10.4004C8.73047 10.4004 8.97461 10.3027 9.14062 10.1172L16.6992 2.37305C16.8652 2.20703 16.9629 1.99219 16.9629 1.74805C16.9629 1.24023 16.582 0.849609 16.0742 0.849609C15.8301 0.849609 15.6055 0.947266 15.4395 1.10352L7.95898 8.75L9.00391 8.75L1.52344 1.10352C1.36719 0.947266 1.14258 0.849609 0.888672 0.849609C0.380859 0.849609 0 1.24023 0 1.74805C0 1.99219 0.0976562 2.20703 0.263672 2.38281L7.82227 10.1172C8.00781 10.3027 8.23242 10.4004 8.48633 10.4004Z";

// Wikipedia "Golden Boot" → page slug override (special characters / split names).
const WIKI_SLUG_OVERRIDE: Record<string, string> = {
  "Ronaldo": "Ronaldo_Nazário",
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

// Wikipedia slug for a golden-boot name (handles "A / B" ties and "(disamb)").
const gbSlug = (name: string) =>
  WIKI_SLUG_OVERRIDE[name] || name.split("/")[0].split(" (")[0].trim();

// Circular player avatar built into the golden-boot chip. Falls back to a gold
// ⚽ ring while the photo is loading or when Wikipedia has no thumbnail, so the
// slot is always filled — no blank flash, no floating pop-under.
function GbAvatar({
  photo,
  name,
  className = "",
}: {
  photo: string | null;
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`relative shrink-0 flex items-center justify-center rounded-full overflow-hidden border border-brand-gold/50 bg-brand-gold/10 shadow-[0_0_10px_rgba(246,196,83,0.25)] ${className}`}
    >
      {photo ? (
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover object-top animate-[fadeIn_0.4s_ease]"
        />
      ) : (
        <span className="text-[0.7em] leading-none select-none">⚽</span>
      )}
    </span>
  );
}

// Tournament analysis calculator
function analyze(d: TournamentData): TournamentAnalysis {
  if (!d.r16) {
    return { champ: null, adv: new Array(16).fill(0), w1: [], w2: [], w3: [] };
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

export default function App() {
  const [lightMode, setLightMode] = useState<boolean>(
    () => localStorage.getItem("wc-classic-mode") === "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", lightMode);
    localStorage.setItem("wc-classic-mode", lightMode ? "light" : "dark");
  }, [lightMode]);

  const [activeYear, setActiveYear] = useState<number>(2026);

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

  const [gbPhoto, setGbPhoto] = useState<string | null>(null);
  const gbCache = useRef<Record<string, string>>({});

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

  // Prefetch the golden-boot photo as soon as the year changes (not on hover):
  // check the in-memory + localStorage cache first, otherwise fetch once from
  // Wikipedia, preload the image, and persist it so it's instant next time.
  useEffect(() => {
    if (!gbName) {
      setGbPhoto(null);
      return;
    }
    const slug = gbSlug(gbName);
    const cached =
      gbCache.current[slug] ??
      (typeof localStorage !== "undefined" ? localStorage.getItem(`gb:${slug}`) : null);
    if (cached) {
      gbCache.current[slug] = cached;
      setGbPhoto(cached);
      return;
    }
    setGbPhoto(null);
    let cancelled = false;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const src: string | undefined = data?.thumbnail?.source;
        if (!src || cancelled) return;
        gbCache.current[slug] = src;
        try {
          localStorage.setItem(`gb:${slug}`, src);
        } catch {
          /* storage full / unavailable — in-memory cache still applies */
        }
        new Image().src = src; // warm the browser cache before render
        setGbPhoto(src);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [gbName]);

  // FIFA World Cup editions run every 4 years from 1930, skipping 1942/1946
  // (WWII). 1986 was the 13th edition, so this holds for every year on our
  // timeline (all >= 1986, stepping by 4).
  const editionsCount = Math.floor((activeYear - 1930) / 4) + 1 - (activeYear > 1938 ? 2 : 0);

  useEffect(() => {
    const champName = champCode ? getTeamName(champCode) : "TBD";
    document.title = `${activeYear} World Cup Bracket — ${champName} · The Road to Glory`;
  }, [activeYear, champCode]);

  return (
    <div className="relative z-[1] min-h-screen md:h-screen md:overflow-hidden text-brand-text flex flex-col">
      {/* Mobile notice — the radial bracket needs room to breathe */}
      <div className="flex-none md:hidden text-center text-[10px] tracking-wide text-brand-gold/80 bg-brand-gold/[0.06] border-b border-brand-gold/15 py-2 px-4">
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

            <div className="kicker inline-flex items-center gap-2.5 font-mono font-semibold tracking-[0.3em] uppercase text-[9.5px] text-brand-gold mb-3.5">
              FIFA World Cup Archive
            </div>
            <h1 className="relative m-0 font-unbounded font-bold text-2xl md:text-3xl lg:text-4xl leading-none tracking-tight">
              <span className="tt bg-clip-text text-transparent bg-gradient-to-b from-brand-gold-hi via-brand-gold to-brand-gold-deep filter drop-shadow-[0_6px_22px_rgba(246,196,83,0.2)]">
                The Road to Glory
              </span>
            </h1>
            <p className="sub text-brand-muted text-xs mt-3 leading-relaxed max-w-[224px] max-md:mx-auto">
              Every knockout bracket since 1934 — one radial map, from Round of 16 to final
            </p>
          </div>

          {/* Mobile summary — the desktop header chips are hidden on phones, so
              surface host / champion / golden boot here instead. */}
          <div className="md:hidden mb-1 grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center justify-start gap-1 rounded-xl border border-brand-line py-2.5 px-1.5">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-brand-muted font-semibold">Host</span>
              <span className="text-brand-text font-bold text-[11px] leading-tight">
                {currentData.hostFlag}
              </span>
              <span className="text-brand-muted text-[9px] leading-tight">{currentData.host}</span>
            </div>
            <div className="flex flex-col items-center justify-start gap-1 rounded-xl border border-brand-line bg-brand-gold/[0.05] py-2.5 px-1.5">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-brand-gold/70 font-semibold">Champion</span>
              <span className="text-brand-gold font-bold text-[11px] leading-tight">
                {champCode ? getTeamFlag(champCode) : "—"}
              </span>
              <span className="text-brand-gold/80 text-[9px] leading-tight">
                {champCode ? getTeamName(champCode) : "TBD"}
              </span>
            </div>
            <div className="flex flex-col items-center justify-start gap-1 rounded-xl border border-brand-line py-2.5 px-1.5">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-brand-muted font-semibold">Golden Boot</span>
              {gbName ? (
                <>
                  <GbAvatar photo={gbPhoto} name={gbName} className="w-8 h-8 text-xs my-0.5" />
                  <span className="text-brand-text font-bold text-[11px] leading-tight">{gbGoals} goals</span>
                  <span className="text-brand-muted text-[9px] leading-tight break-words">{gbName}</span>
                </>
              ) : (
                <span className="text-brand-muted text-[9px] leading-tight">TBD</span>
              )}
            </div>
          </div>

          <Timeline
            activeYear={activeYear}
            onSelectYear={handleSelectYear}
            analyses={analyses}
          />
        </aside>

        {/* Right Main Panel: Interactive Bracket */}
        <main className="main relative z-10 flex flex-col md:min-h-0 items-center max-md:justify-start md:justify-center pt-9 px-0 md:px-6 pb-28 md:pb-4 max-md:overflow-hidden">
          {/* Header Metadata */}
          <div className="flex-none w-full max-w-[1100px] mb-5 relative z-10 max-md:hidden md:animate-[riseIn_0.8s_cubic-bezier(0.2,0.7,0.2,1)_0.2s_both]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-1 py-1">
              {/* Edition + editorial quote */}
              <div className="text-center md:text-left min-w-0 max-md:hidden">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand-muted font-semibold mb-2">
                  FIFA World Cup · {activeYear}
                </div>
                <p className="font-serif italic text-lg md:text-xl leading-snug max-w-[480px] mx-auto md:mx-0 text-brand-text whitespace-nowrap">
                  {currentData.quote ?? "The story is still being written."}
                </p>
              </div>

              {/* Host / Champion / Golden Boot chips */}
              <div className="flex items-stretch justify-start md:justify-center gap-2 md:gap-3 flex-none mx-auto md:mx-0 overflow-x-auto md:overflow-visible max-md:hidden">
                <div className="flex flex-col items-center justify-center py-3 md:py-4 px-3 md:px-6 gap-2 rounded-xl border border-brand-line shrink-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold whitespace-nowrap">Host Nation</span>
                  <span className="text-brand-text font-bold text-sm uppercase tracking-wide leading-none whitespace-nowrap">
                    {currentData.hostFlag} {currentData.host}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center py-3 md:py-4 px-3 md:px-6 gap-2 rounded-xl border border-brand-line bg-brand-gold/[0.04] shrink-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-gold/60 font-semibold whitespace-nowrap">Champion</span>
                  <span className="text-brand-gold font-bold text-sm uppercase tracking-wide leading-none whitespace-nowrap">
                    {champCode ? `${getTeamFlag(champCode)} ${getTeamName(champCode)}` : "To be crowned"}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center py-3 md:py-4 px-3 md:px-6 gap-2 rounded-xl border border-brand-line bg-brand-gold/[0.02] shrink-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold whitespace-nowrap">Golden Boot</span>
                  {gbName ? (
                    <span className="flex items-center gap-2 leading-none">
                      <GbAvatar photo={gbPhoto} name={gbName} className="w-8 h-8 text-sm" />
                      <span className="text-brand-text font-bold text-sm uppercase tracking-wide whitespace-nowrap">
                        {gbName} · {gbGoals}
                      </span>
                    </span>
                  ) : (
                    <span className="text-brand-text font-bold text-sm uppercase tracking-wide leading-none">TBD</span>
                  )}
                </div>
              </div>
            </div>

            {/* Secondary stat strip */}
            <div className="flex items-center justify-between px-1 pt-3 mt-3 font-mono text-[10px] tracking-[0.25em] uppercase text-brand-muted"
              style={{
                backgroundImage: "linear-gradient(to right, transparent, var(--line) 20%, var(--line) 80%, transparent)",
                backgroundPosition: "0 0",
                backgroundSize: "100% 1px",
                backgroundRepeat: "no-repeat",
              }}
            >
              <span>Est. 1930</span>
              <span className="text-brand-gold/80 font-semibold">{editionsCount} Editions</span>
            </div>
          </div>

          {/* Svg Radial Stage */}
          <div className="stage-wrap flex-1 min-h-0 flex justify-center items-center p-1 w-full max-w-[680px] max-md:max-w-none mx-auto">
            <div className="stage relative h-full max-h-[680px] w-auto max-w-full aspect-square max-md:animate-none md:animate-[floatUp_1s_cubic-bezier(0.2,0.7,0.2,1)_0.3s_both] max-md:scale-[1.15] before:content-[''] before:absolute before:inset-0 before:z-0 before:pointer-events-none before:bg-[radial-gradient(circle_at_50%_50%,rgba(246,196,83,0.11),rgba(246,196,83,0.03)_24%,transparent_46%)]">
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
          <div className="legend flex-none max-md:hidden flex gap-6 justify-center flex-wrap items-center text-brand-muted font-mono text-[11px] tracking-wider uppercase mt-1 mb-4 relative z-10 max-md:animate-none md:animate-[riseIn_0.8s_ease_0.5s_both]">
            <div className="item flex items-center gap-2">
              <span className="sw rainbow w-5 h-0.5 rounded bg-gradient-to-r from-[#6cc2ef] via-[#ffd21e] to-[#e02531]" />
              Hover or tap flags to trace runs
            </div>
            <div className="item flex items-center gap-2">
              <span className="sw dotc w-2 h-2 rounded-full bg-brand-steel" />
              Winners advance to center
            </div>
            <div className="item text-brand-gold/75 font-medium">
              Click match for score
            </div>
          </div>
        </main>
      </div>

      {/* Mobile year picker — fixed to bottom on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-brand-bg via-brand-bg/95 to-transparent pt-6 px-4 z-50" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}>
        <div className="relative">
          <select
            value={activeYear}
            onChange={(e) => setActiveYear(Number(e.target.value))}
            aria-label="Select tournament year"
            className="w-full appearance-none rounded-xl border border-brand-gold/30 bg-brand-gold/[0.08] text-brand-gold-hi font-unbounded font-semibold text-base py-3 pl-4 pr-10 tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70"
          >
            {TOURNAMENT_YEARS.map((year) => {
              const d = TOURNAMENTS[year];
              const isFuture = d.seeded;
              return (
                <option key={year} value={year} className="bg-brand-bg text-brand-text">
                  {year} — {d.host}
                  {isFuture ? " (upcoming)" : ""}
                </option>
              );
            })}
          </select>
          <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-3" viewBox="0 0 17.3242 10.4004" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={CHEVRON_PATH} fill="currentColor" className="text-brand-gold/80" />
          </svg>
        </div>
      </div>

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
  );
}
