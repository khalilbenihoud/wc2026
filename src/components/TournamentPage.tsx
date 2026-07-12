import { useEffect, useMemo, useRef, useState } from "react";
import { TOURNAMENTS, getTeamName, getTeamFlag } from "../data";
import { getMatchNotes } from "../constants";
import { countryPath, tournamentPath, COUNTRY_PAGE_ENABLED } from "../router";
import { CHAMPION_IMAGES } from "../championImages.generated";
import { useWikiPhoto } from "../wikiPhoto";
import PlayerAvatar from "./PlayerAvatar";
import AppLink from "./AppLink";
import CountryMap from "./CountryMap";

interface TournamentPageProps {
  year: number;
  onBack: () => void;
  onNavigate: (path: string) => void;
}

export default function TournamentPage({ year, onBack, onNavigate }: TournamentPageProps) {
  const t = TOURNAMENTS[year];

  const champion = useMemo(() => {
    if (!t?.final?.[0] || t.final[0].w === null) return null;
    return getChampionCode(t, year);
  }, [t, year]);

  const runnerUp = useMemo(() => {
    if (!t?.final?.[0] || t.final[0].w === null) return null;
    return getRunnerUpCode(t, year);
  }, [t, year]);

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
          <button onClick={onBack} className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-muted hover:text-brand-gold transition-colors cursor-pointer mb-8">
            ← The Road to Glory
          </button>
          <h1 className="font-unbounded text-2xl text-brand-gold">Tournament not found</h1>
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

  return (
    <div
      ref={scrollRef}
      className={`fixed inset-0 z-40 bg-brand-bg text-brand-text overflow-y-auto custom-scrollbar ${
        isClosing ? "animate-[fadeOut_0.2s_ease_forwards]" : "animate-[fadeIn_0.2s_ease]"
      }`}
    >
      <div className="max-w-[880px] mx-auto px-5 md:px-8 pb-20">
        <div className="sticky top-0 z-20 -mx-5 md:-mx-8 px-5 md:px-8 py-5 mb-8 flex items-center justify-between bg-brand-bg/80 backdrop-blur-md border-b border-brand-line/40">
          <button onClick={handleClose} className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-muted hover:text-brand-gold transition-colors cursor-pointer">
            ← The Road to Glory
          </button>
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted select-none">
            Archive · Tournament
          </div>
        </div>

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
                      className="font-unbounded font-bold text-xl text-brand-text hover:text-brand-gold transition-colors cursor-pointer"
                    >
                      {getTeamName(champion)}
                    </button>
                  ) : (
                    <div className="font-unbounded font-bold text-xl text-brand-text">
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
                  <div className="text-brand-text font-semibold truncate">
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
                  <div className="text-brand-text font-semibold truncate">{t.goldenGlove.name}</div>
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
              <div className="text-brand-text font-semibold">Still up for grabs</div>
              <p className="text-brand-muted text-sm mt-1.5 leading-relaxed">
                No Golden Boot or Glove handed out yet.
                <br />
                Someone out there is having the tournament of their life. ✨
              </p>
            </div>
          )}
        </div>

        <div className="mb-10">
          <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
            Knockout Results
          </div>
          <div className="space-y-6">
            {t.r32 && t.r32.length > 0 && (
              <KnockoutRound
                label="Round of 32"
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
            {t.r16 && (
              <KnockoutRound
                label="Round of 16"
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
            {t.qf && (
              <KnockoutRound
                label="Quarter-finals"
                matches={getRoundMatches(t, year, "qf")}
                onNavigate={onNavigate}
              />
            )}
            {t.sf && (
              <KnockoutRound
                label="Semi-finals"
                matches={getRoundMatches(t, year, "sf")}
                onNavigate={onNavigate}
              />
            )}
            {t.final && (
              <KnockoutRound
                label="Final"
                matches={getRoundMatches(t, year, "final")}
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
                    <span className="text-base">{getTeamFlag(code)}</span>
                    <span className="text-sm font-semibold text-brand-text">{getTeamName(code)}</span>
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

        <div className="mb-10">
          <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
            Other Tournaments
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(TOURNAMENTS)
              .map(Number)
              .sort((a, b) => b - a)
              .filter((y) => y !== year)
              .map((y) => (
                <AppLink
                  key={y}
                  href={tournamentPath(y)}
                  onNavigate={onNavigate}
                  className="px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer border-brand-line text-brand-muted hover:text-brand-gold hover:border-brand-gold/40"
                >
                  {y}
                </AppLink>
              ))}
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
  onNavigate,
}: {
  label: string;
  matches: KnockoutMatch[];
  onNavigate: (path: string) => void;
}) {
  return (
    <div>
      <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-muted mb-2">{label}</h3>
      <div className="space-y-2">
        {matches.map((m, i) => {
          const wA = m.winner === 0;
          const wB = m.winner === 1;
          const played = m.scoreA !== null && m.scoreB !== null;
          const score = played ? `${m.scoreA}–${m.scoreB}` : "vs";
          const notes = getMatchNotes({ x: m.extra, p: m.pens });
          return (
            <div
              key={i}
              className="w-full px-4 py-3 rounded-xl bg-brand-panel/40 border border-brand-line/40"
            >
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
      onClick={() => onNavigate(countryPath(code))}
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

function getRoundMatches(t: typeof TOURNAMENTS[number], year: number, round: "qf" | "sf" | "final"): KnockoutMatch[] {
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
