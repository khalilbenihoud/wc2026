import { TournamentData, TournamentAnalysis } from "./types";

// Tournament analysis calculator. Resolves, for a given bracket, which leaf
// (index into d.teams) advanced out of each round — used to draw winning traces
// and to resolve who actually played each knockout match.
export function analyze(d: TournamentData): TournamentAnalysis {
  if (!d.r16) {
    return analyzeNoR16(d);
  }
  const w1: (number | null)[] = [];
  const w2: (number | null)[] = [];
  const w3: (number | null)[] = [];

  for (let i = 0; i < 8; i++) {
    const m = d.r16[i];
    w1[i] = m && m.w !== null ? 2 * i + m.w : null;
  }
  if (d.qf) {
    for (let i = 0; i < 4; i++) {
      const m = d.qf[i];
      const a = w1[2 * i];
      const b = w1[2 * i + 1];
      if (m && m.w !== null && a != null && b != null) {
        w2[i] = m.w === 0 ? a : b;
      } else {
        w2[i] = null;
      }
    }
  }
  if (d.sf) {
    for (let i = 0; i < 2; i++) {
      const m = d.sf[i];
      const a = w2[2 * i];
      const b = w2[2 * i + 1];
      if (m && m.w !== null && a != null && b != null) {
        w3[i] = m.w === 0 ? a : b;
      } else {
        w3[i] = null;
      }
    }
  }
  const f = d.final?.[0];
  const champ = (f && f.w !== null && w3[0] != null && w3[1] != null)
    ? (f.w === 0 ? w3[0] : w3[1]) : null;

  const adv = new Array(16).fill(0);
  for (let leaf = 0; leaf < 16; leaf++) {
    let a = 0;
    const r16w = w1[Math.floor(leaf / 2)];
    if (r16w != null && r16w === leaf) {
      a = 1;
      const qfw = w2[Math.floor(leaf / 4)];
      if (qfw != null && qfw === leaf) {
        a = 2;
        const sfw = w3[Math.floor(leaf / 8)];
        if (sfw != null && sfw === leaf) {
          a = 3;
          if (champ === leaf) a = 4;
        }
      }
    }
    adv[leaf] = a;
  }

  return { champ, adv, w1, w2, w3 };
}

function analyzeNoR16(d: TournamentData): TournamentAnalysis {
  const w1: (number | null)[] = [null, null, null, null, null, null, null, null];
  const w2: (number | null)[] = [null, null, null, null];
  const w3: (number | null)[] = [null, null];
  let champ: number | null = null;

  if (d.qf) {
    for (let i = 0; i < 4; i++) {
      const m = d.qf[i];
      // QF matches use teams at positions 2*i and 2*i+1
      w1[i] = m && m.w !== null ? (2 * i + m.w) : null;
    }
  }
  if (d.sf) {
    for (let i = 0; i < 2; i++) {
      const m = d.sf[i];
      const a = w1[2 * i];
      const b = w1[2 * i + 1];
      if (m && m.w !== null && a != null && b != null) {
        w2[i] = m.w === 0 ? a : b;
      }
    }
  }
  const f = d.final?.[0];
  if (f && f.w !== null && w2[0] != null && w2[1] != null) {
    champ = f.w === 0 ? w2[0] : w2[1];
    w3[0] = champ;
  }

  const adv = new Array(16).fill(0);
  for (let leaf = 0; leaf < 16; leaf++) {
    let a = 0;
    const qfSlot = Math.floor(leaf / 2);
    if (qfSlot < 4 && w1[qfSlot] === leaf) {
      a = 1;
      const sfSlot = Math.floor(leaf / 4);
      if (sfSlot < 2 && w2[sfSlot] === leaf) {
        a = 2;
        if (champ === leaf) a = 3;
      }
    }
    adv[leaf] = a;
  }

  return { champ, adv, w1, w2, w3 };
}
