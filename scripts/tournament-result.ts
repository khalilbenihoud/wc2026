// Bracket resolution shared by prerender.ts and generate-og-images.ts, so the
// champion / runner-up / third-fourth a page prerenders always matches the card
// it advertises. Mirrors the TournamentPage helpers.
import { TOURNAMENTS } from "../src/data";

type T = (typeof TOURNAMENTS)[number];

function r16Winners(t: T): string[] {
  if (!t.r16) return [];
  const out: string[] = [];
  for (let i = 0; i < 8; i++) {
    const m = t.r16[i];
    if (!m || m.w === null) continue;
    out.push(m.w === 0 ? t.teams[2 * i] : t.teams[2 * i + 1]);
  }
  return out;
}

export function qfWinners(t: T): string[] {
  if (!t.qf) return [];
  const r16w = r16Winners(t);
  const out: string[] = [];
  for (let i = 0; i < 4; i++) {
    const m = t.qf[i];
    if (!m || m.w === null) continue;
    const a = r16w.length >= 8 ? r16w[2 * i] : t.teams[2 * i];
    const b = r16w.length >= 8 ? r16w[2 * i + 1] : t.teams[2 * i + 1];
    out.push(m.w === 0 ? a : b);
  }
  return out;
}

export function sfTeams(t: T): string[] {
  if (!t.sf) return [];
  const qfw = qfWinners(t);
  if (qfw.length < 4) return [];
  const out: string[] = [];
  for (let i = 0; i < 2; i++) {
    const m = t.sf[i];
    if (!m || m.w === null) continue;
    out.push(m.w === 0 ? qfw[2 * i] : qfw[2 * i + 1]);
  }
  return out;
}

export function champion(t: T): string | null {
  if (!t.final?.[0] || t.final[0].w === null) return null;
  const sf = sfTeams(t);
  if (sf.length < 2) return null;
  return t.final[0].w === 0 ? sf[0] : sf[1];
}

export function runnerUp(t: T): string | null {
  if (!t.final?.[0] || t.final[0].w === null) return null;
  const sf = sfTeams(t);
  if (sf.length < 2) return null;
  return t.final[0].w === 0 ? sf[1] : sf[0];
}

// Bronze/fourth from the third-place play-off — mirrors getThirdFourthCodes in
// TournamentPage so the prerendered standings match the app.
export function thirdFourth(t: T): [string | null, string | null] {
  if (!t.tp || t.tp.w === null || !t.sf) return [null, null];
  const qfw = qfWinners(t);
  if (qfw.length < 4) return [null, null];
  const s1 = t.sf[0];
  const s2 = t.sf[1];
  if (!s1 || s1.w === null || !s2 || s2.w === null) return [null, null];
  const tpA = s1.w === 0 ? qfw[1] : qfw[0]; // SF1 loser
  const tpB = s2.w === 0 ? qfw[3] : qfw[2]; // SF2 loser
  const third = t.tp.w === 0 ? tpA : tpB;
  const fourth = t.tp.w === 0 ? tpB : tpA;
  return [third, fourth];
}
