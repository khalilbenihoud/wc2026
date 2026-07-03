export interface Match {
  s: [number, number];
  w: number; // winner index: 0 (first team) or 1 (second team)
  p?: string | null; // penalty shootout score (e.g., '4-3')
  x?: string | null; // extra information (e.g., 'a.e.t.')
}

export interface MatchR32 {
  ta: string; // team code A
  tb: string; // team code B
  s: [number, number] | null;
  w: number | null; // 0 = ta wins, 1 = tb wins
  p?: string | null;
  x?: string | null;
  date?: string | null; // kickoff, e.g. "Jul 3 · 18:00"
}

export interface TournamentData {
  host: string;
  hostFlag: string;
  teams: string[];
  r32?: MatchR32[] | null;
  r16: Match[] | null;
  qf: Match[] | null;
  sf: Match[] | null;
  final: Match[] | null;
  seeded?: boolean;
}

export interface TournamentAnalysis {
  champ: number | null;
  adv: number[]; // index matches d.teams. Value is level reached (0 to 4)
  w1: number[]; // R16 winners
  w2: number[]; // QF winners
  w3: number[]; // SF winners
}
