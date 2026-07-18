// Lazy access to the per-country SVG outlines in src/countryMaps/<CODE>.json.
// Vite turns each JSON into its own chunk, so a country page downloads only the
// one map it renders (~3 KB) instead of the ~266 KB gzip of all ~80 outlines.
export interface CountryMap {
  transform: string;
  paths: string[];
}

const loaders = import.meta.glob<{ default: CountryMap }>("./countryMaps/*.json");

// Codes that have a map — derived from the glob keys, so it's available
// synchronously (no data loaded) for "does this nation have a map?" checks.
export const COUNTRY_MAP_CODES = new Set(
  Object.keys(loaders)
    .map((path) => path.match(/\/([A-Za-z]+)\.json$/)?.[1])
    .filter((c): c is string => !!c),
);

export async function loadCountryMap(code: string): Promise<CountryMap | null> {
  const loader = loaders[`./countryMaps/${code}.json`];
  if (!loader) return null;
  return (await loader()).default;
}
