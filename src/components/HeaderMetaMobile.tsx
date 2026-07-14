import { ReactNode } from "react";
import PlayerAvatar from "./PlayerAvatar";
import { HeaderMetaProps, GLOVE_SINCE } from "./HeaderMeta";

// Mobile / narrow counterpart of HeaderMeta — the same inline-ledger layout
// re-flowed into a single narrow column: quote on top, facts as borderless rows
// with hairline separators.
type Props = Omit<HeaderMetaProps, "editionsCount"> & {
  // "New" mobile design: compact stat tiles that hide not-yet-awarded (TBD)
  // rows, so an in-progress tournament doesn't waste the first screen.
  v2?: boolean;
};

const LBL = "font-mono text-[9.5px] uppercase tracking-[0.22em] text-brand-muted font-semibold";
const ROW = "flex items-center justify-between py-2.5 [&:not(:first-child)]:border-t border-brand-line/60";
const VAL = "flex items-center gap-1.5 font-bold text-[13px]";

export default function HeaderMetaMobile({
  year, host, hostFlag, quote, champFlag, champName,
  gbName, gbGoals, gbPhoto, ggName, ggPhoto, v2,
}: Props) {
  if (v2) {
    const hasGlove = !!ggName && year >= GLOVE_SINCE;
    return (
      <div className="md:hidden mb-1">
        {quote && <p className="font-serif italic text-[13px] text-brand-text text-center mb-2.5 leading-snug">{quote}</p>}
        <div className="grid grid-cols-2 gap-1.5">
          <Tile span2 label="Host" value={<>{hostFlag} {host}</>} />
          <Tile span2 label="Champion" gold value={champName ? <>{champFlag} {champName}</> : "TBD"} />
          {/* Awards only appear once handed out — no dead "TBD" rows mid-tournament. */}
          {gbName && (
            <Tile
              span2={!hasGlove}
              label="Golden Boot"
              value={<><PlayerAvatar photo={gbPhoto} name={gbName} className="w-5 h-5 text-[9px]" />{gbName} · {gbGoals}</>}
            />
          )}
          {hasGlove && (
            <Tile
              label="Golden Glove"
              value={<><PlayerAvatar photo={ggPhoto} name={ggName!} className="w-5 h-5 text-[9px]" />{ggName}</>}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="md:hidden mb-2">
      {quote && <p className="font-serif italic text-[13px] text-brand-text text-center mb-2 leading-snug">{quote}</p>}
      <div className="px-1">
        <div className={ROW}><span className={LBL}>Host</span><span className={VAL}>{hostFlag} {host}</span></div>
        <div className={ROW}><span className={LBL}>Champion</span><span className={`${VAL} text-brand-gold`}>{champName ? `${champFlag} ${champName}` : "TBD"}</span></div>
        <div className={ROW}><span className={LBL}>Golden Boot</span><span className={VAL}>{gbName ? (<><PlayerAvatar photo={gbPhoto} name={gbName} className="w-5 h-5 text-[9px]" />{gbName} · {gbGoals}</>) : "TBD"}</span></div>
        {year >= GLOVE_SINCE && <div className={ROW}><span className={LBL}>Golden Glove</span><span className={VAL}>{ggName ? (<><PlayerAvatar photo={ggPhoto} name={ggName} className="w-5 h-5 text-[9px]" />{ggName}</>) : "TBD"}</span></div>}
      </div>
    </div>
  );
}

// Compact stat card used by the "New" mobile header.
function Tile({ label, value, gold, span2 }: { label: string; value: ReactNode; gold?: boolean; span2?: boolean }) {
  return (
    <div className={`rounded-lg border border-brand-line/40 bg-brand-panel/30 px-3 py-2 ${span2 ? "col-span-2" : ""}`}>
      <div className={LBL}>{label}</div>
      <div className={`mt-1 flex items-center gap-1.5 font-bold text-[13px] leading-tight ${gold ? "text-brand-gold" : "text-brand-text"}`}>
        {value}
      </div>
    </div>
  );
}
