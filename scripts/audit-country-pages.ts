#!/usr/bin/env npx tsx
/**
 * Comprehensive audit of every data field rendered on the Country Page.
 * Covers: profile metadata, timeline, appearances, record, honours,
 * top scorers, rivalries, defining matches, and the epithet.
 *
 * Run:  npx tsx scripts/audit-country-pages.ts
 */

import { generateCountryProfiles } from "../src/countries.generated";
import { MOCK_COUNTRIES, CountryProfile, EDITIONS, RESULT_LABEL, ResultLevel } from "../src/countries.mock";
import { COUNTRY_CODES, slugForCode } from "../src/countrySlug";
import { TEAMS, TOURNAMENTS, getTeamName, getTeamFlag } from "../src/data";

const profiles: Record<string, CountryProfile> = {
  ...generateCountryProfiles(),
  ...MOCK_COUNTRIES,
};

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
const TITLE_COUNTS: Record<string, number> = {
  BRA: 5, ITA: 4, ARG: 3, URU: 2, FRA: 2, ENG: 1, ESP: 1, GER: 1, FRG: 3,
};

const RESULT_RANK: Record<ResultLevel, number> = {
  DNE: 0, GS: 1, R32: 2, R16: 3, QF: 4, "4TH": 5, "3RD": 6, F: 7, W: 8,
};

type Finding = { severity: "error" | "warn" | "info"; message: string };

const findings: Finding[] = [];
const push = (sev: Finding["severity"], msg: string) => findings.push({ severity: sev, message: msg });

// ── 1. Coverage ──────────────────────────────────────────────────────────────

function auditCoverage() {
  // Every non-TBD team in the tournament data should have a profile.
  const allCodes = new Set<string>();
  for (const year of Object.keys(TOURNAMENTS).map(Number)) {
    const t = TOURNAMENTS[year];
    for (const c of t.teams) if (c !== "TBD") allCodes.add(c);
    if (t.r32) {
      for (const m of t.r32) {
        if (m.ta !== "TBD") allCodes.add(m.ta);
        if (m.tb !== "TBD") allCodes.add(m.tb);
      }
    }
  }
  for (const code of [...allCodes].sort()) {
    if (!profiles[code]) {
      push("error", `MISSING PROFILE: ${code} (${getTeamName(code)}) has tournament data but no profile`);
    }
    if (!COUNTRY_CODES.includes(code)) {
      push("warn", `SITEMAP MISSING: ${code} has a profile but is not in COUNTRY_CODES`);
    }
  }
  for (const code of COUNTRY_CODES) {
    if (!profiles[code] && !MOCK_COUNTRIES[code]) {
      push("error", `ORPHAN: ${code} is in COUNTRY_CODES but has no profile`);
    }
  }
}

// ── 2. Profile metadata ──────────────────────────────────────────────────────

function auditMetadata(code: string, p: CountryProfile) {
  if (p.name !== getTeamName(code)) {
    push("warn", `${code}: name "${p.name}" differs from TEAMS name "${getTeamName(code)}"`);
  }
  if (p.flag !== getTeamFlag(code)) {
    push("warn", `${code}: flag "${p.flag}" differs from TEAMS flag "${getTeamFlag(code)}"`);
  }
  if (!p.confederation || p.confederation === "Unknown") {
    push("warn", `${code}: confederation is "${p.confederation}" (may be correct)`);
  }
  if (!slugForCode(code)) {
    push("error", `${code}: missing URL slug (no entry in COUNTRY_CODES or SLUG_OVERRIDES)`);
  }
}

// ── 3. Timeline ──────────────────────────────────────────────────────────────

function auditTimeline(code: string, p: CountryProfile) {
  // No need to flag missing keys — the UI treats absent entries as DNE.
  // Only flag contradictions where a key exists.

  // Champions and runners-up must match ground truth.
  for (const [yr, champCode] of Object.entries(CHAMPIONS)) {
    const year = Number(yr);
    const entry = p.timeline[year];
    if (code === champCode) {
      if (!entry) push("error", `${code}: champion in ${year} but timeline entry is missing`);
      else if (entry.result !== "W") push("error", `${code}: champion in ${year} but timeline shows "${entry.result}"`);
    }
  }
  for (const [yr, ruCode] of Object.entries(RUNNERS_UP)) {
    const year = Number(yr);
    const entry = p.timeline[year];
    if (code === ruCode) {
      if (!entry) push("error", `${code}: runner-up in ${year} but timeline entry is missing`);
      else if (entry.result !== "F") push("error", `${code}: runner-up in ${year} but timeline shows "${entry.result}"`);
    }
  }

  // 1930 QF check.
  const t1930 = p.timeline[1930];
  if (t1930 && t1930.result === "QF") {
    push("error", `${code}: result "QF" for 1930 — 1930 had no quarter-finals`);
  }

  // Appearances count should equal non-DNE timeline entries (up to 2022 max).
  let counted = 0;
  let firstYear = Infinity;
  for (const year of EDITIONS) {
    const e = p.timeline[year];
    if (e && e.result !== "DNE") {
      counted++;
      if (year < firstYear) firstYear = year;
    }
  }
  if (p.appearances !== counted && !MOCK_COUNTRIES[code]) {
    push("warn", `${code}: appearances field = ${p.appearances}, but timeline has ${counted} non-DNE entries`);
  }
  if (p.firstAppearance !== firstYear && !MOCK_COUNTRIES[code]) {
    push("warn", `${code}: firstAppearance = ${p.firstAppearance}, but earliest timeline entry is ${firstYear}`);
  }

  // Result levels should follow a valid knockout progression per year.
  // (No strong validation here since bracket data may not represent all rounds.)
}

// ── 4. Titles & bestResult ──────────────────────────────────────────────────

function auditTitles(code: string, p: CountryProfile) {
  const expectedTitleCount = TITLE_COUNTS[code] || 0;
  if (p.titles.length !== expectedTitleCount && !MOCK_COUNTRIES[code]) {
    push("warn", `${code}: ${p.titles.length} titles, expected ${expectedTitleCount}`);
  }

  // Every title year should have a W in the timeline.
  for (const t of p.titles) {
    const entry = p.timeline[t.year];
    if (!entry) push("error", `${code}: title in ${t.year} but timeline entry missing`);
    else if (entry.result !== "W") push("error", `${code}: title in ${t.year} but timeline shows "${entry.result}"`);
  }

  // bestResult: for non-champions (non-mock), should match highest timeline result.
  if (p.titles.length === 0 && !MOCK_COUNTRIES[code]) {
    let bestLevel: ResultLevel | null = null;
    let bestYear = 0;
    const order: ResultLevel[] = ["F", "3RD", "4TH", "QF", "R16", "R32", "GS"];
    for (const year of EDITIONS) {
      const e = p.timeline[year];
      if (!e) continue;
      for (const level of order) {
        if (e.result === level) {
          if (!bestLevel || order.indexOf(level) < order.indexOf(bestLevel)) {
            bestLevel = level;
            bestYear = year;
          }
          break;
        }
      }
    }
    if (bestLevel) {
      const expectedLabel = `${RESULT_LABEL[bestLevel]} — ${bestYear}`;
      if (p.bestResult !== expectedLabel) {
        push("warn", `${code}: bestResult = "${p.bestResult}", expected "${expectedLabel}"`);
      }
    }
  }
}

// ── 5. Record ─────────────────────────────────────────────────────────────────

function auditRecord(code: string, p: CountryProfile) {
  const rec = p.record;
  if (rec.w < 0 || rec.d < 0 || rec.l < 0) {
    push("error", `${code}: negative values in record (W${rec.w} D${rec.d} L${rec.l})`);
  }
  if (rec.gf < 0 || rec.ga < 0) {
    push("error", `${code}: negative goals (GF${rec.gf} GA${rec.ga})`);
  }
  if (rec.pensWon < 0 || rec.pensLost < 0) {
    push("error", `${code}: negative shootout totals`);
  }
}

// ── 6. Top scorers ───────────────────────────────────────────────────────────

function auditTopScorers(code: string, p: CountryProfile) {
  if (p.topScorers.length === 0) {
    push("info", `${code}: no top scorers`);
    return;
  }
  if (p.topScorers.length > 5) {
    push("info", `${code}: ${p.topScorers.length} top scorers (expected ≤ 5)`);
  }
  for (const s of p.topScorers) {
    if (s.goals <= 0) push("warn", `${code}: top scorer "${s.name}" has ${s.goals} goals`);
    if (!s.name) push("warn", `${code}: unnamed top scorer`);
    if (!s.span) push("warn", `${code}: top scorer "${s.name}" has no span`);
  }
}

// ── 7. Rivalries ─────────────────────────────────────────────────────────────

function auditRivalries(code: string, p: CountryProfile) {
  for (const r of p.rivalries) {
    if (!profiles[r.code] && !TEAMS[r.code]) {
      push("warn", `${code}: rivalry references unknown code "${r.code}"`);
    }
    if (r.played !== r.w + r.d + r.l) {
      push("warn", `${code}: rivalry v ${r.code} played=${r.played} ≠ ${r.w}+${r.d}+${r.l}`);
    }
    if (r.played <= 0) {
      push("warn", `${code}: rivalry v ${r.code} has ${r.played} matches`);
    }
    if (!r.name || !r.flag) {
      push("warn", `${code}: rivalry v ${r.code} missing name or flag`);
    }
  }
}

// ── 8. Defining matches ─────────────────────────────────────────────────────

function auditDefiningMatches(code: string, p: CountryProfile) {
  const isMock = !!MOCK_COUNTRIES[code];
  if (isMock && p.definingMatches.length === 0) {
    push("warn", `${code}: is a mock country but has no defining matches`);
  }
  if (!isMock && p.definingMatches.length > 0) {
    push("info", `${code}: has ${p.definingMatches.length} defining matches but is not a mock country`);
  }
  for (const m of p.definingMatches) {
    if (!m.year || !m.round || !m.fixture || !m.note) {
      push("warn", `${code}: defining match ${m.year} missing required field`);
    }
  }
}

// ── 9. Epithet ──────────────────────────────────────────────────────────────

function auditEpithet(code: string, p: CountryProfile) {
  const ep = p.epithet;
  if (!ep || ep.length < 5) {
    push("warn", `${code}: epithet is too short or empty`);
    return;
  }
  // Check epithet references match actual count.
  const titleMatch = ep.match(/(\d+)-time champion/);
  if (titleMatch) {
    const n = Number(titleMatch[1]);
    if (n !== p.titles.length) {
      push("warn", `${code}: epithet says "${titleMatch[0]}" but titles.length = ${p.titles.length}`);
    }
  }
  const appMatch = ep.match(/(\d+) appearance/);
  if (appMatch) {
    const n = Number(appMatch[1]);
    if (n !== p.appearances) {
      push("warn", `${code}: epithet says "${appMatch[0]}" but appearances = ${p.appearances}`);
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

const codes = Object.keys(profiles).sort();

for (const code of codes) {
  const p = profiles[code];
  if (!TEAMS[code]) continue; // skip if team data is missing entirely

  auditMetadata(code, p);
  auditTimeline(code, p);
  auditTitles(code, p);
  auditRecord(code, p);
  auditTopScorers(code, p);
  auditRivalries(code, p);
  auditDefiningMatches(code, p);
  auditEpithet(code, p);
}

auditCoverage();

// ── Report ───────────────────────────────────────────────────────────────────

console.log(`\n=== Country Page Audit — ${findings.length} findings ===\n`);

if (findings.length === 0) {
  console.log("All checks passed.");
} else {
  const errors = findings.filter((f) => f.severity === "error");
  const warns = findings.filter((f) => f.severity === "warn");
  const infos = findings.filter((f) => f.severity === "info");

  if (errors.length) {
    console.log(`─ ERRORS (${errors.length}) ─`);
    for (const f of errors) console.log(`  • ${f.message}`);
    console.log();
  }
  if (warns.length) {
    console.log(`─ WARNINGS (${warns.length}) ─`);
    for (const f of warns) console.log(`  • ${f.message}`);
    console.log();
  }
  if (infos.length) {
    console.log(`─ INFO (${infos.length}) ─`);
    for (const f of infos) console.log(`  • ${f.message}`);
    console.log();
  }
}
console.log("");
