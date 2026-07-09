// Player of the Match award winners for all World Cup knockout matches.
// Historical data sourced from Wikipedia; 2026 from FIFA match reports.
// Keyed `${year}_${teamA}_${teamB}`. Both orientations stored; lookup tries both.

export interface PlayerOfMatch {
  name: string;
  team: string; // 3-letter FIFA code
}

const MOTM: Record<string, PlayerOfMatch> = {
  // ─── 2026 ────────────────────────────────────────────────────────────────
  // Michelob Ultra Superior Player of the Match (fifa.com)

  // Round of 32
  "2026_RSA_CAN": { name: "Stephen Eustaquio", team: "CAN" },
  "2026_GER_PAR": { name: "Orlando Gill", team: "PAR" },
  "2026_NED_MAR": { name: "Issa Diop", team: "MAR" },
  "2026_BRA_JPN": { name: "Casemiro", team: "BRA" },
  "2026_FRA_SWE": { name: "Kylian Mbappé", team: "FRA" },
  "2026_CIV_NOR": { name: "Antonio Nusa", team: "NOR" },
  "2026_MEX_ECU": { name: "Julián Quiñones", team: "MEX" },
  "2026_ENG_COD": { name: "Harry Kane", team: "ENG" },
  "2026_USA_BIH": { name: "Malik Tillman", team: "USA" },
  "2026_BEL_SEN": { name: "Youri Tielemans", team: "BEL" },
  "2026_POR_CRO": { name: "Cristiano Ronaldo", team: "POR" },
  "2026_ESP_AUT": { name: "Lamine Yamal", team: "ESP" },
  "2026_SUI_ALG": { name: "Breel Embolo", team: "SUI" },
  "2026_ARG_CPV": { name: "Lionel Messi", team: "ARG" },
  "2026_COL_GHA": { name: "Luis Díaz", team: "COL" },
  "2026_AUS_EGY": { name: "Mohamed Salah", team: "EGY" },

  // Round of 16
  "2026_PAR_FRA": { name: "Orlando Gill", team: "PAR" },
  "2026_CAN_MAR": { name: "Azzedine Ounahi", team: "MAR" },
  "2026_BRA_NOR": { name: "Erling Haaland", team: "NOR" },
  "2026_MEX_ENG": { name: "Jude Bellingham", team: "ENG" },
  "2026_POR_ESP": { name: "Rodri", team: "ESP" },
  "2026_USA_BEL": { name: "Charles De Ketelaere", team: "BEL" },
  "2026_ARG_EGY": { name: "Lionel Messi", team: "ARG" },
  "2026_SUI_COL": { name: "Gregor Kobel", team: "SUI" },

  // Quarter-finals
  "2026_FRA_MAR": { name: "Kylian Mbappé", team: "FRA" },

  // ─── 2022 ────────────────────────────────────────────────────────────────
  // Budweiser Player of the Match (Wikipedia)

  // Round of 16
  "2022_NED_USA": { name: "Denzel Dumfries", team: "NED" },
  "2022_ARG_AUS": { name: "Lionel Messi", team: "ARG" },
  "2022_JPN_CRO": { name: "Dominik Livaković", team: "CRO" },
  "2022_BRA_KOR": { name: "Neymar", team: "BRA" },
  "2022_MAR_ESP": { name: "Yassine Bounou", team: "MAR" },
  "2022_POR_SUI": { name: "Gonçalo Ramos", team: "POR" },
  "2022_ENG_SEN": { name: "Harry Kane", team: "ENG" },
  "2022_FRA_POL": { name: "Kylian Mbappé", team: "FRA" },

  // Quarter-finals
  "2022_NED_ARG": { name: "Lionel Messi", team: "ARG" },
  "2022_CRO_BRA": { name: "Dominik Livaković", team: "CRO" },
  "2022_MAR_POR": { name: "Youssef En-Nesyri", team: "MAR" },
  "2022_ENG_FRA": { name: "Antoine Griezmann", team: "FRA" },

  // Semi-finals
  "2022_ARG_CRO": { name: "Lionel Messi", team: "ARG" },
  "2022_MAR_FRA": { name: "Antoine Griezmann", team: "FRA" },

  // Third-place play-off
  "2022_CRO_MAR": { name: "Joško Gvardiol", team: "CRO" },

  // Final
  "2022_ARG_FRA": { name: "Lionel Messi", team: "ARG" },

  // ─── 2002 ────────────────────────────────────────────────────────────────

  // Round of 16
  "2002_GER_PAR": { name: "Oliver Neuville", team: "GER" },
  "2002_USA_MEX": { name: "Landon Donovan", team: "USA" },
  "2002_ESP_IRL": { name: "Iker Casillas", team: "ESP" },
  "2002_KOR_ITA": { name: "Ahn Jung-hwan", team: "KOR" },
  "2002_ENG_DEN": { name: "Rio Ferdinand", team: "ENG" },
  "2002_BRA_BEL": { name: "Rivaldo", team: "BRA" },
  "2002_SEN_SWE": { name: "Henri Camara", team: "SEN" },
  "2002_TUR_JPN": { name: "Alpay Özalan", team: "TUR" },

  // Quarter-finals
  "2002_GER_USA": { name: "Michael Ballack", team: "GER" },
  "2002_ESP_KOR": { name: "Hong Myung-bo", team: "KOR" },
  "2002_ENG_BRA": { name: "Ronaldinho", team: "BRA" },
  "2002_SEN_TUR": { name: "İlhan Mansız", team: "TUR" },

  // Semi-finals
  "2002_GER_KOR": { name: "Michael Ballack", team: "GER" },
  "2002_BRA_TUR": { name: "Ronaldo", team: "BRA" },

  // Third-place play-off
  "2002_KOR_TUR": { name: "Hakan Şükür", team: "TUR" },

  // Final
  "2002_GER_BRA": { name: "Ronaldo", team: "BRA" },

  // ─── 2006 ────────────────────────────────────────────────────────────────

  // Round of 16
  "2006_GER_SWE": { name: "Lukas Podolski", team: "GER" },
  "2006_ARG_MEX": { name: "Maxi Rodríguez", team: "ARG" },
  "2006_ITA_AUS": { name: "Fabio Cannavaro", team: "ITA" },
  "2006_SUI_UKR": { name: "Oleksandr Shovkovskyi", team: "UKR" },
  "2006_ENG_ECU": { name: "David Beckham", team: "ENG" },
  "2006_POR_NED": { name: "Maniche", team: "POR" },
  "2006_BRA_GHA": { name: "Ronaldo", team: "BRA" },
  "2006_ESP_FRA": { name: "Franck Ribéry", team: "FRA" },

  // Quarter-finals
  "2006_GER_ARG": { name: "Michael Ballack", team: "GER" },
  "2006_ITA_UKR": { name: "Gennaro Gattuso", team: "ITA" },
  "2006_ENG_POR": { name: "Owen Hargreaves", team: "POR" },
  "2006_BRA_FRA": { name: "Zinedine Zidane", team: "FRA" },

  // Semi-finals
  "2006_GER_ITA": { name: "Fabio Grosso", team: "ITA" },
  "2006_POR_FRA": { name: "Zinedine Zidane", team: "FRA" },

  // Third-place play-off
  "2006_GER_POR": { name: "Bastian Schweinsteiger", team: "GER" },

  // Final
  "2006_ITA_FRA": { name: "Andrea Pirlo", team: "ITA" },

  // ─── 2010 ────────────────────────────────────────────────────────────────

  // Round of 16
  "2010_URU_KOR": { name: "Luis Suárez", team: "URU" },
  "2010_USA_GHA": { name: "Asamoah Gyan", team: "GHA" },
  "2010_NED_SVK": { name: "Arjen Robben", team: "NED" },
  "2010_BRA_CHI": { name: "Juan", team: "BRA" },
  "2010_GER_ENG": { name: "Thomas Müller", team: "GER" },
  "2010_ARG_MEX": { name: "Carlos Tévez", team: "ARG" },
  "2010_PAR_JPN": { name: "Keisuke Honda", team: "PAR" },
  "2010_ESP_POR": { name: "David Villa", team: "ESP" },

  // Quarter-finals
  "2010_URU_GHA": { name: "Diego Forlán", team: "URU" },
  "2010_NED_BRA": { name: "Wesley Sneijder", team: "NED" },
  "2010_GER_ARG": { name: "Bastian Schweinsteiger", team: "GER" },
  "2010_PAR_ESP": { name: "Andrés Iniesta", team: "ESP" },

  // Semi-finals
  "2010_URU_NED": { name: "Wesley Sneijder", team: "NED" },
  "2010_GER_ESP": { name: "Carles Puyol", team: "ESP" },

  // Third-place play-off
  "2010_URU_GER": { name: "Thomas Müller", team: "GER" },

  // Final
  "2010_NED_ESP": { name: "Andrés Iniesta", team: "ESP" },

  // ─── 2014 ────────────────────────────────────────────────────────────────

  // Round of 16
  "2014_BRA_CHI": { name: "Júlio César", team: "BRA" },
  "2014_COL_URU": { name: "James Rodríguez", team: "COL" },
  "2014_FRA_NGA": { name: "Paul Pogba", team: "FRA" },
  "2014_GER_ALG": { name: "Rais M'Bolhi", team: "GER" },
  "2014_NED_MEX": { name: "Guillermo Ochoa", team: "NED" },
  "2014_CRC_GRE": { name: "Keylor Navas", team: "CRC" },
  "2014_ARG_SUI": { name: "Lionel Messi", team: "ARG" },
  "2014_BEL_USA": { name: "Tim Howard", team: "BEL" },

  // Quarter-finals
  "2014_BRA_COL": { name: "David Luiz", team: "BRA" },
  "2014_FRA_GER": { name: "Mats Hummels", team: "GER" },
  "2014_NED_CRC": { name: "Tim Krul", team: "NED" },
  "2014_ARG_BEL": { name: "Lionel Messi", team: "ARG" },

  // Semi-finals
  "2014_BRA_GER": { name: "Toni Kroos", team: "GER" },
  "2014_NED_ARG": { name: "Sergio Romero", team: "ARG" },

  // Third-place play-off
  "2014_BRA_NED": { name: "Arjen Robben", team: "NED" },

  // Final
  "2014_GER_ARG": { name: "Mario Götze", team: "GER" },

  // ─── 2018 ────────────────────────────────────────────────────────────────

  // Round of 16
  "2018_URU_POR": { name: "Edinson Cavani", team: "URU" },
  "2018_FRA_ARG": { name: "Kylian Mbappé", team: "FRA" },
  "2018_BRA_MEX": { name: "Neymar", team: "BRA" },
  "2018_BEL_JPN": { name: "Jan Vertonghen", team: "BEL" },
  "2018_SWE_SUI": { name: "Emil Forsberg", team: "SWE" },
  "2018_COL_ENG": { name: "Harry Kane", team: "ENG" },
  "2018_ESP_RUS": { name: "Igor Akinfeev", team: "RUS" },
  "2018_CRO_DEN": { name: "Luka Modrić", team: "CRO" },

  // Quarter-finals
  "2018_URU_FRA": { name: "Antoine Griezmann", team: "FRA" },
  "2018_BRA_BEL": { name: "Kevin De Bruyne", team: "BEL" },
  "2018_SWE_ENG": { name: "Harry Maguire", team: "ENG" },
  "2018_RUS_CRO": { name: "Luka Modrić", team: "CRO" },

  // Semi-finals
  "2018_FRA_BEL": { name: "Antoine Griezmann", team: "FRA" },
  "2018_ENG_CRO": { name: "Ivan Perišić", team: "CRO" },

  // Third-place play-off
  "2018_BEL_ENG": { name: "Eden Hazard", team: "BEL" },

  // Final
  "2018_FRA_CRO": { name: "Antoine Griezmann", team: "FRA" },
};

export function getPlayerOfMatch(
  year: number,
  teamA: string,
  teamB: string
): PlayerOfMatch | null {
  return (
    MOTM[`${year}_${teamA}_${teamB}`] ??
    MOTM[`${year}_${teamB}_${teamA}`] ??
    null
  );
}
