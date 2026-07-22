import { useMemo } from "react";
import { TournamentData, TournamentAnalysis } from "../types";
import { getTeamFlag, getTeamName } from "../data";
import { ROUND_NAME, resolveCompetitors, getMatchNotes } from "../constants";

interface Props {
  data: TournamentData & { _year: number };
  analysis: TournamentAnalysis;
  onSelectMatch: (round: string, idx: number) => void;
}

const COL_W = 144;
const COL_GAP = 28;
const CARD_H = 44;
const LABEL_H = 28;
const PAD_X = 12;
const PAD_T = 8;

export default function LinearBracket({ data, analysis, onSelectMatch }: Props) {
  const layout = useMemo(() => {
    const roundKeys: string[] = [];
    if (data.r32) roundKeys.push("r32");
    if (data.r16) roundKeys.push("r16");
    if (data.qf) roundKeys.push("qf");
    if (data.sf) roundKeys.push("sf");
    if (data.final) roundKeys.push("final");

    const totalSlots = data.r16 ? 16 : 8;
    const SLOT_H = 56;
    const totalH = totalSlots * SLOT_H;

    const getCount = (key: string): number => {
      if (key === "r32") return data.r32?.length ?? 0;
      if (key === "r16") return 8;
      if (key === "qf") return 4;
      if (key === "sf") return 2;
      if (key === "final") return 1;
      return 0;
    };

    type Card = {
      idx: number;
      ta: string;
      tb: string;
      score: string;
      notes: string[];
      played: boolean;
      y: number;
    };

    const columns: { key: string; label: string; cards: Card[] }[] = [];

    for (const key of roundKeys) {
      const count = getCount(key);
      if (count === 0) continue;

      const cards: Card[] = [];
      for (let i = 0; i < count; i++) {
        let ta: string, tb: string;
        if (key === "r32" && data.r32) {
          const m = data.r32[i];
          ta = m?.ta ?? "TBD";
          tb = m?.tb ?? "TBD";
        } else {
          [ta, tb] = resolveCompetitors(data, analysis, key, i);
        }

        const matches = data[key as "r16" | "qf" | "sf" | "final"];
        const m = matches ? (key === "final" ? matches[0] : matches[i]) : null;
        const played = m?.s != null;
        const score = played ? `${m!.s[0]}–${m!.s[1]}` : "vs";
        const notes = getMatchNotes(m);

        const center = (i + 0.5) * totalH / count;
        const y = center - CARD_H / 2;

        cards.push({ idx: i, ta, tb, score, notes, played, y });
      }

      columns.push({ key, label: ROUND_NAME[key] || key, cards });
    }

    const connectors: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let ci = 0; ci < columns.length - 1; ci++) {
      const left = columns[ci];
      const right = columns[ci + 1];
      const lc = left.cards.length;
      const rc = right.cards.length;

      for (let ri = 0; ri < rc; ri++) {
        const p = right.cards[ri];
        const py = p.y + CARD_H / 2;
        const leftIdx1 = Math.floor(ri * lc / rc);
        const leftIdx2 = Math.min(Math.floor((ri + 1) * lc / rc) - 1, lc - 1);
        for (let fi = leftIdx1; fi <= leftIdx2; fi++) {
          connectors.push({
            x1: ci * (COL_W + COL_GAP) + COL_W,
            y1: left.cards[fi].y + CARD_H / 2,
            x2: (ci + 1) * (COL_W + COL_GAP),
            y2: py,
          });
        }
      }
    }

    const totalW = columns.length * COL_W + (columns.length - 1) * COL_GAP;
    const totalH_px = totalH + LABEL_H + PAD_T;

    return { columns, connectors, totalW, totalH: totalH_px };
  }, [data, analysis]);

  if (layout.columns.length === 0) return null;

  return (
    <div className="w-full h-full overflow-auto" style={{ paddingBottom: 96 }}>
      <div
        className="relative"
        style={{ width: layout.totalW + PAD_X * 2, height: layout.totalH, padding: `${PAD_T}px ${PAD_X}px 0` }}
      >
        {/* Round labels */}
        {layout.columns.map((col, ci) => (
          <div
            key={col.key}
            className="absolute font-mono text-[10px] tracking-widest uppercase text-brand-gold font-semibold text-center truncate"
            style={{
              left: ci * (COL_W + COL_GAP) + PAD_X,
              top: 0,
              width: COL_W,
              height: LABEL_H,
              lineHeight: `${LABEL_H}px`,
            }}
          >
            {col.label}
          </div>
        ))}

        {/* Cards */}
        {layout.columns.map((col, ci) =>
          col.cards.map((card) => {
            const colX = ci * (COL_W + COL_GAP) + PAD_X;
            return (
              <button
                key={`${col.key}-${card.idx}`}
                onClick={() => onSelectMatch(col.key, card.idx)}
                className="absolute w-full text-left px-2.5 py-1 rounded-lg bg-brand-panel/60 border border-brand-line/50 hover:border-brand-gold/40 transition-colors cursor-pointer flex flex-col justify-center"
                style={{
                  left: colX,
                  top: card.y + LABEL_H,
                  width: COL_W,
                  height: CARD_H,
                }}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0 flex-[1.2]">
                    <span className="fg text-sm shrink-0 leading-none">{getTeamFlag(card.ta)}</span>
                    <span className="text-[10px] truncate leading-tight">{getTeamName(card.ta)}</span>
                  </div>
                  <span className="font-unbounded text-[10px] tracking-wide text-brand-text shrink-0 px-0.5 leading-none">
                    {card.score}
                  </span>
                  <div className="flex items-center gap-1 min-w-0 flex-[1.2] justify-end">
                    <span className="text-[10px] truncate leading-tight">{getTeamName(card.tb)}</span>
                    <span className="fg text-sm shrink-0 leading-none">{getTeamFlag(card.tb)}</span>
                  </div>
                </div>
                {card.notes.length > 0 && (
                  <div className="mt-0.5 font-mono text-[9px] tracking-wider uppercase text-brand-muted text-center leading-none">
                    {card.notes.join(" · ")}
                  </div>
                )}
              </button>
            );
          })
        )}

        {/* Connectors */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
          {layout.connectors.map((c, i) => {
            const midX = (c.x1 + c.x2) / 2;
            return (
              <path
                key={i}
                d={`M ${c.x1 + PAD_X} ${c.y1 + LABEL_H} L ${midX + PAD_X} ${c.y1 + LABEL_H} L ${midX + PAD_X} ${c.y2 + LABEL_H} L ${c.x2 + PAD_X} ${c.y2 + LABEL_H}`}
                fill="none"
                stroke="var(--steel)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.35"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
