import { getTeamFlag } from "../data";

interface Props {
  year: number;
  champCode: string | null;
  champName: string;
  score?: string | null;
  onNavigate: () => void;
}

export default function HeroCard({ year, champCode, champName, score, onNavigate }: Props) {
  // Upcoming / undecided edition.
  if (champCode === null) {
    return (
      <button
        onClick={onNavigate}
        aria-label={`View ${year} World Cup`}
        className="relative w-full overflow-hidden rounded-2xl border border-brand-gold/30 bg-gradient-to-b from-brand-gold/[0.06] to-transparent px-5 py-8 text-center cursor-pointer active:scale-[0.98]"
      >
        <span className="block mb-2 text-3xl">🔮</span>
        <div className="font-unbounded font-bold text-xl text-brand-text mb-1.5 tracking-tight">{year} World Cup</div>
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-muted">Upcoming</span>
      </button>
    );
  }

  const flag = getTeamFlag(champCode);

  // Tifo — an oversized crowd banner draped across the stand: the giant
  // CHAMPIONS word (real Unbounded, sized in container units so it stays one
  // line and fills the width) with the champion unveiled on the fold below.
  return (
    <button
      onClick={onNavigate}
      aria-label={`View ${year} World Cup results — ${champName} champions`}
      className="group relative w-full overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-bg min-h-[210px] flex flex-col justify-end transition-colors hover:border-brand-gold/50 cursor-pointer active:scale-[0.98] [container-type:inline-size]"
    >
      <div
        aria-hidden
        className="absolute top-7 inset-x-0 text-center font-unbounded font-semibold text-[12.5cqw] leading-none tracking-[-0.04em] whitespace-nowrap select-none pointer-events-none bg-clip-text text-transparent bg-gradient-to-b from-brand-gold/20 to-brand-gold/[0.02]"
      >
        CHAMPIONS
      </div>
      <div className="relative bg-gradient-to-b from-transparent via-[#161310] to-[#161310] px-5 pt-12 pb-5 shadow-[inset_0_22px_30px_-20px_rgba(0,0,0,0.95)]">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl leading-none">{flag}</span>
          <span className="font-unbounded font-bold text-3xl text-brand-text tracking-tight">{champName}</span>
        </div>
        <div className="mt-2.5 text-center font-mono text-[10px] tracking-[0.3em] uppercase text-brand-gold-hi">
          {year} World Champions{score && <span className="text-brand-muted"> · {score}</span>}
        </div>
      </div>
    </button>
  );
}
