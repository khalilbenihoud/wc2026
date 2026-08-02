// Shared head-to-head comparison logic, used by both the interactive ComparePage
// and the build-time prerender/sitemap scripts so the two never drift. History
// (1930–2022, group + knockout) comes from the complete jfjelstul meeting log;
// 2026+ from the live bracket in data.ts. Both are oriented to the canonical
// A<B code order. Penalty shootouts count as draws (official FIFA record).

import { TOURNAMENTS, getTeamName } from "./data";
import { analyze } from "./analysis";
import { enumerateMatches, EnumeratedMatch, STATS_DATASET_THROUGH } from "./matches";
import { ROUND_NAME, TOURNAMENT_YEARS } from "./constants";
import { generateCountryProfiles } from "./countries.generated";
import { WC_MEETINGS } from "./countryH2H.generated";
import { comparePath } from "./router";
import { slugForCode } from "./countrySlug";
import { BASE_URL, SITE_NAME, breadcrumbList, faqPage } from "./schema";

export interface ComparisonMeeting {
  year: number;
  round: string;        // stage label
  scoreA: number;       // goals for team A (canonical, alphabetically-first code)
  scoreB: number;
  winner: string | null; // team name, or null for a draw (shootouts count as draws)
  slug: string | null;   // match-detail slug when a page exists (knockout ties)
  pens: string | null;   // shootout score "a-b" oriented to A, or null
  aet: boolean;          // decided after extra time
}

export interface Comparison {
  codeA: string; codeB: string; // canonical (code-sorted)
  nameA: string; nameB: string;
  meetings: ComparisonMeeting[];
  h2h: { played: number; wA: number; d: number; lA: number; wB: number; lB: number };
  titlesA: number; titlesB: number;
  titlesYearsA: number[]; titlesYearsB: number[];
}

// Chronological-within-year ordering across every stage format the archive uses.
const STAGE_RANK: Record<string, number> = {
  "Group stage": 0, "Final round": 1, "Second group stage": 2,
  "Round of 32": 3, "Round of 16": 4, "Quarter-final": 5,
  "Semi-final": 6, "Third-place play-off": 7, Final: 8,
};

export function computeComparison(a: string, b: string): Comparison {
  const codeA = a < b ? a : b;
  const codeB = a < b ? b : a;
  const nameA = getTeamName(codeA) ?? codeA;
  const nameB = getTeamName(codeB) ?? codeB;

  const profiles = generateCountryProfiles();
  const profileA = profiles[codeA];
  const profileB = profiles[codeB];

  // Resolve the knockout matches for a year once, so historical knockout ties can
  // borrow a real match-detail slug and 2026 can be read from the bracket.
  const enumCache = new Map<number, EnumeratedMatch[]>();
  const knockoutMatch = (year: number): EnumeratedMatch | undefined => {
    if (!enumCache.has(year)) {
      const t = TOURNAMENTS[year];
      enumCache.set(year, t ? enumerateMatches(t, analyze(t)) : []);
    }
    return enumCache.get(year)!.find(
      (m) => m.played &&
        ((m.ta === codeA && m.tb === codeB) || (m.ta === codeB && m.tb === codeA))
    );
  };

  const meetings: ComparisonMeeting[] = [];
  for (const m of WC_MEETINGS[`${codeA}|${codeB}`] ?? []) {
    meetings.push({
      year: m.year,
      round: m.stage,
      scoreA: m.ga,
      scoreB: m.gb,
      pens: m.pens ? `${m.pens[0]}-${m.pens[1]}` : null,
      aet: m.aet,
      winner: m.pens ? null : m.ga > m.gb ? nameA : m.gb > m.ga ? nameB : null,
      slug: m.knockout ? knockoutMatch(m.year)?.slug ?? null : null,
    });
  }
  for (const year of TOURNAMENT_YEARS) {
    if (year <= STATS_DATASET_THROUGH) continue;
    const km = knockoutMatch(year);
    if (!km || !km.score) continue;
    const flipped = km.ta === codeB;
    const scoreA = flipped ? km.score[1] : km.score[0];
    const scoreB = flipped ? km.score[0] : km.score[1];
    const pens = km.pens ? (flipped ? km.pens.split("-").reverse().join("-") : km.pens) : null;
    meetings.push({
      year,
      round: ROUND_NAME[km.round] ?? km.round,
      scoreA,
      scoreB,
      pens,
      aet: !!km.extra,
      winner: pens ? null : scoreA > scoreB ? nameA : scoreB > scoreA ? nameB : null,
      slug: km.slug,
    });
  }
  meetings.sort((x, y) => x.year - y.year || (STAGE_RANK[x.round] ?? 9) - (STAGE_RANK[y.round] ?? 9));

  const h2h = { played: meetings.length, wA: 0, d: 0, lA: 0, wB: 0, lB: 0 };
  for (const m of meetings) {
    if (m.winner === nameA) { h2h.wA++; h2h.lB++; }
    else if (m.winner === nameB) { h2h.wB++; h2h.lA++; }
    else h2h.d++;
  }

  return {
    codeA, codeB, nameA, nameB, meetings, h2h,
    titlesA: profileA?.titles.length ?? 0,
    titlesB: profileB?.titles.length ?? 0,
    titlesYearsA: profileA?.titles.map((t) => t.year) ?? [],
    titlesYearsB: profileB?.titles.map((t) => t.year) ?? [],
  };
}

export function comparisonMeta(c: Comparison): { title: string; description: string } {
  const { nameA, nameB, h2h } = c;
  const title = `${nameA} vs ${nameB} World Cup Record · Head-to-Head History`;
  const description = h2h.played > 0
    ? `${nameA} vs ${nameB} all-time FIFA World Cup record: ${h2h.played} meetings, ${nameA} ${h2h.wA}W ${h2h.d}D ${h2h.lA}L. Every World Cup meeting between ${nameA} and ${nameB}, 1930 to today.`
    : `No World Cup meetings between ${nameA} and ${nameB}. Compare their records, titles, and tournament history.`;
  return { title, description };
}

export function comparisonUrl(c: Comparison): string {
  return `${BASE_URL}${comparePath(c.codeA, c.codeB)}/`;
}

export function comparisonJsonLd(c: Comparison): Record<string, unknown> {
  const { nameA, nameB, h2h, meetings } = c;
  const url = comparisonUrl(c);
  const hasMeetings = h2h.played > 0;

  const leader = h2h.wA > h2h.lA ? nameA : h2h.lA > h2h.wA ? nameB : null;
  const summary = hasMeetings
    ? `${nameA} and ${nameB} have met ${h2h.played} time${h2h.played > 1 ? "s" : ""} at the FIFA World Cup — ${nameA} ${h2h.wA}W ${h2h.d}D ${h2h.lA}L${leader ? `, ${leader} lead the head-to-head` : ", the record is level"}.`
    : `${nameA} and ${nameB} have never met at the FIFA World Cup.`;

  const faqs: { question: string; answer: string }[] = [
    { question: `Have ${nameA} and ${nameB} ever met at the FIFA World Cup?`, answer: summary },
  ];
  if (hasMeetings) {
    const last = meetings[meetings.length - 1];
    const outcome = last.winner ? `${last.winner} won` : "it was a draw";
    faqs.push({
      question: `When did ${nameA} and ${nameB} last meet at the World Cup?`,
      answer: `Their most recent World Cup meeting was the ${last.year} ${last.round}, which finished ${last.scoreA}–${last.scoreB} — ${outcome}.`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList([
        { name: SITE_NAME, url: `${BASE_URL}/` },
        { name: `${nameA} vs ${nameB}`, url },
      ]),
      faqPage(faqs),
    ],
  };
}

// Every team pair with at least one World Cup meeting, in canonical code order —
// the set worth prerendering/listing in the sitemap. Historical pairs come from
// the meeting log; 2026+ can introduce first-ever meetings not in that log.
// Restricted to pairs whose codes both have a country slug, so the URL round-
// trips: a few nations (e.g. Iraq, Qatar) have no profile page and would
// otherwise hydrate to "not found" — bad for both users and JS-rendering crawlers.
export function pairsWithMeetings(): [string, string][] {
  const set = new Set<string>(Object.keys(WC_MEETINGS));
  for (const year of TOURNAMENT_YEARS) {
    if (year <= STATS_DATASET_THROUGH) continue;
    const t = TOURNAMENTS[year];
    if (!t) continue;
    for (const m of enumerateMatches(t, analyze(t))) {
      if (!m.played) continue;
      const [x, y] = m.ta < m.tb ? [m.ta, m.tb] : [m.tb, m.ta];
      set.add(`${x}|${y}`);
    }
  }
  return [...set]
    .map((k) => k.split("|") as [string, string])
    .filter(([a, b]) => slugForCode(a) && slugForCode(b));
}
