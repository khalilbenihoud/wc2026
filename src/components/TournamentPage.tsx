import { useEffect, useMemo, useRef, useState } from "react";
import { TOURNAMENTS, getTeamName, getTeamFlag } from "../data";
import { getMatchNotes, TOURNAMENT_YEARS } from "../constants";
import { countryPath, tournamentPath, matchPath, comparePath, COUNTRY_PAGE_ENABLED } from "../router";
import { matchSlug } from "../matches";
import { CHAMPION_IMAGES } from "../championImages.generated";
import { useWikiPhoto } from "../wikiPhoto";
import { fireConfetti } from "../confetti";
import PlayerAvatar from "./PlayerAvatar";
import AppLink from "./AppLink";
import CountryMap from "./CountryMap";
import Breadcrumb from "./Breadcrumb";
import Podium from "./Podium";
import ShareButton from "./ShareButton";
import { SITE_NAME } from "../schema";

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18.4961 14.8145" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7.42188 14.8047C7.90039 14.8047 8.28125 14.4531 8.28125 13.9648C8.28125 13.7305 8.19336 13.4961 8.03711 13.3496L5.84961 11.123L1.77734 7.40234L5.84961 3.68164L8.03711 1.45508C8.19336 1.29883 8.28125 1.07422 8.28125 0.839844C8.28125 0.351562 7.90039 0 7.42188 0C7.1875 0 6.98242 0.078125 6.76758 0.292969L0.302734 6.74805C0.107422 6.93359 0 7.1582 0 7.40234C0 7.64648 0.107422 7.87109 0.302734 8.05664L6.78711 14.5312C6.98242 14.7168 7.1875 14.8047 7.42188 14.8047ZM4.92188 8.27148L17.2754 8.27148C17.7832 8.27148 18.1348 7.91016 18.1348 7.40234C18.1348 6.89453 17.7832 6.5332 17.2754 6.5332L4.92188 6.5332L1.77734 6.72852C1.37695 6.72852 1.10352 7.00195 1.10352 7.40234C1.10352 7.80273 1.37695 8.07617 1.77734 8.07617Z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18.4961 14.8145" className={className} fill="currentColor" aria-hidden="true">
      <path d="M10.7129 14.8047C10.9473 14.8047 11.1523 14.7168 11.3477 14.5312L17.8418 8.05664C18.0371 7.87109 18.1348 7.64648 18.1348 7.40234C18.1348 7.1582 18.0371 6.93359 17.8418 6.74805L11.3672 0.292969C11.1523 0.078125 10.9473 0 10.7129 0C10.2344 0 9.86328 0.351562 9.86328 0.839844C9.86328 1.07422 9.94141 1.29883 10.0977 1.45508L12.2852 3.68164L16.3574 7.40234L12.2852 11.123L10.0977 13.3496C9.94141 13.4961 9.86328 13.7305 9.86328 13.9648C9.86328 14.4531 10.2344 14.8047 10.7129 14.8047ZM0.859375 8.27148L13.2129 8.27148L16.3574 8.07617C16.7578 8.04688 17.0312 7.80273 17.0312 7.40234C17.0312 7.00195 16.7578 6.75781 16.3574 6.72852L13.2129 6.5332L0.859375 6.5332C0.351562 6.5332 0 6.89453 0 7.40234C0 7.91016 0.351562 8.27148 0.859375 8.27148Z" />
    </svg>
  );
}

interface TournamentPageProps {
  year: number;
  onBack: () => void;
  onNavigate: (path: string) => void;
  // Opened directly from another full-screen overlay: skip the fade-in so the
  // home bracket never flashes between the two. Frozen at mount (below).
  instant?: boolean;
}

export default function TournamentPage({ year, onBack, onNavigate, instant }: TournamentPageProps) {
  const t = TOURNAMENTS[year];
  const [skipIntro] = useState(!!instant);

  const champion = useMemo(() => {
    if (!t?.final?.[0] || t.final[0].w === null) return null;
    return getChampionCode(t, year);
  }, [t, year]);

  const runnerUp = useMemo(() => {
    if (!t?.final?.[0] || t.final[0].w === null) return null;
    return getRunnerUpCode(t, year);
  }, [t, year]);

  // Bronze/fourth come from the third-place play-off (known even before the
  // final is decided). Null when the tournament has no play-off result yet.
  const [third, fourth] = useMemo(() => (t ? getThirdFourthCodes(t, year) : [null, null]), [t, year]);

  // Champion hero photo, picked at random from the committed Unsplash pool
  // (scripts/generate-champion-images.ts) — no API call at runtime, so it works
  // in production without a key. Re-picks when the tournament changes.
  const heroImage = useMemo(() => {
    const pool = champion ? CHAMPION_IMAGES[champion] : null;
    if (!pool?.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [champion, year]);

  // The page is its own scroll container (fixed inset-0), so switching year keeps
  // this component mounted and the router's window.scrollTo can't reach it —
  // reset to the top ourselves whenever the tournament changes.
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [year]);

  useEffect(() => {
    if (year === 2026) {
      fireConfetti();
    }
  }, [year]);

  // Fade out on close: stay mounted for one animation cycle, then navigate away
  // (the page unmounts on route change, so we defer that until the fade finishes).
  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onBack, 200);
  };

  // Wikipedia photos for the award winners — same source as the main header.
  const gbPhoto = useWikiPhoto(t?.goldenBoot?.name);
  const ggPhoto = useWikiPhoto(t?.goldenGlove?.name);

  // Fade the photo in once decoded, and reserve its space up front so the card
  // doesn't jump when the CDN image finishes loading.
  const heroExpected = !!heroImage;
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => {
    setHeroLoaded(false);
  }, [heroImage?.url]);

  if (!t) {
    return (
      <div className="fixed inset-0 z-40 bg-brand-bg text-brand-text overflow-y-auto">
        <div className="max-w-[880px] mx-auto px-5 md:px-8 pt-6 pb-20">
          <button onClick={onBack} className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted hover:text-brand-gold transition-colors cursor-pointer mb-8">
            ← The Road to Glory
          </button>
          <h1 className="font-unbounded text-2xl text-brand-gold">Tournament not found</h1>
        </div>
    </div>
  );
}

function TournamentRelated({ champion, runnerUp, onNavigate }: {
  champion: string | null;
  runnerUp: string | null;
  onNavigate: (path: string) => void;
}) {
  if (!champion && !runnerUp) return null;

  return (
    <div className="mb-10">
      <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
        Related
      </div>
      <div className="flex flex-wrap gap-2">
        {champion && COUNTRY_PAGE_ENABLED && (
          <button
            onClick={() => onNavigate(`${countryPath(champion)}/`)}
            className="px-3 py-1 rounded-full border text-sm font-mono transition-colors cursor-pointer border-brand-gold/40 text-brand-gold hover:bg-brand-gold/[0.08]"
          >
            {getTeamFlag(champion)} {getTeamName(champion)} profile
          </button>
        )}
        {runnerUp && COUNTRY_PAGE_ENABLED && (
          <button
            onClick={() => onNavigate(`${countryPath(runnerUp)}/`)}
            className="px-3 py-1 rounded-full border text-sm font-mono transition-colors cursor-pointer border-brand-line text-brand-muted hover:text-brand-gold hover:border-brand-gold/40"
          >
            {getTeamFlag(runnerUp)} {getTeamName(runnerUp)} profile
          </button>
        )}
        {champion && runnerUp && COUNTRY_PAGE_ENABLED && (
          <button
            onClick={() => onNavigate(`${comparePath(champion, runnerUp)}/`)}
            className="px-3 py-1 rounded-full border text-sm font-mono transition-colors cursor-pointer border-brand-line text-brand-muted hover:text-brand-gold hover:border-brand-gold/40"
          >
            {getTeamName(champion)} vs {getTeamName(runnerUp)} history
          </button>
        )}
      </div>
    </div>
  );
}

  const finalMatch = t.final?.[0];
  const score = finalMatch ? `${finalMatch.s[0]}–${finalMatch.s[1]}` : "TBD";

  const allTeams = [...t.teams];
  if (t.r32) {
    for (const m of t.r32) {
      if (!allTeams.includes(m.ta)) allTeams.push(m.ta);
      if (!allTeams.includes(m.tb)) allTeams.push(m.tb);
    }
  }

  // Final standings sit above Awards once the tournament is decided; while it's
  // still being played (no champion yet) the standings aren't final, so they go
  // below Awards instead.
  const finalStandings = (champion || third || fourth) && (
    <div className="mb-10">
      <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
        Final Standings
      </div>
      <Podium
        champion={champion}
        runnerUp={runnerUp}
        third={third}
        fourth={fourth}
        onNavigate={onNavigate}
      />
    </div>
  );

  // Adjacent tournaments for sequential prev/next navigation.
  const navYears = [...TOURNAMENT_YEARS].sort((a, b) => a - b); // 1930…2026
  const navIdx = navYears.indexOf(year);
  const prevYear = navIdx > 0 ? navYears[navIdx - 1] : null;
  const nextYear = navIdx < navYears.length - 1 ? navYears[navIdx + 1] : null;

  return (
    <div
      ref={scrollRef}
      className={`fixed inset-0 z-40 bg-brand-bg text-brand-text overflow-y-auto custom-scrollbar ${
        isClosing ? "animate-[fadeOut_0.2s_ease_forwards]" : skipIntro ? "" : "animate-[fadeIn_0.2s_ease]"
      }`}
    >
      <div className={skipIntro ? "animate-[fadeIn_0.15s_ease]" : ""}>
        {/* Desktop: floating edge arrows that reveal the year on hover. */}
        {prevYear && (
          <button
            onClick={() => onNavigate(`${tournamentPath(prevYear)}/`)}
            aria-label={`Previous tournament: ${prevYear} ${TOURNAMENTS[prevYear]?.host}`}
            className="nav-arrow-btn nav-arrow-btn--prev max-md:hidden flex items-center rounded-full bg-brand-panel/80 backdrop-blur text-brand-muted hover:text-brand-gold transition-colors cursor-pointer overflow-hidden"
          >
            <span className="flex items-center justify-center h-11 w-11 shrink-0">
              <ArrowLeftIcon className="h-3.5 w-auto" />
            </span>
            <span className="nav-arrow-label font-mono text-sm text-brand-gold">{prevYear}</span>
          </button>
        )}
        {nextYear && (
          <button
            onClick={() => onNavigate(`${tournamentPath(nextYear)}/`)}
            aria-label={`Next tournament: ${nextYear} ${TOURNAMENTS[nextYear]?.host}`}
            className="nav-arrow-btn nav-arrow-btn--next max-md:hidden flex items-center rounded-full bg-brand-panel/80 backdrop-blur text-brand-muted hover:text-brand-gold transition-colors cursor-pointer overflow-hidden"
          >
            <span className="nav-arrow-label font-mono text-sm text-brand-gold">{nextYear}</span>
            <span className="flex items-center justify-center h-11 w-11 shrink-0">
              <ArrowRightIcon className="h-3.5 w-auto" />
            </span>
          </button>
        )}

        {/* Mobile: connected bottom pagination bar. Grid (not flex) so the two
            halves stay a strict 50/50 and each can shrink + truncate a long host. */}
        {(prevYear || nextYear) && (
          <div
            className="md:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-2 border-t border-brand-line bg-brand-panel/85 backdrop-blur-xl"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            {prevYear ? (
              <button
                onClick={() => onNavigate(`${tournamentPath(prevYear)}/`)}
                className="min-w-0 flex items-center gap-2.5 px-4 py-3 border-r border-brand-line text-brand-muted active:bg-brand-gold/[0.06] transition-colors cursor-pointer text-left"
              >
                <ArrowLeftIcon className="h-3 w-auto shrink-0 text-brand-gold" />
                <span className="flex flex-col leading-tight min-w-0">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-brand-muted/70">Previous</span>
                  <span className="font-mono text-sm text-brand-text truncate">{prevYear} · {TOURNAMENTS[prevYear]?.host}</span>
                </span>
              </button>
            ) : <span className="border-r border-brand-line" />}
            {nextYear ? (
              <button
                onClick={() => onNavigate(`${tournamentPath(nextYear)}/`)}
                className="min-w-0 flex items-center justify-end gap-2.5 px-4 py-3 text-brand-muted active:bg-brand-gold/[0.06] transition-colors cursor-pointer text-right"
              >
                <span className="flex flex-col leading-tight min-w-0 text-right">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-brand-muted/70">Next</span>
                  <span className="font-mono text-sm text-brand-text truncate">{nextYear} · {TOURNAMENTS[nextYear]?.host}</span>
                </span>
                <ArrowRightIcon className="h-3 w-auto shrink-0 text-brand-gold" />
              </button>
            ) : <span />}
          </div>
        )}

        <div className="sticky top-0 z-20 w-full py-5 mb-8 bg-gradient-to-b from-brand-bg to-transparent">
        <div className="max-w-[880px] mx-auto px-5 md:px-8 flex items-center justify-between gap-4">
          <Breadcrumb
            items={[{ label: SITE_NAME, href: "/" }, { label: `${year} FIFA World Cup` }]}
            onNavigate={(href) => (href === "/" ? handleClose() : onNavigate(href))}
          />
          <div className="flex items-center gap-3 shrink-0">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted select-none max-md:hidden">
              Archive · Tournament
            </div>
            <ShareButton path={tournamentPath(year)} />
          </div>
        </div>
      </div>
      <div className="max-w-[880px] mx-auto px-5 md:px-8 pb-20 max-md:pb-28">

        <div className="mb-10">
          <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-3">
            {t.host} · {year}
          </div>
          <h1 className="font-unbounded font-bold text-3xl md:text-4xl leading-tight tracking-tight mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-brand-gold-hi via-brand-gold to-brand-gold-deep">
              {year} FIFA World Cup
            </span>
          </h1>
          {t.quote && (
            <p className="font-serif text-brand-muted text-lg italic mt-2">{t.quote}</p>
          )}
        </div>

        {champion && (
          <div className="mb-10 rounded-xl border border-brand-gold/20 bg-brand-gold/[0.03] overflow-hidden relative">
            {heroExpected && (
              <>
                {/* Photo covers the whole card; text sits over it. Fades in on load. */}
                {heroImage && (
                  <img
                    src={heroImage.url}
                    alt={heroImage.alt}
                    width={1080}
                    height={720}
                    fetchPriority="high"
                    onLoad={() => setHeroLoaded(true)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                      heroLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
                {/* Bottom-up scrim so the champion text stays legible. */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/85 to-brand-bg/25" />
                {heroImage && (
                  <a
                    href={heroImage.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`absolute top-2 right-3 z-10 font-mono text-[9px] tracking-wider text-brand-text/50 hover:text-brand-text/80 transition-opacity duration-700 ${
                      heroLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    Photo · {heroImage.authorName} / Unsplash
                  </a>
                )}
              </>
            )}
            {/* Glowing champion-country map, drawn in when the page opens. */}
            <CountryMap
              key={champion}
              code={champion}
              className="pointer-events-none absolute right-4 md:right-6 top-1/2 -translate-y-1/2 h-45 w-auto opacity-70"
            />
            <div className={`relative p-6 ${heroExpected ? "pt-40 md:pt-52" : ""}`}>
              <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
                Champion
              </div>
              <div className="flex items-center gap-4">
                <span className="text-4xl">{getTeamFlag(champion)}</span>
                <div>
                  {COUNTRY_PAGE_ENABLED ? (
                    <button
                      onClick={() => onNavigate(countryPath(champion))}
                      className="font-unbounded font-bold text-xl text-brand-text hover:text-brand-gold transition-colors cursor-pointer truncate"
                    >
                      {getTeamName(champion)}
                    </button>
                  ) : (
                    <div className="font-unbounded font-bold text-xl text-brand-text truncate">
                      {getTeamName(champion)}
                    </div>
                  )}
                  {finalMatch && (
                    <p className="text-brand-muted text-sm mt-1">
                      {score} {finalMatch.p ? `(pens ${finalMatch.p})` : ""}
                      {finalMatch.x ? ` ${finalMatch.x}` : ""}
                      {runnerUp && ` vs ${getTeamName(runnerUp)}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {champion && finalStandings}

        <div className="mb-10">
          <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
            Awards
          </div>
          {t.goldenBoot || t.goldenGlove ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.goldenBoot && (
              <div className="p-4 rounded-lg border border-brand-line bg-brand-panel/30 flex items-center gap-4">
                <PlayerAvatar photo={gbPhoto} name={t.goldenBoot.name} className="w-12 h-12 text-xl" />
                <div className="min-w-0">
                  <div className="text-brand-muted text-[10px] font-mono tracking-wider uppercase mb-1">Golden Boot</div>
                  <div className="text-sm text-brand-text font-semibold truncate">
                    {t.goldenBoot.name}
                    <span className="text-brand-gold font-normal"> · {t.goldenBoot.goals} goals</span>
                  </div>
                </div>
              </div>
            )}
            {t.goldenGlove && (
              <div className="p-4 rounded-lg border border-brand-line bg-brand-panel/30 flex items-center gap-4">
                <PlayerAvatar photo={ggPhoto} name={t.goldenGlove.name} className="w-12 h-12 text-xl" />
                <div className="min-w-0">
                  <div className="text-brand-muted text-[10px] font-mono tracking-wider uppercase mb-1">Golden Glove</div>
                  <div className="text-sm text-brand-text font-semibold truncate">{t.goldenGlove.name}</div>
                </div>
              </div>
            )}
          </div>
          ) : (
            <div className="rounded-lg border border-dashed border-brand-line bg-brand-panel/20 px-5 py-9 text-center">
              <div className="flex justify-center gap-2.5 text-3xl mb-3 select-none">
                {["👟", "🏆", "🧤"].map((e, i) => (
                  <span
                    key={i}
                    className="inline-block animate-bounce"
                    style={{ animationDelay: `${i * 160}ms` }}
                  >
                    {e}
                  </span>
                ))}
              </div>
              <div className="text-sm text-brand-text font-semibold">Still up for grabs</div>
              <p className="text-brand-muted text-sm mt-1.5 leading-relaxed">
                No Golden Boot or Glove handed out yet.
                <br />
                Someone out there is having the tournament of their life. ✨
              </p>
            </div>
          )}
        </div>

        {!champion && finalStandings}

        <div className="mb-10">
          <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
            Knockout Results
          </div>
          {/* Latest rounds first: Final at the top, down to the earliest round. */}
          <div className="space-y-6">
            {t.final && (
              <KnockoutRound
                label="Final"
                year={year}
                matches={getRoundMatches(t, year, "final")}
                onNavigate={onNavigate}
              />
            )}
            {t.tp && (
              <KnockoutRound
                label="Third-place play-off"
                year={year}
                matches={getRoundMatches(t, year, "tp")}
                onNavigate={onNavigate}
              />
            )}
            {t.sf && (
              <KnockoutRound
                label="Semi-finals"
                year={year}
                matches={getRoundMatches(t, year, "sf")}
                onNavigate={onNavigate}
              />
            )}
            {t.qf && (
              <KnockoutRound
                label="Quarter-finals"
                year={year}
                matches={getRoundMatches(t, year, "qf")}
                onNavigate={onNavigate}
              />
            )}
            {t.r16 && (
              <KnockoutRound
                label="Round of 16"
                year={year}
                matches={t.r16.map((m, i) => {
                  if (!m) return null;
                  const ta = t.teams[2 * i];
                  const tb = t.teams[2 * i + 1];
                  return {
                    teamA: ta,
                    teamB: tb,
                    scoreA: m.s[0],
                    scoreB: m.s[1],
                    winner: m.w,
                    pens: m.p ?? null,
                    extra: m.x ?? null,
                  };
                }).filter(Boolean) as KnockoutMatch[]}
                onNavigate={onNavigate}
              />
            )}
            {t.r32 && t.r32.length > 0 && (
              <KnockoutRound
                label="Round of 32"
                year={year}
                matches={t.r32.map((m) => ({
                  teamA: m.ta,
                  teamB: m.tb,
                  scoreA: m.s?.[0] ?? null,
                  scoreB: m.s?.[1] ?? null,
                  winner: m.w,
                  pens: m.p ?? null,
                  extra: m.x ?? null,
                }))}
                onNavigate={onNavigate}
              />
            )}
          </div>
        </div>

        <div className="mb-10">
          <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
            Participating Nations ({allTeams.length})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {allTeams
              .filter((c) => c !== "TBD")
              .sort((a, b) => getTeamName(a).localeCompare(getTeamName(b)))
              .map((code) => {
                const inner = (
                  <>
                    <span className="text-sm">{getTeamFlag(code)}</span>
                    <span className="text-sm font-semibold text-brand-text truncate">{getTeamName(code)}</span>
                  </>
                );
                const base = "flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-line text-left";
                return COUNTRY_PAGE_ENABLED ? (
                  <button
                    key={code}
                    onClick={() => onNavigate(countryPath(code))}
                    className={`${base} hover:border-brand-gold/40 hover:bg-brand-gold/[0.04] transition-colors cursor-pointer`}
                  >
                    {inner}
                  </button>
                ) : (
                  <div key={code} className={base}>{inner}</div>
                );
              })}
          </div>
        </div>

        <TournamentRelated
          champion={champion}
          runnerUp={runnerUp}
          onNavigate={onNavigate}
        />

        <div className="mb-10">
          <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
            Other Tournaments
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(TOURNAMENTS)
              .map(Number)
              .sort((a, b) => b - a)
              .filter((y) => y !== year)
              .map((y) => {
                const adjacent = y === prevYear || y === nextYear;
                return (
                  <AppLink
                    key={y}
                    href={`${tournamentPath(y)}/`}
                    onNavigate={onNavigate}
                    className={`px-3 py-1 rounded-full border text-sm font-mono transition-colors cursor-pointer hover:text-brand-gold hover:border-brand-gold/40 ${
                      adjacent
                        ? "border-brand-gold/30 text-brand-text"
                        : "border-brand-line text-brand-muted"
                    }`}
                  >
                    {y}
                  </AppLink>
                );
              })}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

interface KnockoutMatch {
  teamA: string;
  teamB: string;
  scoreA: number | null;
  scoreB: number | null;
  winner: number | null;
  pens: string | null;
  extra: string | null;
}

function KnockoutRound({
  label,
  matches,
  year,
  onNavigate,
}: {
  label: string;
  matches: KnockoutMatch[];
  year: number;
  onNavigate: (path: string) => void;
}) {
  return (
    <div>
      <h3 className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted mb-2">{label}</h3>
      <div className="space-y-2">
        {matches.map((m, i) => {
          const wA = m.winner === 0;
          const wB = m.winner === 1;
          const played = m.scoreA !== null && m.scoreB !== null;
          const score = played ? `${m.scoreA}–${m.scoreB}` : "vs";
          const notes = getMatchNotes({ x: m.extra, p: m.pens });
          const knownTeams = m.teamA !== "TBD" && m.teamB !== "TBD";
          // Played, fully-resolved matches get their own crawlable detail page;
          // undecided/TBD fixtures stay as plain rows (no page exists for them).
          const href = played && knownTeams ? `${matchPath(year, matchSlug(m.teamA, m.teamB))}/` : null;

          const inner = (
            <div className="flex items-center justify-between gap-2">
              <TeamSide code={m.teamA} winner={wA} align="start" onNavigate={onNavigate} />
              <div className="flex flex-col items-center shrink-0">
                <span className="font-unbounded text-sm tracking-wide text-brand-gold font-bold">
                  {score}
                </span>
                {notes.length > 0 && (
                  <span className="font-mono text-[10px] tracking-wider uppercase text-brand-muted/70 leading-none mt-0.5">
                    {notes.join(" ")}
                  </span>
                )}
              </div>
              <TeamSide code={m.teamB} winner={wB} align="end" onNavigate={onNavigate} />
            </div>
          );

          const base = "block w-full px-4 py-3 rounded-xl bg-brand-panel/40 border border-brand-line/40";
          return href ? (
            <AppLink
              key={i}
              href={href}
              onNavigate={onNavigate}
              className={`${base} hover:border-brand-gold/40 hover:bg-brand-gold/[0.06] transition-colors`}
              aria-label={`${getTeamName(m.teamA)} vs ${getTeamName(m.teamB)} — ${label} match details`}
            >
              {inner}
            </AppLink>
          ) : (
            <div key={i} className={base}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeamSide({
  code,
  winner,
  align,
  onNavigate,
}: {
  code: string;
  winner: boolean;
  align: "start" | "end";
  onNavigate: (path: string) => void;
}) {
  const flag = <span className="text-sm leading-none shrink-0">{getTeamFlag(code)}</span>;
  const name = (
    <span className={`text-sm truncate ${winner ? "font-bold text-brand-gold" : "font-semibold"}`}>
      {getTeamName(code)}
    </span>
  );
  const content = align === "start" ? <>{flag}{name}</> : <>{name}{flag}</>;
  const base = `flex items-center gap-2 min-w-0 flex-[1.2] ${align === "end" ? "justify-end" : ""}`;

  if (code === "TBD" || !COUNTRY_PAGE_ENABLED) {
    return <span className={base}>{content}</span>;
  }
  return (
    <button
      onClick={(e) => {
        // This button sits inside the match-row link (AppLink). Without stopping
        // the event, the click would bubble to that link and navigate to the
        // match page instead — so a team name could never reach its country page.
        e.preventDefault();
        e.stopPropagation();
        onNavigate(countryPath(code));
      }}
      className={`${base} hover:text-brand-gold transition-colors cursor-pointer`}
      aria-label={`View ${getTeamName(code)} country page`}
    >
      {content}
    </button>
  );
}

function getChampionCode(t: typeof TOURNAMENTS[number], year: number): string | null {
  if (!t.final?.[0] || t.final[0].w === null) return null;
  const sfTeams = getSFTeams(t, year);
  if (sfTeams.length < 2) return null;
  return t.final[0].w === 0 ? sfTeams[0] : sfTeams[1];
}

function getRunnerUpCode(t: typeof TOURNAMENTS[number], year: number): string | null {
  if (!t.final?.[0] || t.final[0].w === null) return null;
  const sfTeams = getSFTeams(t, year);
  if (sfTeams.length < 2) return null;
  return t.final[0].w === 0 ? sfTeams[1] : sfTeams[0];
}

// Bronze and fourth from the third-place play-off. The two play-off teams are
// the semi-final losers (SF1 loser, SF2 loser); tp.w picks which took bronze.
function getThirdFourthCodes(t: typeof TOURNAMENTS[number], year: number): [string | null, string | null] {
  if (!t.tp || t.tp.w === null || !t.sf) return [null, null];
  const qfW = getQFW(t, year);
  if (qfW.length < 4) return [null, null];
  const s1 = t.sf[0];
  const s2 = t.sf[1];
  if (!s1 || s1.w === null || !s2 || s2.w === null) return [null, null];
  const tpA = s1.w === 0 ? qfW[1] : qfW[0]; // SF1 loser
  const tpB = s2.w === 0 ? qfW[3] : qfW[2]; // SF2 loser
  const third = t.tp.w === 0 ? tpA : tpB;
  const fourth = t.tp.w === 0 ? tpB : tpA;
  return [third, fourth];
}

function getSFTeams(t: typeof TOURNAMENTS[number], year: number): string[] {
  if (!t.sf) return [];
  const qfW = getQFW(t, year);
  if (qfW.length < 4) return [];
  const result: string[] = [];
  for (let i = 0; i < 2; i++) {
    const m = t.sf[i];
    if (!m || m.w === null) continue;
    result.push(m.w === 0 ? qfW[2 * i] : qfW[2 * i + 1]);
  }
  return result;
}

function getQFW(t: typeof TOURNAMENTS[number], year: number): string[] {
  if (!t.qf) return [];
  const r16W = getR16W(t);
  const result: string[] = [];
  for (let i = 0; i < 4; i++) {
    const m = t.qf[i];
    if (!m || m.w === null) continue;
    if (r16W.length >= 8) {
      result.push(m.w === 0 ? r16W[2 * i] : r16W[2 * i + 1]);
    } else {
      result.push(m.w === 0 ? t.teams[2 * i] : t.teams[2 * i + 1]);
    }
  }
  return result;
}

function getR16W(t: typeof TOURNAMENTS[number]): string[] {
  if (!t.r16) return [];
  const result: string[] = [];
  for (let i = 0; i < 8; i++) {
    const m = t.r16[i];
    if (!m || m.w === null) continue;
    result.push(m.w === 0 ? t.teams[2 * i] : t.teams[2 * i + 1]);
  }
  return result;
}

function getRoundMatches(t: typeof TOURNAMENTS[number], year: number, round: "qf" | "sf" | "tp" | "final"): KnockoutMatch[] {
  if (round === "tp" && t.tp) {
    // Third-place play-off: the two semi-final losers.
    const qfW = getQFW(t, year);
    const s1 = t.sf?.[0];
    const s2 = t.sf?.[1];
    if (qfW.length < 4 || !s1 || s1.w === null || !s2 || s2.w === null) return [];
    const ta = s1.w === 0 ? qfW[1] : qfW[0];
    const tb = s2.w === 0 ? qfW[3] : qfW[2];
    const m = t.tp;
    return [{ teamA: ta, teamB: tb, scoreA: m.s[0], scoreB: m.s[1], winner: m.w, pens: m.p ?? null, extra: m.x ?? null }];
  }
  if (round === "qf" && t.qf) {
    const r16W = getR16W(t);
    return t.qf.map((m, i) => {
      if (!m) return null;
      const ta = r16W.length >= 8 ? r16W[2 * i] : t.teams[2 * i];
      const tb = r16W.length >= 8 ? r16W[2 * i + 1] : t.teams[2 * i + 1];
      return { teamA: ta, teamB: tb, scoreA: m.s[0], scoreB: m.s[1], winner: m.w, pens: m.p ?? null, extra: m.x ?? null };
    }).filter(Boolean) as KnockoutMatch[];
  }
  if (round === "sf" && t.sf) {
    const qfW = getQFW(t, year);
    return t.sf.map((m, i) => {
      if (!m) return null;
      const ta = qfW.length >= 4 ? qfW[2 * i] : "TBD";
      const tb = qfW.length >= 4 ? qfW[2 * i + 1] : "TBD";
      return { teamA: ta, teamB: tb, scoreA: m.s[0], scoreB: m.s[1], winner: m.w, pens: m.p ?? null, extra: m.x ?? null };
    }).filter(Boolean) as KnockoutMatch[];
  }
  if (round === "final" && t.final) {
    const sfW = getSFTeams(t, year);
    return t.final.map((m) => {
      if (!m) return null;
      const ta = sfW.length >= 2 ? sfW[0] : "TBD";
      const tb = sfW.length >= 2 ? sfW[1] : "TBD";
      return { teamA: ta, teamB: tb, scoreA: m.s[0], scoreB: m.s[1], winner: m.w, pens: m.p ?? null, extra: m.x ?? null };
    }).filter(Boolean) as KnockoutMatch[];
  }
  return [];
}

