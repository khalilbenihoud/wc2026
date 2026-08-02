import { useMemo, useRef, useEffect, useState } from "react";
import { getTeamName, getTeamFlag } from "../data";
import { countryPath, matchPath, comparePath } from "../router";
import { computeComparison, comparisonMeta, comparisonJsonLd } from "../compare";
import { generateCountryProfiles } from "../countries.generated";
import Breadcrumb from "./Breadcrumb";
import AppLink from "./AppLink";
import { SITE_NAME, BASE_URL } from "../schema";

interface Props {
  codeA: string;
  codeB: string;
  onBack: () => void;
  onNavigate: (path: string) => void;
  instant?: boolean;
}

const KICKER = "font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4";

export default function ComparePage({ codeA, codeB, onBack, onNavigate, instant }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => { setIsClosing(true); setTimeout(onBack, 200); };

  // Canonical ordering: alphabetize so /compare/argentina-vs-brazil/ is canonical
  const canonicalCodeA = codeA < codeB ? codeA : codeB;
  const canonicalCodeB = codeA < codeB ? codeB : codeA;

  useEffect(() => {
    if (codeA !== canonicalCodeA || codeB !== canonicalCodeB) {
      window.history.replaceState(null, "", comparePath(canonicalCodeA, canonicalCodeB));
    }
  }, [codeA, codeB, canonicalCodeA, canonicalCodeB]);

  const nameA = getTeamName(canonicalCodeA) ?? canonicalCodeA;
  const nameB = getTeamName(canonicalCodeB) ?? canonicalCodeB;
  const flagA = getTeamFlag(canonicalCodeA);
  const flagB = getTeamFlag(canonicalCodeB);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [canonicalCodeA, canonicalCodeB]);

  // --- Comparison data (shared with the prerender/sitemap build) ---
  const comparison = useMemo(
    () => computeComparison(canonicalCodeA, canonicalCodeB),
    [canonicalCodeA, canonicalCodeB]
  );

  const { h2h, titlesA, titlesB, titlesYearsA, titlesYearsB, meetings } = comparison;
  const hasMeetings = h2h.played > 0;
  const canonicalUrl = comparePath(canonicalCodeA, canonicalCodeB);

  // SEO metadata — identical to what the prerender bakes in, from src/compare.ts.
  const { title: seoTitle, description: seoDesc } = comparisonMeta(comparison);

  useEffect(() => {
    if (!seoTitle) return;
    document.title = seoTitle;
    const setMeta = (n: string, c: string, a: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${a}="${n}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(a, n); document.head.appendChild(el); }
      el.content = c;
    };
    setMeta("description", seoDesc);
    setMeta("og:title", seoTitle, "property");
    setMeta("og:description", seoDesc, "property");
    setMeta("twitter:title", seoTitle);
    setMeta("twitter:description", seoDesc);
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) { canonicalEl = document.createElement("link"); canonicalEl.rel = "canonical"; document.head.appendChild(canonicalEl); }
    canonicalEl.href = `${BASE_URL}${canonicalUrl}/`;
    let ld = document.getElementById("seo-jsonld");
    if (ld) ld.remove();
    const script = document.createElement("script");
    script.id = "seo-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(comparisonJsonLd(comparison));
    document.head.appendChild(script);
  }, [seoTitle, seoDesc, canonicalUrl, comparison]);

  if (!nameA || !nameB) {
    return (
      <div className="fixed inset-0 z-40 bg-brand-bg text-brand-text overflow-y-auto">
        <div className="max-w-[880px] mx-auto px-5 md:px-8 pt-6 pb-20">
          <button onClick={onBack} className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted hover:text-brand-gold transition-colors cursor-pointer mb-8">
            ← The Road to Glory
          </button>
          <h1 className="font-unbounded text-2xl text-brand-gold">Comparison not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={`fixed inset-0 z-40 bg-brand-bg text-brand-text overflow-y-auto custom-scrollbar ${
        isClosing ? "animate-[fadeOut_0.2s_ease_forwards]" : instant ? "" : "animate-[fadeIn_0.2s_ease]"
      }`}
    >
      <div className={instant ? "animate-[fadeIn_0.15s_ease]" : ""}>
        <div className="sticky top-0 z-20 w-full py-5 mb-8 bg-gradient-to-b from-brand-bg to-transparent">
          <div className="max-w-[880px] mx-auto px-5 md:px-8 flex items-center justify-between gap-4">
            <Breadcrumb
              items={[
                { label: SITE_NAME, href: "/" },
                { label: `${nameA} vs ${nameB}` },
              ]}
              onNavigate={(href) => (href === "/" ? handleClose() : onNavigate(href))}
            />
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted select-none max-md:hidden">
              Archive · Comparison
            </div>
          </div>
        </div>

        <div className="max-w-[880px] mx-auto px-5 md:px-8 pb-20">
          {/* Page header */}
          <div className="mb-10">
            <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-3">
              Head-to-Head
            </div>
            <h1 className="font-unbounded font-bold text-3xl md:text-4xl leading-tight tracking-tight mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-brand-gold-hi via-brand-gold to-brand-gold-deep">
                {nameA} vs {nameB}
              </span>
            </h1>
            <p className="text-brand-muted text-sm">
              {hasMeetings
                ? `${h2h.played} World Cup meeting${h2h.played > 1 ? "s" : ""} — ${nameA} ${h2h.wA}W ${h2h.d}D ${h2h.lA}L`
                : "No World Cup meetings — yet."}
            </p>
          </div>

          {/* Country profile links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <a
              href={`${countryPath(canonicalCodeA)}/`}
              onClick={(e) => { if (e.metaKey || e.ctrlKey || e.button !== 0) return; e.preventDefault(); onNavigate(`${countryPath(canonicalCodeA)}/`); }}
              className="p-4 rounded-xl border border-brand-line/40 bg-brand-panel/30 hover:border-brand-gold/30 hover:bg-brand-panel/50 transition-all cursor-pointer text-left flex items-center gap-3"
            >
              <span className="text-3xl">{flagA}</span>
              <div>
                <span className="font-bold text-sm text-brand-text block">{nameA}</span>
                <span className="text-brand-muted text-xs">{titlesA > 0 ? `${titlesA}× champion` : `${appearancesText(canonicalCodeA, false)}`}</span>
              </div>
            </a>
            <a
              href={`${countryPath(canonicalCodeB)}/`}
              onClick={(e) => { if (e.metaKey || e.ctrlKey || e.button !== 0) return; e.preventDefault(); onNavigate(`${countryPath(canonicalCodeB)}/`); }}
              className="p-4 rounded-xl border border-brand-line/40 bg-brand-panel/30 hover:border-brand-gold/30 hover:bg-brand-panel/50 transition-all cursor-pointer text-left flex items-center gap-3"
            >
              <span className="text-3xl">{flagB}</span>
              <div>
                <span className="font-bold text-sm text-brand-text block">{nameB}</span>
                <span className="text-brand-muted text-xs">{titlesB > 0 ? `${titlesB}× champion` : `${appearancesText(canonicalCodeB, false)}`}</span>
              </div>
            </a>
          </div>

          {/* H2H record card */}
          <section className="mb-10">
            <div className={KICKER}>World Cup Record</div>
            <div className="rounded-xl border border-brand-line bg-brand-panel/30 p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="text-2xl font-unbounded font-bold text-brand-text">{flagA} {h2h.wA}</span>
                <div className="flex gap-4 text-center">
                  <div><div className="text-brand-muted text-xs font-mono uppercase tracking-wider">Played</div><div className="font-unbounded text-xl font-bold text-brand-text">{h2h.played}</div></div>
                  <div><div className="text-brand-muted text-xs font-mono uppercase tracking-wider">Draws</div><div className="font-unbounded text-xl font-bold text-brand-text">{h2h.d}</div></div>
                </div>
                <span className="text-2xl font-unbounded font-bold text-brand-text">{h2h.wB} {flagB}</span>
              </div>
              {hasMeetings ? (
                <div className="flex h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-gold" style={{ width: `${(h2h.wA / h2h.played) * 100}%` }} />
                  <div className="bg-brand-steel/60" style={{ width: `${(h2h.d / h2h.played) * 100}%` }} />
                  <div className="bg-brand-muted/30" style={{ width: `${(h2h.lA / h2h.played) * 100}%` }} />
                </div>
              ) : (
                <p className="text-brand-muted text-sm italic">No World Cup matches between these teams.</p>
              )}
            </div>
          </section>

          {/* Trophy comparison */}
          {(titlesA > 0 || titlesB > 0) && (
            <section className="mb-10">
              <div className={KICKER}>World Cup Titles</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-brand-line bg-brand-panel/30 p-4 text-center">
                  <div className="text-4xl mb-2">{flagA}</div>
                  <div className="font-unbounded font-bold text-2xl text-brand-gold">{titlesA}</div>
                  <div className="text-brand-muted text-xs mt-1">
                    {titlesYearsA.length > 0 ? titlesYearsA.join(", ") : "None"}
                  </div>
                </div>
                <div className="rounded-xl border border-brand-line bg-brand-panel/30 p-4 text-center">
                  <div className="text-4xl mb-2">{flagB}</div>
                  <div className="font-unbounded font-bold text-2xl text-brand-gold">{titlesB}</div>
                  <div className="text-brand-muted text-xs mt-1">
                    {titlesYearsB.length > 0 ? titlesYearsB.join(", ") : "None"}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Meeting timeline */}
          {hasMeetings && (
            <section className="mb-10">
              <div className={KICKER}>World Cup Meetings ({meetings.length})</div>
              <div className="space-y-3">
                {meetings.map((m, i) => {
                  const pensWinner = m.pens
                    ? Number(m.pens.split("-")[0]) > Number(m.pens.split("-")[1]) ? nameA : nameB
                    : null;
                  const goldA = m.winner === nameA || pensWinner === nameA;
                  const goldB = m.winner === nameB || pensWinner === nameB;
                  const label = m.winner ? `${m.winner} won` : pensWinner ? `${pensWinner} won on pens` : "Draw";
                  const suffix = m.pens ? ` (${m.pens} pens)` : m.aet ? " a.e.t." : "";
                  const inner = (
                    <>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="font-mono text-xs tracking-wider text-brand-muted">{m.year} · {m.round}</span>
                        <span className="font-mono text-[10px] tracking-wider text-brand-gold uppercase">{label}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-semibold ${goldA ? "text-brand-gold" : "text-brand-text"}`}>
                          {flagA} {nameA}
                        </span>
                        <span className="font-unbounded text-lg font-bold text-brand-gold whitespace-nowrap">
                          {m.scoreA}–{m.scoreB}{suffix}
                        </span>
                        <span className={`text-sm font-semibold text-right ${goldB ? "text-brand-gold" : "text-brand-text"}`}>
                          {nameB} {flagB}
                        </span>
                      </div>
                    </>
                  );
                  const cls = "block p-4 rounded-xl border border-brand-line/40 bg-brand-panel/30 transition-all";
                  return m.slug ? (
                    <AppLink
                      key={`${m.year}-${m.round}-${i}`}
                      href={`${matchPath(m.year, m.slug)}/`}
                      onNavigate={onNavigate}
                      className={`${cls} hover:border-brand-gold/30 hover:bg-brand-panel/50`}
                    >
                      {inner}
                    </AppLink>
                  ) : (
                    <div key={`${m.year}-${m.round}-${i}`} className={cls}>{inner}</div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Fallback: no meetings */}
          {!hasMeetings && (
            <section className="mb-10">
              <div className={KICKER}>World Cup Meetings</div>
              <div className="rounded-xl border border-brand-line/40 bg-brand-panel/20 p-6 text-center">
                <p className="text-brand-muted">
                  {nameA} and {nameB} have never faced each other at a FIFA World Cup.
                </p>
                <p className="text-brand-muted/60 text-sm mt-2">
                  Explore their individual profiles for their tournament histories.
                </p>
              </div>
            </section>
          )}

          {/* Bottom: links to country profiles */}
          <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-brand-line/30">
            <a
              href={`${countryPath(canonicalCodeA)}/`}
              onClick={(e) => { if (e.metaKey || e.ctrlKey || e.button !== 0) return; e.preventDefault(); onNavigate(`${countryPath(canonicalCodeA)}/`); }}
              className="px-4 py-2 rounded-full border border-brand-line text-sm font-mono text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-colors"
            >
              {flagA} {nameA} profile
            </a>
            <a
              href={`${countryPath(canonicalCodeB)}/`}
              onClick={(e) => { if (e.metaKey || e.ctrlKey || e.button !== 0) return; e.preventDefault(); onNavigate(`${countryPath(canonicalCodeB)}/`); }}
              className="px-4 py-2 rounded-full border border-brand-line text-sm font-mono text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-colors"
            >
              {flagB} {nameB} profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function appearancesText(code: string, long: boolean): string {
  const profiles = generateCountryProfiles();
  const p = profiles[code];
  if (!p) return "No data";
  return long
    ? `${p.appearances} World Cup appearance${p.appearances > 1 ? "s" : ""} since ${p.firstAppearance}`
    : `${p.appearances} appearance${p.appearances > 1 ? "s" : ""}`;
}
