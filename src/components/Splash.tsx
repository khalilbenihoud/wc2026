import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";

const YEARS = [1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026];

interface SplashProps {
  onEnter: () => void;
  exiting: boolean;
}

export default function Splash({ onEnter, exiting }: SplashProps) {
  const [loaderDone, setLoaderDone] = useState(false);
  const [yearIdx, setYearIdx] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const splashRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const timerRef = useRef(0);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Parallax
  useEffect(() => {
    if (reducedMotion) return;
    const el = splashRef.current;
    if (!el) return;

    let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;

    const onMove = (e: MouseEvent) => {
      tmx = e.clientX / window.innerWidth;
      tmy = e.clientY / window.innerHeight;
    };

    const tick = () => {
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;
      el.style.setProperty("--mx", String(mx));
      el.style.setProperty("--my", String(my));
      rafRef.current = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  // Loader
  useEffect(() => {
    if (reducedMotion) {
      setYearIdx(YEARS.length - 1);
      setLoaderDone(true);
      return;
    }

    let idx = 0;
    const baseDelay = 180;
    const minDelay = 50;

    const tick = () => {
      if (idx >= YEARS.length) {
        setLoaderDone(true);
        return;
      }
      setYearIdx(idx);
      if (progressRef.current) {
        progressRef.current.style.width = `${((idx + 1) / YEARS.length) * 100}%`;
      }
      idx++;
      const delay = baseDelay - (baseDelay - minDelay) * (idx / YEARS.length);
      timerRef.current = window.setTimeout(tick, delay);
    };

    tick();

    return () => clearTimeout(timerRef.current);
  }, [reducedMotion]);

  // Title reveal
  useEffect(() => {
    if (!loaderDone) return;

    const chars = charsRef.current;
    const show = () => {
      for (let i = 0; i < chars.length; i++) {
        const span = chars[i];
        if (span) {
          if (!reducedMotion) {
            span.style.transitionDelay = `${i * 0.045}s`;
          }
          span.classList.add("show");
        }
      }
    };

    if (reducedMotion) show();
    else setTimeout(show, 100);
  }, [loaderDone, reducedMotion]);

  const handleEnter = useCallback(() => {
    onEnter();
  }, [onEnter]);

  return (
    <div
      ref={splashRef}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b] transition-all duration-[0.9s] cubic-bezier(0.4,0,0.2,1) ${
        exiting ? "opacity-0 blur-[40px] brightness-[0.3]" : ""
      }`}
      style={
        {
          "--mx": 0.5,
          "--my": 0.5,
          backgroundImage:
            "radial-gradient(1100px 820px at calc(var(--mx,0.5)*100%) calc(var(--my,0.5)*100%), rgba(217,180,90,0.08), transparent 62%), linear-gradient(180deg, #0c0c0e, #09090b 66%)",
        } as CSSProperties
      }
    >
      <style>{`
        .ch { display: inline-block; transform: translateY(100%); opacity: 0; transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease; }
        .ch.show { transform: translateY(0); opacity: 1; }
        .ch-br { display: none; }
        @media (max-width: 640px) { .ch-br { display: block; width: 100%; height: 0; } }
        @keyframes pd { 0%,100% { opacity: 1; box-shadow: 0 0 0 0 #d9b45a; } 50% { opacity: 0.6; box-shadow: 0 0 0 4px transparent; } }
        .pd { animation: pd 2s ease-in-out infinite; }
      `}</style>

      <div className="fixed top-8 left-8 z-10 text-[0.625rem] tracking-[0.22em] uppercase font-medium text-[#f3efe4] opacity-45 max-sm:hidden select-none">
        Archive · Est. 1930
      </div>
      <div className="fixed top-8 right-8 z-10 text-[0.625rem] tracking-[0.22em] uppercase font-medium text-[#f3efe4] opacity-45 max-sm:hidden select-none">
        2026 — Bracket Live
      </div>

      {!loaderDone && (
        <div className="flex flex-col items-center gap-5" role="status" aria-live="polite" aria-label="Opening the archive">
          <div className="font-unbounded text-[clamp(2.5rem,6vw,4.5rem)] font-semibold text-[#d9b45a] leading-none tabular-nums tracking-tight select-none">
            {YEARS[yearIdx]}
          </div>
          <div className="w-[min(18rem,60vw)] h-px bg-[rgba(217,180,90,0.2)] rounded overflow-hidden">
            <div ref={progressRef} className="h-full bg-[#d9b45a] w-0 rounded" style={{ width: reducedMotion ? "100%" : undefined }} />
          </div>
          <div className="text-[0.6875rem] tracking-[0.25em] uppercase font-medium text-[#f3efe4] opacity-50 select-none">
            Opening the archive
          </div>
        </div>
      )}

      <div
        className={`flex flex-col items-center gap-4 text-center px-6 transition-all duration-[0.7s] ease-out ${
          loaderDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-4 text-[0.625rem] tracking-[0.26em] font-semibold text-[#f3efe4] opacity-50 whitespace-nowrap select-none max-sm:text-[0.5625rem] max-sm:gap-2">
          <span className="h-px bg-[#d9b45a] opacity-25 max-sm:min-w-[0.75rem]" style={{ width: "clamp(1.5rem, 5vw, 3rem)" }} />
          FIFA WORLD CUP KNOCKOUT ARCHIVE
          <span className="h-px bg-[#d9b45a] opacity-25 max-sm:min-w-[0.75rem]" style={{ width: "clamp(1.5rem, 5vw, 3rem)" }} />
        </div>
        <h1 className="font-unbounded text-[clamp(2rem,5.5vw,3.75rem)] font-semibold leading-tight tracking-[0.04em] text-[#f3efe4] overflow-hidden max-sm:leading-[1.15]">
          {"The Road to Glory".split("").map((char, i) => (
            <span key={i} ref={(el) => { if (el) charsRef.current[i] = el; }} className="ch">
              {char === " " ? "\u00A0" : char}
              {i === 7 ? <span className="ch-br" /> : null}
            </span>
          ))}
        </h1>
        <p className="max-w-[36rem] text-[0.9375rem] leading-relaxed text-[#f3efe4] opacity-55 font-normal max-sm:text-[0.8125rem]">
          Every knockout bracket since 1930, drawn as a single radial map from the first round of sixteen to the final whistle.
        </p>
        <button
          onClick={handleEnter}
          className="group relative inline-flex items-center gap-2 mt-2 px-8 py-3 border border-[rgba(217,180,90,0.2)] rounded-full font-unbounded text-[0.75rem] font-medium tracking-[0.08em] text-[#f3efe4] cursor-pointer overflow-hidden isolation-auto transition-colors duration-300 bg-transparent outline-none hover:border-[#d9b45a] hover:text-[#09090b] focus-visible:border-[#d9b45a] focus-visible:text-[#09090b] focus-visible:shadow-[0_0_0_3px_rgba(217,180,90,0.2)] max-sm:text-[0.6875rem] max-sm:px-6 max-sm:py-[0.65rem]"
          tabIndex={loaderDone ? 0 : -1}
        >
          <span className="absolute inset-0 -z-10 bg-[#d9b45a] rounded-full transition-all duration-[0.45s] cubic-bezier(0.16,1,0.3,1) opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 -translate-x-full" />
          ENTER THE ARCHIVE
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" aria-hidden="true">
            <svg width="14" height="11" viewBox="0 0 18.5 14.8"><path d="M10.7 14.8c.24 0 .44-.09.64-.27l6.5-6.48c.19-.19.29-.41.29-.66 0-.24-.1-.47-.29-.65L11.37.29A.85.85 0 0010.71 0a.83.83 0 00-.85.84c0 .23.08.46.24.61l2.18 2.23 4.08 3.72-4.08 3.72-2.18 2.23a.85.85 0 00-.24.61.83.83 0 00.85.84zM.86 8.27h12.35l3.15-.2c.4-.02.67-.27.67-.67 0-.4-.27-.64-.67-.67l-3.15-.2H.86A.8.8 0 000 7.4c0 .51.35.87.86.87z" fill="currentColor" opacity=".85" /></svg>
          </span>
        </button>
      </div>

      <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3.5 text-[0.625rem] tracking-[0.18em] font-medium text-[#f3efe4] max-w-[90vw] overflow-x-auto whitespace-nowrap px-4 max-sm:text-[0.5rem] max-sm:gap-2 max-sm:bottom-4 select-none">
        {YEARS.map((y) => (
          <span key={y} className={y === 2026 ? "text-[#d9b45a]" : "opacity-[0.12] max-sm:opacity-[0.12]"}>
            {y === 2026 && <span className="pd w-[5px] h-[5px] rounded-full bg-[#d9b45a] inline-block align-middle mr-1" />}
            {y}
          </span>
        ))}
      </div>

      <button
        onClick={handleEnter}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-10 text-[0.625rem] tracking-[0.18em] text-[#f3efe4] opacity-20 transition-opacity duration-300 hover:opacity-60 focus-visible:opacity-60 outline-none cursor-pointer font-inter max-sm:bottom-10 select-none"
        tabIndex={loaderDone ? 0 : -1}
        style={{ opacity: loaderDone ? 0 : undefined, pointerEvents: loaderDone ? "none" : undefined }}
      >
        Skip
      </button>
    </div>
  );
}
