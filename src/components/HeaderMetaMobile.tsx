import PlayerAvatar from "./PlayerAvatar";
import { HeaderMetaProps, GLOVE_SINCE } from "./HeaderMeta";

// Mobile / narrow counterpart of HeaderMeta — the same inline-ledger layout
// re-flowed into a single narrow column: quote on top, facts as borderless rows
// with hairline separators.
type Props = Omit<HeaderMetaProps, "editionsCount">;

const LBL = "font-mono text-[9.5px] uppercase tracking-[0.22em] text-brand-muted font-semibold";
const ROW = "flex items-center justify-between py-2.5 [&:not(:first-child)]:border-t border-brand-line/60";
const VAL = "flex items-center gap-1.5 font-bold text-[13px]";

export default function HeaderMetaMobile({
  year, host, hostFlag, quote, champFlag, champName,
  gbName, gbGoals, gbPhoto, ggName, ggPhoto,
}: Props) {
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
