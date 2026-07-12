import { COUNTRY_MAPS } from "../countryMaps.generated";

// Total time to draw the whole country, split across its regions by size and
// traced one after another (largest first) — so a many-island nation still
// finishes in the same span, its mainland taking the lion's share of the time.
const TOTAL_MS = 20500;

// Strokes a country's outline with a slow glowing gold draw-in (see the
// .country-map-path rule + drawIn keyframe in index.css). Renders nothing for
// countries we haven't generated a map for.
export default function CountryMap({ code, className }: { code: string; className?: string }) {
  const map = COUNTRY_MAPS[code];
  if (!map) return null;

  // Weight each region by its path complexity so the mainland draws slowly and
  // small islands trace quickly; delays chain them into one continuous sequence.
  const weights = map.paths.map((d) => d.length);
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  let elapsed = 0;
  const timings = weights.map((w) => {
    const duration = (TOTAL_MS * w) / total;
    const delay = elapsed;
    elapsed += duration;
    return { duration, delay };
  });

  return (
    <svg viewBox="0 0 1024 1024" className={className} fill="none" aria-hidden focusable="false">
      <g transform={map.transform}>
        {map.paths.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength={100}
            className="country-map-path"
            style={{
              animationName: "drawIn",
              animationDuration: `${timings[i].duration}ms`,
              animationDelay: `${timings[i].delay}ms`,
              animationTimingFunction: "ease-in-out",
              animationFillMode: "forwards",
            }}
          />
        ))}
      </g>
    </svg>
  );
}
