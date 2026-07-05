import React, { useId, memo, useEffect, useRef, useMemo } from "react";
import { TournamentData, TournamentAnalysis } from "../types";
import { getTeamColor, getTeamFlag, getTeamName } from "../data";
import { ROUND_NAME } from "../constants";

interface RadialBracketProps {
  data: TournamentData & { _year: number };
  analysis: TournamentAnalysis;
  onSelectMatch: (round: string, idx: number) => void;
  hoveredLeaf: number | null;
  setHoveredLeaf: (leaf: number | null) => void;
  onShowTooltip: (
    round: string,
    idx: number,
    x: number,
    y: number,
    visible: boolean
  ) => void;
}

const CX = 450;
const CY = 450;
const R = [368, 288, 202, 120];
const TROPHY_R = 60;
const CLEAR: Record<number, number> = { 0: 31, 1: 19, 2: 22, 3: 26 };
const R32_RING = 422;
const R32_SUBSPAN = 5.625; // half of the 22.5deg leaf spacing

const nodeAngle = (level: number, index: number): number => {
  const span = 1 << level;
  const centerLeaf = index * span + (span - 1) / 2;
  return centerLeaf * 22.5;
};

const polar = (r: number, angDeg: number): [number, number] => {
  const a = angDeg * (Math.PI / 180);
  return [CX + r * Math.sin(a), CY - r * Math.cos(a)];
};

const f2 = (n: number) => Math.round(n * 100) / 100;

// Keyboard equivalent of a click for SVG nodes that act as buttons.
const activateKey = (e: React.KeyboardEvent, fn: () => void) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

const INTRO_BASE = 0.34;
const RING_STEP = 0.12;
const introDelay = (level: number, idx: number, count: number) => {
  return f2(
    INTRO_BASE + (3 - level) * RING_STEP + (idx / Math.max(count, 1)) * 0.05
  );
};

function RadialBracket({
  data,
  analysis,
  onSelectMatch,
  hoveredLeaf,
  setHoveredLeaf,
  onShowTooltip,
}: RadialBracketProps) {
  const bracketId = useId();
  const champCode =
    analysis.champ !== null ? data.teams[analysis.champ] : null;
  const champColor = champCode ? getTeamColor(champCode) : null;

  // Helper to determine advancing team on a connector
  const getConnTeam = (lvl: number, idx: number): string | null => {
    if (!analysis.w1 || !analysis.w1.length) return null;
    if (lvl === 0) {
      const w = analysis.w1[idx >> 1];
      return w != null && w === idx ? data.teams[idx] : null;
    }
    if (lvl === 1) {
      const t = analysis.w1[idx];
      if (t == null) return null;
      const w = analysis.w2[idx >> 1];
      return w != null && w === t ? data.teams[t] : null;
    }
    if (lvl === 2) {
      const t = analysis.w2[idx];
      if (t == null) return null;
      const w = analysis.w3[idx >> 1];
      return w != null && w === t ? data.teams[t] : null;
    }
    if (lvl === 3) {
      const t = analysis.w3[idx];
      if (t == null) return null;
      return analysis.champ === t ? data.teams[t] : null;
    }
    return null;
  };

  // Get active path elements for highlighting
  const getLitElements = (): { conns: Set<string>; nodes: Set<string> } => {
    const conns = new Set<string>();
    const nodes = new Set<string>();

    if (hoveredLeaf !== null) {
      const adv = analysis.adv[hoveredLeaf] || 0;
      nodes.add(`n0-${hoveredLeaf}`);
      for (let k = 0; k < adv; k++) {
        conns.add(`c${k}-${hoveredLeaf >> k}`);
        nodes.add(`n${k + 1}-${hoveredLeaf >> (k + 1)}`);
      }
    }

    return { conns, nodes };
  };

  const { conns: litConns, nodes: litNodes } = useMemo(
    () => getLitElements(),
    [hoveredLeaf, analysis.adv]
  );
  const hasFocus = hoveredLeaf !== null;

  const handleMouseMove = (
    e: React.MouseEvent,
    round: string,
    idx: number
  ) => {
    onShowTooltip(round, idx, e.clientX, e.clientY, true);
  };

  const handleMouseLeave = () => {
    setHoveredLeaf(null);
    onShowTooltip("", 0, 0, 0, false);
  };

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const clear = () => {
      setHoveredLeaf(null);
      onShowTooltip("", 0, 0, 0, false);
    };
    const handleGlobalTouch = (e: TouchEvent) => {
      if (svgRef.current && !svgRef.current.contains(e.target as Node)) {
        clear();
      }
    };
    document.addEventListener("touchstart", handleGlobalTouch, { passive: true });
    return () => document.removeEventListener("touchstart", handleGlobalTouch);
  }, [setHoveredLeaf, onShowTooltip]);

  // 1. Defs, guidelines
  const goldGradId = `${bracketId}-goldgrad`;
  const medGlowId = `${bracketId}-medglow`;
  const medFaceId = `${bracketId}-medface`;
  const trophyShineId = `${bracketId}-trophyshine`;
  const trophyGlowFilterId = `${bracketId}-trophyglowfilter`;

  // 2. Render normal staples (levels 0, 1, 2)
  const renderStaplePaths = () => {
    const paths: React.ReactNode[] = [];
    for (let L = 0; L <= 2; L++) {
      const count = 16 >> L;
      for (let ci = 0; ci < count; ci++) {
        const parLevel = L + 1;
        const childEdge = R[L] - CLEAR[L];
        const parentEdge = R[parLevel] + CLEAR[parLevel];
        const Rb = (childEdge + parentEdge) / 2;
        const thC = nodeAngle(L, ci);
        const thP = nodeAngle(parLevel, ci >> 1);
        const [dx, dy] = polar(childEdge, thC);
        const [bx, by] = polar(Rb, thC);
        const [px, py] = polar(Rb, thP);
        const sweep = thP > thC ? 1 : 0;
        const tm = getConnTeam(L, ci);

        let dStr = `M ${f2(dx)} ${f2(dy)} L ${f2(bx)} ${f2(by)} A ${f2(Rb)} ${f2(Rb)} 0 0 ${sweep} ${f2(px)} ${f2(py)}`;
        if (tm) {
          const [sx, sy] = polar(parentEdge, thP);
          dStr += ` L ${f2(sx)} ${f2(sy)}`;
        }

        const dl = introDelay(L, ci, count);
        const connId = `c${L}-${ci}`;
        const isLit = litConns.has(connId);
        const isDim = hasFocus && !isLit;

        const roundMissing =
          (L === 0 && !data.r16) ||
          (L === 1 && !data.qf) ||
          (L === 2 && !data.sf);

        let className = "conn";
        if (isLit) className += " lit";
        else if (isDim) className += " dim";
        else if (tm) className += " used";
        else if (roundMissing) className += " tbd";

        paths.push(
          <path
            key={connId}
            id={connId}
            pathLength="100"
            d={dStr}
            className={className}
            style={
              {
                "--c": tm ? getTeamColor(tm) : undefined,
                "--d": `${dl}s`,
              } as React.CSSProperties
            }
          />
        );
      }
    }
    return paths;
  };

  // 3. Render final spokes (level 3)
  const renderFinalSpokes = () => {
    return [0, 1].map((ci) => {
      const ang = nodeAngle(3, ci);
      const [x1, y1] = polar(R[3] - CLEAR[3], ang);
      const [x2, y2] = polar(TROPHY_R + 3, ang);
      const tm = getConnTeam(3, ci);
      const dl = introDelay(3, ci, 2);

      const connId = `c3-${ci}`;
      const isLit = litConns.has(connId);
      const isDim = hasFocus && !isLit;

      let className = "conn";
      if (isLit) className += " lit";
      else if (isDim) className += " dim";
      else if (tm) className += " used";
      else if (!data.final) className += " tbd";

      return (
        <path
          key={connId}
          id={connId}
          pathLength="100"
          d={`M ${f2(x1)} ${f2(y1)} L ${f2(x2)} ${f2(y2)}`}
          className={className}
          style={
            {
              "--c": tm ? getTeamColor(tm) : undefined,
              "--d": `${dl}s`,
            } as React.CSSProperties
          }
        />
      );
    });
  };

  // 4. Render intermediate junctions (levels 1, 2, 3)
  const renderJunctions = () => {
    const elements: React.ReactNode[] = [];
    const disc: Record<number, number> = { 1: 17, 2: 20, 3: 24 };
    const flagF: Record<number, number> = { 1: 19, 2: 23, 3: 27 };

    const winArr: Record<number, (number | null)[] | null> = {
      1: analysis.w1,
      2: analysis.w2,
      3: analysis.w3,
    };

    for (let lvl = 1; lvl <= 3; lvl++) {
      const count = 16 >> lvl;
      const round = lvl === 1 ? "r16" : lvl === 2 ? "qf" : "sf";
      const winners = winArr[lvl];

      for (let i = 0; i < count; i++) {
        const ang = nodeAngle(lvl, i);
        const [x, y] = polar(R[lvl], ang);
        const winLeaf = winners?.[i] ?? null;
        const dl = introDelay(lvl, i, count);

        const nodeId = `n${lvl}-${i}`;
        const isLit = litNodes.has(nodeId);
        const isDim = hasFocus && !isLit;
        const isEmpty = winLeaf === null;

        let className = "crest junc";
        if (isEmpty) className += " empty";
        if (isLit) className += " lit";
        if (isDim) className += " dim";

        const teamCode = winLeaf !== null ? data.teams[winLeaf] : null;
        const teamColor = teamCode ? getTeamColor(teamCode) : undefined;
        const qMarkSize: Record<number, number> = { 1: 11, 2: 13, 3: 15 };

        const ariaLabel = teamCode
          ? `${ROUND_NAME[round]} winner ${getTeamName(teamCode)}. View match details.`
          : `${ROUND_NAME[round]} — not yet decided.`;

        elements.push(
          <g
            key={nodeId}
            id={nodeId}
            className={className}
            role="button"
            tabIndex={0}
            aria-label={ariaLabel}
            onClick={() => onSelectMatch(round, i)}
            onKeyDown={(e) => activateKey(e, () => onSelectMatch(round, i))}
            onFocus={() => {
              if (winLeaf !== null) setHoveredLeaf(winLeaf);
            }}
            onBlur={() => setHoveredLeaf(null)}
            onMouseEnter={() => {
              if (winLeaf !== null) setHoveredLeaf(winLeaf);
            }}
            onMouseMove={!isEmpty ? (e) => handleMouseMove(e, round, i) : undefined}
            onMouseLeave={handleMouseLeave}
            onTouchStart={isEmpty ? undefined : (e) => {
              e.stopPropagation();
              if (winLeaf !== null) setHoveredLeaf(winLeaf);
              const t = e.touches[0];
              onShowTooltip(round, i, t.clientX, t.clientY, true);
            }}
            style={{
              "--c": teamColor,
              "--d": `${dl}s`,
              transformOrigin: `${f2(x)}px ${f2(y)}px`,
            } as React.CSSProperties}
          >
            <circle className="disc" cx={f2(x)} cy={f2(y)} r={disc[lvl]} />
            {teamCode && (
              <text
                className="flag font-sans select-none"
                style={{ fontSize: `${flagF[lvl]}px` }}
                x={f2(x)}
                y={f2(y + 1)}
              >
                {getTeamFlag(teamCode)}
              </text>
            )}
            {isEmpty && (
              <circle
                cx={f2(x)}
                cy={f2(y)}
                r={qMarkSize[lvl] / 3}
                fill="var(--steel)"
                className="select-none"
              />
            )}
            <circle
              className="hit fill-transparent cursor-pointer"
              cx={f2(x)}
              cy={f2(y)}
              r={disc[lvl] + 14}
            />
          </g>
        );
      }
    }
    return elements;
  };

  // 5. Render outer leaves (level 0)
  const renderCrests = () => {
    return data.teams.map((code, i) => {
      const ang = nodeAngle(0, i);
      const [x, y] = polar(R[0], ang);
      const dl = introDelay(0, i, 16);

      const nodeId = `n0-${i}`;
      const isLit = litNodes.has(nodeId);
      const isDim = hasFocus && !isLit;

      const isUnknown = code === "TBD";

      let className = "crest";
      if (isUnknown) className += " junc empty";
      if (isLit) className += " lit";
      if (isDim) className += " dim";

      const ariaLabel = isUnknown
        ? "Round of 16 — team to be decided."
        : `${getTeamName(code)}, Round of 16. View match details.`;

      return (
        <g
          key={nodeId}
          id={nodeId}
          className={className}
          role="button"
          tabIndex={0}
          aria-label={ariaLabel}
          onClick={() => onSelectMatch("r16", i >> 1)}
          onKeyDown={(e) => activateKey(e, () => onSelectMatch("r16", i >> 1))}
          onFocus={() => setHoveredLeaf(i)}
          onBlur={() => setHoveredLeaf(null)}
          onMouseEnter={() => setHoveredLeaf(i)}
          onMouseMove={(e) => handleMouseMove(e, "r16", i >> 1)}
          onMouseLeave={handleMouseLeave}
          onTouchStart={(e) => {
            e.stopPropagation();
            setHoveredLeaf(i);
            const t = e.touches[0];
            onShowTooltip("r16", i >> 1, t.clientX, t.clientY, true);
          }}
          style={
            {
              "--c": getTeamColor(code),
              "--d": `${dl}s`,
              transformOrigin: `${f2(x)}px ${f2(y)}px`,
            } as React.CSSProperties
          }
        >
          <circle
            className="disc"
            cx={f2(x)}
            cy={f2(y)}
            r="28"
          />
          {isUnknown ? (
            <circle cx={f2(x)} cy={f2(y)} r={5} fill="var(--steel)" />
          ) : (
            <text className="flag font-sans select-none" x={f2(x)} y={f2(y + 1)}>
              {getTeamFlag(code)}
            </text>
          )}
          <circle
            className="hit fill-transparent cursor-pointer"
            cx={f2(x)}
            cy={f2(y)}
            r="44"
          />
        </g>
      );
    });
  };

  // 5b. Render Round-of-32 outer ring (only when data supplies one entry per leaf)
  const renderR32Ring = () => {
    if (!data.r32 || data.r32.length !== data.teams.length) return null;

    return data.r32.map((m, i) => {
      const known = !(m.ta === "TBD" && m.tb === "TBD");
      const ang = nodeAngle(0, i);
      const angA = ang - R32_SUBSPAN;
      const angB = ang + R32_SUBSPAN;
      const [ax, ay] = polar(R32_RING, angA);
      const [bx, by] = polar(R32_RING, angB);
      const [px, py] = polar(R[0] + 30, ang);
      const dl = introDelay(0, i, 16);

      const played = m.s !== null && m.w !== null;
      const wA = played && m.w === 0;
      const wB = played && m.w === 1;

      const notes: string[] = [];
      if (m.x) notes.push(m.x.trim());
      if (m.p) notes.push(`pens ${m.p.replace("-", "–")}`);
      const scoreLabel = played
        ? `${m.s![0]}–${m.s![1]}${notes.length ? ` (${notes.join(", ")})` : ""}`
        : "vs";

      const renderNode = (
        code: string,
        x: number,
        y: number,
        isWinner: boolean,
        keySuffix: string
      ) => (
        <g
          key={`r32-${i}-${keySuffix}`}
          className={`crest r32node${!known ? " empty" : ""}`}
          role={known ? "button" : undefined}
          tabIndex={known ? 0 : undefined}
          aria-label={
            known
              ? `${getTeamName(m.ta)} versus ${getTeamName(m.tb)}, Round of 32. ${scoreLabel}. View match details.`
              : undefined
          }
          onClick={known ? () => onSelectMatch("r32", i) : undefined}
          onKeyDown={known ? (e) => activateKey(e, () => onSelectMatch("r32", i)) : undefined}
            style={
              {
                "--c": known ? getTeamColor(code) : undefined,
                "--d": `${dl}s`,
                opacity: known && played && !isWinner ? 0.55 : 1,
                cursor: known ? "pointer" : "default",
                transformOrigin: `${f2(x)}px ${f2(y)}px`,
              } as React.CSSProperties
            }
        >
          <circle className="disc" cx={f2(x)} cy={f2(y)} r={20} />
          {known ? (
            <>
              <text
                className="flag font-sans select-none"
                style={{ fontSize: "19px" }}
                x={f2(x)}
                y={f2(y + 1)}
              >
                {getTeamFlag(code)}
              </text>
              <title>{`${getTeamName(m.ta)} vs ${getTeamName(m.tb)} · ${scoreLabel}`}</title>
            </>
          ) : (
            <circle cx={f2(x)} cy={f2(y)} r={5} fill="var(--steel)" className="select-none" />
          )}
        </g>
      );

      return (
        <g key={`r32grp-${i}`}>
          <path
            className={`conn r32conn${!played ? " tbd" : " used"}`}
            pathLength="100"
            d={`M ${f2(ax)} ${f2(ay)} L ${f2(px)} ${f2(py)}`}
            style={{ "--d": `${dl}s` } as React.CSSProperties}
          />
          <path
            className={`conn r32conn${!played ? " tbd" : " used"}`}
            pathLength="100"
            d={`M ${f2(bx)} ${f2(by)} L ${f2(px)} ${f2(py)}`}
            style={{ "--d": `${dl}s` } as React.CSSProperties}
          />
          {renderNode(m.ta, ax, ay, wA, "a")}
          {renderNode(m.tb, bx, by, wB, "b")}
        </g>
      );
    });
  };

  // 6. Central Trophy Medallion
  const renderMedallionComponent = () => {
    const nameStr = champCode ? getTeamName(champCode).toUpperCase() : "TBD";

    const getFontSize = (text: string): string => {
      if (text.length > 13) return "7.5px";
      if (text.length > 10) return "9px";
      if (text.length > 7) return "10.5px";
      return "12.5px";
    };

    return (
      <g
        className="medallion cursor-pointer"
        id="medallion"
        role="button"
        tabIndex={0}
        aria-label={
          champCode
            ? `Champion ${getTeamName(champCode)}. View final details.`
            : "Champion to be decided. View final details."
        }
        onClick={() => onSelectMatch("final", 0)}
        onKeyDown={(e) => activateKey(e, () => onSelectMatch("final", 0))}
        onFocus={() => {
          if (analysis.champ !== null) setHoveredLeaf(analysis.champ);
        }}
        onBlur={() => setHoveredLeaf(null)}
        onMouseEnter={() => {
          if (analysis.champ !== null) setHoveredLeaf(analysis.champ);
        }}
        onMouseMove={analysis.champ !== null ? (e) => handleMouseMove(e, "final", 0) : undefined}
        onMouseLeave={handleMouseLeave}
        onTouchStart={(e) => {
          e.stopPropagation();
          if (analysis.champ !== null) setHoveredLeaf(analysis.champ);
          const t = e.touches[0];
          onShowTooltip("final", 0, t.clientX, t.clientY, true);
        }}
        style={{ "--d": "0.24s" } as React.CSSProperties}
      >
        {/* Invisible helper circle to expand bounding box and prevent browser clipping of glow/shadow effects */}
        <circle
          cx={CX}
          cy={CY}
          r="300"
          fill="none"
          stroke="transparent"
          pointerEvents="none"
        />

        {/* PNG Trophy image */}
        <image
          href="/trophy.png"
          x={CX - 46}
          y={CY - 88}
          width="92"
          height="118"
          preserveAspectRatio="xMidYMid meet"
        />

        {champCode ? (
          <text
            className="champ-name font-unbounded select-none"
            x={CX}
            y={CY + 48}
            style={{ fontSize: getFontSize(nameStr) }}
          >
            {nameStr}
          </text>
        ) : (
          <text
            className="champ-name font-unbounded select-none text-brand-muted"
            x={CX}
            y={CY + 56}
            style={{ fontSize: "14px", fill: "var(--muted)" }}
          >
            TBD
          </text>
        )}

        <text className="champ-year select-none font-mono" x={CX} y={CY + (champCode ? 64 : 72)}>
          {data._year}
        </text>
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      id="bracket"
      viewBox="0 0 900 900"
      className="w-full h-full block overflow-visible select-none relative z-10"
      style={{ touchAction: "manipulation" }}
      role="group"
      aria-label="Radial knockout bracket"
    >
      <defs>
        <linearGradient id={goldGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9ab" />
          <stop offset="0.5" stopColor="#f6c453" />
          <stop offset="1" stopColor="#a9761f" />
        </linearGradient>
        <radialGradient id={medGlowId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={champColor || "#f6c453"} stopOpacity="0.45" />
          <stop offset="0.5" stopColor={champColor || "#f6c453"} stopOpacity="0.15" />
          <stop offset="1" stopColor={champColor || "#f6c453"} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={trophyShineId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.25" stopColor={champColor || "#f6c453"} stopOpacity="0.65" />
          <stop offset="0.6" stopColor={champColor || "#b8862f"} stopOpacity="0.2" />
          <stop offset="1" stopColor="rgba(9,9,11,0)" stopOpacity="0" />
        </radialGradient>
        <filter id={trophyGlowFilterId} x="-70%" y="-70%" width="240%" height="240%">
          {/* soft spread blur for base glow */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur1" />
          {/* tint the blur golden */}
          <feColorMatrix
            in="blur1"
            type="matrix"
            values="1.4 0.6 0   0 0.05
                    0.8 1.1 0   0 0
                    0   0   0.3 0 0
                    0   0   0   2.5 0"
            result="goldBlur"
          />
          {/* tighter sharp halo */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
          <feColorMatrix
            in="blur2"
            type="matrix"
            values="1.2 0.5 0   0 0.08
                    0.7 1.0 0   0 0.02
                    0   0   0.2 0 0
                    0   0   0   3 0"
            result="innerGlow"
          />
          <feMerge>
            <feMergeNode in="goldBlur" />
            <feMergeNode in="innerGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={medFaceId} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" style={{ stopColor: "var(--steel-dim)" }} />
          <stop offset="1" style={{ stopColor: "var(--bg)" }} />
        </radialGradient>
      </defs>

      {/* Guidelines */}
      <circle className="guide" cx={CX} cy={CY} r={R[0] + 14} />

      {/* Connector lines (underneath) */}
      {renderStaplePaths()}
      {renderFinalSpokes()}

      {/* Junction crests */}
      {renderJunctions()}

      {/* Central Trophy Medallion */}
      {renderMedallionComponent()}

      {/* Outer team crests */}
      {renderCrests()}

      {/* Round of 32 outer ring (2026 in-progress bracket) */}
      {renderR32Ring()}
    </svg>
  );
}

export default memo(RadialBracket);
