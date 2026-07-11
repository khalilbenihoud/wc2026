import { MatchStats } from "./stats";

// 2026 World Cup match statistics — sourced from the ESPN API
// (site.api.espn.com/.../fifa.world/summary). openfootball supplies scores and
// goalscorers; ESPN supplies possession / shots / fouls / cards, which it lacks.
// Keyed `${year}_${teamA}_${teamB}`, both orientations, oriented [teamA, teamB].
// Cards are bare 🟨/🟥 markers (per-team counts, no player detail).
const STATS_2026: Record<string, MatchStats> = {
  "2026_RSA_CAN": { cards: [[], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["58%", "42%"], totalShots: [6, 12], fouls: [10, 16] },
  "2026_CAN_RSA": { cards: [["🟨", "🟨"], []], subs: [[], []], pens: [[], []], possession: ["42%", "58%"], totalShots: [12, 6], fouls: [16, 10] },
  "2026_BRA_JPN": { cards: [["🟨", "🟨"], ["🟨", "🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["69%", "31%"], totalShots: [19, 5], fouls: [4, 13] },
  "2026_JPN_BRA": { cards: [["🟨", "🟨", "🟨"], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["31%", "69%"], totalShots: [5, 19], fouls: [13, 4] },
  "2026_GER_PAR": { cards: [["🟨", "🟨"], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["76%", "24%"], totalShots: [21, 7], fouls: [18, 12] },
  "2026_PAR_GER": { cards: [["🟨", "🟨"], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["24%", "76%"], totalShots: [7, 21], fouls: [12, 18] },
  "2026_NED_MAR": { cards: [[], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["30%", "70%"], totalShots: [6, 11], fouls: [18, 15] },
  "2026_MAR_NED": { cards: [["🟨"], []], subs: [[], []], pens: [[], []], possession: ["70%", "30%"], totalShots: [11, 6], fouls: [15, 18] },
  "2026_CIV_NOR": { cards: [[], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["47%", "53%"], totalShots: [14, 9], fouls: [6, 7] },
  "2026_NOR_CIV": { cards: [["🟨"], []], subs: [[], []], pens: [[], []], possession: ["53%", "47%"], totalShots: [9, 14], fouls: [7, 6] },
  "2026_FRA_SWE": { cards: [[], []], subs: [[], []], pens: [[], []], possession: ["61%", "39%"], totalShots: [25, 8], fouls: [14, 10] },
  "2026_SWE_FRA": { cards: [[], []], subs: [[], []], pens: [[], []], possession: ["39%", "61%"], totalShots: [8, 25], fouls: [10, 14] },
  "2026_MEX_ECU": { cards: [[], ["🟨", "🟨", "🟨", "🟥"]], subs: [[], []], pens: [[], []], possession: ["43%", "57%"], totalShots: [15, 7], fouls: [10, 14] },
  "2026_ECU_MEX": { cards: [["🟨", "🟨", "🟨", "🟥"], []], subs: [[], []], pens: [[], []], possession: ["57%", "43%"], totalShots: [7, 15], fouls: [14, 10] },
  "2026_ENG_COD": { cards: [["🟨"], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["60%", "40%"], totalShots: [16, 7], fouls: [10, 12] },
  "2026_COD_ENG": { cards: [["🟨"], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["40%", "60%"], totalShots: [7, 16], fouls: [12, 10] },
  "2026_BEL_SEN": { cards: [["🟨"], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["52%", "48%"], totalShots: [19, 19], fouls: [22, 12] },
  "2026_SEN_BEL": { cards: [["🟨"], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["48%", "52%"], totalShots: [19, 19], fouls: [12, 22] },
  "2026_USA_BIH": { cards: [["🟥"], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["48%", "52%"], totalShots: [8, 10], fouls: [7, 13] },
  "2026_BIH_USA": { cards: [["🟨"], ["🟥"]], subs: [[], []], pens: [[], []], possession: ["52%", "48%"], totalShots: [10, 8], fouls: [13, 7] },
  "2026_ESP_AUT": { cards: [[], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["64%", "36%"], totalShots: [23, 5], fouls: [8, 15] },
  "2026_AUT_ESP": { cards: [["🟨"], []], subs: [[], []], pens: [[], []], possession: ["36%", "64%"], totalShots: [5, 23], fouls: [15, 8] },
  "2026_POR_CRO": { cards: [["🟨"], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["60%", "40%"], totalShots: [15, 13], fouls: [6, 12] },
  "2026_CRO_POR": { cards: [["🟨", "🟨"], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["40%", "60%"], totalShots: [13, 15], fouls: [12, 6] },
  "2026_SUI_ALG": { cards: [[], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["44%", "56%"], totalShots: [11, 8], fouls: [10, 12] },
  "2026_ALG_SUI": { cards: [["🟨", "🟨"], []], subs: [[], []], pens: [[], []], possession: ["56%", "44%"], totalShots: [8, 11], fouls: [12, 10] },
  "2026_AUS_EGY": { cards: [[], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["42%", "58%"], totalShots: [16, 14], fouls: [12, 14] },
  "2026_EGY_AUS": { cards: [["🟨", "🟨"], []], subs: [[], []], pens: [[], []], possession: ["58%", "42%"], totalShots: [14, 16], fouls: [14, 12] },
  "2026_ARG_CPV": { cards: [["🟨"], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["64%", "36%"], totalShots: [22, 16], fouls: [13, 12] },
  "2026_CPV_ARG": { cards: [["🟨"], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["36%", "64%"], totalShots: [16, 22], fouls: [12, 13] },
  "2026_COL_GHA": { cards: [["🟨", "🟨"], ["🟨", "🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["61%", "39%"], totalShots: [20, 8], fouls: [14, 10] },
  "2026_GHA_COL": { cards: [["🟨", "🟨", "🟨"], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["39%", "61%"], totalShots: [8, 20], fouls: [10, 14] },
  "2026_CAN_MAR": { cards: [["🟨", "🟨", "🟨", "🟨"], ["🟨", "🟨", "🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["45%", "55%"], totalShots: [10, 5], fouls: [24, 14] },
  "2026_MAR_CAN": { cards: [["🟨", "🟨", "🟨", "🟨"], ["🟨", "🟨", "🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["55%", "45%"], totalShots: [5, 10], fouls: [14, 24] },
  "2026_PAR_FRA": { cards: [[], ["🟨", "🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["24%", "76%"], totalShots: [5, 15], fouls: [13, 11] },
  "2026_FRA_PAR": { cards: [["🟨", "🟨", "🟨"], []], subs: [[], []], pens: [[], []], possession: ["76%", "24%"], totalShots: [15, 5], fouls: [11, 13] },
  "2026_BRA_NOR": { cards: [["🟨"], []], subs: [[], []], pens: [[], []], possession: ["34%", "66%"], totalShots: [14, 9], fouls: [7, 6] },
  "2026_NOR_BRA": { cards: [[], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["66%", "34%"], totalShots: [9, 14], fouls: [6, 7] },
  "2026_MEX_ENG": { cards: [["🟨", "🟨"], ["🟨", "🟨", "🟨", "🟨", "🟥"]], subs: [[], []], pens: [[], []], possession: ["67%", "33%"], totalShots: [20, 6], fouls: [14, 7] },
  "2026_ENG_MEX": { cards: [["🟨", "🟨", "🟨", "🟨", "🟥"], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["33%", "67%"], totalShots: [6, 20], fouls: [7, 14] },
  "2026_POR_ESP": { cards: [["🟨", "🟨"], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["45%", "55%"], totalShots: [10, 15], fouls: [9, 13] },
  "2026_ESP_POR": { cards: [["🟨"], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["55%", "45%"], totalShots: [15, 10], fouls: [13, 9] },
  "2026_USA_BEL": { cards: [["🟨", "🟨"], []], subs: [[], []], pens: [[], []], possession: ["56%", "44%"], totalShots: [7, 15], fouls: [11, 9] },
  "2026_BEL_USA": { cards: [[], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["44%", "56%"], totalShots: [15, 7], fouls: [9, 11] },
  "2026_ARG_EGY": { cards: [[], ["🟨", "🟨", "🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["64%", "36%"], totalShots: [19, 5], fouls: [13, 11] },
  "2026_EGY_ARG": { cards: [["🟨", "🟨", "🟨", "🟨"], []], subs: [[], []], pens: [[], []], possession: ["36%", "64%"], totalShots: [5, 19], fouls: [11, 13] },
  "2026_SUI_COL": { cards: [["🟨", "🟨", "🟨"], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: undefined, totalShots: undefined, fouls: undefined },
  "2026_COL_SUI": { cards: [["🟨", "🟨"], ["🟨", "🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: undefined, totalShots: undefined, fouls: undefined },
  "2026_FRA_MAR": { cards: [[], ["🟨"]], subs: [[], []], pens: [[], []], possession: ["48%", "52%"], totalShots: [22, 5], fouls: [10, 13] },
  "2026_MAR_FRA": { cards: [["🟨"], []], subs: [[], []], pens: [[], []], possession: ["52%", "48%"], totalShots: [5, 22], fouls: [13, 10] },
  "2026_ESP_BEL": { cards: [["🟨", "🟨"], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["68%", "32%"], totalShots: [17, 5], fouls: [13, 18] },
  "2026_BEL_ESP": { cards: [["🟨", "🟨"], ["🟨", "🟨"]], subs: [[], []], pens: [[], []], possession: ["32%", "68%"], totalShots: [5, 17], fouls: [18, 13] },
};

export function getStats2026(year: number, teamA: string, teamB: string): MatchStats | null {
  return STATS_2026[`${year}_${teamA}_${teamB}`] ?? null;
}
