// Build-time generator: pulls simple country outline SVGs from mapsicon
// (github.com/djaiss/mapsicon, public domain) and commits their path data as one
// src/countryMaps/<CODE>.json per nation. The <CountryMap> component lazy-loads
// the outline (see src/countryMaps.ts) and strokes it with a glowing draw-in
// animation. No runtime deps or fetches.
//
//   npm run gen:country-maps
//
// Historical nations resolve to their modern outline (West Germany → Germany,
// USSR → Russia, Yugoslavia → Serbia, Czechoslovakia → Czechia, Zaire → DR Congo).

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";

// App team code → ISO 3166-1 alpha-2 (mapsicon folder). England has no separate
// outline in the set, so it borrows the UK ("gb"). Historical nations map to
// their modern successor.
const ISO2: Record<string, string> = {
  ALG: "dz", ARG: "ar", AUS: "au", AUT: "at", BEL: "be", BIH: "ba",
  BOL: "bo", BRA: "br", BUL: "bg", CAN: "ca", CHI: "cl", CIV: "ci",
  CMR: "cm", COD: "cd", COL: "co", CPV: "cv", CRC: "cr", CRO: "hr",
  CUB: "cu", CUW: "cw", CZE: "cz", DEN: "dk", ECU: "ec", EGY: "eg",
  ENG: "gb", ESP: "es", FRA: "fr", GHA: "gh", GRE: "gr", HAI: "ht",
  HON: "hn", HUN: "hu", IDN: "id", IRL: "ie", IRN: "ir", IRQ: "iq",
  ITA: "it", JOR: "jo", JPN: "jp", KOR: "kr", KSA: "sa",
  KUW: "kw", MAR: "ma", MEX: "mx", NED: "nl", NGA: "ng", NIR: "gb",
  NOR: "no", NZL: "nz", PAN: "pa", PAR: "py", PER: "pe", PLE: "ps", POL: "pl",
  POR: "pt", PRK: "kp", QAT: "qa", ROU: "ro", RSA: "za", RUS: "ru",
  SCO: "gb", SEN: "sn", SLV: "sv", SUI: "ch", SVK: "sk", SWE: "se",
  TUN: "tn", TUR: "tr", UKR: "ua", URU: "uy", USA: "us", UZB: "uz",
  WAL: "gb",
  FRG: "de", GDR: "de", GER: "de",
  TCH: "cz", URS: "ru", YUG: "rs", ZAI: "cd",
};

// All nation codes that appear in tournament data (skipping TBD).
const CODES = Object.keys(ISO2).sort();

// Extra territories to merge into a nation's map outline. The extra paths share
// the host's transform.
const EXTRA_TERRITORIES: Record<string, string[]> = {};

// Nations we render from a hand-curated local outline instead of mapsicon. MAR
// uses the simplemaps regional map dissolved into one national outline (Western
// Sahara included) — see scripts/dissolve-morocco.py / data/morocco-map.json.
const LOCAL_MAPS: Record<string, string> = {
  MAR: "morocco-map.json",
};

interface CountryMap { transform: string; paths: string[]; }

function loadLocalMap(file: string): CountryMap {
  const raw = readFileSync(resolve(process.cwd(), "scripts", "data", file), "utf8");
  return JSON.parse(raw) as CountryMap;
}

async function fetchMap(iso2: string): Promise<CountryMap> {
  const res = await fetch(`https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${iso2}/vector.svg`);
  if (!res.ok) throw new Error(`mapsicon ${res.status} for ${iso2}`);
  const svg = await res.text();
  const transform = svg.match(/transform="([^"]*)"/)?.[1] ?? "";
  const all = [...svg.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  if (all.length === 0) throw new Error(`no paths in ${iso2}`);
  // Keep the significant landmasses (largest first), dropping tiny specks — so
  // the draw isn't dominated by dozens of islets and stays a clean sequence.
  const sorted = [...all].sort((a, b) => b.length - a.length);
  const max = sorted[0].length;
  // Round coordinates to integers — the outline is scaled down 10× at render, so
  // sub-unit precision is invisible but nearly halves the committed size.
  const round = (d: string) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n))));
  const paths = sorted.filter((d) => d.length >= max * 0.08).slice(0, 5).map(round);
  return { transform, paths };
}

async function main() {
  const out: Record<string, CountryMap> = {};
  for (const code of CODES) {
    if (LOCAL_MAPS[code]) {
      out[code] = loadLocalMap(LOCAL_MAPS[code]);
      console.log(`${code}: local ${LOCAL_MAPS[code]} (${out[code].paths.length} path(s))`);
      continue;
    }
    const iso2 = ISO2[code];
    if (!iso2) { console.warn(`skip ${code}: no ISO2 mapping`); continue; }
    let map: CountryMap;
    try { map = await fetchMap(iso2); } catch (e) { console.warn(`skip ${code} (${iso2}): ${(e as Error).message}`); continue; }
    const extras = EXTRA_TERRITORIES[code];
    if (extras) {
      for (const extra of extras) {
        try {
          const em = await fetchMap(extra);
          map.paths.push(...em.paths);
          console.log(`  + ${extra} (${out[code]?.paths.length ?? map.paths.length - em.paths.length} → ${map.paths.length})`);
        } catch { console.warn(`  skip extra ${extra}: not available`); }
      }
    }
    out[code] = map;
    console.log(`${code} (${iso2}): ${map.paths.length} path(s)`);
  }

  // One JSON per nation (viewBox 0 0 1024 1024) so the app lazy-loads only the
  // map it renders. Outlines: mapsicon (public domain); Morocco from simplemaps
  // (dissolved to one outline by scripts/dissolve-morocco.py). See src/countryMaps.ts.
  const outDir = resolve(process.cwd(), "src", "countryMaps");
  mkdirSync(outDir, { recursive: true });
  for (const [code, map] of Object.entries(out)) {
    writeFileSync(resolve(outDir, `${code}.json`), JSON.stringify(map));
  }
  console.log(`\nWrote ${Object.keys(out).length} map files to ${outDir}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
