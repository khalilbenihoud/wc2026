import React, { useEffect, useState } from "react";
import { SplashProps } from "./types";

const YEARS = [1934, 1938, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026];

export default function SplashV1({ onEnter }: SplashProps) {
  const [step, setStep] = useState<"loading" | "ready" | "exiting">("loading");
  // Index into YEARS driving the loading counter + progress bar.
  const [loadIndex, setLoadIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setLoadIndex(i);
      if (++i < YEARS.length) timer = setTimeout(tick, 200);
      else timer = setTimeout(() => setStep("ready"), 200);
    };
    timer = setTimeout(tick, 200);
    return () => clearTimeout(timer);
  }, []);

  const FADE_MS = 600;
  const handleEnter = () => {
    if (step !== "ready") return;
    setStep("exiting");
    setTimeout(() => onEnter(), FADE_MS);
  };

  const isExiting = step === "exiting";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "#09090b",
      backgroundImage: `
        radial-gradient(ellipse 100% 100% at 50% 50%, rgba(9,9,11,0.4) 0%, rgba(9,9,11,0.75) 100%),
        url("/splash-bg.webp")
      `,
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "#f3efe4",
      fontFamily: "'IBM Plex Mono', monospace",
      opacity: isExiting ? 0 : 1,
      transform: isExiting ? "scale(1.04)" : "scale(1)",
      transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
      pointerEvents: isExiting ? "none" : "auto",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 50% { opacity: 0.25; } }
        .splash-ready { animation: fadeUp 0.8s ease forwards; }
        .splash-btn { transition: background 0.3s, transform 0.2s; }
        .splash-btn:hover:not(:disabled) { background: #d9b45a; transform: translateY(-2px); }
      `}</style>

      {step === "loading" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 20,
          background: "#09090b",
        }}>
          <span style={{ fontSize: 10, letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(243,239,228,0.5)" }}>
            Opening the archive
          </span>
          <span style={{
            fontFamily: "'Unbounded', sans-serif", fontWeight: 700,
            fontSize: "clamp(72px, 14vw, 168px)", lineHeight: 1, color: "#f3efe4",
          }}>
            {YEARS[loadIndex]}
          </span>
          <div style={{ width: "clamp(180px, 28vw, 320px)", height: 1, background: "rgba(243,239,228,0.18)" }}>
            <div style={{ height: "100%", width: `${((loadIndex + 1) / YEARS.length) * 100}%`, background: "linear-gradient(90deg, transparent, #d9b45a, transparent)", transition: "width 0.15s linear" }} />
          </div>
        </div>
      )}

      <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", padding: "clamp(80px, 12vh, 140px) clamp(20px, 6vw, 96px)" }}>
        <div style={{ position: "fixed", top: 24, left: 28, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(243,239,228,0.55)" }}>
          Archive · Est. 1934
        </div>
        <div style={{ position: "fixed", top: 24, right: 28, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(217,180,90,0.85)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d9b45a", boxShadow: "0 0 8px #d9b45a", animation: "pulse 1.4s ease-in-out infinite", display: "inline-block" }} />
          2026 — Bracket Live
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }} className={step === "ready" ? "splash-ready" : ""}>
          {/* <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 10, letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(243,239,228,0.5)", marginBottom: 28 }}>
            <span style={{ width: 48, height: 1, background: "rgba(217,180,90,0.2)" }} />
            ELEVEN TOURNAMENTS · ONE RADIAL MAP
            <span style={{ width: 48, height: 1, background: "rgba(217,180,90,0.2)" }} />
          </div> */}

          <h1 style={{
            fontFamily: "'Unbounded', sans-serif", fontWeight: 700,
            fontSize: "clamp(54px, 10.5vw, 140px)", lineHeight: 0.95,
            letterSpacing: "-0.02em", margin: "0 0 26px",
            background: "linear-gradient(180deg, #ffdf8e 0%, #f6c453 50%, #b8862f 100%)",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            The Road to Glory
          </h1>

          <p style={{ fontSize: "clamp(12px, 1.1vw, 14px)", lineHeight: 1.7, color: "rgba(243,239,228,0.5)", margin: "0 0 40px" }}>
            Every World Cup knockout bracket since 1934, mapped from the first whistle to the final
          </p>

          <button
            onClick={handleEnter}
            disabled={step !== "ready"}
            className="splash-btn"
            style={{
              fontFamily: "'Unbounded', sans-serif", fontWeight: 600,
              fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase",
              color: "#09090b", background: "#f3efe4", border: "none",
              padding: "16px 40px", width: 400, cursor: step === "ready" ? "pointer" : "default",
              opacity: step === "ready" ? 1 : 0,
              transition: "opacity 0.5s ease 0.3s, background 0.3s, transform 0.2s",
            }}
          >
            ENTER THE ARCHIVE →
          </button>
        </div>

        <div style={{
          position: "fixed", left: 0, right: 0, bottom: 0,
          padding: "18px clamp(20px, 6vw, 96px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase",
          color: "rgba(243,239,228,0.45)", borderTop: "1px solid rgba(243,239,228,0.15)",
        }}>
          <div style={{ display: "flex", gap: 18 }}>
            {YEARS.map((y) => (
              <span key={y} style={{ color: y === 2026 ? "#d9b45a" : "inherit" }}>{y}</span>
            ))}
          </div>
          <span>{YEARS.length} Tournaments · 1934 — 2026</span>
        </div>
      </div>
    </div>
  );
}
