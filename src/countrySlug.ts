// Country-page URL slugs. Country pages use full-name slugs (/countries/brazil)
// rather than 3-letter codes (/countries/bra) — the keyword in the URL is worth
// far more for search. This is the single source of truth shared by the router
// (client), the sitemap generator, and the prerender script, so all three agree
// on which slug maps to which team code.
//
// Deliberately light: it imports only TEAMS/TOURNAMENTS from data.ts (already in
// the initial bundle), never the heavy generated country profiles — so pulling
// it into the router adds no weight to the home bracket payload.

import { TEAMS, TOURNAMENTS } from "./data";

// A few TEAMS names are abbreviated for the compact bracket UI; expand them to
// clean, search-friendly slugs instead of slugifying the abbreviation.
const SLUG_OVERRIDES: Record<string, string> = {
  IRL: "republic-of-ireland", // "Rep. Ireland"
  BIH: "bosnia-and-herzegovina", // "Bosnia-Herz."
};

// Lowercase, strip diacritics (Türkiye → turkiye, Curaçao → curacao), and
// collapse everything that isn't a-z0-9 into single hyphens.
export function slugifyName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// The canonical set of country-page codes: every real nation that has appeared
// in a tournament in our data (mirrors the enumeration the sitemap uses).
function computeCodes(): string[] {
  const codes = new Set<string>();
  for (const year of Object.keys(TOURNAMENTS).map(Number)) {
    const t = TOURNAMENTS[year];
    for (const c of t.teams) if (c !== "TBD" && TEAMS[c]) codes.add(c);
    if (t.r32) {
      for (const m of t.r32) {
        if (m.ta !== "TBD" && TEAMS[m.ta]) codes.add(m.ta);
        if (m.tb !== "TBD" && TEAMS[m.tb]) codes.add(m.tb);
      }
    }
  }
  return [...codes];
}

const CODES = computeCodes();

const CODE_TO_SLUG: Record<string, string> = {};
const SLUG_TO_CODE: Record<string, string> = {};
for (const code of CODES) {
  const slug = SLUG_OVERRIDES[code] ?? slugifyName(TEAMS[code][0]);
  CODE_TO_SLUG[code] = slug;
  SLUG_TO_CODE[slug] = code;
}

/** All country-page team codes (nations that have appeared at a World Cup). */
export const COUNTRY_CODES: string[] = CODES;

/** Team code → URL slug, e.g. "BRA" → "brazil". null if the code has no page. */
export function slugForCode(code: string): string | null {
  return CODE_TO_SLUG[code] ?? null;
}

/** URL slug → team code, e.g. "brazil" → "BRA". null if the slug is unknown. */
export function codeForSlug(slug: string): string | null {
  return SLUG_TO_CODE[slug.toLowerCase()] ?? null;
}
