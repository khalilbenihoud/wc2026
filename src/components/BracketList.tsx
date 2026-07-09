import { useMemo, useState, useEffect } from "react";
import { TournamentData, TournamentAnalysis } from "../types";
import { getTeamFlag, getTeamName } from "../data";
import { ROUND_NAME, resolveCompetitors, getMatchNotes } from "../constants";

interface Props {
  data: TournamentData & { _year: number };
  analysis: TournamentAnalysis;
  onSelectMatch: (round: string, idx: number) => void;
}

const ROUND_KEYS = ["r32", "r16", "qf", "sf", "final"] as const;

export default function BracketList({ data, analysis, onSelectMatch }: Props) {
  const rounds = useMemo(() => {
    const result: { key: string; label: string; matches: { idx: number; ta: string; tb: string }[] }[] = [];

    for (const key of ROUND_KEYS) {
      const matches = data[key as keyof TournamentData] as unknown as
        | { ta?: string; tb?: string; s?: [number, number] | null; w?: number | null; p?: string | null; x?: string | null }[]
        | null
        | undefined;

      if (!matches) continue;

      const items: { idx: number; ta: string; tb: string }[] = [];

      if (key === "r32") {
        for (let i = 0; i < matches.length; i++) {
          const m = matches[i] as { ta: string; tb: string; s?: [number, number] | null; w?: number | null; p?: string | null; x?: string | null } | null;
          if (!m) continue;
          items.push({ idx: i, ta: m.ta, tb: m.tb });
        }
      } else {
        for (let i = 0; i < matches.length; i++) {
          const [ta, tb] = resolveCompetitors(data, analysis, key, i);
          items.push({ idx: i, ta, tb });
        }
      }

      if (items.length > 0) {
        result.push({ key, label: ROUND_NAME[key], matches: items });
      }
    }

    return result;
  }, [data, analysis]);

  const [activeRound, setActiveRound] = useState<string | null>(null);

  useEffect(() => {
    setActiveRound(rounds.length > 0 ? rounds[0].key : null);
  }, [rounds]);

  const current = rounds.find((r) => r.key === activeRound);

  return (
    <div className="w-full h-full min-h-0 flex flex-col pb-24">
      {/* Segmented control */}
      {rounds.length > 1 && (
        <div className="flex-none px-4 pt-3 pb-3 overflow-x-auto">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-brand-panel border border-brand-line/60 w-fit mx-auto">
            {rounds.map((r) => (
              <button
                key={r.key}
                onClick={() => setActiveRound(r.key)}
                className={`px-2.5 py-1 text-[9px] font-mono tracking-wider uppercase rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeRound === r.key
                    ? "bg-brand-gold text-brand-bg font-bold shadow-sm"
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Matches for the active round */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4">
        {current && (
          <div className="space-y-2 pb-6">
            {current.matches.map((m, i) => {
              const matchData = data[current.key as "r16" | "qf" | "sf" | "final"]?.[m.idx];
              const played = matchData?.s != null;
              const score = played ? `${matchData!.s[0]}–${matchData!.s[1]}` : "vs";
              const notes = getMatchNotes(matchData);

              return (
                <button
                  key={`${current.key}-${m.idx}`}
                  onClick={() => onSelectMatch(current.key, m.idx)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-brand-panel/40 border border-brand-line/40 hover:border-brand-gold/30 hover:bg-brand-panel/60 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-[1.2]">
                      <span className="text-sm leading-none shrink-0">{getTeamFlag(m.ta)}</span>
                      <span className="text-xs font-semibold truncate">{getTeamName(m.ta)}</span>
                    </div>
                    <div className="flex flex-col items-center shrink-0">
                      <span className="font-unbounded text-xs tracking-wide text-brand-gold font-bold">
                        {score}
                      </span>
                      {notes.length > 0 && (
                        <span className="font-mono text-[8px] tracking-wider uppercase text-brand-muted/70 leading-none mt-0.5">
                          {notes.map((n) => n).join(" ")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 min-w-0 flex-[1.2] justify-end">
                      <span className="text-xs font-semibold truncate">{getTeamName(m.tb)}</span>
                      <span className="text-sm leading-none shrink-0">{getTeamFlag(m.tb)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
