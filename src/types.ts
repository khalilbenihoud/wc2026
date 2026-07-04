export interface Match {
  s: [number, number];
  w: number | null; // winner index: 0 (first team), 1 (second team), null if not played
  p?: string | null; // penalty shootout score (e.g., '4-3')
  x?: string | null; // extra information (e.g., 'a.e.t.')
  g?: [string[], string[]] | null; // goalscorers: [homeGoals, awayGoals]
}

export interface MatchR32 {
  ta: string; // team code A
  tb: string; // team code B
  s: [number, number] | null;
  w: number | null; // 0 = ta wins, 1 = tb wins
  p?: string | null;
  x?: string | null;
  date?: string | null; // kickoff, e.g. "Jul 3 · 18:00"
  g?: [string[], string[]] | null; // goalscorers: [homeGoals, awayGoals]
}

export interface TournamentData {
  host: string;
  hostFlag: string;
  teams: string[];
  r32?: MatchR32[] | null;
  r16: (Match | null)[] | null;
  qf: (Match | null)[] | null;
  sf: (Match | null)[] | null;
  final: (Match | null)[] | null;
  seeded?: boolean;
  goldenBoot?: { name: string; goals: number; photo?: string } | null;
  quote?: string | null; // short editorial line about the final, e.g. "Messi. At last."
}

export interface TournamentAnalysis {
  champ: number | null;
  adv: number[]; // index matches d.teams. Value is level reached (0 to 4)
  w1: (number | null)[]; // R16 winners
  w2: (number | null)[]; // QF winners
  w3: (number | null)[]; // SF winners
}
