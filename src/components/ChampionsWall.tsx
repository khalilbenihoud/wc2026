import { useEffect, useMemo, useState } from "react";
import { Champion, getChampions } from "../champions";
import { getTeamFlag } from "../data";

function Star({ filled = true, size = 10 }: { filled?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={filled ? "text-brand-gold" : "text-brand-steel/60"}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l2.9 6.9L22 10l-5.5 4.7L18.2 22 12 18.1 5.8 22l1.7-7.3L2 10l7.1-1.1L12 2z" />
    </svg>
  );
}

function StarRow({ n, max = 5 }: { n: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} filled={i < n} />
      ))}
    </span>
  );
}

// Hero background image per nation — an editorial portrait sits behind the
// winner block when one is available. The vendor in a Brasil kit already carries
// five stars on his crest — the same total his nation has on the trophy.
// Served as WebP (~77 KB, universally supported).
const HERO_IMAGE: Record<string, string> = {
  BRA: "/brazil-hero.webp",
};

// Editorial hall-of-fame: winner enshrined between gradient rules, rest as a
// numbered ledger with gradient hairlines between rows.
function Ledger({ list, onNavigateCountry }: { list: Champion[]; onNavigateCountry?: (code: string) => void }) {
  const [first, ...rest] = list;
  const heroSrc = first ? HERO_IMAGE[first.code] : undefined;
  return (
    <div>
      {first && heroSrc && (
        <div className="relative overflow-hidden -mx-6 -mt-6 mb-5 min-h-[320px] md:min-h-[400px]">
          <img
            src={heroSrc}
            alt=""
            aria-hidden
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-[75%_center] select-none pointer-events-none"
          />
          {/* Heavy dark scrim on the left where the text pools, fading right so
              the subject's jersey and CBF crest stay luminous. */}
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/90 via-black/70 to-transparent"
          />
          {/* Vertical scrim so the top and bottom read as a framed spread. */}
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/50"
          />
          <span
            aria-hidden
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent"
          />
          <span
            aria-hidden
            className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent"
          />
          <div className="relative h-full flex items-end min-h-[320px] md:min-h-[400px] pt-12 pb-8 md:pb-10 pl-6 md:pl-10 pr-6">
            <div className="max-w-[58%] text-left">
              <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-brand-gold-hi mb-3 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                Champion of Champions
              </div>
              <button
                onClick={() => onNavigateCountry?.(first.code)}
                className="flex items-center gap-3 mb-3 text-left hover:opacity-80 cursor-pointer transition-opacity"
                aria-label={`View ${first.name} country page`}
              >
                <span className="text-3xl leading-none select-none">{first.flag}</span>
                <span className="font-unbounded font-bold text-3xl md:text-4xl text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                  {first.name}
                </span>
              </button>
              <div className="flex items-center gap-2">
                <StarRow n={first.stars} max={first.stars} />
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/75 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                  · Latest {first.latestWin}
                </span>
              </div>
            </div>
          </div>
          <a
            href="https://unsplash.com/photos/man-wearing-cap-and-jersey-aANIrjIFRKE"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-3 font-mono text-[9px] tracking-[0.2em] uppercase text-white/50 hover:text-white/90 transition-colors drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
          >
            Photo · Unsplash
          </a>
        </div>
      )}
      {first && !heroSrc && (
        <div className="relative py-6 mb-5 text-center">
          <span
            aria-hidden
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent"
          />
          <span
            aria-hidden
            className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent"
          />
          <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-brand-gold-hi mb-3">
            Champion of Champions
          </div>
          <button
            onClick={() => onNavigateCountry?.(first.code)}
            className="flex items-center justify-center gap-3 mb-2 mx-auto hover:opacity-80 cursor-pointer transition-opacity"
            aria-label={`View ${first.name} country page`}
          >
            <span className="text-3xl leading-none select-none">{first.flag}</span>
            <span className="font-unbounded font-bold text-2xl md:text-3xl text-brand-text tracking-tight">
              {first.name}
            </span>
          </button>
          <div className="flex items-center justify-center gap-2">
            <StarRow n={first.stars} max={first.stars} />
            <span className="font-mono text-[10px] tracking-widest uppercase text-brand-muted">
              · Latest {first.latestWin}
            </span>
          </div>
        </div>
      )}
      <ol>
        {rest.map((c, i) => (
          <li
            key={c.code}
            className="relative"
          >
            {i > 0 && (
              <span
                aria-hidden
                className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-line to-transparent"
              />
            )}
            <button
              onClick={() => onNavigateCountry?.(c.code)}
              className="w-full grid grid-cols-[36px_1fr_auto_auto] items-center gap-3 py-2.5 hover:opacity-80 cursor-pointer text-left transition-opacity"
              aria-label={`View ${c.name} country page`}
            >
            <span className="font-unbounded font-semibold text-lg text-brand-muted tabular-nums">
              {i + 2}
            </span>
            <span className="flex items-center gap-2.5 min-w-0">
              <span className="text-base leading-none select-none">{c.flag}</span>
              <span className="text-sm text-brand-text truncate">{c.name}</span>
            </span>
            <StarRow n={c.stars} max={c.stars} />
            <span className="font-mono text-[10px] text-brand-muted tabular-nums w-12 text-right">
              {c.latestWin}
            </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── Trigger button (used from App.tsx to open the modal) ────────────────
export function ChampionsTrigger({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/5 px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-gold-hi hover:bg-brand-gold/15 hover:border-brand-gold/70 transition-colors cursor-pointer ${className}`}
      aria-label="Open Hall of Champions"
    >
      <span aria-hidden>🏆</span>
      <span>Hall of Champions</span>
    </button>
  );
}

interface ChampionsWallProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateCountry?: (code: string) => void;
}

export default function ChampionsWall({ isOpen, onClose, onNavigateCountry }: ChampionsWallProps) {
  const champions = useMemo(() => getChampions(), []);

  // Keep mounted through the close animation.
  const CLOSE_MS = 200;
  const [rendered, setRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      setIsClosing(false);
      return;
    }
    if (rendered) {
      setIsClosing(true);
      const t = setTimeout(() => {
        setRendered(false);
        setIsClosing(false);
      }, CLOSE_MS);
      return () => clearTimeout(t);
    }
  }, [isOpen, rendered]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!rendered || !champions.length) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${
          isClosing ? "animate-[fadeOut_0.2s_ease_forwards]" : "animate-[fadeIn_0.2s_ease]"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Hall of Champions"
        className={`absolute inset-0 flex items-center justify-center p-4 pointer-events-none ${
          isClosing ? "animate-[fadeOut_0.2s_ease_forwards]" : "animate-[fadeIn_0.25s_ease]"
        }`}
      >
        <section
          className="pointer-events-auto max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar bg-brand-panel border border-brand-line rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <header className="sticky top-0 z-10 bg-brand-panel border-b border-brand-line px-6 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-mono text-[10px] font-semibold tracking-[0.3em] uppercase text-brand-gold mb-1.5">
                Hall of Champions
              </div>
              <h2 className="font-unbounded font-bold text-xl md:text-2xl text-brand-text leading-tight">
                Legendary
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close Hall of Champions"
              className="text-brand-muted hover:text-brand-text text-xl cursor-pointer leading-none transition-colors"
            >
              ✕
            </button>
          </header>

          <div className="p-6">
            <Ledger list={champions} onNavigateCountry={onNavigateCountry} />

            <p className="mt-6 font-mono text-[10px] tracking-widest uppercase text-brand-muted text-center">
              Eight nations · one trophy · {getTeamFlag("BRA")} five stars stand alone
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
