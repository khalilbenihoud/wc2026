import { useState } from "react";
import {
  CountryProfile,
  EDITIONS,
  RESULT_HEIGHT,
  RESULT_LABEL,
  Milestone,
  VideoHighlight,
} from "../../countries.mock";
import CountryMap from "../CountryMap";
import { COUNTRY_MAPS } from "../../countryMaps.generated";
import PlayerAvatar from "../PlayerAvatar";
import { useWikiPhoto } from "../../wikiPhoto";
import { countryPath, tournamentPath } from "../../router";
import { Rule, SectionKicker } from "./shared";

interface ArchiveProps {
  profile: CountryProfile;
  onNavigate: (path: string) => void;
}

// ── Shared sub-components ────────────────────────────────────────────────────

function Pulse({ profile }: { profile: CountryProfile }) {
  const [caption, setCaption] = useState<string | null>(null);
  const defaultCaption = "Hover a year";
  return (
    <div>
      <div className="flex items-end gap-[3px] md:gap-1.5 h-28 md:h-36" role="group" aria-label={`${profile.name} results at every World Cup`}>
        {EDITIONS.map((year, i) => {
          const entry = profile.timeline[year];
          const result = entry?.result ?? "DNE";
          const h = RESULT_HEIGHT[result];
          const isTitle = result === "W";
          const label = `${year} · ${RESULT_LABEL[result]}${entry?.note ? ` — ${entry.note}` : ""}`;
          return (
            <div key={year} className="flex-1 h-full flex flex-col justify-end items-center relative">
              {year === 1950 && (
                <span aria-hidden className="absolute -left-[2px] md:-left-[3px] top-1 bottom-0 border-l border-dashed border-brand-steel/50" />
              )}
              <button type="button" aria-label={label} onMouseEnter={() => setCaption(label)} onMouseLeave={() => setCaption(null)} onFocus={() => setCaption(label)} onBlur={() => setCaption(null)} className="w-full h-full flex flex-col justify-end items-center cursor-pointer group focus:outline-none">
                {isTitle && <span aria-hidden className="text-brand-gold text-[9px] md:text-[11px] leading-none mb-1 group-hover:text-brand-gold-hi">★</span>}
                {result === "DNE" ? (
                  <span className="pulse-bar w-full h-[3px] rounded-sm bg-brand-steel/40 group-hover:bg-brand-steel group-focus-visible:bg-brand-steel" style={{ animationDelay: `${i * 40}ms` }} />
                ) : (
                  <span className={`pulse-bar w-full rounded-t-sm transition-colors ${
                    isTitle ? "bg-gradient-to-b from-brand-gold-hi via-brand-gold to-brand-gold-deep" :
                    result === "F" ? "bg-gradient-to-b from-zinc-400/90 to-brand-steel group-hover:from-brand-gold/70 group-focus-visible:from-brand-gold/70" :
                    "bg-brand-steel group-hover:bg-brand-gold/70 group-focus-visible:bg-brand-gold/70"
                  }`} style={{ height: `${h * 100}%`, animationDelay: `${i * 40}ms` }} />
                )}
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 font-mono text-[9px] tracking-wider text-brand-muted select-none" aria-hidden>
        <span>1930</span><span className="max-md:hidden">1950</span><span>1970</span><span className="max-md:hidden">1990</span><span>2010</span><span className="text-brand-gold">2026</span>
      </div>
      <div className="mt-3 min-h-[1.25rem] text-center font-mono text-[11px] tracking-wider text-brand-muted" aria-live="polite">
        {caption ?? <span className="opacity-60">{defaultCaption}</span>}
      </div>
    </div>
  );
}

function ScorerRow({ name, span, goals, max }: { name: string; span: string; goals: number; max: number }) {
  const photo = useWikiPhoto(name);
  return (
    <div className="flex items-center gap-3 py-2.5">
      <PlayerAvatar photo={photo} name={name} className="w-7 h-7 text-xs" />
      <span className="text-sm text-brand-text flex-none min-w-0 truncate">{name}</span>
      <span className="font-mono text-[10px] text-brand-muted tracking-wider flex-none shrink-0">{span}</span>
      <span className="flex-1 mx-1 self-center h-px bg-brand-line relative overflow-visible">
        <span className="absolute inset-y-0 left-0 -top-px h-[3px] rounded bg-brand-gold/60" style={{ width: `${(goals / max) * 100}%` }} />
      </span>
      <span className="font-mono text-sm text-brand-gold tabular-nums flex-none">{goals}</span>
    </div>
  );
}

function TopScorers({ profile }: { profile: CountryProfile }) {
  if (profile.topScorers.length === 0) return null;
  const max = profile.topScorers[0]?.goals ?? 1;
  return (
    <div>
      <SectionKicker>Top scorers</SectionKicker>
      <div className="space-y-0">
        {profile.topScorers.map((s, i) => (
          <div key={s.name}>
            {i > 0 && <Rule />}
            <ScorerRow name={s.name} span={s.span} goals={s.goals} max={max} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Rivalries({ profile, onNavigate }: { profile: CountryProfile; onNavigate: (path: string) => void }) {
  if (profile.rivalries.length === 0) return null;
  return (
    <div>
      <SectionKicker>Rivalries</SectionKicker>
      <div>
        {profile.rivalries.map((r, i) => (
          <div key={r.code}>
            {i > 0 && <Rule />}
            <button
              type="button"
              onClick={() => onNavigate(countryPath(r.code))}
              className="w-full flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-md cursor-pointer text-left hover:bg-brand-gold/[0.04] focus-visible:bg-brand-gold/[0.06] focus:outline-none transition-colors"
            >
              <span aria-hidden className="text-base leading-none">{r.flag}</span>
              <span className="text-sm font-semibold text-brand-text flex-1 truncate">{r.name}</span>
              <span className="font-mono text-[11px] tabular-nums tracking-wider">
                <span className="text-brand-gold">{r.w}W</span><span className="text-brand-muted"> · {r.d}D · </span><span className="text-brand-text/70">{r.l}L</span>
              </span>
              <span className="w-16 h-1 rounded-full overflow-hidden flex flex-none" aria-hidden>
                <span className="bg-brand-gold" style={{ width: `${(r.w / r.played) * 100}%` }} />
                <span className="bg-brand-steel" style={{ width: `${(r.d / r.played) * 100}%` }} />
                <span className="bg-brand-steel/30" style={{ width: `${(r.l / r.played) * 100}%` }} />
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroMap({ p }: { p: CountryProfile }) {
  const hasMap = !!COUNTRY_MAPS[p.code];
  if (!hasMap) {
    return (
      <div
        className="pointer-events-none h-64 md:h-80 w-64 md:w-80 rounded-full animate-pulse"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)" }}
      />
    );
  }

  return (
    <div className="relative opacity-50">
      <CountryMap key={p.code} code={p.code} className="pointer-events-none h-64 md:h-80 w-auto" />
    </div>
  );
}

function TitlesDisplay({ count }: { count: number }) {
  const stars = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="flex items-center gap-1.5 select-none" aria-label={`${count} World Cup title${count > 1 ? "s" : ""}`}>
      <span className="text-brand-muted/40 text-lg leading-none">❦</span>
      <span className="flex items-center gap-0.5">
        {stars.map((i) => (
          <span key={i} className="text-brand-gold text-xl md:text-2xl drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">★</span>
        ))}
      </span>
      <span className="text-brand-muted/40 text-lg leading-none">❦</span>
    </div>
  );
}

function HeroSection({ p }: { p: CountryProfile }) {
  const stars = p.titles.length > 0 && <TitlesDisplay count={p.titles.length} />;

  const info = p.appearances === 0
    ? `${p.confederation} · Yet to reach a World Cup`
    : `${p.confederation} · ${p.appearances} appearances · since ${p.firstAppearance}`;

  const mapEl = (
    <div className="hidden md:flex items-center justify-center min-h-[16rem]">
      <HeroMap p={p} />
    </div>
  );

  return (
    <header className="relative mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center py-8 md:py-12 overflow-hidden rounded-xl">
      <div className="relative z-10">
        <div className="flex flex-col items-start text-left gap-3">
          {stars}
          <h1 className="font-unbounded font-bold text-3xl md:text-5xl tracking-tight leading-tight flex items-center gap-3 md:gap-4">
            <span className="leading-none select-none drop-shadow-lg">{p.flag}</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-brand-text to-brand-text/70 whitespace-nowrap">{p.name}</span>
          </h1>
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted">{info}</div>
          <p className="mt-2 font-serif text-brand-muted text-[15px] leading-relaxed italic max-w-md">{p.epithet}</p>
        </div>
      </div>
      <div className="relative z-10">{mapEl}</div>
    </header>
  );
}

function StatsRow({ p }: { p: CountryProfile }) {
  const rec = p.record;
  return (
    <section className="mb-10">
      <Rule />
      <div className="py-4 flex flex-wrap justify-center gap-x-8 gap-y-1.5 font-mono text-[11px] md:text-xs tracking-[0.18em] uppercase">
        <span className="text-brand-muted">Record <span className="text-brand-text tabular-nums normal-case">{rec.w}W {rec.d}D {rec.l}L</span></span>
        <span className="text-brand-muted">Goals <span className="text-brand-text tabular-nums normal-case">{rec.gf}–{rec.ga}</span></span>
        <span className="text-brand-muted">Shootouts <span className="text-brand-text tabular-nums normal-case">{rec.pensWon}–{rec.pensLost}</span></span>
      </div>
      <Rule />
    </section>
  );
}

function DefiningMatches({ p }: { p: CountryProfile }) {
  if (p.definingMatches.length === 0) return null;
  // Long histories (Argentina, Brazil, Italy…) run to a dozen entries — split
  // them into two column-major columns at md+ so the section stays compact while
  // each column reads chronologically. Shorter lists stay a single column.
  const twoCol = p.definingMatches.length > 4;
  return (
    <section className="mb-10">
      <SectionKicker>Defining matches</SectionKicker>
      <div className={twoCol ? "md:columns-2 md:gap-x-10" : ""}>
        {p.definingMatches.map((m, i) => (
          <div key={`${m.year}-${i}`} className="break-inside-avoid">
            {i > 0 && <Rule />}
            <div className="py-4">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-muted mb-1.5">
                <span className="text-brand-gold">{m.year}</span> · {m.round}
              </div>
              <div className="text-brand-text text-[15px] font-medium">{m.fixture}</div>
              <p className="mt-1 font-serif text-sm text-brand-muted leading-relaxed italic">{m.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MilestonesSection({ milestones, onNavigate }: { milestones: Milestone[]; onNavigate: (path: string) => void }) {
  if (milestones.length === 0) return null;
  return (
    <section className="mb-10">
      <SectionKicker>Milestones</SectionKicker>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {milestones.map((m, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onNavigate(tournamentPath(m.year))}
            className="block w-full text-left p-4 rounded-xl border border-brand-line/40 bg-brand-panel/20 hover:border-brand-gold/30 hover:bg-brand-gold/[0.03] focus-visible:border-brand-gold/40 focus:outline-none transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] tracking-wider uppercase text-brand-gold tabular-nums">{m.year}</span>
              <span className="font-mono text-[10px] tracking-wider uppercase text-brand-muted/60">World Cup</span>
            </div>
            <h3 className="text-sm font-semibold text-brand-text leading-snug mb-1">{m.headline}</h3>
            <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">{m.detail}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function VideosSection({ videos }: { videos: VideoHighlight[] }) {
  if (videos.length === 0) return null;
  return (
    <section className="mb-10">
      <SectionKicker>Videos</SectionKicker>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {videos.map((v, i) => (
          <a
            key={i}
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-3 rounded-xl border border-brand-line/40 bg-brand-panel/20 hover:border-brand-gold/30 hover:bg-brand-gold/[0.03] transition-colors group"
          >
            <div
              className="w-20 h-14 rounded-lg bg-brand-steel/40 flex items-center justify-center shrink-0 font-mono text-[10px] text-brand-muted bg-cover bg-center overflow-hidden"
              style={v.thumbnail ? { backgroundImage: `url(${v.thumbnail})` } : undefined}
            >
              <span className="text-xl opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg">▶</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-brand-text leading-snug truncate">{v.title}</h3>
              {v.duration && <span className="font-mono text-[10px] text-brand-muted/60">{v.duration}</span>}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ── Layout: Dashboard ─────────────────────────────────────────────────────────
// Stats cards at top, everything compact in a grid.

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-brand-line/40 bg-brand-panel/20 p-4 text-center">
      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-muted mb-1">{label}</div>
      <div className="font-unbounded font-bold text-sm md:text-base text-brand-text tracking-tight">{value}</div>
      {sub && <div className="font-mono text-[10px] text-brand-muted/60 mt-0.5">{sub}</div>}
    </div>
  );
}

function LayoutDashboard({ p, onNavigate }: { p: CountryProfile; onNavigate: (path: string) => void }) {
  const rec = p.record;
  return (
    <div>
      <HeroSection p={p} />
      <section className={`mb-10 grid grid-cols-2 gap-3 ${p.titles.length > 0 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
        <StatCard label="Record" value={`${rec.w}W · ${rec.d}D · ${rec.l}L`} sub={`${rec.gf} GF · ${rec.ga} GA`} />
        <StatCard label="Appearances" value={String(p.appearances)} sub={p.appearances === 0 ? "none yet" : `since ${p.firstAppearance}`} />
        <StatCard label="Best result" value={p.titles.length > 0 ? `Champion ×${p.titles.length}` : p.bestResult.replace(/ —.*/, "")} sub={p.titles.length > 0 ? "" : p.bestResult.replace(/.*— /, "")} />
        {p.titles.length > 0 && <StatCard label="Titles" value={"★".repeat(p.titles.length)} sub={`${p.titles.length} star${p.titles.length > 1 ? "s" : ""}`} />}
      </section>
      <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        <div>
          <SectionKicker>The pulse</SectionKicker>
          <Pulse profile={p} />
        </div>
        <div>
          <TopScorers profile={p} />
        </div>
      </section>
      {p.rivalries.length > 0 && <section className="mb-10"><Rivalries profile={p} onNavigate={onNavigate} /></section>}
      <DefiningMatches p={p} />
      <MilestonesSection milestones={p.milestones} onNavigate={onNavigate} />
      <VideosSection videos={p.videos} />
    </div>
  );
}

// ── Archive ───────────────────────────────────────────────────────────────────

export default function Archive({ profile, onNavigate }: ArchiveProps) {
  return <LayoutDashboard p={profile} onNavigate={onNavigate} />;
}