// One-off audit: cross-check the DERIVED country-profile fields (timeline,
// bestResult, appearances, firstAppearance) against known ground truth, to find
// where the bracket-derived data disagrees with reality. Not part of the build.
import { generateCountryProfiles } from "../src/countries.generated";
import { MOCK_COUNTRIES } from "../src/countries.mock";

const profiles = { ...generateCountryProfiles(), ...MOCK_COUNTRIES };
const P = (c: string) => profiles[c];

// ── Ground truth ─────────────────────────────────────────────────────────────
const CHAMPIONS: Record<number, string> = {
  1930: "URU", 1934: "ITA", 1938: "ITA", 1950: "URU", 1954: "FRG", 1958: "BRA",
  1962: "BRA", 1966: "ENG", 1970: "BRA", 1974: "FRG", 1978: "ARG", 1982: "ITA",
  1986: "ARG", 1990: "FRG", 1994: "BRA", 1998: "FRA", 2002: "BRA", 2006: "ITA",
  2010: "ESP", 2014: "GER", 2018: "FRA", 2022: "ARG",
};
const RUNNERS_UP: Record<number, string> = {
  1930: "ARG", 1934: "TCH", 1938: "HUN", 1950: "BRA", 1954: "HUN", 1958: "SWE",
  1962: "TCH", 1966: "FRG", 1970: "ITA", 1974: "NED", 1978: "NED", 1982: "FRG",
  1986: "FRG", 1990: "ARG", 1994: "ITA", 1998: "BRA", 2002: "GER", 2006: "FRA",
  2010: "NED", 2014: "ARG", 2018: "CRO", 2022: "FRA",
};
// Real total World Cup appearances through 2022 (well-known nations).
const REAL_APPEARANCES: Record<string, number> = {
  BRA: 22, GER: 20, ITA: 18, ARG: 18, MEX: 17, ENG: 16, ESP: 16, FRA: 16,
  URU: 14, USA: 11, NED: 11, SUI: 12, KOR: 11, BEL: 14, SWE: 12,
};

const findings: string[] = [];

// 1) Champions: winner's timeline must be "W" that year, and titles must include it.
for (const [yr, code] of Object.entries(CHAMPIONS)) {
  const year = Number(yr);
  const p = P(code);
  if (!p) { findings.push(`CHAMPION ${year}: profile ${code} missing`); continue; }
  const t = p.timeline[year];
  if (!t || t.result !== "W")
    findings.push(`CHAMPION ${year} ${code}: timeline shows "${t?.result ?? "—"}", expected W`);
  if (!p.titles.some((x) => x.year === year))
    findings.push(`CHAMPION ${year} ${code}: not in titles[]`);
}

// 2) Runners-up: timeline should be "F" that year.
for (const [yr, code] of Object.entries(RUNNERS_UP)) {
  const year = Number(yr);
  const p = P(code);
  if (!p) { findings.push(`RUNNER-UP ${year}: profile ${code} missing`); continue; }
  const t = p.timeline[year];
  if (!t || t.result !== "F")
    findings.push(`RUNNER-UP ${year} ${code}: timeline shows "${t?.result ?? "—"}", expected F`);
}

// 3) 1930 had NO quarter-finals (groups → semis → final). Any "QF" in 1930 is impossible.
for (const code of Object.keys(profiles)) {
  const t = P(code)?.timeline[1930];
  if (t?.result === "QF") findings.push(`1930 ${code}: result "QF" — 1930 had no quarter-finals`);
}

// 4) Appearance counts vs reality (undercount from group-stage-only years the
//    bracket data doesn't list).
for (const [code, real] of Object.entries(REAL_APPEARANCES)) {
  const p = P(code);
  if (!p) continue;
  if (p.appearances !== real)
    findings.push(`APPEARANCES ${code}: derived ${p.appearances}, real ~${real} (through 2022)`);
}

// 5) Title-count sanity for the multi-winners (app models West Germany separately).
const TITLE_COUNTS: Record<string, number> = { BRA: 5, ITA: 4, ARG: 3, URU: 2, FRA: 2, ENG: 1, ESP: 1, GER: 1, FRG: 3 };
for (const [code, n] of Object.entries(TITLE_COUNTS)) {
  const p = P(code);
  if (!p) continue;
  if (p.titles.length !== n)
    findings.push(`TITLES ${code}: derived ${p.titles.length}, expected ${n}`);
}

console.log(`\n=== Country data audit — ${findings.length} findings ===\n`);
console.log(findings.length ? findings.map((f) => "• " + f).join("\n") : "No discrepancies found.");
console.log("");
