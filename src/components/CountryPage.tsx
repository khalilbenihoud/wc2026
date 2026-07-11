import { CountryProfile } from "../countries.mock";
import { TOURNAMENTS } from "../data";
import { countryPath, tournamentPath } from "../router";
import Archive from "./country/Archive";

interface CountryPageProps {
  profile: CountryProfile;
  allCountries: Record<string, CountryProfile>;
  onBack: () => void;
  onNavigate: (path: string) => void;
  onSelectCountry: (code: string) => void;
}

export default function CountryPage({ profile, allCountries, onBack, onNavigate, onSelectCountry }: CountryPageProps) {
  return (
    <div className="country-fade fixed inset-0 z-40 bg-brand-bg text-brand-text overflow-y-auto custom-scrollbar">
      <div className="max-w-[880px] mx-auto px-5 md:px-8 pt-6 pb-20">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-muted hover:text-brand-gold transition-colors cursor-pointer"
          >
            ← The Road to Glory
          </button>
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-muted/70 select-none">
            Archive · Nation
          </div>
        </div>

        {/* Nation switcher (mock phase) */}
        <div className="mb-10 space-y-2.5 font-mono text-[10px] tracking-wider uppercase">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-brand-muted/50 select-none w-16">Nation:</span>
            {Object.values(allCountries).map((c) => (
              <button
                key={c.code}
                onClick={() => onSelectCountry(c.code)}
                className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                  c.code === profile.code
                    ? "border-brand-gold/60 text-brand-gold bg-brand-gold/10"
                    : "border-brand-line text-brand-muted hover:text-brand-text hover:border-brand-steel"
                }`}
              >
                {c.flag} {c.code}
              </button>
            ))}
          </div>
        </div>

        <Archive profile={profile} />

        {/* Internal cross-links for SEO */}
        <section className="mt-16 pt-8 border-t border-brand-line/40">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-line text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-colors cursor-pointer text-sm"
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
                  className="px-2.5 py-1 rounded-full border border-brand-line/60 text-brand-muted/70 hover:text-brand-text hover:border-brand-steel transition-colors cursor-pointer text-xs font-mono"
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
