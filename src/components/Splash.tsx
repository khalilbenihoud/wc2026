import { useState, useEffect, useRef, Fragment } from "react";

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
      if (idx >= YEARS.length) { setLoaderDone(true); return; }
      setYearIdx(idx);
      if (progressRef.current) {
        progressRef.current.style.width = ((idx + 1) / YEARS.length * 100) + "%";
      }
      idx++;
      timerRef.current = window.setTimeout(tick, baseDelay - (baseDelay - minDelay) * (idx / YEARS.length));
    };
    tick();
    return () => clearTimeout(timerRef.current);
  }, [reducedMotion]);

  useEffect(() => {
    if (!loaderDone) return;
    const chars = charsRef.current;
    const reveal = () => {
      for (let i = 0; i < chars.length; i++) {
        const span = chars[i];
        if (span) {
          if (!reducedMotion) span.style.transitionDelay = `${i * 0.045}s`;
          span.classList.add("show");
        }
      }
    };
    if (reducedMotion) reveal();
    else setTimeout(reveal, 100);
  }, [loaderDone, reducedMotion]);

  return (
    <div
      ref={splashRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#09090b",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        color: "#f3efe4",
        transition: exiting ? "opacity 0.9s ease, filter 0.9s ease" : "none",
        opacity: exiting ? 0 : 1,
        filter: exiting ? "blur(40px) brightness(0.3)" : "none",
        backgroundImage: "radial-gradient(1100px 820px at calc(var(--mx,0.5)*100%) calc(var(--my,0.5)*100%), rgba(217,180,90,0.08), transparent 62%), linear-gradient(180deg, #0c0c0e, #09090b 66%)",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Ambient breathing glow behind the content. */}
      <div
        className="splash-glow"
        aria-hidden
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "42rem",
          height: "42rem",
          maxWidth: "90vw",
          maxHeight: "90vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217,180,90,0.16), transparent 68%)",
          filter: "blur(30px)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="splash-fade" style={{ position: "fixed", top: "2rem", left: "2rem", fontSize: "0.625rem", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, opacity: 0.45, zIndex: 1 }}>
        Archive &middot; Est. 1930
      </div>
      <div className="splash-fade" style={{ position: "fixed", top: "2rem", right: "2rem", fontSize: "0.625rem", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, opacity: 0.45, zIndex: 1 }}>
        2026 &mdash; Bracket Live
      </div>

      {!loaderDone && (
        <div className="splash-fade" style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 600, color: "#d9b45a", lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
            {YEARS[yearIdx]}
          </div>
          <div style={{ width: "min(18rem,60vw)", height: 1, background: "rgba(217,180,90,0.2)", borderRadius: 1, overflow: "hidden" }}>
            <div ref={progressRef} style={{ height: "100%", background: "#d9b45a", width: reducedMotion ? "100%" : "0%", borderRadius: 1 }} />
          </div>
          <div style={{ fontSize: "0.6875rem", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 500, opacity: 0.5 }}>
            Opening the archive
          </div>
        </div>
      )}

      {loaderDone && (
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          textAlign: "center",
          padding: "0 1.5rem",
        }}>
        <div className="splash-rise" style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.625rem", letterSpacing: "0.26em", fontWeight: 600, opacity: 0.5, whiteSpace: "nowrap" }}>
          <span className="splash-line" style={{ flex: 1, height: 1, background: "#d9b45a", opacity: 0.25, minWidth: "1.5rem", animationDelay: "0.15s" }} />
          FIFA WORLD CUP KNOCKOUT ARCHIVE
          <span className="splash-line" style={{ flex: 1, height: 1, background: "#d9b45a", opacity: 0.25, minWidth: "1.5rem", animationDelay: "0.15s" }} />
        </div>

        <h1 style={{ fontFamily: "Unbounded, sans-serif", fontSize: "clamp(2rem,5.5vw,3.75rem)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "0.04em", overflow: "hidden", textAlign: "center", color: "#f6c453" }}>
          {"The Road to Glory".split("").map((char, i) => (
            <Fragment key={i}>
              <span ref={(el) => { if (el) charsRef.current[i] = el; }} className="ch">
                {char === " " ? "\u00A0" : char}
              </span>
              {/* Sibling of the char spans (not nested), so on mobile the
                  width:100% break actually wraps "to Glory" to its own line. */}
              {i === 7 ? <span className="ch-br" /> : null}
            </Fragment>
          ))}</h1>

        <p className="splash-rise" style={{ maxWidth: "36rem", fontSize: "0.9375rem", lineHeight: 1.6, opacity: 0.55, animationDelay: "0.9s" }}>
          Every knockout bracket since 1930, drawn as a single radial map from the first round of sixteen to the final whistle.
        </p>

        <button
          onClick={() => onEnter()}
          className="splash-cta splash-rise"
          style={{
            animationDelay: "1.05s",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "0.5rem",
            padding: "0.75rem 2rem",
            border: "1px solid rgba(217,180,90,0.2)",
            borderRadius: "9999px",
            fontFamily: "Unbounded, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            cursor: "pointer",
            background: "transparent",
            outline: "none",
          }}
        >
          ENTER THE ARCHIVE
          <span style={{ display: "inline-block" }}>
            <svg width="14" height="11" viewBox="0 0 18.5 14.8"><path d="M10.7 14.8c.24 0 .44-.09.64-.27l6.5-6.48c.19-.19.29-.41.29-.66 0-.24-.1-.47-.29-.65L11.37.29A.85.85 0 0010.71 0a.83.83 0 00-.85.84c0 .23.08.46.24.61l2.18 2.23 4.08 3.72-4.08 3.72-2.18 2.23a.85.85 0 00-.24.61.83.83 0 00.85.84zM.86 8.27h12.35l3.15-.2c.4-.02.67-.27.67-.67 0-.4-.27-.64-.67-.67l-3.15-.2H.86A.8.8 0 000 7.4c0 .51.35.87.86.87z" fill="currentColor" opacity=".85" /></svg>
          </span>
        </button>
      </div>
      )}

      <div className="splash-fade" style={{
        position: "fixed",
        bottom: "1.75rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "0.875rem",
        fontSize: "0.625rem",
        letterSpacing: "0.18em",
        fontWeight: 500,
        maxWidth: "90vw",
        overflowX: "auto",
        whiteSpace: "nowrap",
        padding: "0 1rem",
        zIndex: 1,
      }}>
        {YEARS.map((y) => (
          <span key={y} style={{ color: y === 2026 ? "#d9b45a" : "#f3efe4", opacity: y === 2026 ? 1 : 0.28 }}>
            {y === 2026 && (
              <span className="pd" style={{ width: 5, height: 5, borderRadius: "50%", background: "#d9b45a", display: "inline-block", marginRight: "0.375rem", verticalAlign: "middle" }} />
            )}
            {y}
          </span>
        ))}
      </div>

      <button
        onClick={() => onEnter()}
        style={{
          position: "fixed",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.625rem",
          letterSpacing: "0.18em",
          color: "#f3efe4",
          opacity: loaderDone ? 0.2 : 0,
          cursor: "pointer",
          background: "none",
          border: "none",
          fontFamily: "Inter, sans-serif",
          pointerEvents: loaderDone ? "auto" : "none",
        }}
      >
        Skip
      </button>
    </div>
  );
}
