import { useEffect, useRef, useState } from "react";
import { CountryProfile } from "../countries.mock";
import { TOURNAMENTS, getTeamColor } from "../data";
import { countryPath, tournamentPath } from "../router";
import Archive from "./country/Archive";

interface CountryPageProps {
  profile: CountryProfile;
  onBack: () => void;
  onNavigate: (path: string) => void;
}

export default function CountryPage({ profile, onBack, onNavigate }: CountryPageProps) {
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
        isClosing ? "animate-[fadeOut_0.2s_ease_forwards]" : "animate-[fadeIn_0.2s_ease]"
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
        <div className="sticky top-0 z-20 -mx-5 md:-mx-8 px-5 md:px-8 py-5 mb-8 flex items-center justify-between bg-brand-bg/80 backdrop-blur-md border-b border-brand-line/40">
          <button onClick={handleClose} className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-muted hover:text-brand-gold transition-colors cursor-pointer">
            ← The Road to Glory
          </button>
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted select-none">
            Archive · Nation
          </div>
        </div>

        <Archive profile={profile} />

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
                return (
                  <button
                    key={year}
                    onClick={() => onNavigate(tournamentPath(year))}
                    className="px-3 py-1.5 rounded-full border border-brand-line text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-colors cursor-pointer text-sm font-mono"
                  >
                    {year}
                  </button>
                );
              })}
          </div>

          {profile.rivalries.length > 0 && (
            <>
              <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
                Related Nations
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {profile.rivalries.map((r) => (
                  <button
                    key={r.code}
                    onClick={() => onNavigate(countryPath(r.code))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-line text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-colors cursor-pointer text-sm font-mono"
                  >
                    <span>{r.flag}</span>
                    {r.name}
                  </button>
                ))}
              </div>
            </>
          )}

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
