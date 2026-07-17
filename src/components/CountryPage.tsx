import { useEffect, useRef, useState } from "react";
import { CountryProfile, RESULT_LABEL, ResultLevel } from "../countries.mock";
import { TOURNAMENTS, getTeamColor } from "../data";
import { tournamentPath } from "../router";
import Archive from "./country/Archive";
import Breadcrumb from "./Breadcrumb";
import { SITE_NAME } from "../schema";

const RESULT_BADGE_CLASS: Record<ResultLevel, string> = {
  W: "bg-brand-gold/20 text-brand-gold border-brand-gold/40",
  F: "bg-zinc-400/20 text-zinc-300 border-zinc-400/40",
  "3RD": "bg-amber-700/20 text-amber-500 border-amber-700/40",
  "4TH": "bg-amber-900/20 text-amber-700 border-amber-900/40",
  QF: "bg-brand-steel/30 text-brand-text border-brand-steel/50",
  R16: "bg-brand-steel/20 text-brand-muted border-brand-steel/40",
  R32: "bg-brand-steel/15 text-brand-muted/80 border-brand-steel/30",
  GS: "bg-brand-line/30 text-brand-muted/70 border-brand-line/50",
  DNE: "bg-transparent text-brand-muted/40 border-brand-line/30",
};

interface CountryPageProps {
  profile: CountryProfile;
  onBack: () => void;
  onNavigate: (path: string) => void;
  // Opened directly from another full-screen overlay (e.g. a nation link on the
  // tournament page): skip the fade-in so the home bracket never flashes between
  // the two. Frozen at mount (below).
  instant?: boolean;
}

export default function CountryPage({ profile, onBack, onNavigate, instant }: CountryPageProps) {
  const [skipIntro] = useState(!!instant);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [profile.code]);

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onBack, 200);
  };

  const color = getTeamColor(profile.code);

  return (
    <div
      ref={scrollRef}
      className={`fixed inset-0 z-40 bg-brand-bg text-brand-text overflow-y-auto custom-scrollbar ${
        isClosing ? "animate-[fadeOut_0.2s_ease_forwards]" : skipIntro ? "" : "animate-[fadeIn_0.2s_ease]"
      }`}
    >
      {/* Ambient aurora — two drifting gradients for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -inset-48 animate-[aurora_14s_ease_infinite_alternate]"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 30% 40%, ${color}18 0%, transparent 60%)`,
          }}
        />
        <div
          className="absolute -inset-48 animate-[aurora_20s_ease_infinite_alternate-reverse]"
          style={{
            background: `radial-gradient(ellipse 50% 40% at 70% 60%, ${color}0d 0%, transparent 50%)`,
          }}
        />
      </div>
      <div className="relative z-10 max-w-[880px] mx-auto px-5 md:px-8 pb-20">
        <div className="sticky top-0 z-20 -mx-5 md:-mx-8 px-5 md:px-8 py-5 mb-8 flex items-center justify-between gap-4 bg-brand-bg/80 backdrop-blur-md border-b border-brand-line/40">
          <Breadcrumb
            items={[{ label: SITE_NAME, href: "/", home: true }, { label: profile.name }]}
            onNavigate={handleClose}
          />
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted select-none max-md:hidden shrink-0">
            Archive · Nation
          </div>
        </div>

        <Archive profile={profile} onNavigate={onNavigate} />

        {/* Internal cross-links for SEO */}
        <section className="mb-10 pt-8 border-t border-brand-line/40">
          <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
            Tournament Appearances
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(profile.timeline)
              .filter(([, entry]) => entry && entry.result !== "DNE")
              .map(([yearStr]) => {
                const year = Number(yearStr);
                const entry = profile.timeline[year]!;
                return (
                  <button
                    key={year}
                    onClick={() => onNavigate(tournamentPath(year))}
                    title={`${year} · ${RESULT_LABEL[entry.result]}`}
                    className="group flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-full border border-brand-line text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-colors cursor-pointer text-sm font-mono"
                  >
                    <span>{year}</span>
                    <span className={`px-1.5 py-px rounded-sm text-[9px] font-semibold tracking-wider border ${RESULT_BADGE_CLASS[entry.result]}`}>
                      {entry.result}
                    </span>
                  </button>
                );
              })}
          </div>

          <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
            Explore All Tournaments
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(TOURNAMENTS)
              .map(Number)
              .sort((a, b) => b - a)
              .map((year) => (
                <button
                  key={year}
                  onClick={() => onNavigate(tournamentPath(year))}
                  className="px-3 py-1.5 rounded-full border border-brand-line text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-colors cursor-pointer text-sm font-mono"
                >
                  {year}
                </button>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
