import PlayerAvatar from "./PlayerAvatar";
import AppLink from "./AppLink";

export interface HeaderMetaProps {
  year: number;
  host: string;
  hostFlag: string;
  quote: string | null;
  champFlag: string | null;
  champName: string | null;
  gbName?: string;
  gbGoals?: number;
  gbPhoto: string | null;
  ggName?: string;
  ggPhoto: string | null;
  editionsCount: number;
  resultsHref?: string;
  onNavigate?: (href: string) => void;
}

const EYEBROW = "font-mono text-[11px] uppercase tracking-[0.3em] text-brand-muted font-semibold";
const LBL = "font-mono text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold whitespace-nowrap";
const QUOTE_FALLBACK = "The story is still being written.";

// The Golden Glove (best goalkeeper) award only exists from 1994 onward, so the
// slot is hidden entirely for earlier tournaments rather than shown as a dash.
export const GLOVE_SINCE = 1994;

// Desktop header: an inline ledger — edition + editorial quote on the left, the
// tournament's facts as one quiet hairline-separated stat line on the right.
export default function HeaderMeta({
  year, host, hostFlag, quote, champFlag, champName,
  gbName, gbGoals, gbPhoto, ggName, ggPhoto, editionsCount, resultsHref, onNavigate,
}: HeaderMetaProps) {
  const cell = "flex flex-col justify-center gap-2 px-6 [&:not(:first-child)]:border-l border-brand-line";
  return (
    <div className="flex-none w-full max-w-[1100px] mb-5 relative z-10 max-md:hidden md:animate-[riseIn_0.8s_cubic-bezier(0.2,0.7,0.2,1)_0.2s_both]">
      <div className="flex items-center justify-between gap-10 px-1 py-1">
        <div className="min-w-0">
          {resultsHref && onNavigate ? (
            <AppLink
              href={resultsHref}
              onNavigate={onNavigate}
              aria-label={`View ${year} World Cup results`}
              className={`${EYEBROW} mb-2.5 group inline-flex items-center gap-1.5 hover:text-brand-gold transition-colors cursor-pointer`}
            >
              FIFA World Cup · {year}
              <span
                aria-hidden
                className="text-brand-gold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
              >
                →
              </span>
            </AppLink>
          ) : (
            <div className={`${EYEBROW} mb-2.5`}>FIFA World Cup · {year}</div>
          )}
          <p className="font-serif italic text-xl leading-snug text-brand-text whitespace-nowrap">
            {quote ?? QUOTE_FALLBACK}
          </p>
        </div>
        <div className="flex items-stretch">
          <div className={cell}>
            <span className={LBL}>Host</span>
            <span className="font-bold text-sm uppercase tracking-wide whitespace-nowrap">{hostFlag} {host}</span>
          </div>
          <div className={cell}>
            <span className={LBL}>Champion</span>
            <span className="font-bold text-sm uppercase tracking-wide text-brand-gold whitespace-nowrap">
              {champName ? `${champFlag} ${champName}` : "TBD"}
            </span>
          </div>
          <div className={cell}>
            <span className={LBL}>Golden Boot</span>
            <span className="flex items-center gap-2 font-bold text-sm uppercase tracking-wide whitespace-nowrap">
              {gbName ? (<><PlayerAvatar photo={gbPhoto} name={gbName} className="w-6 h-6 text-xs" />{gbName} · {gbGoals}</>) : "TBD"}
            </span>
          </div>
          {year >= GLOVE_SINCE && (
            <div className={cell}>
              <span className={LBL}>Golden Glove</span>
              <span className="flex items-center gap-2 font-bold text-sm uppercase tracking-wide whitespace-nowrap">
                {ggName ? (<><PlayerAvatar photo={ggPhoto} name={ggName} className="w-6 h-6 text-xs" />{ggName}</>) : "TBD"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Secondary stat strip */}
      <div
        className="flex items-center justify-between px-1 pt-3 mt-3 font-mono text-[10px] tracking-[0.25em] uppercase text-brand-muted"
        style={{
          backgroundImage: "linear-gradient(to right, transparent, var(--line) 20%, var(--line) 80%, transparent)",
          backgroundPosition: "0 0",
          backgroundSize: "100% 1px",
          backgroundRepeat: "no-repeat",
        }}
      >
        <span>Est. 1930</span>
        <span className="text-brand-gold/80 font-semibold">{editionsCount} Editions</span>
      </div>
    </div>
  );
}
