import { useRef, useState } from "react";
import { getHubData, type HubNation } from "../countriesHub";
import { getTeamFlag } from "../data";
import { countryPath, countriesPath } from "../router";
import { SITE_NAME } from "../schema";
import Breadcrumb from "./Breadcrumb";
import ShareButton from "./ShareButton";

interface Props {
  onNavigate: (path: string) => void;
  // Opened from another full-screen overlay — skip the fade so nothing flashes.
  instant?: boolean;
}

// Browse-by-nation hub: an honour roll of champions plus every team grouped by
// confederation, each linking to its country page. Prerendered counterpart lives
// in scripts/prerender.ts (buildCountriesHub) — keep the two in sync.
export default function CountriesHub({ onNavigate, instant }: Props) {
  const [skipIntro] = useState(!!instant);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { total, champions, groups } = getHubData();

  const go = (path: string) => onNavigate(path);

  const stat = (n: HubNation) =>
    n.titles > 0
      ? `${n.titles}× champion${n.titles > 1 ? "s" : ""}`
      : `${n.appearances} appearance${n.appearances === 1 ? "" : "s"}`;

  const NationCard = ({ n }: { n: HubNation }) => (
    <button
      onClick={() => go(countryPath(n.code))}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-brand-line text-left hover:border-brand-gold/40 hover:bg-brand-gold/[0.03] transition-colors cursor-pointer"
    >
      <span className="text-2xl leading-none shrink-0">{getTeamFlag(n.code)}</span>
      <span className="min-w-0">
        <span className="block font-semibold text-sm text-brand-text group-hover:text-brand-gold transition-colors truncate">
          {n.name}
        </span>
        <span className="block font-mono text-[10px] tracking-wide uppercase text-brand-muted truncate">
          {stat(n)}
        </span>
      </span>
    </button>
  );

  return (
    <div
      ref={scrollRef}
      className={`fixed inset-0 z-40 bg-brand-bg text-brand-text overflow-y-auto custom-scrollbar ${
        skipIntro ? "" : "animate-[fadeIn_0.2s_ease]"
      }`}
    >
      <div className="sticky top-0 z-20 w-full py-5 mb-8 bg-gradient-to-b from-brand-bg to-transparent">
        <div className="max-w-[880px] mx-auto px-5 md:px-8 flex items-center justify-between gap-4">
          <Breadcrumb
            items={[{ label: SITE_NAME, href: "/" }, { label: "Countries" }]}
            onNavigate={(href) => go(href)}
          />
          <div className="flex items-center gap-3 shrink-0">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted select-none max-md:hidden">
              Archive · Nations
            </div>
            <ShareButton path={countriesPath} />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[880px] mx-auto px-5 md:px-8 pb-20">
        <h1 className="font-unbounded font-bold text-3xl md:text-4xl leading-tight tracking-tight mb-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-brand-gold-hi via-brand-gold to-brand-gold-deep">
            World Cup Nations
          </span>
        </h1>
        <p className="font-serif italic text-brand-muted text-lg mb-10 max-w-[46rem]">
          Every one of the {total} nations to grace a FIFA World Cup, 1930–2026 — the champions ranked
          by titles, and all teams grouped by confederation. Tap any nation for its full record,
          results and top scorers.
        </p>

        <section className="mb-12">
          <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
            Roll of honour
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {champions.map((n) => (
              <NationCard key={n.code} n={n} />
            ))}
          </div>
        </section>

        {groups.map((g) => (
          <section key={g.label} className="mb-10">
            <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
              {g.label} · {g.nations.length}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {g.nations.map((n) => (
                <NationCard key={n.code} n={n} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
