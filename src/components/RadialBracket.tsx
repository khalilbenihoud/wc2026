import React, { useId } from "react";
import { TournamentData, TournamentAnalysis } from "../types";
import { getTeamColor, getTeamFlag, getTeamName } from "../data";

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
  light?: boolean;
}

const CX = 450;
const CY = 450;
const R = [368, 288, 202, 120];
const TROPHY_R = 60;
const CLEAR: Record<number, number> = { 0: 31, 1: 19, 2: 22, 3: 26 };

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

const INTRO_BASE = 0.34;
const RING_STEP = 0.12;
const introDelay = (level: number, idx: number, count: number) => {
  return f2(
    INTRO_BASE + (3 - level) * RING_STEP + (idx / Math.max(count, 1)) * 0.05
  );
};

export default function RadialBracket({
  data,
  analysis,
  onSelectMatch,
  hoveredLeaf,
  setHoveredLeaf,
  onShowTooltip,
  light = false,
}: RadialBracketProps) {
  const bracketId = useId();
  const champCode =
    analysis.champ !== null ? data.teams[analysis.champ] : null;
  const champColor = champCode ? getTeamColor(champCode) : null;

  // Helper to determine advancing team on a connector
  const getConnTeam = (lvl: number, idx: number): string | null => {
    if (!analysis.w1 || !analysis.w1.length) return null;
    if (lvl === 0) return analysis.w1[idx >> 1] === idx ? data.teams[idx] : null;
    if (lvl === 1) {
      const t = analysis.w1[idx];
      return analysis.w2[idx >> 1] === t ? data.teams[t] : null;
    }
    if (lvl === 2) {
      const t = analysis.w2[idx];
      return analysis.w3[idx >> 1] === t ? data.teams[t] : null;
    }
    if (lvl === 3) {
      const t = analysis.w3[idx];
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

  const { conns: litConns, nodes: litNodes } = getLitElements();
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

    const winArr: Record<number, number[] | null> = {
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
        const winLeaf = winners ? winners[i] : null;
        const dl = introDelay(lvl, i, count);

        const nodeId = `n${lvl}-${i}`;
        const isLit = litNodes.has(nodeId);
        const isDim = hasFocus && !isLit;

        let className = "crest junc";
        if (winLeaf === null) className += " empty";
        if (isLit) className += " lit";
        if (isDim) className += " dim";

        const teamCode = winLeaf !== null ? data.teams[winLeaf] : null;
        const teamColor = teamCode ? getTeamColor(teamCode) : undefined;

        const isEmpty = winLeaf == null;
        const qMarkSize: Record<number, number> = { 1: 11, 2: 13, 3: 15 };

        elements.push(
          <g
            key={nodeId}
            id={nodeId}
            className={className}
            onClick={() => onSelectMatch(round, i)}
            onMouseEnter={() => {
              if (winLeaf !== null) setHoveredLeaf(winLeaf);
            }}
            onMouseMove={(e) => handleMouseMove(e, round, i)}
            onMouseLeave={handleMouseLeave}
            style={
              {
                "--c": teamColor,
                "--d": `${dl}s`,
                transformOrigin: `${f2(x)}px ${f2(y)}px`,
              } as React.CSSProperties
            }
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
              <text
                x={f2(x)}
                y={f2(y + 1)}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--steel)"
                fontWeight="700"
                style={{ fontSize: `${qMarkSize[lvl]}px`, fontFamily: "inherit" }}
                className="select-none"
              >
                ?
              </text>
            )}
            <circle
              className="hit fill-transparent cursor-pointer"
              cx={f2(x)}
              cy={f2(y)}
              r={disc[lvl] + 6}
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
      const [lx, ly] = polar(R[0] - 38, ang);
      const isChamp = analysis.champ === i;
      const dl = introDelay(0, i, 16);

      const nodeId = `n0-${i}`;
      const isLit = litNodes.has(nodeId);
      const isDim = hasFocus && !isLit;

      let className = "crest";
      if (isLit) className += " lit";
      if (isDim) className += " dim";

      return (
        <g
          key={nodeId}
          id={nodeId}
          className={className}
          onClick={() => onSelectMatch("r16", i >> 1)}
          onMouseEnter={() => setHoveredLeaf(i)}
          onMouseMove={(e) => handleMouseMove(e, "r16", i >> 1)}
          onMouseLeave={handleMouseLeave}
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
          <text className="flag font-sans select-none" x={f2(x)} y={f2(y + 1)}>
            {getTeamFlag(code)}
          </text>
          <text
            className="code font-unbounded select-none"
            x={f2(lx)}
            y={f2(ly + 4)}
          >
            {code}
          </text>
          <circle
            className="hit fill-transparent cursor-pointer"
            cx={f2(x)}
            cy={f2(y)}
            r="34"
          />
        </g>
      );
    });
  };

  // 6. Central Trophy Medallion
  const renderMedallionComponent = () => {
    const champCode =
      analysis.champ !== null ? data.teams[analysis.champ] : null;
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
        onClick={() => onSelectMatch("final", 0)}
        onMouseEnter={() => {
          if (analysis.champ !== null) setHoveredLeaf(analysis.champ);
        }}
        onMouseMove={(e) => handleMouseMove(e, "final", 0)}
        onMouseLeave={handleMouseLeave}
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
            y={CY + 48}
            style={{ fontSize: "15px", fill: "#71717a" }}
          >
            TBD
          </text>
        )}

        <text className="champ-year select-none font-mono" x={CX} y={CY + 64}>
          {data._year}
        </text>
      </g>
    );
  };

  return (
    <svg
      id="bracket"
      viewBox="0 0 900 900"
      className="w-full h-full block overflow-visible select-none relative z-10"
      role="img"
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
          <stop offset="0" stopColor={light ? "#e8e5e0" : "#27272a"} />
          <stop offset="1" stopColor={light ? "#f8f7f4" : "#09090b"} />
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
    </svg>
  );
}
