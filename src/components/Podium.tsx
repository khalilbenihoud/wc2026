import { getTeamName, getTeamFlag } from "../data";
import { countryPath, COUNTRY_PAGE_ENABLED } from "../router";

// Final standings, top four. Any slot may be null while a tournament is still
// in progress (e.g. the medal matches decided but the final not yet played).
export interface PodiumProps {
  champion: string | null;
  runnerUp: string | null;
  third: string | null;
  fourth: string | null;
  onNavigate: (path: string) => void;
}

type Metal = "gold" | "silver" | "bronze" | "steel";

interface Position {
  rank: 1 | 2 | 3 | 4;
  label: string;
  medal: Metal;
  code: string | null;
}

// The metal is the one accent this section spends its boldness on. color-mix
// keeps the tints theme-aware (dark + light) off a single token each.
const METAL_VAR: Record<Metal, string> = {
  gold: "var(--color-medal-gold)",
  silver: "var(--color-medal-silver)",
  bronze: "var(--color-medal-bronze)",
  steel: "var(--color-brand-muted)",
};
const tint = (metal: Metal, pct: number) =>
  `color-mix(in srgb, ${METAL_VAR[metal]} ${pct}%, transparent)`;

export default function Podium({ champion, runnerUp, third, fourth, onNavigate }: PodiumProps) {
  const positions: Position[] = [
    { rank: 1, label: "Champion", medal: "gold", code: champion },
    { rank: 2, label: "Runner-up", medal: "silver", code: runnerUp },
    { rank: 3, label: "Third place", medal: "bronze", code: third },
    { rank: 4, label: "Fourth place", medal: "steel", code: fourth },
  ];

  return (
    <div className="space-y-2">
      {positions.map((pos) => {
        const isChampion = pos.rank === 1;
        const clickable = !!pos.code && COUNTRY_PAGE_ENABLED;

        const row = (
          <div className="flex items-center gap-3.5">
            {/* Metal rank chip — the section's single accent. */}
            <span
              className="w-8 h-8 shrink-0 rounded-lg grid place-items-center font-unbounded font-bold text-sm"
              style={{
                color: METAL_VAR[pos.medal],
                background: tint(pos.medal, 12),
                border: `1px solid ${tint(pos.medal, 38)}`,
              }}
            >
              {pos.rank}
            </span>
            <span className="text-lg leading-none shrink-0">
              {pos.code ? getTeamFlag(pos.code) : "🏳️"}
            </span>
            <div className="min-w-0 flex-1">
              <span
                className={`block truncate text-sm ${
                  pos.code
                    ? isChampion
                      ? "font-bold text-brand-gold"
                      : "font-semibold text-brand-text"
                    : "font-semibold text-brand-muted"
                }`}
              >
                {pos.code ? getTeamName(pos.code) : "TBD"}
              </span>
              <span className="font-mono text-[10px] tracking-wider uppercase text-brand-muted">
                {pos.label}
              </span>
            </div>
          </div>
        );

        const base = "block w-full px-4 py-3 rounded-xl bg-brand-panel/40 border border-brand-line/40";
        return clickable ? (
          <button
            key={pos.rank}
            onClick={() => onNavigate(countryPath(pos.code!))}
            className={`${base} text-left hover:border-brand-gold/40 hover:bg-brand-gold/[0.06] transition-colors cursor-pointer`}
            aria-label={`${pos.label}: ${getTeamName(pos.code!)} — view country page`}
          >
            {row}
          </button>
        ) : (
          <div key={pos.rank} className={base}>
            {row}
          </div>
        );
      })}
    </div>
  );
}
