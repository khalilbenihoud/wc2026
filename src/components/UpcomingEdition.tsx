interface Props {
  year: number;
  host: string;
  hostFlag: string;
  onExplore?: () => void;
}

const KICKER = "font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold";

// Empty state shown on the main stage for an upcoming edition (no bracket yet).
// The archive spans 1930–now, so the natural framing for 2030 is the centenary
// of the first World Cup (Uruguay, 1930).
export default function UpcomingEdition({ year, host, hostFlag, onExplore }: Props) {
  const isCentenary = year === 2030;
  return (
    <div className="flex-1 min-h-0 w-full max-w-[680px] mx-auto flex items-center justify-center p-1 max-md:overflow-hidden">
      <div className="relative w-full rounded-2xl border border-brand-line/60 bg-gradient-to-b from-brand-gold/[0.05] to-transparent px-8 py-12 text-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(246,196,83,0.10),transparent_55%)]"
        />
        <div className="relative">
          <span className="block text-4xl mb-4">🔮</span>
          <div className={`${KICKER} mb-3`}>Upcoming · Qualification underway</div>
          <h2 className="font-unbounded font-bold text-3xl md:text-4xl tracking-tight mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-brand-gold-hi via-brand-gold to-brand-gold-deep">
              {year} FIFA World Cup
            </span>
          </h2>
          <p className="text-brand-text text-lg font-medium mb-1">
            {hostFlag} {host}
          </p>
          <p className="text-brand-muted text-sm max-w-[46ch] mx-auto leading-relaxed">
            48 teams across three nations and two continents.
            {isCentenary && (
              <>
                {" "}A century after the first World Cup, the tournament returns with
                three celebratory opening matches in Uruguay 🇺🇾, Argentina 🇦🇷 and
                Paraguay 🇵🇾 — where it all began in 1930.
              </>
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <Stat label="Edition" value="24th" />
            <Stat label="Format" value="48 teams" />
            <Stat label="Kickoff" value="June 2030" />
          </div>

          {onExplore && (
            <button
              onClick={onExplore}
              className="mt-9 px-5 py-2 rounded-full border border-brand-line text-sm font-mono tracking-wider text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-colors cursor-pointer"
            >
              Explore past World Cups →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-muted">{label}</span>
      <span className="font-unbounded font-bold text-base text-brand-text">{value}</span>
    </div>
  );
}
