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

// Editorial hall-of-fame: winner enshrined between gradient rules, rest as a
// numbered ledger with gradient hairlines between rows.
function Ledger({ list }: { list: Champion[] }) {
  const [first, ...rest] = list;
  return (
    <div>
      {first && (
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
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-3xl leading-none select-none">{first.flag}</span>
            <span className="font-unbounded font-bold text-2xl md:text-3xl text-brand-text tracking-tight">
              {first.name}
            </span>
          </div>
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
            className="relative grid grid-cols-[36px_1fr_auto_auto] items-center gap-3 py-2.5"
          >
            {i > 0 && (
              <span
                aria-hidden
                className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-line to-transparent"
              />
            )}
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
}

export default function ChampionsWall({ isOpen, onClose }: ChampionsWallProps) {
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
            <Ledger list={champions} />

            <p className="mt-6 font-mono text-[10px] tracking-widest uppercase text-brand-muted text-center">
              Eight nations · one trophy · {getTeamFlag("BRA")} five stars stand alone
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
