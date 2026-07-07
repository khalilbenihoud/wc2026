import { getTeamName } from "../data";

// ── Goal parsing ──────────────────────────────────────────────────────────
// Split a raw goal string like "Zinedine Zidane 90'+2' (pen.)" into parts so we
// can lay it out (name / minute / pen·og tag) instead of a flat line.
interface ParsedGoal {
  name: string;
  minute: string; // display label, e.g. "90'+2'"
  sort: number; // for chronological ordering
  tag: string | null; // "PEN" | "OG" | null
  side: 0 | 1; // 0 = home team, 1 = away
}

function goalTagLabel(raw: string | null): string | null {
  if (!raw) return null;
  const low = raw.toLowerCase();
  if (low.includes("pen")) return "PEN";
  if (low.includes("o.g") || low.includes("og")) return "OG";
  return raw.toUpperCase();
}

function parseGoal(raw: string, side: 0 | 1): ParsedGoal {
  const trimmed = raw.trim();
  const tagMatch = trimmed.match(/\s*\(([^)]+)\)\s*$/);
  const tag = goalTagLabel(tagMatch ? tagMatch[1] : null);
  const body = tagMatch ? trimmed.slice(0, tagMatch.index).trim() : trimmed;
  const minMatch = body.match(/(\d+)(?:\+(\d+))?'$/);
  if (!minMatch) return { name: body, minute: "", sort: 999, tag, side };
  const base = parseInt(minMatch[1], 10);
  const stoppage = minMatch[2] ? parseInt(minMatch[2], 10) : 0;
  return {
    name: body.slice(0, minMatch.index).trim(),
    minute: minMatch[0],
    sort: base + stoppage / 100,
    tag,
    side,
  };
}

const TAG_BADGE =
  "shrink-0 font-mono text-[8px] font-bold uppercase tracking-wider text-brand-gold/80 border border-brand-gold/30 rounded px-1 py-px";

interface MatchGoalsProps {
  ta: string;
  tb: string;
  goalsA: string[];
  goalsB: string[];
}

// Chronological goal timeline — a center spine with home goals on the left and
// away goals on the right, ordered by minute so the flow of the match reads
// top-to-bottom.
export default function MatchGoals({ ta, tb, goalsA, goalsB }: MatchGoalsProps) {
  const merged = [
    ...goalsA.map((g) => parseGoal(g, 0)),
    ...goalsB.map((g) => parseGoal(g, 1)),
  ].sort((x, y) => x.sort - y.sort);

  return (
    <div className="relative">
      <div className="absolute top-1 bottom-1 left-1/2 -translate-x-1/2 w-px bg-brand-line" />
      <div className="flex flex-col gap-2.5">
        {merged.map((g, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="min-w-0">
              {g.side === 0 && <GoalNameMin g={g} align="right" />}
            </div>
            <span
              className="relative z-10 w-2.5 h-2.5 rounded-full bg-brand-gold ring-4 ring-brand-panel"
              title={getTeamName(g.side === 0 ? ta : tb)}
            />
            <div className="min-w-0">
              {g.side === 1 && <GoalNameMin g={g} align="left" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalNameMin({ g, align }: { g: ParsedGoal; align: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-1.5 ${align === "right" ? "justify-end" : "justify-start"}`}>
      {align === "right" && <span className="font-mono text-[11px] font-semibold text-brand-gold tabular-nums">{g.minute}</span>}
      <span className="text-xs text-brand-text truncate">{g.name}</span>
      {g.tag && <span className={TAG_BADGE}>{g.tag}</span>}
      {align === "left" && <span className="font-mono text-[11px] font-semibold text-brand-gold tabular-nums">{g.minute}</span>}
    </div>
  );
}
