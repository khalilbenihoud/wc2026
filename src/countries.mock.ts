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

export interface NewsArticle {
  headline: string;
  source: string;
  date: string;
  url: string;
  snippet: string;
}

export interface VideoHighlight {
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
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
  news: NewsArticle[];
  videos: VideoHighlight[];
}

export const MOCK_COUNTRIES: Record<string, CountryProfile> = {
  BRA: {
    code: "BRA",
    name: "Brazil",
    flag: "🇧🇷",
    confederation: "CONMEBOL",
    epithet: "The only nation to appear at every World Cup — and the only one with five.",
    appearances: 23,
    firstAppearance: 1930,
    titles: [
      { year: 1958, final: "5–2 v Sweden" },
      { year: 1962, final: "3–1 v Czechoslovakia" },
      { year: 1970, final: "4–1 v Italy" },
      { year: 1994, final: "0–0 (3–2 pens) v Italy" },
      { year: 2002, final: "2–0 v Germany" },
    ],
    bestResult: "Champions ×5",
    timeline: {
      1930: { result: "GS" }, 1934: { result: "GS" }, 1938: { result: "3RD" },
      1950: { result: "F", note: "The Maracanazo" }, 1954: { result: "QF" },
      1958: { result: "W", note: "Pelé, 17, announces himself" },
      1962: { result: "W" }, 1966: { result: "GS" },
      1970: { result: "W", note: "The greatest side ever assembled" },
      1974: { result: "4TH" }, 1978: { result: "3RD" }, 1982: { result: "QF", note: "The Sarrià tragedy" },
      1986: { result: "QF" }, 1990: { result: "R16" }, 1994: { result: "W" },
      1998: { result: "F" }, 2002: { result: "W" }, 2006: { result: "QF" },
      2010: { result: "QF" }, 2014: { result: "4TH", note: "The 7–1" }, 2018: { result: "QF" },
      2022: { result: "QF" },
    },
    record: { w: 76, d: 19, l: 19, gf: 237, ga: 108, pensWon: 3, pensLost: 2 },
    ranking: 5,
    form: [
      { label: "2022 · QF", fixture: "Croatia 1–1 (4–2 pens) Brazil", outcome: "L" },
      { label: "2022 · R16", fixture: "Brazil 4–1 South Korea", outcome: "W" },
      { label: "2022 · GS", fixture: "Cameroon 1–0 Brazil", outcome: "L" },
      { label: "2022 · GS", fixture: "Brazil 2–0 Serbia", outcome: "W" },
      { label: "2022 · GS", fixture: "Brazil 1–0 Switzerland", outcome: "W" },
    ],
    topScorers: [
      { name: "Ronaldo", goals: 15, span: "1998–2006" },
      { name: "Pelé", goals: 12, span: "1958–1970" },
      { name: "Vavá", goals: 9, span: "1958–1962" },
      { name: "Jairzinho", goals: 9, span: "1970–1974" },
      { name: "Neymar", goals: 8, span: "2014–2022" },
    ],
    rivalries: [
      { code: "ITA", name: "Italy", flag: "🇮🇹", played: 5, w: 3, d: 1, l: 1 },
      { code: "FRA", name: "France", flag: "🇫🇷", played: 4, w: 1, d: 0, l: 3 },
      { code: "ARG", name: "Argentina", flag: "🇦🇷", played: 4, w: 2, d: 1, l: 1 },
      { code: "GER", name: "Germany", flag: "🇩🇪", played: 2, w: 1, d: 0, l: 1 },
      { code: "NED", name: "Netherlands", flag: "🇳🇱", played: 5, w: 2, d: 1, l: 2 },
    ],
    definingMatches: [
      { year: 1950, round: "Final round", fixture: "Brazil 1–2 Uruguay", note: "200,000 fell silent at the Maracanã. The wound that named itself." },
      { year: 1958, round: "Final", fixture: "Brazil 5–2 Sweden", note: "A 17-year-old cries on his teammates' shoulders. Football has a new king." },
      { year: 1970, round: "Final", fixture: "Brazil 4–1 Italy", note: "Carlos Alberto's fourth — the pass, the run, the shot. Perfection, filmed in color." },
      { year: 1982, round: "Second group stage", fixture: "Italy 3–2 Brazil", note: "Paolo Rossi ends the most beautiful team never to win it." },
      { year: 2014, round: "Semi-final", fixture: "Brazil 1–7 Germany", note: "The Mineirazo. Six minutes that rewrote a nation's relationship with the game." },
    ],
    news: [
      { headline: "Brazilian football in 2026: Can the Seleção reclaim glory?", source: "The Guardian", date: "2026-06-14", url: "#", snippet: "After a quarter-final exit in Qatar, Brazil enter the 2026 World Cup with a renewed squad and a point to prove." },
      { headline: "Vinícius Jr leads Brazil's new generation", source: "ESPN Brasil", date: "2026-05-28", url: "#", snippet: "The Real Madrid star has taken on the mantle of leadership for a Seleção side blending youth and experience." },
      { headline: "Why Brazil remains favourite despite recent struggles", source: "FourFourTwo", date: "2026-04-12", url: "#", snippet: "No nation has won more World Cups. No nation carries more weight. Brazil's 2026 campaign starts here." },
    ],
    videos: [
      { title: "Brazil's greatest World Cup goals", thumbnail: "", url: "#", duration: "4:32" },
      { title: "Pelé's legacy: 70 years of magic", thumbnail: "", url: "#", duration: "12:15" },
      { title: "Mineirazo: Brazil 1–7 Germany — the full story", thumbnail: "", url: "#", duration: "18:40" },
    ],
  },

  NED: {
    code: "NED",
    name: "Netherlands",
    flag: "🇳🇱",
    confederation: "UEFA",
    epithet: "Three finals, zero titles — the greatest story the trophy never told.",
    appearances: 12,
    firstAppearance: 1934,
    titles: [],
    bestResult: "Runners-up — 1974, 1978, 2010",
    timeline: {
      1934: { result: "GS" }, 1938: { result: "GS" },
      1974: { result: "F", note: "Total Football reaches the final" },
      1978: { result: "F", note: "Rensenbrink hits the post in the 90th" },
      1990: { result: "R16" }, 1994: { result: "QF" }, 1998: { result: "4TH" },
      2006: { result: "R16" }, 2010: { result: "F", note: "Iniesta, 116'" },
      2014: { result: "3RD" }, 2022: { result: "QF" },
    },
    record: { w: 30, d: 13, l: 8, gf: 96, ga: 52, pensWon: 1, pensLost: 3 },
    ranking: 7,
    form: [
      { label: "2022 · QF", fixture: "Netherlands 2–2 (3–4 pens) Argentina", outcome: "L" },
      { label: "2022 · R16", fixture: "Netherlands 3–1 USA", outcome: "W" },
      { label: "2022 · GS", fixture: "Netherlands 2–0 Qatar", outcome: "W" },
      { label: "2022 · GS", fixture: "Netherlands 1–1 Ecuador", outcome: "D" },
      { label: "2022 · GS", fixture: "Netherlands 2–0 Senegal", outcome: "W" },
    ],
    topScorers: [
      { name: "Johnny Rep", goals: 7, span: "1974–1978" },
      { name: "Dennis Bergkamp", goals: 6, span: "1994–1998" },
      { name: "Wesley Sneijder", goals: 6, span: "2010–2014" },
      { name: "Arjen Robben", goals: 6, span: "2006–2014" },
      { name: "Rob Rensenbrink", goals: 6, span: "1974–1978" },
    ],
    rivalries: [
      { code: "ARG", name: "Argentina", flag: "🇦🇷", played: 6, w: 2, d: 2, l: 2 },
      { code: "BRA", name: "Brazil", flag: "🇧🇷", played: 5, w: 2, d: 1, l: 2 },
      { code: "GER", name: "Germany", flag: "🇩🇪", played: 3, w: 1, d: 1, l: 1 },
      { code: "ESP", name: "Spain", flag: "🇪🇸", played: 2, w: 1, d: 0, l: 1 },
    ],
    definingMatches: [
      { year: 1974, round: "Final", fixture: "Netherlands 1–2 West Germany", note: "A penalty before Germany touched the ball. Then Beckenbauer's machine answered." },
      { year: 1978, round: "Final", fixture: "Argentina 3–1 Netherlands", note: "The post in the 90th minute. Two inches from immortality, twice running." },
      { year: 1998, round: "Semi-final", fixture: "Brazil 1–1 (4–2 pens) Netherlands", note: "Bergkamp's touch v Argentina deserved a final. The shootout said no." },
      { year: 2010, round: "Final", fixture: "Netherlands 0–1 Spain", note: "Robben, one-on-one, twice. Iniesta once. Football is cruel arithmetic." },
      { year: 2014, round: "Group stage", fixture: "Spain 1–5 Netherlands", note: "Van Persie flies. The world champions dismantled in ninety minutes." },
    ],
    news: [
      { headline: "Netherlands 2026: Can this be the one?", source: "Voetbal International", date: "2026-06-02", url: "#", snippet: "Three finals lost. The Dutch carry the weight of history into every tournament — but this squad feels different." },
      { headline: "Frenkie de Jong: The metronome of Oranje", source: "De Telegraaf", date: "2026-05-15", url: "#", snippet: "The Barcelona midfielder controls everything. If the Netherlands go far, he will be the reason." },
    ],
    videos: [
      { title: "Total Football: The story of 1974", thumbnail: "", url: "#", duration: "22:10" },
      { title: "Bergkamp's goal v Argentina — the inside story", thumbnail: "", url: "#", duration: "6:45" },
    ],
  },

  MAR: {
    code: "MAR",
    name: "Morocco",
    flag: "🇲🇦",
    confederation: "CAF",
    epithet: "Africa's first semi-finalists — and they're not done climbing.",
    appearances: 7,
    firstAppearance: 1970,
    titles: [],
    bestResult: "Fourth place — 2022",
    timeline: {
      1970: { result: "GS" },
      1986: { result: "R16", note: "First African side to top a group" },
      1994: { result: "GS" }, 1998: { result: "GS" },
      2018: { result: "GS" },
       2022: { result: "4TH", note: "Africa's first semi-final" },
    },
    record: { w: 9, d: 8, l: 12, gf: 27, ga: 32, pensWon: 1, pensLost: 0 },
    ranking: 11,
    form: [
      { label: "2022 · 3rd place", fixture: "Croatia 2–1 Morocco", outcome: "L" },
      { label: "2022 · SF", fixture: "France 2–0 Morocco", outcome: "L" },
      { label: "2022 · QF", fixture: "Morocco 1–0 Portugal", outcome: "W" },
      { label: "2022 · R16", fixture: "Morocco 0–0 (3–0 pens) Spain", outcome: "W" },
      { label: "2018 · GS", fixture: "Morocco 2–2 Spain", outcome: "D" },
    ],
    topScorers: [
      { name: "Youssef En-Nesyri", goals: 3, span: "2018–2022" },
      { name: "Salaheddine Bassir", goals: 2, span: "1998" },
      { name: "Abderrazak Khairi", goals: 2, span: "1986" },
      { name: "Hakim Ziyech", goals: 2, span: "2022" },
    ],
    rivalries: [
      { code: "ESP", name: "Spain", flag: "🇪🇸", played: 3, w: 1, d: 1, l: 1 },
      { code: "FRA", name: "France", flag: "🇫🇷", played: 2, w: 0, d: 0, l: 2 },
      { code: "POR", name: "Portugal", flag: "🇵🇹", played: 3, w: 2, d: 0, l: 1 },
      { code: "BEL", name: "Belgium", flag: "🇧🇪", played: 2, w: 1, d: 0, l: 1 },
    ],
    definingMatches: [
      { year: 1986, round: "Group stage", fixture: "Morocco 3–1 Portugal", note: "Khairi twice. The first African nation ever to win a World Cup group." },
      { year: 2022, round: "Round of 16", fixture: "Morocco 0–0 (3–0 pens) Spain", note: "Bono saves everything. Casablanca and Madrid hold the same breath, differently." },
      { year: 2022, round: "Quarter-final", fixture: "Morocco 1–0 Portugal", note: "En-Nesyri outjumps everyone. A continent crosses a line it can never uncross." },
    ],
    news: [
      { headline: "Morocco's World Cup fever: A nation dreams again", source: "Le Matin", date: "2026-06-10", url: "#", snippet: "After the historic semi-final run in 2022, Morocco are no longer underdogs — they arrive as contenders." },
      { headline: "Regragui's revolution continues", source: "BBC Sport", date: "2026-05-20", url: "#", snippet: "The manager who led Morocco to the semi-finals has built on that foundation with a new generation of talent." },
    ],
    videos: [
      { title: "Morocco's historic 2022 run: Every moment", thumbnail: "", url: "#", duration: "15:30" },
      { title: "Bono's penalty saves v Spain — full shootout", thumbnail: "", url: "#", duration: "8:22" },
      { title: "En-Nesyri's header v Portugal: How they made history", thumbnail: "", url: "#", duration: "3:15" },
    ],
  },

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
    news: [],
    videos: [],
  },
};
