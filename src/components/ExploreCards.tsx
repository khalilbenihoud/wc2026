import { countriesPath, tournamentPath } from "../router";
import { TOURNAMENT_YEARS } from "../constants";
import { TOURNAMENTS } from "../data";

interface Props {
  onNavigate: (path: string) => void;
  onOpenChampions: () => void;
}

const cards = [
  {
    label: "Nations & Records",
    desc: "71 teams, their World Cup history, records, rivalries",
    icon: "🏆",
    href: `${countriesPath}/`,
  },
  {
    label: "Champions Wall",
    desc: "Every World Cup winner from 1930 to today",
    icon: "👑",
    action: "champions",
  },
  {
    label: "Latest Edition",
    desc: "Full bracket and results",
    icon: "⚽",
    href: (year: number) => `${tournamentPath(year)}/`,
    dynamic: true,
  },
  {
    label: "First Edition",
    desc: "Where the story began — Uruguay 1930",
    icon: "📜",
    href: `${tournamentPath(1930)}/`,
  },
] as const;

const LINK_BASE =
  "flex flex-col items-start gap-2 p-4 rounded-xl border border-brand-line/40 bg-brand-panel/30 hover:border-brand-gold/30 hover:bg-brand-panel/50 transition-all cursor-pointer active:scale-[0.98] text-left w-full";
const ICON_CLASS = "text-2xl leading-none shrink-0";
const LABEL_CLASS =
  "font-mono text-[10px] font-semibold tracking-[0.22em] uppercase text-brand-gold/90";
const DESC_CLASS =
  "text-[11px] text-brand-muted leading-relaxed";

export default function ExploreCards({ onNavigate, onOpenChampions }: Props) {
  // TOURNAMENT_YEARS is sorted newest-first; skip any upcoming (seeded) edition
  // so "Latest Edition" points at the most recent one with real results.
  const currentEdition = TOURNAMENT_YEARS.find((y) => !TOURNAMENTS[y].seeded) ?? TOURNAMENT_YEARS[0];

  return (
    <div className="flex-none w-full max-w-[1100px] pt-2 pb-2 max-md:px-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[9px] font-semibold tracking-[0.28em] uppercase text-brand-muted/60">
          Explore
        </span>
        <span className="flex-1 h-px bg-gradient-to-r from-brand-line to-transparent" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {cards.map((card) => {
          const href =
            "href" in card
              ? typeof card.href === "function"
                ? card.href(currentEdition)
                : card.href
              : null;

          if (!href && "action" in card && card.action === "champions") {
            return (
              <button key="champions" onClick={onOpenChampions} className={LINK_BASE}>
                <span className={ICON_CLASS}>{card.icon}</span>
                <span className={LABEL_CLASS}>{card.label}</span>
                <span className={DESC_CLASS}>{card.desc}</span>
              </button>
            );
          }

          if (!href) return null;

          return (
            <a
              key={card.label}
              href={href}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                onNavigate(href);
              }}
              className={LINK_BASE}
            >
              <span className={ICON_CLASS}>{card.icon}</span>
              <span className={LABEL_CLASS}>{card.label}</span>
              <span className={DESC_CLASS}>{card.desc}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
