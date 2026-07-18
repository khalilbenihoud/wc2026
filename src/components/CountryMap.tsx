import { useEffect, useState } from "react";
import { loadCountryMap, type CountryMap as CountryMapData } from "../countryMaps";

// Total time to draw the whole country, split across its regions by size and
// traced one after another (largest first) — so a many-island nation still
// finishes in the same span, its mainland taking the lion's share of the time.
const TOTAL_MS = 20500;

// Strokes a country's outline with a slow glowing gold draw-in while an engraved
// diagonal hatch fill fades in behind the trace (see .country-map-path + the
// drawInHatch keyframe in index.css). The outline is lazy-loaded per country, so
// nothing renders until its map chunk resolves (or if we have no map for it).
export default function CountryMap({ code, className }: { code: string; className?: string }) {
  const [map, setMap] = useState<CountryMapData | null>(null);
  useEffect(() => {
    let alive = true;
    setMap(null);
    loadCountryMap(code).then((m) => { if (alive) setMap(m); });
    return () => { alive = false; };
  }, [code]);
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
      <defs>
        <pattern
          id={`map-hatch-${code}`}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="8" stroke="var(--color-brand-gold)" strokeWidth="1.1" strokeOpacity="0.5" />
        </pattern>
      </defs>
      <g transform={map.transform}>
        {map.paths.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength={100}
            className="country-map-path"
            // fill must be set inline (not as an attribute): the CSS rule
            // `.country-map-path { fill: none }` would otherwise win over it.
            style={{
              fill: `url(#map-hatch-${code})`,
              animationName: "drawInHatch",
              animationDuration: `${timings[i].duration}ms`,
              animationDelay: `${timings[i].delay}ms`,
              animationTimingFunction: "ease-in-out",
              animationFillMode: "both",
            }}
          />
        ))}
      </g>
    </svg>
  );
}
