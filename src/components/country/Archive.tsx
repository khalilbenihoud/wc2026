import { useState } from "react";
import {
  CountryProfile,
  EDITIONS,
  RESULT_HEIGHT,
  RESULT_LABEL,
} from "../../countries.mock";
import { Rule, SectionKicker } from "./shared";

// ── The Pulse ────────────────────────────────────────────────────────────────
// One slot per edition, 1930 → 2026. Bar height encodes the round reached;
// championships are full-height gold with a star; a baseline tick marks
// editions the nation missed. The WWII gap gets a labeled spacer so the
// century reads honestly.
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
              {/* WWII spacer between 1938 and 1950 */}
              {year === 1950 && (
                <span
                  aria-hidden
                  className="absolute -left-[2px] md:-left-[3px] top-1 bottom-0 border-l border-dashed border-brand-steel/50"
                />
              )}
              <button
                type="button"
                aria-label={label}
                onMouseEnter={() => setCaption(label)}
                onMouseLeave={() => setCaption(null)}
                onFocus={() => setCaption(label)}
                onBlur={() => setCaption(null)}
                className="w-full h-full flex flex-col justify-end items-center cursor-pointer group focus:outline-none"
              >
                {isTitle && (
                  <span aria-hidden className="text-brand-gold text-[9px] md:text-[11px] leading-none mb-1 group-hover:text-brand-gold-hi">
                    ★
                  </span>
                )}
                {result === "DNE" ? (
                  <span className="pulse-bar w-full h-[3px] rounded-sm bg-brand-steel/40 group-hover:bg-brand-steel group-focus-visible:bg-brand-steel" style={{ animationDelay: `${i * 40}ms` }} />
                ) : (
                  <span
                    className={`pulse-bar w-full rounded-t-sm transition-colors ${
                      isTitle
                        ? "bg-gradient-to-b from-brand-gold-hi via-brand-gold to-brand-gold-deep"
                        : result === "F"
                        ? // Lost finals read as silver — for some nations that is the whole story.
                          "bg-gradient-to-b from-zinc-400/90 to-brand-steel group-hover:from-brand-gold/70 group-focus-visible:from-brand-gold/70"
                        : "bg-brand-steel group-hover:bg-brand-gold/70 group-focus-visible:bg-brand-gold/70"
                    }`}
                    style={{ height: `${h * 100}%`, animationDelay: `${i * 40}ms` }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Axis: decade markers only — 23 year labels would be noise. */}
      <div className="flex justify-between mt-2 font-mono text-[9px] tracking-wider text-brand-muted select-none" aria-hidden>
        <span>1930</span>
        <span className="max-md:hidden">1950</span>
        <span>1970</span>
        <span className="max-md:hidden">1990</span>
        <span>2010</span>
        <span className="text-brand-gold">2026</span>
      </div>

      {/* Live caption for the hovered / focused year. */}
      <div className="mt-3 min-h-[1.25rem] text-center font-mono text-[11px] tracking-wider text-brand-muted" aria-live="polite">
        {caption ?? <span className="opacity-60">{defaultCaption}</span>}
      </div>
    </div>
  );
}

// ── Ledgers ──────────────────────────────────────────────────────────────────

function TopScorers({ profile }: { profile: CountryProfile }) {
  const max = profile.topScorers[0]?.goals ?? 1;
  return (
    <div>
      <SectionKicker>Top scorers</SectionKicker>
      <div className="space-y-0">
        {profile.topScorers.map((s, i) => (
          <div key={s.name}>
            {i > 0 && <Rule />}
            <div className="flex items-baseline gap-3 py-2.5">
              <span className="text-sm text-brand-text flex-none">{s.name}</span>
              <span className="font-mono text-[10px] text-brand-muted tracking-wider flex-none">{s.span}</span>
              <span className="flex-1 mx-1 self-center h-px bg-brand-line relative overflow-visible">
                <span
                  className="absolute inset-y-0 left-0 -top-px h-[3px] rounded bg-brand-gold/60"
                  style={{ width: `${(s.goals / max) * 100}%` }}
                />
              </span>
              <span className="font-mono text-sm text-brand-gold tabular-nums flex-none">{s.goals}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Rivalries({ profile }: { profile: CountryProfile }) {
  return (
    <div>
      <SectionKicker>Rivalries</SectionKicker>
      <div>
        {profile.rivalries.map((r, i) => (
          <div key={r.code}>
            {i > 0 && <Rule />}
            <div className="flex items-center gap-3 py-2.5">
              <span aria-hidden className="text-base leading-none">{r.flag}</span>
              <span className="text-sm text-brand-text flex-1">{r.name}</span>
              <span className="font-mono text-[11px] tabular-nums tracking-wider">
                <span className="text-brand-gold">{r.w}W</span>
                <span className="text-brand-muted"> · {r.d}D · </span>
                <span className="text-brand-text/70">{r.l}L</span>
              </span>
              {/* W/D/L split bar */}
              <span className="w-16 h-1 rounded-full overflow-hidden flex flex-none" aria-hidden>
                <span className="bg-brand-gold" style={{ width: `${(r.w / r.played) * 100}%` }} />
                <span className="bg-brand-steel" style={{ width: `${(r.d / r.played) * 100}%` }} />
                <span className="bg-brand-steel/30" style={{ width: `${(r.l / r.played) * 100}%` }} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Variant: Archive — editorial single column, ledger discipline ────────────

export default function Archive({ profile }: { profile: CountryProfile }) {
  const rec = profile.record;
  return (
    <div>
      {/* Hero */}
      <header className="mb-10 md:mb-14">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-5">
            <span aria-hidden className="text-5xl md:text-6xl leading-none select-none">{profile.flag}</span>
            <div>
              <h1 className="font-unbounded font-semibold text-3xl md:text-5xl tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-brand-text to-brand-text/70">
                {profile.name}
              </h1>
              <div className="mt-2.5 font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted">
                {profile.confederation} · {profile.appearances} appearances · since {profile.firstAppearance}
              </div>
            </div>
          </div>
          {profile.titles.length > 0 && (
            <div
              className="text-brand-gold text-lg md:text-xl tracking-[0.2em] select-none flex-none mt-1"
              aria-label={`${profile.titles.length} World Cup titles`}
            >
              {"★".repeat(profile.titles.length)}
            </div>
          )}
        </div>
        <p className="mt-5 text-brand-muted text-[15px] leading-relaxed italic max-w-[36rem]">
          {profile.epithet}
        </p>
      </header>

      {/* The Pulse */}
      <section className="mb-12 md:mb-16">
        <SectionKicker>The pulse · 1930 – 2026</SectionKicker>
        <Pulse profile={profile} />
      </section>

      {/* All-time record — a ledger line, not stat cards. */}
      <section className="mb-12 md:mb-16">
        <Rule />
        <div className="py-4 flex flex-wrap justify-center gap-x-8 gap-y-1.5 font-mono text-[11px] md:text-xs tracking-[0.18em] uppercase">
          <span className="text-brand-muted">
            Record <span className="text-brand-text tabular-nums normal-case">{rec.w}W {rec.d}D {rec.l}L</span>
          </span>
          <span className="text-brand-muted">
            Goals <span className="text-brand-text tabular-nums normal-case">{rec.gf}–{rec.ga}</span>
          </span>
          <span className="text-brand-muted">
            Shootouts <span className="text-brand-text tabular-nums normal-case">{rec.pensWon}–{rec.pensLost}</span>
          </span>
        </div>
        <Rule />
      </section>

      {/* Honours — only exists for nations that have them. */}
      <section className="mb-12 md:mb-16">
        <SectionKicker>Honours</SectionKicker>
        {profile.titles.length > 0 ? (
          <div>
            {profile.titles.map((t, i) => (
              <div key={t.year}>
                {i > 0 && <Rule />}
                <div className="flex items-baseline gap-4 py-3">
                  <span className="font-unbounded font-semibold text-xl md:text-2xl text-brand-gold tabular-nums">{t.year}</span>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-muted flex-1 max-md:hidden">World champions</span>
                  <span className="flex-1 md:hidden" />
                  <span className="font-mono text-xs text-brand-text/80 tabular-nums">{t.final}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-1 text-sm text-brand-muted">
            Best result — <span className="text-brand-text">{profile.bestResult}</span>
          </div>
        )}
      </section>

      {/* Scorers + rivalries */}
      <section className="mb-12 md:mb-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        <TopScorers profile={profile} />
        <Rivalries profile={profile} />
      </section>

      {/* Defining matches */}
      <section>
        <SectionKicker>Defining matches</SectionKicker>
        <div>
          {profile.definingMatches.map((m, i) => (
            <div key={`${m.year}-${i}`}>
              {i > 0 && <Rule />}
              <div className="py-4">
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-muted mb-1.5">
                  <span className="text-brand-gold">{m.year}</span> · {m.round}
                </div>
                <div className="text-brand-text text-[15px] font-medium">{m.fixture}</div>
                <p className="mt-1 text-sm text-brand-muted leading-relaxed italic">{m.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
