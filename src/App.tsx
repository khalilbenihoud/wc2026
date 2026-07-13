//  ╔══════════════════════════════════════╗
//  ║  Inspired by Emilio Sansolini        ║
//  ╚══════════════════════════════════════╝
import { useState, useMemo, useEffect, useCallback } from "react";
import { TournamentAnalysis } from "./types";
import { TOURNAMENTS, getTeamFlag, getTeamName } from "./data";
import { ROUND_NAME, resolveCompetitors, getMatchNotes } from "./constants";
import Timeline from "./components/Timeline";
import RadialBracket from "./components/RadialBracket";
import BracketList from "./components/BracketList";
import MatchDetailsModal from "./components/MatchDetailsModal";
import Splash from "./components/Splash";
import PlayerAvatar from "./components/PlayerAvatar";
import { useWikiPhoto } from "./wikiPhoto";
import HeaderMeta from "./components/HeaderMeta";
import HeaderMetaMobile from "./components/HeaderMetaMobile";
import MobileTimeline from "./components/MobileTimeline";
import ChampionsWall, { ChampionsTrigger } from "./components/ChampionsWall";
import CountryPage from "./components/CountryPage";
import TournamentPage from "./components/TournamentPage";
import { MOCK_COUNTRIES } from "./countries.mock";
import { generateCountryProfiles } from "./countries.generated";
import { useRouter, countryPath, tournamentPath, matchPath, COUNTRY_PAGE_ENABLED } from "./router";
import { useSeo } from "./seo";
import { useSeoTracking } from "./seoTracking";
import { analyze } from "./analysis";
import { findMatchBySlug } from "./matches";

// Light/dark toggle is currently hidden on all breakpoints — flip to true to
// bring the ☀️/🌙 button back (the theme logic underneath is left intact).
const SHOW_THEME_TOGGLE = false;

// Reused sidebar divider style (avoids recreating a 5-line style object every render).
const SIDEBAR_DIVIDER_STYLE: Record<string, string> = {
  background:
    "linear-gradient(to bottom, transparent 0%, var(--gold) 2%, var(--gold) 10%, var(--line) 14%, var(--line) 42%, transparent 48%, transparent 50%, var(--gold) 52%, var(--gold) 60%, var(--line) 64%, var(--line) 92%, transparent 100%)",
  backgroundSize: "100% 200%",
};

export default function App() {
  const { route, navigate } = useRouter();
  useSeoTracking();

  useEffect(() => {
    // Country page is disabled for now: send any country URL (legacy hash or
    // direct /countries/… link) back to the home bracket instead of a blank page.
    if (!COUNTRY_PAGE_ENABLED) {
      if (route.path === "country" || /^#\/country\//.test(window.location.hash)) {
        navigate("/");
      }
      return;
    }
    const m = window.location.hash.match(/^#\/country\/([A-Za-z]{3})$/);
    if (m) {
      window.history.replaceState(null, "", countryPath(m[1]));
      navigate(countryPath(m[1]));
    }
  }, []);

  const [splashDone, setSplashDone] = useState(
    () =>
      sessionStorage.getItem("wc-splash-done") === "1" ||
      route.path !== "home"
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
  const [viewMode, setViewMode] = useState<"radial" | "list">("radial");

  // The radial bracket is desktop-only; phones always get the list view. Track
  // the viewport reactively so resizing across the breakpoint stays correct.
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // On mobile we force the list view regardless of the stored preference.
  const effectiveViewMode = isMobile ? "list" : viewMode;

  const allCountries = useMemo(() => {
    const generated = generateCountryProfiles();
    return { ...generated, ...MOCK_COUNTRIES };
  }, []);

  const countryCode = route.path === "country" ? route.params.code : null;
  const countryProfile = countryCode ? allCountries[countryCode] : undefined;

  const tournamentYear = route.path === "tournament" ? Number(route.params.year) : null;

  // A match URL (/tournaments/<year>/matches/<slug>) shows the tournament page
  // with that match's details modal open. Both drive off the same year.
  const matchYear = route.path === "match" ? Number(route.params.year) : null;
  // The year whose TournamentPage sits behind everything, for either route.
  const pageYear = tournamentYear ?? matchYear;

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

  // Resolve a match URL to the tournament year + bracket slot, then open its
  // details modal over that tournament page. Unknown slug → tournament page.
  useEffect(() => {
    if (route.path !== "match") return;
    const year = Number(route.params.year);
    const data = TOURNAMENTS[year];
    const analysis = analyses[year];
    if (!data || !analysis) {
      navigate("/");
      return;
    }
    const found = findMatchBySlug(data, analysis, route.params.slug);
    if (!found) {
      navigate(`${tournamentPath(year)}/`);
      return;
    }
    setActiveYear(year);
    setSelectedMatch({ round: found.round, idx: found.idx });
  }, [route, analyses, navigate]);

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

  const handleNavigateCountry = useCallback((code: string) => {
    if (!COUNTRY_PAGE_ENABLED) return; // country page disabled for now
    navigate(countryPath(code));
  }, [navigate]);

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
  const handleCloseModal = useCallback(() => {
    setSelectedMatch(null);
    // Closing a match-URL modal should drop the /matches/<slug> segment so the
    // URL reflects what's now on screen (the tournament page).
    if (route.path === "match") navigate(`${tournamentPath(Number(route.params.year))}/`);
  }, [route, navigate]);

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

  function getChampionForYear(year: number): string | null {
    const a = analyses[year];
    const d = TOURNAMENTS[year];
    if (!a || !d || a.champ === null) return null;
    return d.teams[a.champ] ?? null;
  }

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

  const seoMeta = useMemo(() => {
    if (route.path === "country" && countryProfile) {
      const p = countryProfile;
      const desc = p.titles.length > 0
        ? `${p.name} — ${p.titles.length}× World Cup champion${p.titles.length > 1 ? "s" : ""}. ${p.appearances} tournament appearances since ${p.firstAppearance}. ${p.epithet}`
        : `${p.name} — ${p.bestResult}. ${p.appearances} World Cup appearance${p.appearances > 1 ? "s" : ""} since ${p.firstAppearance}. ${p.epithet}`;
      return {
        title: `${p.name} World Cup History — The Road to Glory`,
        description: desc,
        canonical: countryPath(p.code),
        jsonLd: {
          "@type": "SportsTeam",
          name: p.name,
          description: p.epithet,
          url: `https://worldcuparchive.net${countryPath(p.code)}`,
        },
      };
    }
    if (route.path === "match" && matchYear && TOURNAMENTS[matchYear]) {
      const t = TOURNAMENTS[matchYear];
      const analysis = analyses[matchYear];
      const found = analysis ? findMatchBySlug(t, analysis, route.params.slug) : null;
      if (found) {
        const taName = getTeamName(found.ta);
        const tbName = getTeamName(found.tb);
        const roundName = ROUND_NAME[found.round];
        const scoreStr = found.score ? `${found.score[0]}–${found.score[1]}` : null;
        const resultTitle = scoreStr ? `${taName} ${scoreStr} ${tbName}` : `${taName} vs ${tbName}`;
        const winnerName = found.winner ? getTeamName(found.winner) : null;
        return {
          title: `${resultTitle} — ${matchYear} FIFA World Cup ${roundName} · The Road to Glory`,
          description:
            `${taName} vs ${tbName}, ${matchYear} FIFA World Cup ${roundName} in ${t.host}. ` +
            (scoreStr
              ? `Final score ${scoreStr}${found.pens ? ` (${found.pens} pens)` : found.extra ? ` ${found.extra}` : ""}.${winnerName ? ` ${winnerName} advanced.` : ""} `
              : "") +
            `Goalscorers, result, and match details.`,
          canonical: `${matchPath(matchYear, found.slug)}/`,
          jsonLd: {
            "@type": "SportsEvent",
            name: `${taName} vs ${tbName} — ${matchYear} FIFA World Cup ${roundName}`,
            sport: "Association football",
            location: { "@type": "Place", name: t.host },
            competitor: [
              { "@type": "SportsTeam", name: taName },
              { "@type": "SportsTeam", name: tbName },
            ],
            url: `https://worldcuparchive.net${matchPath(matchYear, found.slug)}/`,
          },
        };
      }
    }
    if (route.path === "tournament" && tournamentYear && TOURNAMENTS[tournamentYear]) {
      const t = TOURNAMENTS[tournamentYear];
      const champ = tournamentYear ? getChampionForYear(tournamentYear) : null;
      const champName = champ ? getTeamName(champ) : "TBD";
      return {
        title: `${tournamentYear} FIFA World Cup Results — ${champName} Champion · The Road to Glory`,
        description: `${tournamentYear} FIFA World Cup in ${t.host}. ${t.quote || ""} Full knockout results, golden boot, and all participating nations.`,
        canonical: `${tournamentPath(tournamentYear)}/`, // trailing slash = Netlify's 200 URL
        jsonLd: {
          "@type": "SportsEvent",
          name: `${tournamentYear} FIFA World Cup`,
          startDate: `${tournamentYear}-06-01`,
          endDate: `${tournamentYear}-07-31`,
          location: { "@type": "Place", name: t.host },
          description: t.quote || `${tournamentYear} FIFA World Cup`,
        },
      };
    }
    return {
      title: `${activeYear} World Cup Bracket — ${champCode ? getTeamName(champCode) : "TBD"} · The Road to Glory`,
      description: "Every FIFA World Cup knockout stage since 1930, drawn as one interactive radial bracket.",
      canonical: "/",
    };
  }, [route, countryProfile, tournamentYear, matchYear, analyses, activeYear, champCode]);

  useSeo(seoMeta);

  return (
    <>
      {!splashDone && <Splash onEnter={handleSplashEnter} exiting={splashExiting} />}

      {/* Background is inert while the match modal (portaled to <body>) is open,
          so assistive tech and pointer focus stay within the dialog. */}
      <div
        inert={selectedMatch !== null}
        className="relative z-[1] min-h-screen md:h-screen md:overflow-hidden text-brand-text flex flex-col"
      >
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
            resultsHref={`${tournamentPath(activeYear)}/`}
            onNavigate={navigate}
          />

          {/* Bracket Stage */}
          {effectiveViewMode === "radial" ? (
            <div className="stage-wrap flex-1 min-h-0 flex justify-center items-center p-1 w-full max-w-[680px] max-md:max-w-none mx-auto max-md:overflow-hidden">
              <div className="stage relative h-full max-h-[680px] w-auto max-w-full aspect-square max-md:animate-none md:animate-[floatUp_1s_cubic-bezier(0.2,0.7,0.2,1)_0.3s_both] before:content-[''] before:absolute before:inset-0 before:z-0 before:pointer-events-none before:bg-[radial-gradient(circle_at_50%_50%,rgba(246,196,83,0.11),rgba(246,196,83,0.03)_24%,transparent_46%)]">
                <RadialBracket
                  data={currentData}
                  analysis={currentAnalysis}
                  onSelectMatch={handleSelectMatch}
                  onNavigateCountry={handleNavigateCountry}
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
                onNavigateCountry={handleNavigateCountry}
              />
            </div>
          )}

          {/* View toggle + legend — desktop only; phones are locked to list view */}
          <div className="flex-none w-full pt-3 pb-6 max-md:hidden">
            <div className="flex justify-center mb-1 max-md:hidden">
              <button
                onClick={() => setViewMode(viewMode === "radial" ? "list" : "radial")}
                className="text-[10px] font-mono tracking-wider uppercase text-brand-muted hover:text-brand-gold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {viewMode === "radial" ? "☰ List view" : "◉ Radial view"}
              </button>
            </div>
            <div className="flex gap-6 justify-center flex-wrap items-center text-brand-muted font-mono text-[11px] tracking-wider uppercase relative z-10">
              {effectiveViewMode === "radial" ? (
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
              <ChampionsTrigger onClick={openChampions} className="max-md:hidden" />
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
        onNavigateCountry={handleNavigateCountry}
      />

      </div>

      <ChampionsWall isOpen={championsOpen} onClose={closeChampions} onNavigateCountry={handleNavigateCountry} />

      {COUNTRY_PAGE_ENABLED && countryProfile && (
        <CountryPage
          profile={countryProfile}
          allCountries={allCountries}
          onBack={() => navigate("/")}
          onNavigate={navigate}
          onSelectCountry={(code) => navigate(countryPath(code))}
        />
      )}

      {pageYear !== null && TOURNAMENTS[pageYear] && (
        <TournamentPage
          year={pageYear}
          onBack={() => navigate("/")}
          onNavigate={navigate}
        />
      )}
    </>
  );
}
