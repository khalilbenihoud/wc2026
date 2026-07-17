import { useEffect, useRef, useState } from "react";
import {
  CountryProfile,
  EDITIONS,
  RESULT_HEIGHT,
  RESULT_LABEL,
  NewsArticle,
  VideoHighlight,
} from "../../countries.mock";
import CountryMap from "../CountryMap";
import { COUNTRY_MAPS } from "../../countryMaps.generated";
import PlayerAvatar from "../PlayerAvatar";
import { useWikiPhoto } from "../../wikiPhoto";
import { countryPath } from "../../router";
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
  const mapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const svg = el.querySelector("svg");
    if (!svg) return;
    const g = svg.querySelector("g");
    if (!g) return;
    const bbox = g.getBBox();
    if (bbox.width === 0 || bbox.height === 0) return;
    const viewW = svg.viewBox?.baseVal?.width ?? 1024;
    const viewH = svg.viewBox?.baseVal?.height ?? 1024;
    setPos({
      x: ((bbox.x + bbox.width / 2) / viewW) * 100,
      y: ((bbox.y + bbox.height / 2) / viewH) * 100,
    });
  }, [p.code]);

  const hasMap = !!COUNTRY_MAPS[p.code];
  if (!hasMap) {
    return (
      <div
        className="pointer-events-none h-64 md:h-80 w-64 md:w-80 rounded-full animate-pulse"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)" }}
      />
    );
  }

  const dot = pos && (
    <>
      <span
        className="absolute w-3 h-3 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(246,196,83,0.8)] animate-[pulse_2s_ease-in-out_infinite] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      />
      <span
        className="absolute w-8 h-8 rounded-full bg-brand-gold/20 animate-[ping_2s_ease-in-out_infinite] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      />
    </>
  );

  return (
    <div ref={mapRef} className="relative opacity-50">
      <CountryMap key={p.code} code={p.code} className="pointer-events-none h-64 md:h-80 w-auto" />
      {dot}
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

const HERO_VARIANTS_KEY = "country-hero-variant";
const VARIANTS = ["v1", "v2"] as const;
type HeroVariant = (typeof VARIANTS)[number];

const labels: Record<HeroVariant, string> = {
  v1: "Side",
  v2: "Full",
};

function VariantSwitcher({ value, onChange }: { value: HeroVariant; onChange: (v: HeroVariant) => void }) {
  return (
    <div className="flex items-center gap-1 mb-4">
      {VARIANTS.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`text-[10px] font-mono tracking-wider px-2 py-1 rounded border transition-colors ${
            value === v
              ? "border-brand-gold text-brand-gold bg-brand-gold/10"
              : "border-brand-line/40 text-brand-muted hover:text-brand-text hover:border-brand-line"
          }`}
        >
          {labels[v]}
        </button>
      ))}
    </div>
  );
}

function HeroSection({ p }: { p: CountryProfile }) {
  const [variant, setVariant] = useState<HeroVariant>(() => {
    if (typeof window === "undefined") return "v1";
    return (localStorage.getItem(HERO_VARIANTS_KEY) as HeroVariant) ?? "v1";
  });

  const changeVariant = (v: HeroVariant) => {
    setVariant(v);
    localStorage.setItem(HERO_VARIANTS_KEY, v);
  };

  const stars = p.titles.length > 0 && <TitlesDisplay count={p.titles.length} />;

  const info = p.appearances === 0
    ? `${p.confederation} · Yet to reach a World Cup`
    : `${p.confederation} · ${p.appearances} appearances · since ${p.firstAppearance}`;

  const mapEl = (
    <div className="hidden md:flex items-center justify-center min-h-[16rem]">
      <HeroMap p={p} />
    </div>
  );

  if (variant === "v1") {
    return (
      <>
        <VariantSwitcher value={variant} onChange={changeVariant} />
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
      </>
    );
  }

  if (variant === "v2") {
    return (
      <>
        <VariantSwitcher value={variant} onChange={changeVariant} />
        <header className="relative mb-8 py-16 md:py-24 overflow-hidden rounded-xl flex flex-col items-center text-center">
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center scale-150">{mapEl}</div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-brand-bg/60 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-3 max-w-lg">
            {stars}
            <span className="text-6xl md:text-7xl leading-none select-none drop-shadow-lg">{p.flag}</span>
            <h1 className="font-unbounded font-bold text-4xl md:text-6xl tracking-tight leading-tight text-brand-text">{p.name}</h1>
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted">{info}</div>
            <p className="font-serif text-brand-muted text-[15px] leading-relaxed italic">{p.epithet}</p>
          </div>
        </header>
      </>
    );
  }

  return null;
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
  return (
    <section className="mb-10">
      <SectionKicker>Defining matches</SectionKicker>
      <div>
        {p.definingMatches.map((m, i) => (
          <div key={`${m.year}-${i}`}>
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

function NewsSection({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="mb-10">
      <SectionKicker>Latest news</SectionKicker>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {articles.map((a, i) => (
          <a key={i} href={a.url} className="block p-4 rounded-xl border border-brand-line/40 bg-brand-panel/20 hover:border-brand-gold/30 hover:bg-brand-gold/[0.03] transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] tracking-wider uppercase text-brand-muted">{a.source}</span>
              <span className="font-mono text-[10px] text-brand-muted/60">{a.date}</span>
            </div>
            <h3 className="text-sm font-semibold text-brand-text leading-snug mb-1">{a.headline}</h3>
            <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">{a.snippet}</p>
          </a>
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
          <a key={i} href={v.url} className="flex items-center gap-4 p-3 rounded-xl border border-brand-line/40 bg-brand-panel/20 hover:border-brand-gold/30 hover:bg-brand-gold/[0.03] transition-colors">
            <div className="w-16 h-12 rounded-lg bg-brand-steel/40 flex items-center justify-center shrink-0 font-mono text-[10px] text-brand-muted">
              <span className="text-lg">▶</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-brand-text leading-snug truncate">{v.title}</h3>
              <span className="font-mono text-[10px] text-brand-muted/60">{v.duration}</span>
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
      <NewsSection articles={p.news} />
      <VideosSection videos={p.videos} />
    </div>
  );
}

// ── Archive ───────────────────────────────────────────────────────────────────

export default function Archive({ profile, onNavigate }: ArchiveProps) {
  return <LayoutDashboard p={profile} onNavigate={onNavigate} />;
}