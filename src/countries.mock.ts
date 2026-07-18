// MOCK DATA — hand-written placeholder profiles while the country page design
// settles. The `CountryProfile` interface is the contract; a later pass will
// derive real profiles from data.ts / scorers.ts / stats.ts (and the jfjelstul
// dataset for group-stage coverage) and this file goes away.

// Every edition actually played. The 1938→1950 gap (WWII) is rendered as a
// labeled spacer in the Pulse, so it is not listed here.
export const EDITIONS = [
  1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982,
  1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026,
] as const;

// Result ladder, worst → best. `DNE` = did not enter / did not qualify.
export type ResultLevel =
  | "DNE" | "GS" | "R32" | "R16" | "QF" | "4TH" | "3RD" | "F" | "W";

// Bar height of each result in the Pulse, as a fraction of full height.
export const RESULT_HEIGHT: Record<ResultLevel, number> = {
  DNE: 0, GS: 0.16, R32: 0.28, R16: 0.4, QF: 0.56, "4TH": 0.66, "3RD": 0.72, F: 0.86, W: 1,
};

export const RESULT_LABEL: Record<ResultLevel, string> = {
  DNE: "Did not qualify",
  GS: "Group stage",
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-final",
  "4TH": "Fourth place",
  "3RD": "Third place",
  F: "Runner-up",
  W: "Champion",
};

// A factual, dataset-derived career milestone (e.g. a title or best finish).
// Deliberately NOT modelled as a news article: these are generated from the
// bracket data, so they carry no byline, publication date, or source that would
// imply real reporting — only the tournament year, which links to that edition's
// own page on this site.
export interface Milestone {
  year: number;
  headline: string;
  detail: string;
}

export interface VideoHighlight {
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  // Edition year the clip belongs to (taken from the match key). Lets the
  // VideoObject schema emit an uploadDate, which Google requires for video
  // rich-result eligibility.
  year?: number;
}

export interface CountryProfile {
  code: string;
  name: string;
  flag: string;
  confederation: string;
  epithet: string; // one editorial line under the name
  appearances: number;
  firstAppearance: number;
  titles: { year: number; final: string }[]; // championships, with final result
  bestResult: string; // used when there are no titles
  timeline: Partial<Record<number, { result: ResultLevel; note?: string }>>; // by edition year; missing year = DNE
  record: { w: number; d: number; l: number; gf: number; ga: number; pensWon: number; pensLost: number };
  ranking: number; // FIFA world ranking (mock)
  form: { label: string; fixture: string; outcome: "W" | "D" | "L" }[]; // most recent first
  topScorers: { name: string; goals: number; span: string }[];
  rivalries: { code: string; name: string; flag: string; played: number; w: number; d: number; l: number }[];
  definingMatches: {
    year: number;
    round: string;
    fixture: string; // e.g. "Brazil 1–2 Uruguay"
    note: string; // one editorial line
  }[];
  milestones: Milestone[];
  videos: VideoHighlight[];
}

// Partial country overrides — only the fields you want to customise (e.g.
// milestones, videos, epithet). Fields left undefined are filled by the generated profile.
// Use applyMockOverrides(gen) to merge them into a full profile set.
export const MOCK_COUNTRIES: Record<string, Partial<CountryProfile>> = {
  // Palestine (Al-Fida'i) have never reached a World Cup, so no generated
  // profile exists for them — this hand-written entry gives the nation a page.
  // Every WC-specific field is empty by design (each section hides when empty),
  // and the appearances === 0 state is handled in the hero + stat cards.
  PLE: {
    code: "PLE",
    name: "Palestine",
    flag: "🇵🇸",
    confederation: "AFC",
    epithet: "Still chasing a first World Cup — a footballing nation that carries a flag far larger than any scoreline.",
    appearances: 0,
    firstAppearance: 0,
    titles: [],
    bestResult: "Yet to qualify — chasing a debut",
    timeline: {},
    record: { w: 0, d: 0, l: 0, gf: 0, ga: 0, pensWon: 0, pensLost: 0 },
    ranking: 0,
    form: [],
    topScorers: [],
    rivalries: [],
    definingMatches: [],
    milestones: [],
    videos: [],
  },
};

export function applyMockOverrides(profiles: Record<string, CountryProfile>): Record<string, CountryProfile> {
  for (const [code, mock] of Object.entries(MOCK_COUNTRIES)) {
    if (profiles[code]) {
      profiles[code] = { ...profiles[code], ...mock } as CountryProfile;
    } else {
      profiles[code] = mock as CountryProfile;
    }
  }
  return profiles;
}
