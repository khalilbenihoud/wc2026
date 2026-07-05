// Auto-generated from jfjelstul/worldcup dataset — DO NOT EDIT BY HAND.
// Key: `${year}_${teamA}_${teamB}` -> stats oriented [teamA, teamB].
// Both orientations are emitted so lookups work in either team order.

export interface MatchStats {
  cards: [string[], string[]];  // [teamA, teamB]
  subs: [string[], string[]];
  pens: [string[], string[]];  // penalty shootouts only
}

const STATS: Record<string, MatchStats> = {
  "1986_ARG_BEL": {
    cards: [["Jorge Valdano 33' 🟨"], ["Daniel Veyt 27' 🟨"]],
    subs: [["Jorge Burruchaga 85' → Ricardo Bochini 85'"], ["Michel Renquin 54' → Philippe Desmet 54'"]],
    pens: [[], []]
  },
  "1986_ARG_ENG": {
    cards: [["Sergio Batista 60' 🟨"], ["Terry Fenwick 9' 🟨"]],
    subs: [["Jorge Burruchaga 75' → Carlos Tapia 75'"], ["Peter Reid 69' → Chris Waddle 69'", "Trevor Steven 74' → John Barnes 74'"]],
    pens: [[], []]
  },
  "1986_ARG_FRG": {
    cards: [["Diego Maradona 17' 🟨", "Julio Olarticoechea 77' 🟨", "Héctor Enrique 81' 🟨", "Nery Pumpido 85' 🟨"], ["Lothar Matthäus 21' 🟨", "Hans-Peter Briegel 62' 🟨"]],
    subs: [["Jorge Burruchaga 90' → Marcelo Trobbiani 90'"], ["Klaus Allofs 46' → Rudi Völler 46'", "Felix Magath 62' → Dieter Hoeneß 62'"]],
    pens: [[], []]
  },
  "1986_ARG_URU": {
    cards: [["Oscar Garré 30' 🟨", "José Luis Brown 49' 🟨", "Nery Pumpido 83' 🟨"], ["Enzo Francescoli 35' 🟨", "Eduardo Mario Acevedo 58' 🟨", "Sergio Santín 68' 🟨", "Jorge da Silva 85' 🟨"]],
    subs: [["Sergio Batista 85' → Julio Olarticoechea 85'"], ["Wilmar Cabrera 46' → Jorge da Silva 46'", "Eduardo Mario Acevedo 61' → Rubén Paz 61'"]],
    pens: [[], []]
  },
  "1986_BEL_ARG": {
    cards: [["Daniel Veyt 27' 🟨"], ["Jorge Valdano 33' 🟨"]],
    subs: [["Michel Renquin 54' → Philippe Desmet 54'"], ["Jorge Burruchaga 85' → Ricardo Bochini 85'"]],
    pens: [[], []]
  },
  "1986_BEL_ESP": {
    cards: [["Stéphane Demol 24' 🟨", "Georges Grün 115' 🟨"], ["Tomás 39' 🟨", "Ramón Calderé 44' 🟨"]],
    subs: [["Daniel Veyt 82' → Hugo Broos 82'", "Franky Vercauteren 106' → Leo Van Der Elst 106'"], ["Tomás 46' → Juan Antonio Señor 46'", "Julio Salinas 63' → Eloy 63'"]],
    pens: [["Nico Claesen ✓", "Enzo Scifo ✓", "Hugo Broos ✓", "Patrick Vervoort ✓", "Leo Van Der Elst ✓"], ["Juan Antonio Señor ✓", "Eloy ✗", "Chendo ✓", "Emilio Butragueño ✓", "Víctor ✓"]]
  },
  "1986_BEL_URS": {
    cards: [["Michel Renquin 65' 🟨"], []],
    subs: [["Georges Grün 99' → Leo Clijsters 99'", "Eric Gerets 112' → Leo Van Der Elst 112'"], ["Oleksandr Zavarov 72' → Sergey Rodionov 72'", "Pavel Yakovenko 79' → Vadym Yevtushenko 79'"]],
    pens: [[], []]
  },
  "1986_BRA_FRA": {
    cards: [[], []],
    subs: [["Müller 71' → Zico 71'", "Júnior 91' → Paulo Silas 91'"], ["Alain Giresse 84' → Jean-Marc Ferreri 84'", "Dominique Rocheteau 99' → Bruno Bellone 99'"]],
    pens: [["Sócrates ✗", "Alemão ✓", "Zico ✓", "Branco ✓", "Júlio César ✗"], ["Yannick Stopyra ✓", "Manuel Amoros ✓", "Bruno Bellone ✓", "Michel Platini ✗", "Luis Fernández ✓"]]
  },
  "1986_BRA_POL": {
    cards: [["Careca 36' 🟨", "Edinho 83' 🟨"], ["Dariusz Dziekanowski 13' 🟨", "Zbigniew Boniek 30' 🟨", "Włodzimierz Smolarek 32' 🟨"]],
    subs: [["Sócrates 69' → Zico 69'", "Müller 73' → Paulo Silas 73'"], ["Kazimierz Przybyś 59' → Jan Furtok 59'", "Jan Urban 83' → Władysław Żmuda 83'"]],
    pens: [[], []]
  },
  "1986_BUL_MEX": {
    cards: [["Nikolay Arabov 58' 🟨"], []],
    subs: [["Plamen Getov 59' → Nasko Sirakov 59'", "Atanas Pashev 70' → Bozhidar Iskrenov 70'"], ["Tomás Boy 79' → Carlos de los Cobos 79'"]],
    pens: [[], []]
  },
  "1986_DEN_ESP": {
    cards: [["Henrik Andersen 26' 🟨"], ["Andoni Goikoetxea 27' 🟨", "José Antonio Camacho 32' 🟨", "Míchel 60' 🟨"]],
    subs: [["Henrik Andersen 60' → John Eriksen 60'", "Jesper Olsen 71' → Jan Mølby 71'"], ["Julio Salinas 46' → Eloy 46'", "Míchel 83' → Francisco 83'"]],
    pens: [[], []]
  },
  "1986_ENG_ARG": {
    cards: [["Terry Fenwick 9' 🟨"], ["Sergio Batista 60' 🟨"]],
    subs: [["Peter Reid 69' → Chris Waddle 69'", "Trevor Steven 74' → John Barnes 74'"], ["Jorge Burruchaga 75' → Carlos Tapia 75'"]],
    pens: [[], []]
  },
  "1986_ENG_PAR": {
    cards: [["Alvin Martin 37' 🟨", "Steve Hodge 67' 🟨"], ["Jorge Amado Nunes 60' 🟨"]],
    subs: [["Peter Reid 58' → Gary Stevens 58'", "Peter Beardsley 80' → Mark Hateley 80'"], ["Juan Torales 64' → Jorge Guasch 64'"]],
    pens: [[], []]
  },
  "1986_ESP_BEL": {
    cards: [["Tomás 39' 🟨", "Ramón Calderé 44' 🟨"], ["Stéphane Demol 24' 🟨", "Georges Grün 115' 🟨"]],
    subs: [["Tomás 46' → Juan Antonio Señor 46'", "Julio Salinas 63' → Eloy 63'"], ["Daniel Veyt 82' → Hugo Broos 82'", "Franky Vercauteren 106' → Leo Van Der Elst 106'"]],
    pens: [["Juan Antonio Señor ✓", "Eloy ✗", "Chendo ✓", "Emilio Butragueño ✓", "Víctor ✓"], ["Nico Claesen ✓", "Enzo Scifo ✓", "Hugo Broos ✓", "Patrick Vervoort ✓", "Leo Van Der Elst ✓"]]
  },
  "1986_ESP_DEN": {
    cards: [["Andoni Goikoetxea 27' 🟨", "José Antonio Camacho 32' 🟨", "Míchel 60' 🟨"], ["Henrik Andersen 26' 🟨"]],
    subs: [["Julio Salinas 46' → Eloy 46'", "Míchel 83' → Francisco 83'"], ["Henrik Andersen 60' → John Eriksen 60'", "Jesper Olsen 71' → Jan Mølby 71'"]],
    pens: [[], []]
  },
  "1986_FRA_BRA": {
    cards: [[], []],
    subs: [["Alain Giresse 84' → Jean-Marc Ferreri 84'", "Dominique Rocheteau 99' → Bruno Bellone 99'"], ["Müller 71' → Zico 71'", "Júnior 91' → Paulo Silas 91'"]],
    pens: [["Yannick Stopyra ✓", "Manuel Amoros ✓", "Bruno Bellone ✓", "Michel Platini ✗", "Luis Fernández ✓"], ["Sócrates ✗", "Alemão ✓", "Zico ✓", "Branco ✓", "Júlio César ✗"]]
  },
  "1986_FRA_FRG": {
    cards: [["Luis Fernández 89' 🟨"], ["Felix Magath 59' 🟨"]],
    subs: [["Bruno Bellone 66' → Daniel Xuereb 66'", "Alain Giresse 72' → Philippe Vercruysse 72'"], ["Karl-Heinz Rummenigge 57' → Rudi Völler 57'"]],
    pens: [[], []]
  },
  "1986_FRA_ITA": {
    cards: [["William Ayache 40' 🟨"], ["Fernando De Napoli 16' 🟨", "Antonio Di Gennaro 67' 🟨"]],
    subs: [["Luis Fernández 73' → Thierry Tusseau 73'", "Michel Platini 85' → Jean-Marc Ferreri 85'"], ["Giuseppe Baresi 46' → Antonio Di Gennaro 46'", "Giuseppe Galderisi 58' → Gianluca Vialli 58'"]],
    pens: [[], []]
  },
  "1986_FRG_ARG": {
    cards: [["Lothar Matthäus 21' 🟨", "Hans-Peter Briegel 62' 🟨"], ["Diego Maradona 17' 🟨", "Julio Olarticoechea 77' 🟨", "Héctor Enrique 81' 🟨", "Nery Pumpido 85' 🟨"]],
    subs: [["Klaus Allofs 46' → Rudi Völler 46'", "Felix Magath 62' → Dieter Hoeneß 62'"], ["Jorge Burruchaga 90' → Marcelo Trobbiani 90'"]],
    pens: [[], []]
  },
  "1986_FRG_FRA": {
    cards: [["Felix Magath 59' 🟨"], ["Luis Fernández 89' 🟨"]],
    subs: [["Karl-Heinz Rummenigge 57' → Rudi Völler 57'"], ["Bruno Bellone 66' → Daniel Xuereb 66'", "Alain Giresse 72' → Philippe Vercruysse 72'"]],
    pens: [[], []]
  },
  "1986_FRG_MAR": {
    cards: [[], ["Abdelmajid Lamriss 29' 🟨", "Labid Khalifa 65' 🟨"]],
    subs: [["Rudi Völler 46' → Pierre Littbarski 46'"], []],
    pens: [[], []]
  },
  "1986_FRG_MEX": {
    cards: [["Klaus Allofs 27' 🟨", "Karlheinz Förster 56' 🟨", "Thomas Berthold 65' 🟥", "Lothar Matthäus 86' 🟨"], ["Javier Aguirre 20' 🟨", "Fernando Quirarte 27' 🟨", "Carlos de los Cobos 75' 🟨", "Raúl Servín 83' 🟨", "Hugo Sánchez 94' 🟨"]],
    subs: [["Karl-Heinz Rummenigge 59' → Dieter Hoeneß 59'", "Norbert Eder 116' → Pierre Littbarski 116'"], ["Tomás Boy 32' → Carlos de los Cobos 32'", "Rafael Amador 69' → Francisco Javier Cruz 69'"]],
    pens: [["Klaus Allofs ✓", "Andreas Brehme ✓", "Lothar Matthäus ✓", "Pierre Littbarski ✓"], ["Manuel Negrete ✓", "Fernando Quirarte ✗", "Raúl Servín ✗"]]
  },
  "1986_ITA_FRA": {
    cards: [["Fernando De Napoli 16' 🟨", "Antonio Di Gennaro 67' 🟨"], ["William Ayache 40' 🟨"]],
    subs: [["Giuseppe Baresi 46' → Antonio Di Gennaro 46'", "Giuseppe Galderisi 58' → Gianluca Vialli 58'"], ["Luis Fernández 73' → Thierry Tusseau 73'", "Michel Platini 85' → Jean-Marc Ferreri 85'"]],
    pens: [[], []]
  },
  "1986_MAR_FRG": {
    cards: [["Abdelmajid Lamriss 29' 🟨", "Labid Khalifa 65' 🟨"], []],
    subs: [[], ["Rudi Völler 46' → Pierre Littbarski 46'"]],
    pens: [[], []]
  },
  "1986_MEX_BUL": {
    cards: [[], ["Nikolay Arabov 58' 🟨"]],
    subs: [["Tomás Boy 79' → Carlos de los Cobos 79'"], ["Plamen Getov 59' → Nasko Sirakov 59'", "Atanas Pashev 70' → Bozhidar Iskrenov 70'"]],
    pens: [[], []]
  },
  "1986_MEX_FRG": {
    cards: [["Javier Aguirre 20' 🟨", "Fernando Quirarte 27' 🟨", "Carlos de los Cobos 75' 🟨", "Raúl Servín 83' 🟨", "Hugo Sánchez 94' 🟨"], ["Klaus Allofs 27' 🟨", "Karlheinz Förster 56' 🟨", "Thomas Berthold 65' 🟥", "Lothar Matthäus 86' 🟨"]],
    subs: [["Tomás Boy 32' → Carlos de los Cobos 32'", "Rafael Amador 69' → Francisco Javier Cruz 69'"], ["Karl-Heinz Rummenigge 59' → Dieter Hoeneß 59'", "Norbert Eder 116' → Pierre Littbarski 116'"]],
    pens: [["Manuel Negrete ✓", "Fernando Quirarte ✗", "Raúl Servín ✗"], ["Klaus Allofs ✓", "Andreas Brehme ✓", "Lothar Matthäus ✓", "Pierre Littbarski ✓"]]
  },
  "1986_PAR_ENG": {
    cards: [["Jorge Amado Nunes 60' 🟨"], ["Alvin Martin 37' 🟨", "Steve Hodge 67' 🟨"]],
    subs: [["Juan Torales 64' → Jorge Guasch 64'"], ["Peter Reid 58' → Gary Stevens 58'", "Peter Beardsley 80' → Mark Hateley 80'"]],
    pens: [[], []]
  },
  "1986_POL_BRA": {
    cards: [["Dariusz Dziekanowski 13' 🟨", "Zbigniew Boniek 30' 🟨", "Włodzimierz Smolarek 32' 🟨"], ["Careca 36' 🟨", "Edinho 83' 🟨"]],
    subs: [["Kazimierz Przybyś 59' → Jan Furtok 59'", "Jan Urban 83' → Władysław Żmuda 83'"], ["Sócrates 69' → Zico 69'", "Müller 73' → Paulo Silas 73'"]],
    pens: [[], []]
  },
  "1986_URS_BEL": {
    cards: [[], ["Michel Renquin 65' 🟨"]],
    subs: [["Oleksandr Zavarov 72' → Sergey Rodionov 72'", "Pavel Yakovenko 79' → Vadym Yevtushenko 79'"], ["Georges Grün 99' → Leo Clijsters 99'", "Eric Gerets 112' → Leo Van Der Elst 112'"]],
    pens: [[], []]
  },
  "1986_URU_ARG": {
    cards: [["Enzo Francescoli 35' 🟨", "Eduardo Mario Acevedo 58' 🟨", "Sergio Santín 68' 🟨", "Jorge da Silva 85' 🟨"], ["Oscar Garré 30' 🟨", "José Luis Brown 49' 🟨", "Nery Pumpido 83' 🟨"]],
    subs: [["Wilmar Cabrera 46' → Jorge da Silva 46'", "Eduardo Mario Acevedo 61' → Rubén Paz 61'"], ["Sergio Batista 85' → Julio Olarticoechea 85'"]],
    pens: [[], []]
  },
  "1990_ARG_BRA": {
    cards: [["Pedro Monzón 27' 🟨", "Ricardo Giusti 28' 🟨", "Sergio Goycochea 87' 🟨"], ["Ricardo Rocha 40' 🟨", "Mauro Galvão 50' 🟨", "Ricardo Gomes 85' 🟥"]],
    subs: [["Pedro Troglio 61' → Gabriel Calderón 61'"], ["Mauro Galvão 84' → Paulo Silas 84'", "Alemão 84' → Renato Gaúcho 84'"]],
    pens: [[], []]
  },
  "1990_ARG_FRG": {
    cards: [["Gustavo Dezotti 5' 🟥", "Pedro Monzón 65' 🟥", "Pedro Troglio 84' 🟨", "Diego Maradona 87' 🟨"], ["Rudi Völler 52' 🟨"]],
    subs: [["Oscar Ruggeri 46' → Pedro Monzón 46'", "Jorge Burruchaga 53' → Gabriel Calderón 53'"], ["Thomas Berthold 73' → Stefan Reuter 73'"]],
    pens: [[], []]
  },
  "1990_ARG_ITA": {
    cards: [["Ricardo Giusti 30' 🟨", "Oscar Ruggeri 71' 🟨", "Julio Olarticoechea 76' 🟨", "Claudio Caniggia 82' 🟨", "Sergio Batista 118' 🟨"], ["Giuseppe Giannini 22' 🟨"]],
    subs: [["Gabriel Calderón 46' → Pedro Troglio 46'", "José Basualdo 99' → Sergio Batista 99'"], ["Gianluca Vialli 70' → Aldo Serena 70'", "Giuseppe Giannini 73' → Roberto Baggio 73'"]],
    pens: [["José Serrizuela ✓", "Jorge Burruchaga ✓", "Julio Olarticoechea ✓", "Diego Maradona ✓"], ["Franco Baresi ✓", "Roberto Baggio ✓", "Luigi De Agostini ✓", "Roberto Donadoni ✗", "Aldo Serena ✗"]]
  },
  "1990_ARG_YUG": {
    cards: [["José Serrizuela 21' 🟨", "Julio Olarticoechea 41' 🟨", "Pedro Troglio 61' 🟨", "Juan Simón 111' 🟨"], ["Refik Šabanadžović 24' 🟨"]],
    subs: [["Julio Olarticoechea 51' → Pedro Troglio 51'", "Gabriel Calderón 87' → Gustavo Dezotti 87'"], ["Safet Sušić 61' → Dejan Savićević 61'"]],
    pens: [["José Serrizuela ✓", "Jorge Burruchaga ✓", "Diego Maradona ✗", "Pedro Troglio ✗", "Gustavo Dezotti ✓"], ["Dragan Stojković ✗", "Robert Prosinečki ✓", "Dejan Savićević ✓", "Dragoljub Brnović ✗", "Faruk Hadžibegić ✗"]]
  },
  "1990_BEL_ENG": {
    cards: [[], ["Paul Gascoigne 85' 🟨"]],
    subs: [["Marc Degryse 64' → Nico Claesen 64'", "Bruno Versavel 107' → Patrick Vervoort 107'"], ["Steve McMahon 71' → David Platt 71'", "John Barnes 74' → Steve Bull 74'"]],
    pens: [[], []]
  },
  "1990_BRA_ARG": {
    cards: [["Ricardo Rocha 40' 🟨", "Mauro Galvão 50' 🟨", "Ricardo Gomes 85' 🟥"], ["Pedro Monzón 27' 🟨", "Ricardo Giusti 28' 🟨", "Sergio Goycochea 87' 🟨"]],
    subs: [["Mauro Galvão 84' → Paulo Silas 84'", "Alemão 84' → Renato Gaúcho 84'"], ["Pedro Troglio 61' → Gabriel Calderón 61'"]],
    pens: [[], []]
  },
  "1990_CMR_COL": {
    cards: [["André Kana-Biyik 44' 🟨", "Victor N'Dip 47' 🟨", "Émile Mbouh 68' 🟨", "Jules Onana 117' 🟨"], ["Luis Carlos Perea 72' 🟨", "Gabriel Gómez 74' 🟨"]],
    subs: [["Louis-Paul M'Fédé 54' → Roger Milla 54'", "Cyrille Makanaky 69' → Bonaventure Djonkep 69'"], ["Luis Fajardo 63' → Arnoldo Iguarán 63'", "Gabriel Gómez 79' → Bernardo Redín 79'"]],
    pens: [[], []]
  },
  "1990_CMR_ENG": {
    cards: [["Benjamin Massing 28' 🟨", "Thomas N'Kono 104' 🟨", "Roger Milla 120' 🟨"], ["Stuart Pearce 70' 🟨"]],
    subs: [["Emmanuel Maboang 46' → Roger Milla 46'", "Louis-Paul M'Fédé 62' → Eugène Ekéké 62'"], ["John Barnes 46' → Peter Beardsley 46'", "Terry Butcher 73' → Trevor Steven 73'"]],
    pens: [[], []]
  },
  "1990_COL_CMR": {
    cards: [["Luis Carlos Perea 72' 🟨", "Gabriel Gómez 74' 🟨"], ["André Kana-Biyik 44' 🟨", "Victor N'Dip 47' 🟨", "Émile Mbouh 68' 🟨", "Jules Onana 117' 🟨"]],
    subs: [["Luis Fajardo 63' → Arnoldo Iguarán 63'", "Gabriel Gómez 79' → Bernardo Redín 79'"], ["Louis-Paul M'Fédé 54' → Roger Milla 54'", "Cyrille Makanaky 69' → Bonaventure Djonkep 69'"]],
    pens: [[], []]
  },
  "1990_CRC_TCH": {
    cards: [["Rónald González Brenes 6' 🟨", "Héctor Marchena 75' 🟨"], ["Ivan Hašek 53' 🟨", "Ján Kocian 56' 🟨", "František Straka 68' 🟨"]],
    subs: [["Marvin Obando 46' → Hernán Medford 46'", "Germán Chavarría 65' → Alexandre Guimarães 65'"], []],
    pens: [[], []]
  },
  "1990_ENG_BEL": {
    cards: [["Paul Gascoigne 85' 🟨"], []],
    subs: [["Steve McMahon 71' → David Platt 71'", "John Barnes 74' → Steve Bull 74'"], ["Marc Degryse 64' → Nico Claesen 64'", "Bruno Versavel 107' → Patrick Vervoort 107'"]],
    pens: [[], []]
  },
  "1990_ENG_CMR": {
    cards: [["Stuart Pearce 70' 🟨"], ["Benjamin Massing 28' 🟨", "Thomas N'Kono 104' 🟨", "Roger Milla 120' 🟨"]],
    subs: [["John Barnes 46' → Peter Beardsley 46'", "Terry Butcher 73' → Trevor Steven 73'"], ["Emmanuel Maboang 46' → Roger Milla 46'", "Louis-Paul M'Fédé 62' → Eugène Ekéké 62'"]],
    pens: [[], []]
  },
  "1990_ENG_FRG": {
    cards: [["Paul Parker 66' 🟨", "Paul Gascoigne 99' 🟨"], ["Andreas Brehme 109' 🟨"]],
    subs: [["Terry Butcher 70' → Trevor Steven 70'"], ["Rudi Völler 38' → Karl-Heinz Riedle 38'", "Thomas Häßler 66' → Stefan Reuter 66'"]],
    pens: [["Gary Lineker ✓", "Peter Beardsley ✓", "David Platt ✓", "Stuart Pearce ✗", "Chris Waddle ✗"], ["Andreas Brehme ✓", "Lothar Matthäus ✓", "Karl-Heinz Riedle ✓", "Olaf Thon ✓"]]
  },
  "1990_ESP_YUG": {
    cards: [["Roberto 92' 🟨", "Chendo 110' 🟨"], ["Srečko Katanec 7' 🟨", "Zlatko Vujović 60' 🟨", "Zoran Vulić 97' 🟨"]],
    subs: [["Genar Andrinúa 49' → Manuel Jiménez 49'", "Emilio Butragueño 79' → Rafael Paz 79'"], ["Darko Pančev 55' → Dejan Savićević 55'", "Srečko Katanec 79' → Zoran Vulić 79'"]],
    pens: [[], []]
  },
  "1990_FRG_ARG": {
    cards: [["Rudi Völler 52' 🟨"], ["Gustavo Dezotti 5' 🟥", "Pedro Monzón 65' 🟥", "Pedro Troglio 84' 🟨", "Diego Maradona 87' 🟨"]],
    subs: [["Thomas Berthold 73' → Stefan Reuter 73'"], ["Oscar Ruggeri 46' → Pedro Monzón 46'", "Jorge Burruchaga 53' → Gabriel Calderón 53'"]],
    pens: [[], []]
  },
  "1990_FRG_ENG": {
    cards: [["Andreas Brehme 109' 🟨"], ["Paul Parker 66' 🟨", "Paul Gascoigne 99' 🟨"]],
    subs: [["Rudi Völler 38' → Karl-Heinz Riedle 38'", "Thomas Häßler 66' → Stefan Reuter 66'"], ["Terry Butcher 70' → Trevor Steven 70'"]],
    pens: [["Andreas Brehme ✓", "Lothar Matthäus ✓", "Karl-Heinz Riedle ✓", "Olaf Thon ✓"], ["Gary Lineker ✓", "Peter Beardsley ✓", "David Platt ✓", "Stuart Pearce ✗", "Chris Waddle ✗"]]
  },
  "1990_FRG_NED": {
    cards: [["Rudi Völler 21' 🟥", "Lothar Matthäus 77' 🟨"], ["Frank Rijkaard 21' 🟥", "Jan Wouters 32' 🟨", "Marco van Basten 72' 🟨"]],
    subs: [["Jürgen Klinsmann 77' → Karl-Heinz Riedle 77'"], ["Berry van Aerle 66' → Wim Kieft 66'", "Richard Witschge 78' → Hans Gillhaus 78'"]],
    pens: [[], []]
  },
  "1990_FRG_TCH": {
    cards: [["Jürgen Klinsmann 28' 🟨"], ["Ľubomír Moravčík 11' 🟨", "Michal Bílek 14' 🟨", "František Straka 38' 🟨", "Ivo Knoflíček 88' 🟨"]],
    subs: [["Uwe Bein 82' → Andreas Möller 82'"], ["Michal Bílek 67' → Václav Němeček 67'", "Luboš Kubík 79' → Stanislav Griga 79'"]],
    pens: [[], []]
  },
  "1990_IRL_ITA": {
    cards: [["Kevin Moran 43' 🟨"], ["Luigi De Agostini 36' 🟨"]],
    subs: [["Niall Quinn 53' → Tony Cascarino 53'", "John Aldridge 78' → John Sheridan 78'"], ["Giuseppe Giannini 62' → Carlo Ancelotti 62'", "Roberto Baggio 70' → Aldo Serena 70'"]],
    pens: [[], []]
  },
  "1990_IRL_ROU": {
    cards: [["John Aldridge 17' 🟨", "Paul McGrath 108' 🟨"], ["Gheorghe Hagi 111' 🟨", "Dănuț Lupu 114' 🟨"]],
    subs: [["John Aldridge 22' → Tony Cascarino 22'", "Steve Staunton 94' → David O'Leary 94'"], ["Florin Răducioiu 74' → Dănuț Lupu 74'", "Ioan Sabău 98' → Daniel Timofte 98'"]],
    pens: [["Kevin Sheedy ✓", "Ray Houghton ✓", "Andy Townsend ✓", "Tony Cascarino ✓", "David O'Leary ✓"], ["Gheorghe Hagi ✓", "Dănuț Lupu ✓", "Iosif Rotariu ✓", "Ioan Lupescu ✓", "Daniel Timofte ✗"]]
  },
  "1990_ITA_ARG": {
    cards: [["Giuseppe Giannini 22' 🟨"], ["Ricardo Giusti 30' 🟨", "Oscar Ruggeri 71' 🟨", "Julio Olarticoechea 76' 🟨", "Claudio Caniggia 82' 🟨", "Sergio Batista 118' 🟨"]],
    subs: [["Gianluca Vialli 70' → Aldo Serena 70'", "Giuseppe Giannini 73' → Roberto Baggio 73'"], ["Gabriel Calderón 46' → Pedro Troglio 46'", "José Basualdo 99' → Sergio Batista 99'"]],
    pens: [["Franco Baresi ✓", "Roberto Baggio ✓", "Luigi De Agostini ✓", "Roberto Donadoni ✗", "Aldo Serena ✗"], ["José Serrizuela ✓", "Jorge Burruchaga ✓", "Julio Olarticoechea ✓", "Diego Maradona ✓"]]
  },
  "1990_ITA_IRL": {
    cards: [["Luigi De Agostini 36' 🟨"], ["Kevin Moran 43' 🟨"]],
    subs: [["Giuseppe Giannini 62' → Carlo Ancelotti 62'", "Roberto Baggio 70' → Aldo Serena 70'"], ["Niall Quinn 53' → Tony Cascarino 53'", "John Aldridge 78' → John Sheridan 78'"]],
    pens: [[], []]
  },
  "1990_ITA_URU": {
    cards: [["Nicola Berti 36' 🟨"], ["José Pintos Saldanha 14' 🟨", "Fernando Álvez 26' 🟨", "José Perdomo 35' 🟨", "Nelson Gutiérrez 65' 🟨"]],
    subs: [["Nicola Berti 52' → Aldo Serena 52'", "Roberto Baggio 79' → Pietro Vierchowod 79'"], ["Carlos Aguilera 55' → Rubén Sosa 55'", "Santiago Ostolaza 79' → Antonio Alzamendi 79'"]],
    pens: [[], []]
  },
  "1990_NED_FRG": {
    cards: [["Frank Rijkaard 21' 🟥", "Jan Wouters 32' 🟨", "Marco van Basten 72' 🟨"], ["Rudi Völler 21' 🟥", "Lothar Matthäus 77' 🟨"]],
    subs: [["Berry van Aerle 66' → Wim Kieft 66'", "Richard Witschge 78' → Hans Gillhaus 78'"], ["Jürgen Klinsmann 77' → Karl-Heinz Riedle 77'"]],
    pens: [[], []]
  },
  "1990_ROU_IRL": {
    cards: [["Gheorghe Hagi 111' 🟨", "Dănuț Lupu 114' 🟨"], ["John Aldridge 17' 🟨", "Paul McGrath 108' 🟨"]],
    subs: [["Florin Răducioiu 74' → Dănuț Lupu 74'", "Ioan Sabău 98' → Daniel Timofte 98'"], ["John Aldridge 22' → Tony Cascarino 22'", "Steve Staunton 94' → David O'Leary 94'"]],
    pens: [["Gheorghe Hagi ✓", "Dănuț Lupu ✓", "Iosif Rotariu ✓", "Ioan Lupescu ✓", "Daniel Timofte ✗"], ["Kevin Sheedy ✓", "Ray Houghton ✓", "Andy Townsend ✓", "Tony Cascarino ✓", "David O'Leary ✓"]]
  },
  "1990_TCH_CRC": {
    cards: [["Ivan Hašek 53' 🟨", "Ján Kocian 56' 🟨", "František Straka 68' 🟨"], ["Rónald González Brenes 6' 🟨", "Héctor Marchena 75' 🟨"]],
    subs: [[], ["Marvin Obando 46' → Hernán Medford 46'", "Germán Chavarría 65' → Alexandre Guimarães 65'"]],
    pens: [[], []]
  },
  "1990_TCH_FRG": {
    cards: [["Ľubomír Moravčík 11' 🟨", "Michal Bílek 14' 🟨", "František Straka 38' 🟨", "Ivo Knoflíček 88' 🟨"], ["Jürgen Klinsmann 28' 🟨"]],
    subs: [["Michal Bílek 67' → Václav Němeček 67'", "Luboš Kubík 79' → Stanislav Griga 79'"], ["Uwe Bein 82' → Andreas Möller 82'"]],
    pens: [[], []]
  },
  "1990_URU_ITA": {
    cards: [["José Pintos Saldanha 14' 🟨", "Fernando Álvez 26' 🟨", "José Perdomo 35' 🟨", "Nelson Gutiérrez 65' 🟨"], ["Nicola Berti 36' 🟨"]],
    subs: [["Carlos Aguilera 55' → Rubén Sosa 55'", "Santiago Ostolaza 79' → Antonio Alzamendi 79'"], ["Nicola Berti 52' → Aldo Serena 52'", "Roberto Baggio 79' → Pietro Vierchowod 79'"]],
    pens: [[], []]
  },
  "1990_YUG_ARG": {
    cards: [["Refik Šabanadžović 24' 🟨"], ["José Serrizuela 21' 🟨", "Julio Olarticoechea 41' 🟨", "Pedro Troglio 61' 🟨", "Juan Simón 111' 🟨"]],
    subs: [["Safet Sušić 61' → Dejan Savićević 61'"], ["Julio Olarticoechea 51' → Pedro Troglio 51'", "Gabriel Calderón 87' → Gustavo Dezotti 87'"]],
    pens: [["Dragan Stojković ✗", "Robert Prosinečki ✓", "Dejan Savićević ✓", "Dragoljub Brnović ✗", "Faruk Hadžibegić ✗"], ["José Serrizuela ✓", "Jorge Burruchaga ✓", "Diego Maradona ✗", "Pedro Troglio ✗", "Gustavo Dezotti ✓"]]
  },
  "1990_YUG_ESP": {
    cards: [["Srečko Katanec 7' 🟨", "Zlatko Vujović 60' 🟨", "Zoran Vulić 97' 🟨"], ["Roberto 92' 🟨", "Chendo 110' 🟨"]],
    subs: [["Darko Pančev 55' → Dejan Savićević 55'", "Srečko Katanec 79' → Zoran Vulić 79'"], ["Genar Andrinúa 49' → Manuel Jiménez 49'", "Emilio Butragueño 79' → Rafael Paz 79'"]],
    pens: [[], []]
  },
  "1994_ARG_ROU": {
    cards: [["Oscar Ruggeri 33' 🟨", "Fernando Redondo 55' 🟨", "José Chamot 56' 🟨", "Fernando Cáceres 83' 🟨"], ["Gheorghe Popescu 50' 🟨", "Tibor Selymes 68' 🟨", "Ilie Dumitrescu 84' 🟨"]],
    subs: [["Roberto Néstor Sensini 63' → Ramón Medina Bello 63'"], ["Gheorghe Hagi 86' → Constantin Gâlcă 86'", "Ilie Dumitrescu 89' → Corneliu Papură 89'"]],
    pens: [[], []]
  },
  "1994_BEL_GER": {
    cards: [["Philippe Albert 38' 🟨"], ["Thomas Helmer 13' 🟨", "Martin Wagner 37' 🟨"]],
    subs: [["Rudi Smidts 66' → Danny Boffin 66'", "Luc Nilis 78' → Alexandre Czerniatynski 78'"], ["Lothar Matthäus 45' → Andreas Brehme 45'", "Jürgen Klinsmann 86' → Stefan Kuntz 86'"]],
    pens: [[], []]
  },
  "1994_BRA_ITA": {
    cards: [["Mazinho 4' 🟨", "Cafu 87' 🟨"], ["Luigi Apolloni 41' 🟨", "Demetrio Albertini 42' 🟨"]],
    subs: [["Jorginho 21' → Cafu 21'", "Zinho 106' → Viola 106'"], ["Roberto Mussi 35' → Luigi Apolloni 35'", "Dino Baggio 95' → Alberigo Evani 95'"]],
    pens: [["Márcio Santos ✗", "Romário ✓", "Branco ✓", "Dunga ✓"], ["Franco Baresi ✗", "Demetrio Albertini ✓", "Alberigo Evani ✓", "Daniele Massaro ✗", "Roberto Baggio ✗"]]
  },
  "1994_BRA_NED": {
    cards: [["Dunga 74' 🟨"], ["Aron Winter 40' 🟨", "Jan Wouters 89' 🟨"]],
    subs: [["Mazinho 81' → Raí 81'", "Branco 90' → Cafu 90'"], ["Peter van Vossen 54' → Bryan Roy 54'", "Frank Rijkaard 65' → Ronald de Boer 65'"]],
    pens: [[], []]
  },
  "1994_BRA_SWE": {
    cards: [["Zinho 3' 🟨"], ["Roger Ljung 29' 🟨", "Jonas Thern 63' 🟥", "Tomas Brolin 86' 🟨"]],
    subs: [["Mazinho 45' → Raí 45'"], ["Martin Dahlin 68' → Stefan Rehn 68'"]],
    pens: [[], []]
  },
  "1994_BRA_USA": {
    cards: [["Mazinho 8' 🟨", "Jorginho 16' 🟨", "Leonardo 43' 🟥"], ["Tab Ramos 43' 🟨", "Paul Caligiuri 49' 🟨", "Fernando Clavijo 64' 🟨", "Thomas Dooley 80' 🟨"]],
    subs: [["Zinho 69' → Cafu 69'"], ["Tab Ramos 45' → Eric Wynalda 45'", "Hugo Pérez 66' → Roy Wegerle 66'"]],
    pens: [[], []]
  },
  "1994_BUL_GER": {
    cards: [["Trifon Ivanov 22' 🟨", "Hristo Stoichkov 82' 🟨", "Borislav Mihaylov 85' 🟨"], ["Thomas Helmer 14' 🟨", "Martin Wagner 15' 🟨", "Thomas Häßler 49' 🟨", "Jürgen Klinsmann 50' 🟨", "Rudi Völler 89' 🟨"]],
    subs: [["Hristo Stoichkov 85' → Ivaylo Yordanov 85'", "Emil Kostadinov 90' → Boncho Genchev 90'"], ["Martin Wagner 59' → Thomas Strunz 59'", "Thomas Häßler 83' → Andreas Brehme 83'"]],
    pens: [[], []]
  },
  "1994_BUL_ITA": {
    cards: [["Emil Kostadinov 52' 🟨", "Yordan Letchkov 65' 🟨", "Zlatko Yankov 83' 🟨"], ["Alessandro Costacurta 61' 🟨", "Demetrio Albertini 80' 🟨"]],
    subs: [["Emil Kostadinov 72' → Ivaylo Yordanov 72'", "Hristo Stoichkov 79' → Boncho Genchev 79'"], ["Dino Baggio 56' → Antonio Conte 56'", "Roberto Baggio 71' → Giuseppe Signori 71'"]],
    pens: [[], []]
  },
  "1994_BUL_MEX": {
    cards: [["Emil Kremenliev 12' 🟨", "Nasko Sirakov 17' 🟨", "Iliyan Kiryakov 34' 🟨", "Ivaylo Yordanov 67' 🟨"], ["Claudio Suárez 14' 🟨", "Luis García Postigo 28' 🟨", "Ramón Ramírez 70' 🟨", "Alberto García Aspe 76' 🟨"]],
    subs: [["Nasko Sirakov 104' → Boncho Genchev 104'", "Emil Kostadinov 119' → Petar Mihtarski 119'"], []],
    pens: [["Krasimir Balakov ✗", "Boncho Genchev ✓", "Daniel Borimirov ✓", "Yordan Letchkov ✓"], ["Alberto García Aspe ✗", "Marcelino Bernal ✗", "Jorge Rodríguez ✗", "Claudio Suárez ✓"]]
  },
  "1994_ESP_ITA": {
    cards: [["Abelardo 3' 🟨", "José Luis Caminero 19' 🟨"], []],
    subs: [["Sergi 60' → Julio Salinas 60'", "José María Bakero 65' → Fernando Hierro 65'"], ["Demetrio Albertini 45' → Giuseppe Signori 45'", "Antonio Conte 66' → Nicola Berti 66'"]],
    pens: [[], []]
  },
  "1994_ESP_SUI": {
    cards: [["Andoni Goikoetxea 18' 🟨", "Albert Ferrer 19' 🟨", "Paco Camarasa 22' 🟨", "Jorge Otero 87' 🟨"], ["Marc Hottiger 23' 🟨", "Jürg Studer 69' 🟨", "Nestor Subiat 77' 🟨", "Marco Pascolo 85' 🟨"]],
    subs: [["Andoni Goikoetxea 61' → Txiki Begiristain 61'", "Fernando Hierro 76' → Jorge Otero 76'"], ["Yvan Quentin 58' → Jürg Studer 58'", "Christophe Ohrel 73' → Nestor Subiat 73'"]],
    pens: [[], []]
  },
  "1994_GER_BEL": {
    cards: [["Thomas Helmer 13' 🟨", "Martin Wagner 37' 🟨"], ["Philippe Albert 38' 🟨"]],
    subs: [["Lothar Matthäus 45' → Andreas Brehme 45'", "Jürgen Klinsmann 86' → Stefan Kuntz 86'"], ["Rudi Smidts 66' → Danny Boffin 66'", "Luc Nilis 78' → Alexandre Czerniatynski 78'"]],
    pens: [[], []]
  },
  "1994_GER_BUL": {
    cards: [["Thomas Helmer 14' 🟨", "Martin Wagner 15' 🟨", "Thomas Häßler 49' 🟨", "Jürgen Klinsmann 50' 🟨", "Rudi Völler 89' 🟨"], ["Trifon Ivanov 22' 🟨", "Hristo Stoichkov 82' 🟨", "Borislav Mihaylov 85' 🟨"]],
    subs: [["Martin Wagner 59' → Thomas Strunz 59'", "Thomas Häßler 83' → Andreas Brehme 83'"], ["Hristo Stoichkov 85' → Ivaylo Yordanov 85'", "Emil Kostadinov 90' → Boncho Genchev 90'"]],
    pens: [[], []]
  },
  "1994_IRL_NED": {
    cards: [[], ["Ronald Koeman 72' 🟨"]],
    subs: [["Steve Staunton 63' → Jason McAteer 63'", "Tommy Coyne 74' → Tony Cascarino 74'"], ["Peter van Vossen 70' → Bryan Roy 70'", "Rob Witschge 79' → Arthur Numan 79'"]],
    pens: [[], []]
  },
  "1994_ITA_BRA": {
    cards: [["Luigi Apolloni 41' 🟨", "Demetrio Albertini 42' 🟨"], ["Mazinho 4' 🟨", "Cafu 87' 🟨"]],
    subs: [["Roberto Mussi 35' → Luigi Apolloni 35'", "Dino Baggio 95' → Alberigo Evani 95'"], ["Jorginho 21' → Cafu 21'", "Zinho 106' → Viola 106'"]],
    pens: [["Franco Baresi ✗", "Demetrio Albertini ✓", "Alberigo Evani ✓", "Daniele Massaro ✗", "Roberto Baggio ✗"], ["Márcio Santos ✗", "Romário ✓", "Branco ✓", "Dunga ✓"]]
  },
  "1994_ITA_BUL": {
    cards: [["Alessandro Costacurta 61' 🟨", "Demetrio Albertini 80' 🟨"], ["Emil Kostadinov 52' 🟨", "Yordan Letchkov 65' 🟨", "Zlatko Yankov 83' 🟨"]],
    subs: [["Dino Baggio 56' → Antonio Conte 56'", "Roberto Baggio 71' → Giuseppe Signori 71'"], ["Emil Kostadinov 72' → Ivaylo Yordanov 72'", "Hristo Stoichkov 79' → Boncho Genchev 79'"]],
    pens: [[], []]
  },
  "1994_ITA_ESP": {
    cards: [[], ["Abelardo 3' 🟨", "José Luis Caminero 19' 🟨"]],
    subs: [["Demetrio Albertini 45' → Giuseppe Signori 45'", "Antonio Conte 66' → Nicola Berti 66'"], ["Sergi 60' → Julio Salinas 60'", "José María Bakero 65' → Fernando Hierro 65'"]],
    pens: [[], []]
  },
  "1994_ITA_NGA": {
    cards: [["Daniele Massaro 6' 🟨", "Alessandro Costacurta 29' 🟨", "Giuseppe Signori 60' 🟨", "Dino Baggio 62' 🟨", "Gianfranco Zola 75' 🟥", "Paolo Maldini 80' 🟨"], ["Michael Emenalo 2' 🟨", "Mutiu Adepoju 41' 🟨", "Sunday Oliseh 53' 🟨", "Chidi Nwanu 58' 🟨"]],
    subs: [["Nicola Berti 45' → Dino Baggio 45'", "Giuseppe Signori 65' → Gianfranco Zola 65'"], ["Daniel Amokachi 35' → Mutiu Adepoju 35'", "Emmanuel Amunike 57' → Thompson Oliha 57'"]],
    pens: [[], []]
  },
  "1994_KSA_SWE": {
    cards: [["Khalid Al-Muwallid 71' 🟨"], ["Roger Ljung 16' 🟨", "Jonas Thern 67' 🟨", "Roland Nilsson 74' 🟨"]],
    subs: [["Mohamed Abd Al-Jawad 55' → Fahad Al-Ghesheyan 55'", "Fahad Al-Bishi 63' → Khalid Al-Muwallid 63'"], ["Joachim Björklund 55' → Pontus Kåmark 55'", "Jonas Thern 70' → Håkan Mild 70'"]],
    pens: [[], []]
  },
  "1994_MEX_BUL": {
    cards: [["Claudio Suárez 14' 🟨", "Luis García Postigo 28' 🟨", "Ramón Ramírez 70' 🟨", "Alberto García Aspe 76' 🟨"], ["Emil Kremenliev 12' 🟨", "Nasko Sirakov 17' 🟨", "Iliyan Kiryakov 34' 🟨", "Ivaylo Yordanov 67' 🟨"]],
    subs: [[], ["Nasko Sirakov 104' → Boncho Genchev 104'", "Emil Kostadinov 119' → Petar Mihtarski 119'"]],
    pens: [["Alberto García Aspe ✗", "Marcelino Bernal ✗", "Jorge Rodríguez ✗", "Claudio Suárez ✓"], ["Krasimir Balakov ✗", "Boncho Genchev ✓", "Daniel Borimirov ✓", "Yordan Letchkov ✓"]]
  },
  "1994_NED_BRA": {
    cards: [["Aron Winter 40' 🟨", "Jan Wouters 89' 🟨"], ["Dunga 74' 🟨"]],
    subs: [["Peter van Vossen 54' → Bryan Roy 54'", "Frank Rijkaard 65' → Ronald de Boer 65'"], ["Mazinho 81' → Raí 81'", "Branco 90' → Cafu 90'"]],
    pens: [[], []]
  },
  "1994_NED_IRL": {
    cards: [["Ronald Koeman 72' 🟨"], []],
    subs: [["Peter van Vossen 70' → Bryan Roy 70'", "Rob Witschge 79' → Arthur Numan 79'"], ["Steve Staunton 63' → Jason McAteer 63'", "Tommy Coyne 74' → Tony Cascarino 74'"]],
    pens: [[], []]
  },
  "1994_NGA_ITA": {
    cards: [["Michael Emenalo 2' 🟨", "Mutiu Adepoju 41' 🟨", "Sunday Oliseh 53' 🟨", "Chidi Nwanu 58' 🟨"], ["Daniele Massaro 6' 🟨", "Alessandro Costacurta 29' 🟨", "Giuseppe Signori 60' 🟨", "Dino Baggio 62' 🟨", "Gianfranco Zola 75' 🟥", "Paolo Maldini 80' 🟨"]],
    subs: [["Daniel Amokachi 35' → Mutiu Adepoju 35'", "Emmanuel Amunike 57' → Thompson Oliha 57'"], ["Nicola Berti 45' → Dino Baggio 45'", "Giuseppe Signori 65' → Gianfranco Zola 65'"]],
    pens: [[], []]
  },
  "1994_ROU_ARG": {
    cards: [["Gheorghe Popescu 50' 🟨", "Tibor Selymes 68' 🟨", "Ilie Dumitrescu 84' 🟨"], ["Oscar Ruggeri 33' 🟨", "Fernando Redondo 55' 🟨", "José Chamot 56' 🟨", "Fernando Cáceres 83' 🟨"]],
    subs: [["Gheorghe Hagi 86' → Constantin Gâlcă 86'", "Ilie Dumitrescu 89' → Corneliu Papură 89'"], ["Roberto Néstor Sensini 63' → Ramón Medina Bello 63'"]],
    pens: [[], []]
  },
  "1994_ROU_SWE": {
    cards: [["Gheorghe Popescu 21' 🟨", "Tibor Selymes 34' 🟨", "Basarab Panduru 108' 🟨"], ["Klas Ingesson 7' 🟨", "Stefan Schwarz 43' 🟨"]],
    subs: [["Dorinel Munteanu 84' → Basarab Panduru 84'"], ["Joachim Björklund 84' → Pontus Kåmark 84'", "Martin Dahlin 107' → Henrik Larsson 107'"]],
    pens: [["Florin Răducioiu ✓", "Gheorghe Hagi ✓", "Ioan Lupescu ✓", "Dan Petrescu ✗", "Ilie Dumitrescu ✓", "Miodrag Belodedici ✗"], ["Håkan Mild ✗", "Kennet Andersson ✓", "Tomas Brolin ✓", "Klas Ingesson ✓", "Roland Nilsson ✓", "Henrik Larsson ✓"]]
  },
  "1994_SUI_ESP": {
    cards: [["Marc Hottiger 23' 🟨", "Jürg Studer 69' 🟨", "Nestor Subiat 77' 🟨", "Marco Pascolo 85' 🟨"], ["Andoni Goikoetxea 18' 🟨", "Albert Ferrer 19' 🟨", "Paco Camarasa 22' 🟨", "Jorge Otero 87' 🟨"]],
    subs: [["Yvan Quentin 58' → Jürg Studer 58'", "Christophe Ohrel 73' → Nestor Subiat 73'"], ["Andoni Goikoetxea 61' → Txiki Begiristain 61'", "Fernando Hierro 76' → Jorge Otero 76'"]],
    pens: [[], []]
  },
  "1994_SWE_BRA": {
    cards: [["Roger Ljung 29' 🟨", "Jonas Thern 63' 🟥", "Tomas Brolin 86' 🟨"], ["Zinho 3' 🟨"]],
    subs: [["Martin Dahlin 68' → Stefan Rehn 68'"], ["Mazinho 45' → Raí 45'"]],
    pens: [[], []]
  },
  "1994_SWE_KSA": {
    cards: [["Roger Ljung 16' 🟨", "Jonas Thern 67' 🟨", "Roland Nilsson 74' 🟨"], ["Khalid Al-Muwallid 71' 🟨"]],
    subs: [["Joachim Björklund 55' → Pontus Kåmark 55'", "Jonas Thern 70' → Håkan Mild 70'"], ["Mohamed Abd Al-Jawad 55' → Fahad Al-Ghesheyan 55'", "Fahad Al-Bishi 63' → Khalid Al-Muwallid 63'"]],
    pens: [[], []]
  },
  "1994_SWE_ROU": {
    cards: [["Klas Ingesson 7' 🟨", "Stefan Schwarz 43' 🟨"], ["Gheorghe Popescu 21' 🟨", "Tibor Selymes 34' 🟨", "Basarab Panduru 108' 🟨"]],
    subs: [["Joachim Björklund 84' → Pontus Kåmark 84'", "Martin Dahlin 107' → Henrik Larsson 107'"], ["Dorinel Munteanu 84' → Basarab Panduru 84'"]],
    pens: [["Håkan Mild ✗", "Kennet Andersson ✓", "Tomas Brolin ✓", "Klas Ingesson ✓", "Roland Nilsson ✓", "Henrik Larsson ✓"], ["Florin Răducioiu ✓", "Gheorghe Hagi ✓", "Ioan Lupescu ✓", "Dan Petrescu ✗", "Ilie Dumitrescu ✓", "Miodrag Belodedici ✗"]]
  },
  "1994_USA_BRA": {
    cards: [["Tab Ramos 43' 🟨", "Paul Caligiuri 49' 🟨", "Fernando Clavijo 64' 🟨", "Thomas Dooley 80' 🟨"], ["Mazinho 8' 🟨", "Jorginho 16' 🟨", "Leonardo 43' 🟥"]],
    subs: [["Tab Ramos 45' → Eric Wynalda 45'", "Hugo Pérez 66' → Roy Wegerle 66'"], ["Zinho 69' → Cafu 69'"]],
    pens: [[], []]
  },
  "1998_ARG_ENG": {
    cards: [["Juan Sebastián Verón 44' 🟨", "Diego Simeone 47' 🟨", "Matías Almeyda 73' 🟨", "Carlos Roa 120' 🟨"], ["David Seaman 5' 🟨", "Paul Ince 10' 🟨", "David Beckham 47' 🟥"]],
    subs: [["Claudio López 68' → Hernán Crespo 68'", "Gabriel Batistuta 68' → Marcelo Gallardo 68'", "Diego Simeone 91' → Sergio Berti 91'"], ["Graeme Le Saux 71' → Gareth Southgate 71'", "Paul Scholes 78' → Paul Merson 78'", "Darren Anderton 97' → David Batty 97'"]],
    pens: [["Sergio Berti ✓", "Hernán Crespo ✗", "Juan Sebastián Verón ✓", "Marcelo Gallardo ✓", "Roberto Ayala ✓"], ["Alan Shearer ✓", "Paul Ince ✗", "Paul Merson ✓", "Michael Owen ✓", "David Batty ✗"]]
  },
  "1998_ARG_NED": {
    cards: [["José Chamot 22' 🟨", "Roberto Néstor Sensini 60' 🟨", "Ariel Ortega 86' 🟥"], ["Jaap Stam 10' 🟨", "Arthur Numan 17' 🟨"]],
    subs: [["Matías Almeyda 68' → Mauricio Pineda 68'", "José Chamot 89' → Abel Balbo 89'"], ["Ronald de Boer 64' → Marc Overmars 64'"]],
    pens: [[], []]
  },
  "1998_BRA_CHI": {
    cards: [["Leonardo 45' 🟨", "Cafu 90'+1' 🟨"], ["Ronald Fuentes 34' 🟨", "Nelson Tapia 45' 🟨"]],
    subs: [["Bebeto 65' → Denílson 65'", "Aldair 78' → Gonçalves 78'"], ["Miguel Ramírez 46' → Marcelo Vega 46'", "José Luis Sierra 46' → Fabián Estay 46'", "Clarence Acuña 80' → Luis Musrri 80'"]],
    pens: [[], []]
  },
  "1998_BRA_DEN": {
    cards: [["Roberto Carlos 11' 🟨", "Aldair 37' 🟨", "Cafu 81' 🟨"], ["Thomas Helveg 19' 🟨", "Søren Colding 39' 🟨", "Stig Tøfting 72' 🟨"]],
    subs: [["Bebeto 64' → Denílson 64'", "Leonardo 71' → Emerson 71'", "Rivaldo 87' → Zé Roberto 87'"], ["Allan Nielsen 46' → Stig Tøfting 46'", "Peter Møller 66' → Ebbe Sand 66'", "Thomas Helveg 87' → Michael Schjønberg 87'"]],
    pens: [[], []]
  },
  "1998_BRA_FRA": {
    cards: [["Júnior Baiano 33' 🟨"], ["Didier Deschamps 39' 🟨", "Marcel Desailly 48' 🟨", "Christian Karembeu 56' 🟨"]],
    subs: [["Leonardo 46' → Denílson 46'", "César Sampaio 73' → Edmundo 73'"], ["Christian Karembeu 57' → Alain Boghossian 57'", "Stéphane Guivarc'h 66' → Christophe Dugarry 66'", "Youri Djorkaeff 74' → Patrick Vieira 74'"]],
    pens: [[], []]
  },
  "1998_BRA_NED": {
    cards: [["Zé Carlos 31' 🟨", "César Sampaio 45' 🟨"], ["Michael Reiziger 48' 🟨", "Edgar Davids 60' 🟨", "Pierre van Hooijdonk 90' 🟨", "Clarence Seedorf 119' 🟨"]],
    subs: [["Bebeto 70' → Denílson 70'", "Leonardo 85' → Emerson 85'"], ["Michael Reiziger 56' → Aron Winter 56'", "Boudewijn Zenden 75' → Pierre van Hooijdonk 75'", "Wim Jonk 111' → Clarence Seedorf 111'"]],
    pens: [["Ronaldo ✓", "Rivaldo ✓", "Emerson ✓", "Dunga ✓"], ["Frank de Boer ✓", "Dennis Bergkamp ✓", "Phillip Cocu ✗", "Ronald de Boer ✗"]]
  },
  "1998_CHI_BRA": {
    cards: [["Ronald Fuentes 34' 🟨", "Nelson Tapia 45' 🟨"], ["Leonardo 45' 🟨", "Cafu 90'+1' 🟨"]],
    subs: [["Miguel Ramírez 46' → Marcelo Vega 46'", "José Luis Sierra 46' → Fabián Estay 46'", "Clarence Acuña 80' → Luis Musrri 80'"], ["Bebeto 65' → Denílson 65'", "Aldair 78' → Gonçalves 78'"]],
    pens: [[], []]
  },
  "1998_CRO_FRA": {
    cards: [["Aljoša Asanović 45' 🟨", "Mario Stanić 75' 🟨", "Dario Šimić 88' 🟨"], ["Laurent Blanc 74' 🟥"]],
    subs: [["Zvonimir Boban 65' → Silvio Marić 65'", "Mario Stanić 89' → Robert Prosinečki 89'"], ["Christian Karembeu 31' → Thierry Henry 31'", "Stéphane Guivarc'h 68' → David Trezeguet 68'", "Youri Djorkaeff 77' → Frank Leboeuf 77'"]],
    pens: [[], []]
  },
  "1998_CRO_GER": {
    cards: [["Dario Šimić 13' 🟨", "Davor Šuker 57' 🟨"], ["Jörg Heinrich 18' 🟨", "Michael Tarnat 37' 🟨", "Christian Wörns 40' 🟥"]],
    subs: [["Goran Vlaović 83' → Silvio Marić 83'"], ["Thomas Häßler 69' → Ulf Kirsten 69'", "Dietmar Hamann 79' → Olaf Marschall 79'"]],
    pens: [[], []]
  },
  "1998_CRO_ROU": {
    cards: [["Zvonimir Boban 27' 🟨", "Slaven Bilić 70' 🟨"], ["Gheorghe Popescu 43' 🟨", "Dan Petrescu 70' 🟨", "Adrian Ilie 81' 🟨"]],
    subs: [["Goran Vlaović 76' → Petar Krpan 76'", "Mario Stanić 83' → Igor Tudor 83'"], ["Gheorghe Hagi 56' → Gheorghe Craioveanu 56'", "Gabriel Popescu 61' → Radu Niculescu 61'", "Dan Petrescu 76' → Lucian Marinescu 76'"]],
    pens: [[], []]
  },
  "1998_DEN_BRA": {
    cards: [["Thomas Helveg 19' 🟨", "Søren Colding 39' 🟨", "Stig Tøfting 72' 🟨"], ["Roberto Carlos 11' 🟨", "Aldair 37' 🟨", "Cafu 81' 🟨"]],
    subs: [["Allan Nielsen 46' → Stig Tøfting 46'", "Peter Møller 66' → Ebbe Sand 66'", "Thomas Helveg 87' → Michael Schjønberg 87'"], ["Bebeto 64' → Denílson 64'", "Leonardo 71' → Emerson 71'", "Rivaldo 87' → Zé Roberto 87'"]],
    pens: [[], []]
  },
  "1998_DEN_NGA": {
    cards: [["Marc Rieper 24' 🟨"], ["Jay-Jay Okocha 49' 🟨"]],
    subs: [["Peter Møller 58' → Ebbe Sand 58'", "Brian Laudrup 78' → Morten Wieghorst 78'", "Michael Laudrup 84' → Per Frandsen 84'"], ["Nwankwo Kanu 65' → Rashidi Yekini 65'", "Garba Lawal 73' → Tijani Babangida 73'"]],
    pens: [[], []]
  },
  "1998_ENG_ARG": {
    cards: [["David Seaman 5' 🟨", "Paul Ince 10' 🟨", "David Beckham 47' 🟥"], ["Juan Sebastián Verón 44' 🟨", "Diego Simeone 47' 🟨", "Matías Almeyda 73' 🟨", "Carlos Roa 120' 🟨"]],
    subs: [["Graeme Le Saux 71' → Gareth Southgate 71'", "Paul Scholes 78' → Paul Merson 78'", "Darren Anderton 97' → David Batty 97'"], ["Claudio López 68' → Hernán Crespo 68'", "Gabriel Batistuta 68' → Marcelo Gallardo 68'", "Diego Simeone 91' → Sergio Berti 91'"]],
    pens: [["Alan Shearer ✓", "Paul Ince ✗", "Paul Merson ✓", "Michael Owen ✓", "David Batty ✗"], ["Sergio Berti ✓", "Hernán Crespo ✗", "Juan Sebastián Verón ✓", "Marcelo Gallardo ✓", "Roberto Ayala ✓"]]
  },
  "1998_FRA_BRA": {
    cards: [["Didier Deschamps 39' 🟨", "Marcel Desailly 48' 🟨", "Christian Karembeu 56' 🟨"], ["Júnior Baiano 33' 🟨"]],
    subs: [["Christian Karembeu 57' → Alain Boghossian 57'", "Stéphane Guivarc'h 66' → Christophe Dugarry 66'", "Youri Djorkaeff 74' → Patrick Vieira 74'"], ["Leonardo 46' → Denílson 46'", "César Sampaio 73' → Edmundo 73'"]],
    pens: [[], []]
  },
  "1998_FRA_CRO": {
    cards: [["Laurent Blanc 74' 🟥"], ["Aljoša Asanović 45' 🟨", "Mario Stanić 75' 🟨", "Dario Šimić 88' 🟨"]],
    subs: [["Christian Karembeu 31' → Thierry Henry 31'", "Stéphane Guivarc'h 68' → David Trezeguet 68'", "Youri Djorkaeff 77' → Frank Leboeuf 77'"], ["Zvonimir Boban 65' → Silvio Marić 65'", "Mario Stanić 89' → Robert Prosinečki 89'"]],
    pens: [[], []]
  },
  "1998_FRA_ITA": {
    cards: [["Stéphane Guivarc'h 53' 🟨", "Didier Deschamps 62' 🟨"], ["Alessandro Del Piero 26' 🟨", "Giuseppe Bergomi 28' 🟨", "Alessandro Costacurta 113' 🟨"]],
    subs: [["Christian Karembeu 65' → Thierry Henry 65'", "Stéphane Guivarc'h 65' → David Trezeguet 65'"], ["Dino Baggio 52' → Demetrio Albertini 52'", "Alessandro Del Piero 67' → Roberto Baggio 67'", "Gianluca Pessotto 90' → Angelo Di Livio 90'"]],
    pens: [["Zinedine Zidane ✓", "Bixente Lizarazu ✗", "David Trezeguet ✓", "Thierry Henry ✓", "Laurent Blanc ✓"], ["Roberto Baggio ✓", "Demetrio Albertini ✗", "Alessandro Costacurta ✓", "Christian Vieri ✓", "Luigi Di Biagio ✗"]]
  },
  "1998_FRA_PAR": {
    cards: [[], ["José Luis Chilavert 19' 🟨", "Miguel Ángel Benítez 23' 🟨", "Julio César Enciso 32' 🟨", "Francisco Arce 84' 🟨", "Arístides Rojas 99' 🟨"]],
    subs: [["Thierry Henry 64' → Robert Pires 64'", "Emmanuel Petit 69' → Alain Boghossian 69'", "Bernard Diomède 76' → Stéphane Guivarc'h 76'"], ["Jorge Luis Campos 55' → Julio César Yegros 55'", "Carlos Paredes 75' → Denis Caniza 75'", "José Cardozo 91' → Arístides Rojas 91'"]],
    pens: [[], []]
  },
  "1998_GER_CRO": {
    cards: [["Jörg Heinrich 18' 🟨", "Michael Tarnat 37' 🟨", "Christian Wörns 40' 🟥"], ["Dario Šimić 13' 🟨", "Davor Šuker 57' 🟨"]],
    subs: [["Thomas Häßler 69' → Ulf Kirsten 69'", "Dietmar Hamann 79' → Olaf Marschall 79'"], ["Goran Vlaović 83' → Silvio Marić 83'"]],
    pens: [[], []]
  },
  "1998_GER_MEX": {
    cards: [["Markus Babbel 45'+1' 🟨", "Lothar Matthäus 56' 🟨", "Michael Tarnat 77' 🟨", "Dietmar Hamann 88' 🟨"], ["Duilio Davino 57' 🟨", "Cuauhtémoc Blanco 87' 🟨"]],
    subs: [["Thomas Helmer 37' → Christian Ziege 37'", "Jörg Heinrich 57' → Andreas Möller 57'", "Thomas Häßler 73' → Ulf Kirsten 73'"], ["Marcelino Bernal 46' → Salvador Carmona 46'", "Francisco Palencia 53' → Jesús Arellano 53'", "Alberto García Aspe 86' → Ricardo Peláez 86'"]],
    pens: [[], []]
  },
  "1998_ITA_FRA": {
    cards: [["Alessandro Del Piero 26' 🟨", "Giuseppe Bergomi 28' 🟨", "Alessandro Costacurta 113' 🟨"], ["Stéphane Guivarc'h 53' 🟨", "Didier Deschamps 62' 🟨"]],
    subs: [["Dino Baggio 52' → Demetrio Albertini 52'", "Alessandro Del Piero 67' → Roberto Baggio 67'", "Gianluca Pessotto 90' → Angelo Di Livio 90'"], ["Christian Karembeu 65' → Thierry Henry 65'", "Stéphane Guivarc'h 65' → David Trezeguet 65'"]],
    pens: [["Roberto Baggio ✓", "Demetrio Albertini ✗", "Alessandro Costacurta ✓", "Christian Vieri ✓", "Luigi Di Biagio ✗"], ["Zinedine Zidane ✓", "Bixente Lizarazu ✗", "David Trezeguet ✓", "Thierry Henry ✓", "Laurent Blanc ✓"]]
  },
  "1998_ITA_NOR": {
    cards: [["Francesco Moriero 38' 🟨", "Luigi Di Biagio 84' 🟨", "Paolo Maldini 89' 🟨"], ["Håvard Flo 35' 🟨", "Erik Mykland 54' 🟨", "Kjetil Rekdal 62' 🟨"]],
    subs: [["Francesco Moriero 63' → Angelo Di Livio 63'", "Demetrio Albertini 72' → Gianluca Pessotto 72'", "Alessandro Del Piero 77' → Enrico Chiesa 77'"], ["Øyvind Leonhardsen 13' → Roar Strand 13'", "Roar Strand 39' → Ståle Solbakken 39'", "Håvard Flo 73' → Ole Gunnar Solskjær 73'"]],
    pens: [[], []]
  },
  "1998_MEX_GER": {
    cards: [["Duilio Davino 57' 🟨", "Cuauhtémoc Blanco 87' 🟨"], ["Markus Babbel 45'+1' 🟨", "Lothar Matthäus 56' 🟨", "Michael Tarnat 77' 🟨", "Dietmar Hamann 88' 🟨"]],
    subs: [["Marcelino Bernal 46' → Salvador Carmona 46'", "Francisco Palencia 53' → Jesús Arellano 53'", "Alberto García Aspe 86' → Ricardo Peláez 86'"], ["Thomas Helmer 37' → Christian Ziege 37'", "Jörg Heinrich 57' → Andreas Möller 57'", "Thomas Häßler 73' → Ulf Kirsten 73'"]],
    pens: [[], []]
  },
  "1998_NED_ARG": {
    cards: [["Jaap Stam 10' 🟨", "Arthur Numan 17' 🟨"], ["José Chamot 22' 🟨", "Roberto Néstor Sensini 60' 🟨", "Ariel Ortega 86' 🟥"]],
    subs: [["Ronald de Boer 64' → Marc Overmars 64'"], ["Matías Almeyda 68' → Mauricio Pineda 68'", "José Chamot 89' → Abel Balbo 89'"]],
    pens: [[], []]
  },
  "1998_NED_BRA": {
    cards: [["Michael Reiziger 48' 🟨", "Edgar Davids 60' 🟨", "Pierre van Hooijdonk 90' 🟨", "Clarence Seedorf 119' 🟨"], ["Zé Carlos 31' 🟨", "César Sampaio 45' 🟨"]],
    subs: [["Michael Reiziger 56' → Aron Winter 56'", "Boudewijn Zenden 75' → Pierre van Hooijdonk 75'", "Wim Jonk 111' → Clarence Seedorf 111'"], ["Bebeto 70' → Denílson 70'", "Leonardo 85' → Emerson 85'"]],
    pens: [["Frank de Boer ✓", "Dennis Bergkamp ✓", "Phillip Cocu ✗", "Ronald de Boer ✗"], ["Ronaldo ✓", "Rivaldo ✓", "Emerson ✓", "Dunga ✓"]]
  },
  "1998_NED_YUG": {
    cards: [[], ["Dragan Stojković 38' 🟨", "Zoran Mirković 52' 🟨", "Goran Đorović 73' 🟨"]],
    subs: [[], ["Dragan Stojković 57' → Dejan Savićević 57'", "Siniša Mihajlović 78' → Niša Saveljić 78'"]],
    pens: [[], []]
  },
  "1998_NGA_DEN": {
    cards: [["Jay-Jay Okocha 49' 🟨"], ["Marc Rieper 24' 🟨"]],
    subs: [["Nwankwo Kanu 65' → Rashidi Yekini 65'", "Garba Lawal 73' → Tijani Babangida 73'"], ["Peter Møller 58' → Ebbe Sand 58'", "Brian Laudrup 78' → Morten Wieghorst 78'", "Michael Laudrup 84' → Per Frandsen 84'"]],
    pens: [[], []]
  },
  "1998_NOR_ITA": {
    cards: [["Håvard Flo 35' 🟨", "Erik Mykland 54' 🟨", "Kjetil Rekdal 62' 🟨"], ["Francesco Moriero 38' 🟨", "Luigi Di Biagio 84' 🟨", "Paolo Maldini 89' 🟨"]],
    subs: [["Øyvind Leonhardsen 13' → Roar Strand 13'", "Roar Strand 39' → Ståle Solbakken 39'", "Håvard Flo 73' → Ole Gunnar Solskjær 73'"], ["Francesco Moriero 63' → Angelo Di Livio 63'", "Demetrio Albertini 72' → Gianluca Pessotto 72'", "Alessandro Del Piero 77' → Enrico Chiesa 77'"]],
    pens: [[], []]
  },
  "1998_PAR_FRA": {
    cards: [["José Luis Chilavert 19' 🟨", "Miguel Ángel Benítez 23' 🟨", "Julio César Enciso 32' 🟨", "Francisco Arce 84' 🟨", "Arístides Rojas 99' 🟨"], []],
    subs: [["Jorge Luis Campos 55' → Julio César Yegros 55'", "Carlos Paredes 75' → Denis Caniza 75'", "José Cardozo 91' → Arístides Rojas 91'"], ["Thierry Henry 64' → Robert Pires 64'", "Emmanuel Petit 69' → Alain Boghossian 69'", "Bernard Diomède 76' → Stéphane Guivarc'h 76'"]],
    pens: [[], []]
  },
  "1998_ROU_CRO": {
    cards: [["Gheorghe Popescu 43' 🟨", "Dan Petrescu 70' 🟨", "Adrian Ilie 81' 🟨"], ["Zvonimir Boban 27' 🟨", "Slaven Bilić 70' 🟨"]],
    subs: [["Gheorghe Hagi 56' → Gheorghe Craioveanu 56'", "Gabriel Popescu 61' → Radu Niculescu 61'", "Dan Petrescu 76' → Lucian Marinescu 76'"], ["Goran Vlaović 76' → Petar Krpan 76'", "Mario Stanić 83' → Igor Tudor 83'"]],
    pens: [[], []]
  },
  "1998_YUG_NED": {
    cards: [["Dragan Stojković 38' 🟨", "Zoran Mirković 52' 🟨", "Goran Đorović 73' 🟨"], []],
    subs: [["Dragan Stojković 57' → Dejan Savićević 57'", "Siniša Mihajlović 78' → Niša Saveljić 78'"], []],
    pens: [[], []]
  },
  "2002_BEL_BRA": {
    cards: [["Yves Vanderhaeghe 24' 🟨"], ["Roberto Carlos 28' 🟨"]],
    subs: [["Jacky Peeters 72' → Wesley Sonck 72'"], ["Juninho Paulista 57' → Denílson 57'", "Ronaldinho 81' → Kléberson 81'", "Rivaldo 90' → Ricardinho 90'"]],
    pens: [[], []]
  },
  "2002_BRA_BEL": {
    cards: [["Roberto Carlos 28' 🟨"], ["Yves Vanderhaeghe 24' 🟨"]],
    subs: [["Juninho Paulista 57' → Denílson 57'", "Ronaldinho 81' → Kléberson 81'", "Rivaldo 90' → Ricardinho 90'"], ["Jacky Peeters 72' → Wesley Sonck 72'"]],
    pens: [[], []]
  },
  "2002_BRA_ENG": {
    cards: [["Ronaldinho 57' 🟥"], ["Paul Scholes 75' 🟨", "Rio Ferdinand 86' 🟨"]],
    subs: [["Ronaldo 70' → Edílson 70'"], ["Trevor Sinclair 56' → Kieron Dyer 56'", "Michael Owen 79' → Darius Vassell 79'", "Ashley Cole 80' → Teddy Sheringham 80'"]],
    pens: [[], []]
  },
  "2002_BRA_GER": {
    cards: [["Roque Júnior 6' 🟨"], ["Miroslav Klose 9' 🟨"]],
    subs: [["Ronaldinho 85' → Juninho Paulista 85'", "Ronaldo 90' → Denílson 90'"], ["Miroslav Klose 74' → Oliver Bierhoff 74'", "Jens Jeremies 77' → Gerald Asamoah 77'", "Marco Bode 84' → Christian Ziege 84'"]],
    pens: [[], []]
  },
  "2002_BRA_TUR": {
    cards: [["Gilberto Silva 41' 🟨"], ["Tugay Kerimoğlu 59' 🟨", "Hasan Şaş 90' 🟨"]],
    subs: [["Ronaldo 68' → Luizão 68'", "Edílson 75' → Denílson 75'", "Kléberson 85' → Juliano Belletti 85'"], ["Emre Belözoğlu 62' → İlhan Mansız 62'", "Ümit Davala 74' → Muzzy Izzet 74'", "Yıldıray Baştürk 88' → Arif Erdem 88'"]],
    pens: [[], []]
  },
  "2002_DEN_ENG": {
    cards: [["Stig Tøfting 24' 🟨"], ["Danny Mills 50' 🟨"]],
    subs: [["Thomas Helveg 7' → Kasper Bøgelund 7'", "Stig Tøfting 58' → Claus Jensen 58'"], ["Michael Owen 46' → Robbie Fowler 46'", "Paul Scholes 49' → Kieron Dyer 49'", "Emile Heskey 69' → Teddy Sheringham 69'"]],
    pens: [[], []]
  },
  "2002_ENG_BRA": {
    cards: [["Paul Scholes 75' 🟨", "Rio Ferdinand 86' 🟨"], ["Ronaldinho 57' 🟥"]],
    subs: [["Trevor Sinclair 56' → Kieron Dyer 56'", "Michael Owen 79' → Darius Vassell 79'", "Ashley Cole 80' → Teddy Sheringham 80'"], ["Ronaldo 70' → Edílson 70'"]],
    pens: [[], []]
  },
  "2002_ENG_DEN": {
    cards: [["Danny Mills 50' 🟨"], ["Stig Tøfting 24' 🟨"]],
    subs: [["Michael Owen 46' → Robbie Fowler 46'", "Paul Scholes 49' → Kieron Dyer 49'", "Emile Heskey 69' → Teddy Sheringham 69'"], ["Thomas Helveg 7' → Kasper Bøgelund 7'", "Stig Tøfting 58' → Claus Jensen 58'"]],
    pens: [[], []]
  },
  "2002_ESP_IRL": {
    cards: [["Juanfran 62' 🟨", "Rubén Baraja 87' 🟨", "Fernando Hierro 89' 🟨"], []],
    subs: [["Javier de Pedro 66' → Gaizka Mendieta 66'", "Fernando Morientes 72' → David Albelda 72'", "Raúl 80' → Albert Luque 80'"], ["Steve Staunton 50' → Kenny Cunningham 50'", "Gary Kelly 55' → Niall Quinn 55'", "Ian Harte 82' → David Connolly 82'"]],
    pens: [["Fernando Hierro ✓", "Rubén Baraja ✓", "Juanfran ✗", "Juan Carlos Valerón ✗", "Gaizka Mendieta ✓"], ["Robbie Keane ✓", "Matt Holland ✗", "David Connolly ✗", "Kevin Kilbane ✗", "Steve Finnan ✓"]]
  },
  "2002_ESP_KOR": {
    cards: [["Javier de Pedro 53' 🟨", "Fernando Morientes 111' 🟨"], ["Sang-chul Yoo 52' 🟨"]],
    subs: [["Javier de Pedro 70' → Gaizka Mendieta 70'", "Juan Carlos Valerón 80' → Luis Enrique 80'", "Iván Helguera 93' → Xavi 93'"], ["Nam-il Kim 32' → Eul-yong Lee 32'", "Sang-chul Yoo 60' → Chun-soo Lee 60'", "Tae-young Kim 90' → Sun-hong Hwang 90'"]],
    pens: [["Fernando Hierro ✓", "Rubén Baraja ✓", "Xavi ✓", "Joaquín ✗"], ["Sun-hong Hwang ✓", "Ji-sung Park ✓", "Ki-hyeon Seol ✓", "Jung-hwan Ahn ✓", "Myung-bo Hong ✓"]]
  },
  "2002_GER_BRA": {
    cards: [["Miroslav Klose 9' 🟨"], ["Roque Júnior 6' 🟨"]],
    subs: [["Miroslav Klose 74' → Oliver Bierhoff 74'", "Jens Jeremies 77' → Gerald Asamoah 77'", "Marco Bode 84' → Christian Ziege 84'"], ["Ronaldinho 85' → Juninho Paulista 85'", "Ronaldo 90' → Denílson 90'"]],
    pens: [[], []]
  },
  "2002_GER_KOR": {
    cards: [["Michael Ballack 71' 🟨", "Oliver Neuville 85' 🟨"], ["Min-sung Lee 90' 🟨"]],
    subs: [["Miroslav Klose 70' → Oliver Bierhoff 70'", "Bernd Schneider 85' → Jens Jeremies 85'", "Oliver Neuville 88' → Gerald Asamoah 88'"], ["Sun-hong Hwang 54' → Jung-hwan Ahn 54'", "Jin-cheul Choi 56' → Min-sung Lee 56'", "Myung-bo Hong 80' → Ki-hyeon Seol 80'"]],
    pens: [[], []]
  },
  "2002_GER_PAR": {
    cards: [["Bernd Schneider 35' 🟨", "Frank Baumann 71' 🟨", "Michael Ballack 90'+2' 🟨"], ["Roberto Acuña 26' 🟥", "José Cardozo 50' 🟨"]],
    subs: [["Marko Rehmer 46' → Sebastian Kehl 46'", "Christoph Metzelder 60' → Frank Baumann 60'", "Oliver Neuville 90'+2' → Gerald Asamoah 90'+2'"], ["Roque Santa Cruz 29' → Jorge Luis Campos 29'", "Carlos Bonet 84' → Diego Gavilán 84'", "Estanislao Struway 90'+1' → Nelson Cuevas 90'+1'"]],
    pens: [[], []]
  },
  "2002_GER_USA": {
    cards: [["Sebastian Kehl 66' 🟨", "Jens Jeremies 68' 🟨"], ["Eddie Lewis 40' 🟨", "Eddie Pope 41' 🟨", "Claudio Reyna 68' 🟨", "Pablo Mastroeni 69' 🟨", "Gregg Berhalter 70' 🟨"]],
    subs: [["Bernd Schneider 60' → Jens Jeremies 60'", "Oliver Neuville 80' → Marco Bode 80'", "Miroslav Klose 88' → Oliver Bierhoff 88'"], ["Brian McBride 58' → Clint Mathis 58'", "Frankie Hejduk 65' → Cobi Jones 65'", "Pablo Mastroeni 80' → Earnie Stewart 80'"]],
    pens: [[], []]
  },
  "2002_IRL_ESP": {
    cards: [[], ["Juanfran 62' 🟨", "Rubén Baraja 87' 🟨", "Fernando Hierro 89' 🟨"]],
    subs: [["Steve Staunton 50' → Kenny Cunningham 50'", "Gary Kelly 55' → Niall Quinn 55'", "Ian Harte 82' → David Connolly 82'"], ["Javier de Pedro 66' → Gaizka Mendieta 66'", "Fernando Morientes 72' → David Albelda 72'", "Raúl 80' → Albert Luque 80'"]],
    pens: [["Robbie Keane ✓", "Matt Holland ✗", "David Connolly ✗", "Kevin Kilbane ✗", "Steve Finnan ✓"], ["Fernando Hierro ✓", "Rubén Baraja ✓", "Juanfran ✗", "Juan Carlos Valerón ✗", "Gaizka Mendieta ✓"]]
  },
  "2002_ITA_KOR": {
    cards: [["Francesco Coco 4' 🟨", "Francesco Totti 22' 🟨", "Damiano Tommasi 55' 🟨", "Cristiano Zanetti 59' 🟨"], ["Tae-young Kim 17' 🟨", "Chong-gug Song 80' 🟨", "Chun-soo Lee 99' 🟨", "Jin-cheul Choi 115' 🟨"]],
    subs: [["Alessandro Del Piero 61' → Gennaro Gattuso 61'", "Gianluca Zambrotta 72' → Angelo Di Livio 72'"], ["Tae-young Kim 63' → Sun-hong Hwang 63'", "Nam-il Kim 68' → Chun-soo Lee 68'", "Myung-bo Hong 83' → Du-ri Cha 83'"]],
    pens: [[], []]
  },
  "2002_JPN_TUR": {
    cards: [["Kazuyuki Toda 45' 🟨"], ["Alpay Özalan 21' 🟨", "Ergün Penbe 44' 🟨", "Hakan Şükür 90' 🟨"]],
    subs: [["Junichi Inamoto 46' → Takayuki Suzuki 46'", "Alessandro Santos 46' → Daisuke Ichikawa 46'", "Daisuke Ichikawa 86' → Hiroaki Morishima 86'"], ["Ümit Davala 74' → Nihat Kahveci 74'", "Hasan Şaş 85' → Tayfur Havutçu 85'", "Yıldıray Baştürk 90' → İlhan Mansız 90'"]],
    pens: [[], []]
  },
  "2002_KOR_ESP": {
    cards: [["Sang-chul Yoo 52' 🟨"], ["Javier de Pedro 53' 🟨", "Fernando Morientes 111' 🟨"]],
    subs: [["Nam-il Kim 32' → Eul-yong Lee 32'", "Sang-chul Yoo 60' → Chun-soo Lee 60'", "Tae-young Kim 90' → Sun-hong Hwang 90'"], ["Javier de Pedro 70' → Gaizka Mendieta 70'", "Juan Carlos Valerón 80' → Luis Enrique 80'", "Iván Helguera 93' → Xavi 93'"]],
    pens: [["Sun-hong Hwang ✓", "Ji-sung Park ✓", "Ki-hyeon Seol ✓", "Jung-hwan Ahn ✓", "Myung-bo Hong ✓"], ["Fernando Hierro ✓", "Rubén Baraja ✓", "Xavi ✓", "Joaquín ✗"]]
  },
  "2002_KOR_GER": {
    cards: [["Min-sung Lee 90' 🟨"], ["Michael Ballack 71' 🟨", "Oliver Neuville 85' 🟨"]],
    subs: [["Sun-hong Hwang 54' → Jung-hwan Ahn 54'", "Jin-cheul Choi 56' → Min-sung Lee 56'", "Myung-bo Hong 80' → Ki-hyeon Seol 80'"], ["Miroslav Klose 70' → Oliver Bierhoff 70'", "Bernd Schneider 85' → Jens Jeremies 85'", "Oliver Neuville 88' → Gerald Asamoah 88'"]],
    pens: [[], []]
  },
  "2002_KOR_ITA": {
    cards: [["Tae-young Kim 17' 🟨", "Chong-gug Song 80' 🟨", "Chun-soo Lee 99' 🟨", "Jin-cheul Choi 115' 🟨"], ["Francesco Coco 4' 🟨", "Francesco Totti 22' 🟨", "Damiano Tommasi 55' 🟨", "Cristiano Zanetti 59' 🟨"]],
    subs: [["Tae-young Kim 63' → Sun-hong Hwang 63'", "Nam-il Kim 68' → Chun-soo Lee 68'", "Myung-bo Hong 83' → Du-ri Cha 83'"], ["Alessandro Del Piero 61' → Gennaro Gattuso 61'", "Gianluca Zambrotta 72' → Angelo Di Livio 72'"]],
    pens: [[], []]
  },
  "2002_MEX_USA": {
    cards: [["Manuel Vidrio 37' 🟨", "Luis Hernández 67' 🟨", "Cuauhtémoc Blanco 70' 🟨", "Alberto García Aspe 81' 🟨", "Salvador Carmona 84' 🟨", "Rafael Márquez 88' 🟥"], ["Eddie Pope 26' 🟨", "Pablo Mastroeni 47' 🟨", "Josh Wolff 50' 🟨", "Gregg Berhalter 53' 🟨", "Brad Friedel 83' 🟨"]],
    subs: [["Ramón Morales 28' → Luis Hernández 28'", "Manuel Vidrio 46' → Sigifredo Mercado 46'", "Gerardo Torrado 78' → Alberto García Aspe 78'"], ["Josh Wolff 59' → Earnie Stewart 59'", "Brian McBride 79' → Cobi Jones 79'", "Pablo Mastroeni 90' → Carlos Llamosa 90'"]],
    pens: [[], []]
  },
  "2002_PAR_GER": {
    cards: [["Roberto Acuña 26' 🟥", "José Cardozo 50' 🟨"], ["Bernd Schneider 35' 🟨", "Frank Baumann 71' 🟨", "Michael Ballack 90'+2' 🟨"]],
    subs: [["Roque Santa Cruz 29' → Jorge Luis Campos 29'", "Carlos Bonet 84' → Diego Gavilán 84'", "Estanislao Struway 90'+1' → Nelson Cuevas 90'+1'"], ["Marko Rehmer 46' → Sebastian Kehl 46'", "Christoph Metzelder 60' → Frank Baumann 60'", "Oliver Neuville 90'+2' → Gerald Asamoah 90'+2'"]],
    pens: [[], []]
  },
  "2002_SEN_SWE": {
    cards: [["Ferdinand Coly 73' 🟨", "Pape Thiaw 94' 🟨"], []],
    subs: [["Pape Malick Diop 66' → Habib Beye 66'"], ["Marcus Allbäck 65' → Andreas Andersson 65'", "Niclas Alexandersson 76' → Zlatan Ibrahimović 76'", "Magnus Svensson 99' → Mattias Jonson 99'"]],
    pens: [[], []]
  },
  "2002_SEN_TUR": {
    cards: [["Omar Daf 12' 🟨", "Aliou Cissé 63' 🟨"], ["Emre Belözoğlu 22' 🟨", "İlhan Mansız 87' 🟨"]],
    subs: [[], ["Hakan Şükür 67' → İlhan Mansız 67'", "Emre Belözoğlu 91' → Arif Erdem 91'"]],
    pens: [[], []]
  },
  "2002_SWE_SEN": {
    cards: [[], ["Ferdinand Coly 73' 🟨", "Pape Thiaw 94' 🟨"]],
    subs: [["Marcus Allbäck 65' → Andreas Andersson 65'", "Niclas Alexandersson 76' → Zlatan Ibrahimović 76'", "Magnus Svensson 99' → Mattias Jonson 99'"], ["Pape Malick Diop 66' → Habib Beye 66'"]],
    pens: [[], []]
  },
  "2002_TUR_BRA": {
    cards: [["Tugay Kerimoğlu 59' 🟨", "Hasan Şaş 90' 🟨"], ["Gilberto Silva 41' 🟨"]],
    subs: [["Emre Belözoğlu 62' → İlhan Mansız 62'", "Ümit Davala 74' → Muzzy Izzet 74'", "Yıldıray Baştürk 88' → Arif Erdem 88'"], ["Ronaldo 68' → Luizão 68'", "Edílson 75' → Denílson 75'", "Kléberson 85' → Juliano Belletti 85'"]],
    pens: [[], []]
  },
  "2002_TUR_JPN": {
    cards: [["Alpay Özalan 21' 🟨", "Ergün Penbe 44' 🟨", "Hakan Şükür 90' 🟨"], ["Kazuyuki Toda 45' 🟨"]],
    subs: [["Ümit Davala 74' → Nihat Kahveci 74'", "Hasan Şaş 85' → Tayfur Havutçu 85'", "Yıldıray Baştürk 90' → İlhan Mansız 90'"], ["Junichi Inamoto 46' → Takayuki Suzuki 46'", "Alessandro Santos 46' → Daisuke Ichikawa 46'", "Daisuke Ichikawa 86' → Hiroaki Morishima 86'"]],
    pens: [[], []]
  },
  "2002_TUR_SEN": {
    cards: [["Emre Belözoğlu 22' 🟨", "İlhan Mansız 87' 🟨"], ["Omar Daf 12' 🟨", "Aliou Cissé 63' 🟨"]],
    subs: [["Hakan Şükür 67' → İlhan Mansız 67'", "Emre Belözoğlu 91' → Arif Erdem 91'"], []],
    pens: [[], []]
  },
  "2002_USA_GER": {
    cards: [["Eddie Lewis 40' 🟨", "Eddie Pope 41' 🟨", "Claudio Reyna 68' 🟨", "Pablo Mastroeni 69' 🟨", "Gregg Berhalter 70' 🟨"], ["Sebastian Kehl 66' 🟨", "Jens Jeremies 68' 🟨"]],
    subs: [["Brian McBride 58' → Clint Mathis 58'", "Frankie Hejduk 65' → Cobi Jones 65'", "Pablo Mastroeni 80' → Earnie Stewart 80'"], ["Bernd Schneider 60' → Jens Jeremies 60'", "Oliver Neuville 80' → Marco Bode 80'", "Miroslav Klose 88' → Oliver Bierhoff 88'"]],
    pens: [[], []]
  },
  "2002_USA_MEX": {
    cards: [["Eddie Pope 26' 🟨", "Pablo Mastroeni 47' 🟨", "Josh Wolff 50' 🟨", "Gregg Berhalter 53' 🟨", "Brad Friedel 83' 🟨"], ["Manuel Vidrio 37' 🟨", "Luis Hernández 67' 🟨", "Cuauhtémoc Blanco 70' 🟨", "Alberto García Aspe 81' 🟨", "Salvador Carmona 84' 🟨", "Rafael Márquez 88' 🟥"]],
    subs: [["Josh Wolff 59' → Earnie Stewart 59'", "Brian McBride 79' → Cobi Jones 79'", "Pablo Mastroeni 90' → Carlos Llamosa 90'"], ["Ramón Morales 28' → Luis Hernández 28'", "Manuel Vidrio 46' → Sigifredo Mercado 46'", "Gerardo Torrado 78' → Alberto García Aspe 78'"]],
    pens: [[], []]
  },
  "2006_ARG_GER": {
    cards: [["Juan Pablo Sorín 46' 🟨", "Javier Mascherano 60' 🟨", "Maxi Rodríguez 88' 🟨", "Julio Cruz 95' 🟨", "Leandro Cufré 120' 🟥"], ["Lukas Podolski 3' 🟨", "David Odonkor 94' 🟨", "Arne Friedrich 114' 🟨"]],
    subs: [["Roberto Abbondanzieri 71' → Leo Franco 71'", "Juan Román Riquelme 72' → Esteban Cambiasso 72'", "Hernán Crespo 79' → Julio Cruz 79'"], ["Bernd Schneider 62' → David Odonkor 62'", "Bastian Schweinsteiger 74' → Tim Borowski 74'", "Miroslav Klose 86' → Oliver Neuville 86'"]],
    pens: [["Julio Cruz ✓", "Roberto Ayala ✗", "Maxi Rodríguez ✓", "Esteban Cambiasso ✗"], ["Oliver Neuville ✓", "Michael Ballack ✓", "Lukas Podolski ✓", "Tim Borowski ✓"]]
  },
  "2006_ARG_MEX": {
    cards: [["Gabriel Heinze 45'+1' 🟨", "Juan Pablo Sorín 112' 🟨"], ["Rafael Márquez 70' 🟨", "José Antonio Castro 82' 🟨", "Gerardo Torrado 118' 🟨", "Francisco Fonseca 119' 🟨"]],
    subs: [["Hernán Crespo 75' → Carlos Tevez 75'", "Esteban Cambiasso 76' → Pablo Aimar 76'", "Javier Saviola 84' → Lionel Messi 84'"], ["Pável Pardo 38' → Gerardo Torrado 38'", "Andrés Guardado 66' → Gonzalo Pineda 66'", "Ramón Morales 74' → Sinha 74'"]],
    pens: [[], []]
  },
  "2006_AUS_ITA": {
    cards: [["Vince Grella 23' 🟨", "Tim Cahill 49' 🟨", "Luke Wilkshire 61' 🟨"], ["Fabio Grosso 29' 🟨", "Marco Materazzi 50' 🟥", "Gennaro Gattuso 89' 🟨", "Gianluca Zambrotta 90'+1' 🟨"]],
    subs: [["Mile Sterjovski 81' → John Aloisi 81'"], ["Alberto Gilardino 46' → Vincenzo Iaquinta 46'", "Luca Toni 56' → Andrea Barzagli 56'", "Alessandro Del Piero 75' → Francesco Totti 75'"]],
    pens: [[], []]
  },
  "2006_BRA_FRA": {
    cards: [["Cafu 25' 🟨", "Juan 45' 🟨", "Ronaldo 45'+2' 🟨", "Lúcio 75' 🟨"], ["Willy Sagnol 74' 🟨", "Louis Saha 87' 🟨", "Lilian Thuram 88' 🟨"]],
    subs: [["Juninho Pernambucano 63' → Adriano 63'", "Cafu 76' → Cicinho 76'", "Kaká 79' → Robinho 79'"], ["Franck Ribéry 77' → Sidney Govou 77'", "Florent Malouda 81' → Sylvain Wiltord 81'", "Thierry Henry 86' → Louis Saha 86'"]],
    pens: [[], []]
  },
  "2006_BRA_GHA": {
    cards: [["Adriano 13' 🟨", "Juan 44' 🟨"], ["Stephen Appiah 7' 🟨", "Sulley Muntari 11' 🟨", "John Paintsil 29' 🟨", "Eric Addo 38' 🟨", "Asamoah Gyan 48' 🟨"]],
    subs: [["Emerson 46' → Gilberto Silva 46'", "Adriano 61' → Juninho Pernambucano 61'", "Kaká 83' → Ricardinho 83'"], ["Eric Addo 60' → Derek Boateng 60'", "Matthew Amoah 70' → Alex Tachie-Mensah 70'"]],
    pens: [[], []]
  },
  "2006_ECU_ENG": {
    cards: [["Antonio Valencia 24' 🟨", "Carlos Tenorio 37' 🟨", "Ulises de la Cruz 67' 🟨"], ["John Terry 18' 🟨", "Paul Robinson 78' 🟨", "Jamie Carragher 82' 🟨"]],
    subs: [["Edwin Tenorio 69' → Christian Lara 69'", "Carlos Tenorio 72' → Iván Kaviedes 72'"], ["Joe Cole 77' → Jamie Carragher 77'", "David Beckham 87' → Aaron Lennon 87'", "Steven Gerrard 90'+2' → Stewart Downing 90'+2'"]],
    pens: [[], []]
  },
  "2006_ENG_ECU": {
    cards: [["John Terry 18' 🟨", "Paul Robinson 78' 🟨", "Jamie Carragher 82' 🟨"], ["Antonio Valencia 24' 🟨", "Carlos Tenorio 37' 🟨", "Ulises de la Cruz 67' 🟨"]],
    subs: [["Joe Cole 77' → Jamie Carragher 77'", "David Beckham 87' → Aaron Lennon 87'", "Steven Gerrard 90'+2' → Stewart Downing 90'+2'"], ["Edwin Tenorio 69' → Christian Lara 69'", "Carlos Tenorio 72' → Iván Kaviedes 72'"]],
    pens: [[], []]
  },
  "2006_ENG_POR": {
    cards: [["John Terry 30' 🟨", "Wayne Rooney 62' 🟥", "Owen Hargreaves 107' 🟨"], ["Petit 44' 🟨", "Ricardo Carvalho 111' 🟨"]],
    subs: [["David Beckham 52' → Aaron Lennon 52'", "Joe Cole 65' → Peter Crouch 65'", "Aaron Lennon 119' → Jamie Carragher 119'"], ["Pauleta 63' → Simão 63'", "Tiago 74' → Hugo Viana 74'", "Luís Figo 86' → Hélder Postiga 86'"]],
    pens: [["Frank Lampard ✗", "Owen Hargreaves ✓", "Steven Gerrard ✗", "Jamie Carragher ✗"], ["Simão ✓", "Hugo Viana ✗", "Petit ✗", "Hélder Postiga ✓", "Cristiano Ronaldo ✓"]]
  },
  "2006_ESP_FRA": {
    cards: [["Carles Puyol 82' 🟨"], ["Patrick Vieira 68' 🟨", "Franck Ribéry 87' 🟨", "Zinedine Zidane 90'+1' 🟨"]],
    subs: [["David Villa 54' → Luis García 54'", "Raúl 54' → Joaquín 54'", "Xavi 72' → Marcos Senna 72'"], ["Florent Malouda 74' → Sidney Govou 74'", "Thierry Henry 88' → Sylvain Wiltord 88'"]],
    pens: [[], []]
  },
  "2006_FRA_BRA": {
    cards: [["Willy Sagnol 74' 🟨", "Louis Saha 87' 🟨", "Lilian Thuram 88' 🟨"], ["Cafu 25' 🟨", "Juan 45' 🟨", "Ronaldo 45'+2' 🟨", "Lúcio 75' 🟨"]],
    subs: [["Franck Ribéry 77' → Sidney Govou 77'", "Florent Malouda 81' → Sylvain Wiltord 81'", "Thierry Henry 86' → Louis Saha 86'"], ["Juninho Pernambucano 63' → Adriano 63'", "Cafu 76' → Cicinho 76'", "Kaká 79' → Robinho 79'"]],
    pens: [[], []]
  },
  "2006_FRA_ESP": {
    cards: [["Patrick Vieira 68' 🟨", "Franck Ribéry 87' 🟨", "Zinedine Zidane 90'+1' 🟨"], ["Carles Puyol 82' 🟨"]],
    subs: [["Florent Malouda 74' → Sidney Govou 74'", "Thierry Henry 88' → Sylvain Wiltord 88'"], ["David Villa 54' → Luis García 54'", "Raúl 54' → Joaquín 54'", "Xavi 72' → Marcos Senna 72'"]],
    pens: [[], []]
  },
  "2006_FRA_ITA": {
    cards: [["Willy Sagnol 12' 🟨", "Alou Diarra 76' 🟨", "Zinedine Zidane 110' 🟥", "Florent Malouda 111' 🟨"], ["Gianluca Zambrotta 5' 🟨"]],
    subs: [["Patrick Vieira 56' → Alou Diarra 56'", "Franck Ribéry 100' → David Trezeguet 100'", "Thierry Henry 107' → Sylvain Wiltord 107'"], ["Simone Perrotta 61' → Daniele De Rossi 61'", "Francesco Totti 61' → Vincenzo Iaquinta 61'", "Mauro Camoranesi 86' → Alessandro Del Piero 86'"]],
    pens: [["Sylvain Wiltord ✓", "David Trezeguet ✗", "Eric Abidal ✓", "Willy Sagnol ✓"], ["Andrea Pirlo ✓", "Marco Materazzi ✓", "Daniele De Rossi ✓", "Alessandro Del Piero ✓", "Fabio Grosso ✓"]]
  },
  "2006_FRA_POR": {
    cards: [["Louis Saha 87' 🟨"], ["Ricardo Carvalho 83' 🟨"]],
    subs: [["Florent Malouda 69' → Sylvain Wiltord 69'", "Franck Ribéry 72' → Sidney Govou 72'", "Thierry Henry 85' → Louis Saha 85'"], ["Miguel 62' → Paulo Ferreira 62'", "Pauleta 68' → Simão 68'", "Costinha 75' → Hélder Postiga 75'"]],
    pens: [[], []]
  },
  "2006_GER_ARG": {
    cards: [["Lukas Podolski 3' 🟨", "David Odonkor 94' 🟨", "Arne Friedrich 114' 🟨"], ["Juan Pablo Sorín 46' 🟨", "Javier Mascherano 60' 🟨", "Maxi Rodríguez 88' 🟨", "Julio Cruz 95' 🟨", "Leandro Cufré 120' 🟥"]],
    subs: [["Bernd Schneider 62' → David Odonkor 62'", "Bastian Schweinsteiger 74' → Tim Borowski 74'", "Miroslav Klose 86' → Oliver Neuville 86'"], ["Roberto Abbondanzieri 71' → Leo Franco 71'", "Juan Román Riquelme 72' → Esteban Cambiasso 72'", "Hernán Crespo 79' → Julio Cruz 79'"]],
    pens: [["Oliver Neuville ✓", "Michael Ballack ✓", "Lukas Podolski ✓", "Tim Borowski ✓"], ["Julio Cruz ✓", "Roberto Ayala ✗", "Maxi Rodríguez ✓", "Esteban Cambiasso ✗"]]
  },
  "2006_GER_ITA": {
    cards: [["Tim Borowski 40' 🟨", "Christoph Metzelder 56' 🟨"], ["Mauro Camoranesi 90' 🟨"]],
    subs: [["Tim Borowski 73' → Bastian Schweinsteiger 73'", "Bernd Schneider 83' → David Odonkor 83'", "Miroslav Klose 111' → Oliver Neuville 111'"], ["Luca Toni 74' → Alberto Gilardino 74'", "Mauro Camoranesi 91' → Vincenzo Iaquinta 91'", "Simone Perrotta 104' → Alessandro Del Piero 104'"]],
    pens: [[], []]
  },
  "2006_GER_SWE": {
    cards: [["Torsten Frings 27' 🟨"], ["Teddy Lučić 28' 🟨", "Mattias Jonson 48' 🟨", "Marcus Allbäck 78' 🟨"]],
    subs: [["Bastian Schweinsteiger 72' → Tim Borowski 72'", "Lukas Podolski 74' → Oliver Neuville 74'", "Torsten Frings 85' → Sebastian Kehl 85'"], ["Kim Källström 39' → Petter Hansson 39'", "Mattias Jonson 52' → Christian Wilhelmsson 52'", "Zlatan Ibrahimović 72' → Marcus Allbäck 72'"]],
    pens: [[], []]
  },
  "2006_GHA_BRA": {
    cards: [["Stephen Appiah 7' 🟨", "Sulley Muntari 11' 🟨", "John Paintsil 29' 🟨", "Eric Addo 38' 🟨", "Asamoah Gyan 48' 🟨"], ["Adriano 13' 🟨", "Juan 44' 🟨"]],
    subs: [["Eric Addo 60' → Derek Boateng 60'", "Matthew Amoah 70' → Alex Tachie-Mensah 70'"], ["Emerson 46' → Gilberto Silva 46'", "Adriano 61' → Juninho Pernambucano 61'", "Kaká 83' → Ricardinho 83'"]],
    pens: [[], []]
  },
  "2006_ITA_AUS": {
    cards: [["Fabio Grosso 29' 🟨", "Marco Materazzi 50' 🟥", "Gennaro Gattuso 89' 🟨", "Gianluca Zambrotta 90'+1' 🟨"], ["Vince Grella 23' 🟨", "Tim Cahill 49' 🟨", "Luke Wilkshire 61' 🟨"]],
    subs: [["Alberto Gilardino 46' → Vincenzo Iaquinta 46'", "Luca Toni 56' → Andrea Barzagli 56'", "Alessandro Del Piero 75' → Francesco Totti 75'"], ["Mile Sterjovski 81' → John Aloisi 81'"]],
    pens: [[], []]
  },
  "2006_ITA_FRA": {
    cards: [["Gianluca Zambrotta 5' 🟨"], ["Willy Sagnol 12' 🟨", "Alou Diarra 76' 🟨", "Zinedine Zidane 110' 🟥", "Florent Malouda 111' 🟨"]],
    subs: [["Simone Perrotta 61' → Daniele De Rossi 61'", "Francesco Totti 61' → Vincenzo Iaquinta 61'", "Mauro Camoranesi 86' → Alessandro Del Piero 86'"], ["Patrick Vieira 56' → Alou Diarra 56'", "Franck Ribéry 100' → David Trezeguet 100'", "Thierry Henry 107' → Sylvain Wiltord 107'"]],
    pens: [["Andrea Pirlo ✓", "Marco Materazzi ✓", "Daniele De Rossi ✓", "Alessandro Del Piero ✓", "Fabio Grosso ✓"], ["Sylvain Wiltord ✓", "David Trezeguet ✗", "Eric Abidal ✓", "Willy Sagnol ✓"]]
  },
  "2006_ITA_GER": {
    cards: [["Mauro Camoranesi 90' 🟨"], ["Tim Borowski 40' 🟨", "Christoph Metzelder 56' 🟨"]],
    subs: [["Luca Toni 74' → Alberto Gilardino 74'", "Mauro Camoranesi 91' → Vincenzo Iaquinta 91'", "Simone Perrotta 104' → Alessandro Del Piero 104'"], ["Tim Borowski 73' → Bastian Schweinsteiger 73'", "Bernd Schneider 83' → David Odonkor 83'", "Miroslav Klose 111' → Oliver Neuville 111'"]],
    pens: [[], []]
  },
  "2006_ITA_UKR": {
    cards: [[], ["Vyacheslav Sviderskyi 16' 🟨", "Maksym Kalynychenko 21' 🟨", "Artem Milevskyi 67' 🟨"]],
    subs: [["Mauro Camoranesi 68' → Simone Barone 68'", "Andrea Pirlo 68' → Massimo Oddo 68'", "Gennaro Gattuso 77' → Cristian Zaccardo 77'"], ["Vyacheslav Sviderskyi 20' → Andriy Vorobey 20'", "Andriy Rusol 45'+2' → Vladyslav Vashchuk 45'+2'", "Artem Milevskyi 72' → Oleksiy Byelik 72'"]],
    pens: [[], []]
  },
  "2006_MEX_ARG": {
    cards: [["Rafael Márquez 70' 🟨", "José Antonio Castro 82' 🟨", "Gerardo Torrado 118' 🟨", "Francisco Fonseca 119' 🟨"], ["Gabriel Heinze 45'+1' 🟨", "Juan Pablo Sorín 112' 🟨"]],
    subs: [["Pável Pardo 38' → Gerardo Torrado 38'", "Andrés Guardado 66' → Gonzalo Pineda 66'", "Ramón Morales 74' → Sinha 74'"], ["Hernán Crespo 75' → Carlos Tevez 75'", "Esteban Cambiasso 76' → Pablo Aimar 76'", "Javier Saviola 84' → Lionel Messi 84'"]],
    pens: [[], []]
  },
  "2006_NED_POR": {
    cards: [["Mark van Bommel 2' 🟨", "Khalid Boulahrouz 7' 🟨", "Giovanni van Bronckhorst 59' 🟨", "Wesley Sneijder 73' 🟨", "Rafael van der Vaart 74' 🟨"], ["Maniche 20' 🟨", "Costinha 31' 🟨", "Petit 50' 🟨", "Luís Figo 60' 🟨", "Deco 73' 🟨", "Ricardo 76' 🟨", "Nuno Valente 76' 🟨"]],
    subs: [["Joris Mathijsen 56' → Rafael van der Vaart 56'", "Mark van Bommel 67' → John Heitinga 67'", "Phillip Cocu 84' → Jan Vennegoor of Hesselink 84'"], ["Cristiano Ronaldo 34' → Simão 34'", "Pauleta 46' → Petit 46'", "Luís Figo 84' → Tiago 84'"]],
    pens: [[], []]
  },
  "2006_POR_ENG": {
    cards: [["Petit 44' 🟨", "Ricardo Carvalho 111' 🟨"], ["John Terry 30' 🟨", "Wayne Rooney 62' 🟥", "Owen Hargreaves 107' 🟨"]],
    subs: [["Pauleta 63' → Simão 63'", "Tiago 74' → Hugo Viana 74'", "Luís Figo 86' → Hélder Postiga 86'"], ["David Beckham 52' → Aaron Lennon 52'", "Joe Cole 65' → Peter Crouch 65'", "Aaron Lennon 119' → Jamie Carragher 119'"]],
    pens: [["Simão ✓", "Hugo Viana ✗", "Petit ✗", "Hélder Postiga ✓", "Cristiano Ronaldo ✓"], ["Frank Lampard ✗", "Owen Hargreaves ✓", "Steven Gerrard ✗", "Jamie Carragher ✗"]]
  },
  "2006_POR_FRA": {
    cards: [["Ricardo Carvalho 83' 🟨"], ["Louis Saha 87' 🟨"]],
    subs: [["Miguel 62' → Paulo Ferreira 62'", "Pauleta 68' → Simão 68'", "Costinha 75' → Hélder Postiga 75'"], ["Florent Malouda 69' → Sylvain Wiltord 69'", "Franck Ribéry 72' → Sidney Govou 72'", "Thierry Henry 85' → Louis Saha 85'"]],
    pens: [[], []]
  },
  "2006_POR_NED": {
    cards: [["Maniche 20' 🟨", "Costinha 31' 🟨", "Petit 50' 🟨", "Luís Figo 60' 🟨", "Deco 73' 🟨", "Ricardo 76' 🟨", "Nuno Valente 76' 🟨"], ["Mark van Bommel 2' 🟨", "Khalid Boulahrouz 7' 🟨", "Giovanni van Bronckhorst 59' 🟨", "Wesley Sneijder 73' 🟨", "Rafael van der Vaart 74' 🟨"]],
    subs: [["Cristiano Ronaldo 34' → Simão 34'", "Pauleta 46' → Petit 46'", "Luís Figo 84' → Tiago 84'"], ["Joris Mathijsen 56' → Rafael van der Vaart 56'", "Mark van Bommel 67' → John Heitinga 67'", "Phillip Cocu 84' → Jan Vennegoor of Hesselink 84'"]],
    pens: [[], []]
  },
  "2006_SUI_UKR": {
    cards: [["Tranquillo Barnetta 59' 🟨"], []],
    subs: [["Johan Djourou 34' → Stéphane Grichting 34'", "Hakan Yakin 64' → Marco Streller 64'", "Alexander Frei 117' → Mauro Lustrinelli 117'"], ["Maksym Kalynychenko 75' → Ruslan Rotan 75'", "Andriy Vorobey 94' → Serhii Rebrov 94'", "Andriy Voronin 111' → Artem Milevskyi 111'"]],
    pens: [["Marco Streller ✗", "Tranquillo Barnetta ✗", "Ricardo Cabanas ✗"], ["Andriy Shevchenko ✗", "Artem Milevskyi ✓", "Serhii Rebrov ✓", "Oleh Husyev ✓"]]
  },
  "2006_SWE_GER": {
    cards: [["Teddy Lučić 28' 🟨", "Mattias Jonson 48' 🟨", "Marcus Allbäck 78' 🟨"], ["Torsten Frings 27' 🟨"]],
    subs: [["Kim Källström 39' → Petter Hansson 39'", "Mattias Jonson 52' → Christian Wilhelmsson 52'", "Zlatan Ibrahimović 72' → Marcus Allbäck 72'"], ["Bastian Schweinsteiger 72' → Tim Borowski 72'", "Lukas Podolski 74' → Oliver Neuville 74'", "Torsten Frings 85' → Sebastian Kehl 85'"]],
    pens: [[], []]
  },
  "2006_UKR_ITA": {
    cards: [["Vyacheslav Sviderskyi 16' 🟨", "Maksym Kalynychenko 21' 🟨", "Artem Milevskyi 67' 🟨"], []],
    subs: [["Vyacheslav Sviderskyi 20' → Andriy Vorobey 20'", "Andriy Rusol 45'+2' → Vladyslav Vashchuk 45'+2'", "Artem Milevskyi 72' → Oleksiy Byelik 72'"], ["Mauro Camoranesi 68' → Simone Barone 68'", "Andrea Pirlo 68' → Massimo Oddo 68'", "Gennaro Gattuso 77' → Cristian Zaccardo 77'"]],
    pens: [[], []]
  },
  "2006_UKR_SUI": {
    cards: [[], ["Tranquillo Barnetta 59' 🟨"]],
    subs: [["Maksym Kalynychenko 75' → Ruslan Rotan 75'", "Andriy Vorobey 94' → Serhii Rebrov 94'", "Andriy Voronin 111' → Artem Milevskyi 111'"], ["Johan Djourou 34' → Stéphane Grichting 34'", "Hakan Yakin 64' → Marco Streller 64'", "Alexander Frei 117' → Mauro Lustrinelli 117'"]],
    pens: [["Andriy Shevchenko ✗", "Artem Milevskyi ✓", "Serhii Rebrov ✓", "Oleh Husyev ✓"], ["Marco Streller ✗", "Tranquillo Barnetta ✗", "Ricardo Cabanas ✗"]]
  },
  "2010_ARG_GER": {
    cards: [["Nicolás Otamendi 11' 🟨", "Javier Mascherano 80' 🟨"], ["Thomas Müller 35' 🟨"]],
    subs: [["Nicolás Otamendi 70' → Javier Pastore 70'", "Ángel Di María 75' → Sergio Agüero 75'"], ["Jérôme Boateng 72' → Marcell Jansen 72'", "Sami Khedira 77' → Toni Kroos 77'", "Thomas Müller 84' → Piotr Trochowski 84'"]],
    pens: [[], []]
  },
  "2010_ARG_MEX": {
    cards: [[], ["Rafael Márquez 28' 🟨"]],
    subs: [["Carlos Tevez 69' → Juan Sebastián Verón 69'", "Ángel Di María 79' → Jonás Gutiérrez 79'", "Maxi Rodríguez 87' → Javier Pastore 87'"], ["Adolfo Bautista 46' → Pablo Barrera 46'", "Andrés Guardado 61' → Guillermo Franco 61'"]],
    pens: [[], []]
  },
  "2010_BRA_CHI": {
    cards: [["Kaká 30' 🟨", "Ramires 72' 🟨"], ["Arturo Vidal 47' 🟨", "Ismael Fuentes 68' 🟨", "Rodrigo Millar 80' 🟨"]],
    subs: [["Luís Fabiano 76' → Nilmar 76'", "Kaká 81' → Kléberson 81'", "Robinho 85' → Gilberto 85'"], ["Pablo Contreras 46' → Jorge Valdivia 46'", "Mark González 46' → Rodrigo Tello 46'", "Mauricio Isla 62' → Rodrigo Millar 62'"]],
    pens: [[], []]
  },
  "2010_BRA_NED": {
    cards: [["Michel Bastos 37' 🟨", "Felipe Melo 73' 🟥"], ["John Heitinga 14' 🟨", "Gregory van der Wiel 47' 🟨", "Nigel de Jong 64' 🟨", "André Ooijer 76' 🟨"]],
    subs: [["Michel Bastos 62' → Gilberto 62'", "Luís Fabiano 77' → Nilmar 77'"], ["Robin van Persie 85' → Klaas-Jan Huntelaar 85'"]],
    pens: [[], []]
  },
  "2010_CHI_BRA": {
    cards: [["Arturo Vidal 47' 🟨", "Ismael Fuentes 68' 🟨", "Rodrigo Millar 80' 🟨"], ["Kaká 30' 🟨", "Ramires 72' 🟨"]],
    subs: [["Pablo Contreras 46' → Jorge Valdivia 46'", "Mark González 46' → Rodrigo Tello 46'", "Mauricio Isla 62' → Rodrigo Millar 62'"], ["Luís Fabiano 76' → Nilmar 76'", "Kaká 81' → Kléberson 81'", "Robinho 85' → Gilberto 85'"]],
    pens: [[], []]
  },
  "2010_ENG_GER": {
    cards: [["Glen Johnson 81' 🟨"], ["Arne Friedrich 47' 🟨"]],
    subs: [["James Milner 64' → Joe Cole 64'", "Jermain Defoe 71' → Emile Heskey 71'", "Glen Johnson 87' → Shaun Wright-Phillips 87'"], ["Thomas Müller 72' → Piotr Trochowski 72'", "Miroslav Klose 72' → Mario Gómez 72'", "Mesut Özil 83' → Stefan Kießling 83'"]],
    pens: [[], []]
  },
  "2010_ESP_GER": {
    cards: [[], []],
    subs: [["David Villa 81' → Fernando Torres 81'", "Pedro 86' → David Silva 86'", "Xabi Alonso 90'+3' → Carlos Marchena 90'+3'"], ["Jérôme Boateng 52' → Marcell Jansen 52'", "Piotr Trochowski 62' → Toni Kroos 62'", "Sami Khedira 81' → Mario Gómez 81'"]],
    pens: [[], []]
  },
  "2010_ESP_NED": {
    cards: [["Carles Puyol 16' 🟨", "Sergio Ramos 23' 🟨", "Joan Capdevila 67' 🟨", "Andrés Iniesta 118' 🟨", "Xavi 120'+1' 🟨"], ["Robin van Persie 15' 🟨", "Mark van Bommel 22' 🟨", "Nigel de Jong 28' 🟨", "Giovanni van Bronckhorst 54' 🟨", "John Heitinga 57' 🟨", "Arjen Robben 84' 🟨", "Gregory van der Wiel 111' 🟨", "Joris Mathijsen 117' 🟨"]],
    subs: [["Pedro 60' → Jesús Navas 60'", "Xabi Alonso 87' → Cesc Fàbregas 87'", "David Villa 106' → Fernando Torres 106'"], ["Dirk Kuyt 71' → Eljero Elia 71'", "Nigel de Jong 99' → Rafael van der Vaart 99'", "Giovanni van Bronckhorst 105' → Edson Braafheid 105'"]],
    pens: [[], []]
  },
  "2010_ESP_PAR": {
    cards: [["Gerard Piqué 57' 🟨", "Sergio Busquets 63' 🟨"], ["Antolín Alcaraz 59' 🟨", "Víctor Cáceres 59' 🟨", "Claudio Morel 71' 🟨", "Jonathan Santana 88' 🟨"]],
    subs: [["Fernando Torres 56' → Cesc Fàbregas 56'", "Xabi Alonso 75' → Pedro 75'", "Carles Puyol 84' → Carlos Marchena 84'"], ["Édgar Barreto 64' → Enrique Vera 64'", "Nelson Valdez 72' → Roque Santa Cruz 72'", "Víctor Cáceres 84' → Lucas Barrios 84'"]],
    pens: [[], []]
  },
  "2010_ESP_POR": {
    cards: [["Xabi Alonso 74' 🟨"], ["Tiago 80' 🟨", "Ricardo Costa 89' 🟥"]],
    subs: [["Fernando Torres 58' → Fernando Llorente 58'", "David Villa 88' → Álvaro Arbeloa 88'", "Xabi Alonso 90'+3' → Carlos Marchena 90'+3'"], ["Hugo Almeida 58' → Danny 58'", "Pepe 72' → Liédson 72'", "Simão 72' → Pedro Mendes 72'"]],
    pens: [[], []]
  },
  "2010_GER_ARG": {
    cards: [["Thomas Müller 35' 🟨"], ["Nicolás Otamendi 11' 🟨", "Javier Mascherano 80' 🟨"]],
    subs: [["Jérôme Boateng 72' → Marcell Jansen 72'", "Sami Khedira 77' → Toni Kroos 77'", "Thomas Müller 84' → Piotr Trochowski 84'"], ["Nicolás Otamendi 70' → Javier Pastore 70'", "Ángel Di María 75' → Sergio Agüero 75'"]],
    pens: [[], []]
  },
  "2010_GER_ENG": {
    cards: [["Arne Friedrich 47' 🟨"], ["Glen Johnson 81' 🟨"]],
    subs: [["Thomas Müller 72' → Piotr Trochowski 72'", "Miroslav Klose 72' → Mario Gómez 72'", "Mesut Özil 83' → Stefan Kießling 83'"], ["James Milner 64' → Joe Cole 64'", "Jermain Defoe 71' → Emile Heskey 71'", "Glen Johnson 87' → Shaun Wright-Phillips 87'"]],
    pens: [[], []]
  },
  "2010_GER_ESP": {
    cards: [[], []],
    subs: [["Jérôme Boateng 52' → Marcell Jansen 52'", "Piotr Trochowski 62' → Toni Kroos 62'", "Sami Khedira 81' → Mario Gómez 81'"], ["David Villa 81' → Fernando Torres 81'", "Pedro 86' → David Silva 86'", "Xabi Alonso 90'+3' → Carlos Marchena 90'+3'"]],
    pens: [[], []]
  },
  "2010_GHA_URU": {
    cards: [["John Paintsil 54' 🟨", "Hans Sarpei 77' 🟨", "John Mensah 93' 🟨"], ["Jorge Fucile 20' 🟨", "Egidio Arévalo Ríos 48' 🟨", "Diego Pérez 59' 🟨", "Luis Suárez 120'+1' 🟥"]],
    subs: [["Samuel Inkoom 74' → Stephen Appiah 74'", "Sulley Muntari 88' → Dominic Adiyiah 88'"], ["Diego Lugano 38' → Andrés Scotti 38'", "Álvaro Fernández 46' → Nicolás Lodeiro 46'", "Edinson Cavani 76' → Sebastián Abreu 76'"]],
    pens: [["Asamoah Gyan ✓", "Stephen Appiah ✓", "John Mensah ✗", "Dominic Adiyiah ✗"], ["Diego Forlán ✓", "Mauricio Victorino ✓", "Andrés Scotti ✓", "Maxi Pereira ✗", "Sebastián Abreu ✓"]]
  },
  "2010_GHA_USA": {
    cards: [["Jonathan Mensah 61' 🟨", "André Ayew 90'+2' 🟨"], ["Ricardo Clark 7' 🟨", "Steve Cherundolo 18' 🟨", "Carlos Bocanegra 68' 🟨"]],
    subs: [["Hans Sarpei 73' → Lee Addy 73'", "Kevin-Prince Boateng 78' → Stephen Appiah 78'", "Samuel Inkoom 113' → Sulley Muntari 113'"], ["Ricardo Clark 31' → Maurice Edu 31'", "Robbie Findley 46' → Benny Feilhaber 46'", "Jozy Altidore 91' → Herculez Gomez 91'"]],
    pens: [[], []]
  },
  "2010_JPN_PAR": {
    cards: [["Daisuke Matsui 58' 🟨", "Yuto Nagatomo 72' 🟨", "Keisuke Honda 90'+3' 🟨", "Yasuhito Endō 113' 🟨"], ["Cristian Riveros 118' 🟨"]],
    subs: [["Daisuke Matsui 65' → Shinji Okazaki 65'", "Yuki Abe 81' → Kengo Nakamura 81'", "Yoshito Ōkubo 106' → Keiji Tamada 106'"], ["Édgar Benítez 60' → Nelson Valdez 60'", "Néstor Ortigoza 75' → Édgar Barreto 75'", "Roque Santa Cruz 94' → Óscar Cardozo 94'"]],
    pens: [["Yasuhito Endō ✓", "Makoto Hasebe ✓", "Yūichi Komano ✗", "Keisuke Honda ✓"], ["Édgar Barreto ✓", "Lucas Barrios ✓", "Cristian Riveros ✓", "Nelson Valdez ✓", "Óscar Cardozo ✓"]]
  },
  "2010_KOR_URU": {
    cards: [["Jung-woo Kim 38' 🟨", "Du-ri Cha 69' 🟨", "Yong-hyung Cho 83' 🟨"], []],
    subs: [["Jae-sung Kim 61' → Dong-gook Lee 61'", "Sung-yueng Ki 85' → Ki-hun Yeom 85'"], ["Diego Godín 46' → Mauricio Victorino 46'", "Álvaro Pereira 74' → Nicolás Lodeiro 74'", "Luis Suárez 84' → Álvaro Fernández 84'"]],
    pens: [[], []]
  },
  "2010_MEX_ARG": {
    cards: [["Rafael Márquez 28' 🟨"], []],
    subs: [["Adolfo Bautista 46' → Pablo Barrera 46'", "Andrés Guardado 61' → Guillermo Franco 61'"], ["Carlos Tevez 69' → Juan Sebastián Verón 69'", "Ángel Di María 79' → Jonás Gutiérrez 79'", "Maxi Rodríguez 87' → Javier Pastore 87'"]],
    pens: [[], []]
  },
  "2010_NED_BRA": {
    cards: [["John Heitinga 14' 🟨", "Gregory van der Wiel 47' 🟨", "Nigel de Jong 64' 🟨", "André Ooijer 76' 🟨"], ["Michel Bastos 37' 🟨", "Felipe Melo 73' 🟥"]],
    subs: [["Robin van Persie 85' → Klaas-Jan Huntelaar 85'"], ["Michel Bastos 62' → Gilberto 62'", "Luís Fabiano 77' → Nilmar 77'"]],
    pens: [[], []]
  },
  "2010_NED_ESP": {
    cards: [["Robin van Persie 15' 🟨", "Mark van Bommel 22' 🟨", "Nigel de Jong 28' 🟨", "Giovanni van Bronckhorst 54' 🟨", "John Heitinga 57' 🟨", "Arjen Robben 84' 🟨", "Gregory van der Wiel 111' 🟨", "Joris Mathijsen 117' 🟨"], ["Carles Puyol 16' 🟨", "Sergio Ramos 23' 🟨", "Joan Capdevila 67' 🟨", "Andrés Iniesta 118' 🟨", "Xavi 120'+1' 🟨"]],
    subs: [["Dirk Kuyt 71' → Eljero Elia 71'", "Nigel de Jong 99' → Rafael van der Vaart 99'", "Giovanni van Bronckhorst 105' → Edson Braafheid 105'"], ["Pedro 60' → Jesús Navas 60'", "Xabi Alonso 87' → Cesc Fàbregas 87'", "David Villa 106' → Fernando Torres 106'"]],
    pens: [[], []]
  },
  "2010_NED_SVK": {
    cards: [["Arjen Robben 31' 🟨", "Maarten Stekelenburg 90'+3' 🟨"], ["Juraj Kucka 40' 🟨", "Kamil Kopúnek 72' 🟨", "Martin Škrtel 84' 🟨"]],
    subs: [["Arjen Robben 71' → Eljero Elia 71'", "Robin van Persie 80' → Klaas-Jan Huntelaar 80'", "Wesley Sneijder 90'+2' → Ibrahim Afellay 90'+2'"], ["Erik Jendrišek 71' → Kamil Kopúnek 71'", "Marek Hamšík 87' → Marek Sapara 87'", "Radoslav Zabavník 88' → Martin Jakubko 88'"]],
    pens: [[], []]
  },
  "2010_NED_URU": {
    cards: [["Wesley Sneijder 29' 🟨", "Khalid Boulahrouz 78' 🟨", "Mark van Bommel 90'+5' 🟨"], ["Maxi Pereira 21' 🟨", "Martín Cáceres 29' 🟨"]],
    subs: [["Demy de Zeeuw 46' → Rafael van der Vaart 46'", "Arjen Robben 89' → Eljero Elia 89'"], ["Álvaro Pereira 78' → Sebastián Abreu 78'", "Diego Forlán 84' → Sebastián Fernández 84'"]],
    pens: [[], []]
  },
  "2010_PAR_ESP": {
    cards: [["Antolín Alcaraz 59' 🟨", "Víctor Cáceres 59' 🟨", "Claudio Morel 71' 🟨", "Jonathan Santana 88' 🟨"], ["Gerard Piqué 57' 🟨", "Sergio Busquets 63' 🟨"]],
    subs: [["Édgar Barreto 64' → Enrique Vera 64'", "Nelson Valdez 72' → Roque Santa Cruz 72'", "Víctor Cáceres 84' → Lucas Barrios 84'"], ["Fernando Torres 56' → Cesc Fàbregas 56'", "Xabi Alonso 75' → Pedro 75'", "Carles Puyol 84' → Carlos Marchena 84'"]],
    pens: [[], []]
  },
  "2010_PAR_JPN": {
    cards: [["Cristian Riveros 118' 🟨"], ["Daisuke Matsui 58' 🟨", "Yuto Nagatomo 72' 🟨", "Keisuke Honda 90'+3' 🟨", "Yasuhito Endō 113' 🟨"]],
    subs: [["Édgar Benítez 60' → Nelson Valdez 60'", "Néstor Ortigoza 75' → Édgar Barreto 75'", "Roque Santa Cruz 94' → Óscar Cardozo 94'"], ["Daisuke Matsui 65' → Shinji Okazaki 65'", "Yuki Abe 81' → Kengo Nakamura 81'", "Yoshito Ōkubo 106' → Keiji Tamada 106'"]],
    pens: [["Édgar Barreto ✓", "Lucas Barrios ✓", "Cristian Riveros ✓", "Nelson Valdez ✓", "Óscar Cardozo ✓"], ["Yasuhito Endō ✓", "Makoto Hasebe ✓", "Yūichi Komano ✗", "Keisuke Honda ✓"]]
  },
  "2010_POR_ESP": {
    cards: [["Tiago 80' 🟨", "Ricardo Costa 89' 🟥"], ["Xabi Alonso 74' 🟨"]],
    subs: [["Hugo Almeida 58' → Danny 58'", "Pepe 72' → Liédson 72'", "Simão 72' → Pedro Mendes 72'"], ["Fernando Torres 58' → Fernando Llorente 58'", "David Villa 88' → Álvaro Arbeloa 88'", "Xabi Alonso 90'+3' → Carlos Marchena 90'+3'"]],
    pens: [[], []]
  },
  "2010_SVK_NED": {
    cards: [["Juraj Kucka 40' 🟨", "Kamil Kopúnek 72' 🟨", "Martin Škrtel 84' 🟨"], ["Arjen Robben 31' 🟨", "Maarten Stekelenburg 90'+3' 🟨"]],
    subs: [["Erik Jendrišek 71' → Kamil Kopúnek 71'", "Marek Hamšík 87' → Marek Sapara 87'", "Radoslav Zabavník 88' → Martin Jakubko 88'"], ["Arjen Robben 71' → Eljero Elia 71'", "Robin van Persie 80' → Klaas-Jan Huntelaar 80'", "Wesley Sneijder 90'+2' → Ibrahim Afellay 90'+2'"]],
    pens: [[], []]
  },
  "2010_URU_GHA": {
    cards: [["Jorge Fucile 20' 🟨", "Egidio Arévalo Ríos 48' 🟨", "Diego Pérez 59' 🟨", "Luis Suárez 120'+1' 🟥"], ["John Paintsil 54' 🟨", "Hans Sarpei 77' 🟨", "John Mensah 93' 🟨"]],
    subs: [["Diego Lugano 38' → Andrés Scotti 38'", "Álvaro Fernández 46' → Nicolás Lodeiro 46'", "Edinson Cavani 76' → Sebastián Abreu 76'"], ["Samuel Inkoom 74' → Stephen Appiah 74'", "Sulley Muntari 88' → Dominic Adiyiah 88'"]],
    pens: [["Diego Forlán ✓", "Mauricio Victorino ✓", "Andrés Scotti ✓", "Maxi Pereira ✗", "Sebastián Abreu ✓"], ["Asamoah Gyan ✓", "Stephen Appiah ✓", "John Mensah ✗", "Dominic Adiyiah ✗"]]
  },
  "2010_URU_KOR": {
    cards: [[], ["Jung-woo Kim 38' 🟨", "Du-ri Cha 69' 🟨", "Yong-hyung Cho 83' 🟨"]],
    subs: [["Diego Godín 46' → Mauricio Victorino 46'", "Álvaro Pereira 74' → Nicolás Lodeiro 74'", "Luis Suárez 84' → Álvaro Fernández 84'"], ["Jae-sung Kim 61' → Dong-gook Lee 61'", "Sung-yueng Ki 85' → Ki-hun Yeom 85'"]],
    pens: [[], []]
  },
  "2010_URU_NED": {
    cards: [["Maxi Pereira 21' 🟨", "Martín Cáceres 29' 🟨"], ["Wesley Sneijder 29' 🟨", "Khalid Boulahrouz 78' 🟨", "Mark van Bommel 90'+5' 🟨"]],
    subs: [["Álvaro Pereira 78' → Sebastián Abreu 78'", "Diego Forlán 84' → Sebastián Fernández 84'"], ["Demy de Zeeuw 46' → Rafael van der Vaart 46'", "Arjen Robben 89' → Eljero Elia 89'"]],
    pens: [[], []]
  },
  "2010_USA_GHA": {
    cards: [["Ricardo Clark 7' 🟨", "Steve Cherundolo 18' 🟨", "Carlos Bocanegra 68' 🟨"], ["Jonathan Mensah 61' 🟨", "André Ayew 90'+2' 🟨"]],
    subs: [["Ricardo Clark 31' → Maurice Edu 31'", "Robbie Findley 46' → Benny Feilhaber 46'", "Jozy Altidore 91' → Herculez Gomez 91'"], ["Hans Sarpei 73' → Lee Addy 73'", "Kevin-Prince Boateng 78' → Stephen Appiah 78'", "Samuel Inkoom 113' → Sulley Muntari 113'"]],
    pens: [[], []]
  },
  "2014_ALG_GER": {
    cards: [["Rafik Halliche 42' 🟨"], ["Philipp Lahm 107' 🟨"]],
    subs: [["Saphir Taïder 78' → Yacine Brahimi 78'", "Rafik Halliche 97' → Madjid Bougherra 97'", "Hillal Soudani 100' → Abdelmoumene Djabou 100'"], ["Mario Götze 46' → André Schürrle 46'", "Shkodran Mustafi 70' → Sami Khedira 70'", "Bastian Schweinsteiger 109' → Christoph Kramer 109'"]],
    pens: [[], []]
  },
  "2014_ARG_BEL": {
    cards: [["Lucas Biglia 75' 🟨"], ["Eden Hazard 53' 🟨", "Toby Alderweireld 69' 🟨"]],
    subs: [["Ángel Di María 33' → Enzo Pérez 33'", "Ezequiel Lavezzi 71' → Rodrigo Palacio 71'", "Gonzalo Higuaín 81' → Fernando Gago 81'"], ["Divock Origi 59' → Romelu Lukaku 59'", "Kevin Mirallas 60' → Dries Mertens 60'", "Eden Hazard 75' → Nacer Chadli 75'"]],
    pens: [[], []]
  },
  "2014_ARG_GER": {
    cards: [["Javier Mascherano 64' 🟨", "Sergio Agüero 65' 🟨"], ["Bastian Schweinsteiger 29' 🟨", "Benedikt Höwedes 34' 🟨"]],
    subs: [["Ezequiel Lavezzi 45' → Sergio Agüero 45'", "Gonzalo Higuaín 78' → Rodrigo Palacio 78'", "Enzo Pérez 86' → Fernando Gago 86'"], ["Christoph Kramer 32' → André Schürrle 32'", "Miroslav Klose 88' → Mario Götze 88'", "Mesut Özil 120' → Per Mertesacker 120'"]],
    pens: [[], []]
  },
  "2014_ARG_NED": {
    cards: [["Martín Demichelis 49' 🟨"], ["Bruno Martins Indi 45' 🟨", "Klaas-Jan Huntelaar 105' 🟨"]],
    subs: [["Enzo Pérez 81' → Rodrigo Palacio 81'", "Gonzalo Higuaín 82' → Sergio Agüero 82'", "Ezequiel Lavezzi 101' → Maxi Rodríguez 101'"], ["Bruno Martins Indi 46' → Daryl Janmaat 46'", "Nigel de Jong 62' → Jordy Clasie 62'", "Robin van Persie 96' → Klaas-Jan Huntelaar 96'"]],
    pens: [["Lionel Messi ✓", "Ezequiel Garay ✓", "Sergio Agüero ✓", "Maxi Rodríguez ✓"], ["Ron Vlaar ✗", "Arjen Robben ✓", "Wesley Sneijder ✗", "Dirk Kuyt ✓"]]
  },
  "2014_ARG_SUI": {
    cards: [["Marcos Rojo 90' 🟨", "Ángel Di María 120' 🟨", "Ezequiel Garay 120'+4' 🟨"], ["Granit Xhaka 36' 🟨", "Gélson Fernandes 73' 🟨"]],
    subs: [["Ezequiel Lavezzi 74' → Rodrigo Palacio 74'", "Marcos Rojo 105'+1' → José María Basanta 105'+1'", "Fernando Gago 106' → Lucas Biglia 106'"], ["Granit Xhaka 66' → Gélson Fernandes 66'", "Josip Drmić 82' → Haris Seferovic 82'", "Admir Mehmedi 113' → Blerim Džemaili 113'"]],
    pens: [[], []]
  },
  "2014_BEL_ARG": {
    cards: [["Eden Hazard 53' 🟨", "Toby Alderweireld 69' 🟨"], ["Lucas Biglia 75' 🟨"]],
    subs: [["Divock Origi 59' → Romelu Lukaku 59'", "Kevin Mirallas 60' → Dries Mertens 60'", "Eden Hazard 75' → Nacer Chadli 75'"], ["Ángel Di María 33' → Enzo Pérez 33'", "Ezequiel Lavezzi 71' → Rodrigo Palacio 71'", "Gonzalo Higuaín 81' → Fernando Gago 81'"]],
    pens: [[], []]
  },
  "2014_BEL_USA": {
    cards: [["Vincent Kompany 42' 🟨"], ["Geoff Cameron 18' 🟨"]],
    subs: [["Dries Mertens 60' → Kevin Mirallas 60'", "Divock Origi 91' → Romelu Lukaku 91'", "Eden Hazard 111' → Nacer Chadli 111'"], ["Fabian Johnson 32' → DeAndre Yedlin 32'", "Graham Zusi 72' → Chris Wondolowski 72'", "Alejandro Bedoya 105'+2' → Julian Green 105'+2'"]],
    pens: [[], []]
  },
  "2014_BRA_CHI": {
    cards: [["Hulk 55' 🟨", "Luiz Gustavo 60' 🟨", "Jô 93' 🟨", "Dani Alves 105'+1' 🟨"], ["Eugenio Mena 17' 🟨", "Francisco Silva 40' 🟨", "Mauricio Pinilla 102' 🟨"]],
    subs: [["Fred 64' → Jô 64'", "Fernandinho 72' → Ramires 72'", "Oscar 106' → Willian 106'"], ["Eduardo Vargas 57' → Felipe Gutiérrez 57'", "Arturo Vidal 87' → Mauricio Pinilla 87'", "Gary Medel 108' → José Manuel Rojas 108'"]],
    pens: [["David Luiz ✓", "Willian ✗", "Marcelo ✓", "Hulk ✗", "Neymar ✓"], ["Mauricio Pinilla ✗", "Alexis Sánchez ✗", "Charles Aránguiz ✓", "Marcelo Díaz ✓", "Gonzalo Jara ✗"]]
  },
  "2014_BRA_COL": {
    cards: [["Thiago Silva 64' 🟨", "Júlio César 78' 🟨"], ["James Rodríguez 67' 🟨", "Mario Yepes 71' 🟨"]],
    subs: [["Hulk 82' → Ramires 82'", "Paulinho 86' → Hernanes 86'", "Neymar 88' → Henrique 88'"], ["Víctor Ibarbo 46' → Adrián Ramos 46'", "Teófilo Gutiérrez 70' → Carlos Bacca 70'", "Juan Cuadrado 80' → Juan Fernando Quintero 80'"]],
    pens: [[], []]
  },
  "2014_BRA_GER": {
    cards: [["Dante 68' 🟨"], []],
    subs: [["Fernandinho 46' → Ramires 46'", "Hulk 46' → Paulinho 46'", "Fred 70' → Willian 70'"], ["Mats Hummels 46' → Per Mertesacker 46'", "Miroslav Klose 58' → André Schürrle 58'", "Sami Khedira 76' → Julian Draxler 76'"]],
    pens: [[], []]
  },
  "2014_CHI_BRA": {
    cards: [["Eugenio Mena 17' 🟨", "Francisco Silva 40' 🟨", "Mauricio Pinilla 102' 🟨"], ["Hulk 55' 🟨", "Luiz Gustavo 60' 🟨", "Jô 93' 🟨", "Dani Alves 105'+1' 🟨"]],
    subs: [["Eduardo Vargas 57' → Felipe Gutiérrez 57'", "Arturo Vidal 87' → Mauricio Pinilla 87'", "Gary Medel 108' → José Manuel Rojas 108'"], ["Fred 64' → Jô 64'", "Fernandinho 72' → Ramires 72'", "Oscar 106' → Willian 106'"]],
    pens: [["Mauricio Pinilla ✗", "Alexis Sánchez ✗", "Charles Aránguiz ✓", "Marcelo Díaz ✓", "Gonzalo Jara ✗"], ["David Luiz ✓", "Willian ✗", "Marcelo ✓", "Hulk ✗", "Neymar ✓"]]
  },
  "2014_COL_BRA": {
    cards: [["James Rodríguez 67' 🟨", "Mario Yepes 71' 🟨"], ["Thiago Silva 64' 🟨", "Júlio César 78' 🟨"]],
    subs: [["Víctor Ibarbo 46' → Adrián Ramos 46'", "Teófilo Gutiérrez 70' → Carlos Bacca 70'", "Juan Cuadrado 80' → Juan Fernando Quintero 80'"], ["Hulk 82' → Ramires 82'", "Paulinho 86' → Hernanes 86'", "Neymar 88' → Henrique 88'"]],
    pens: [[], []]
  },
  "2014_COL_URU": {
    cards: [["Pablo Armero 78' 🟨"], ["José Giménez 55' 🟨", "Diego Lugano 77' 🟨"]],
    subs: [["Teófilo Gutiérrez 68' → Alexander Mejía 68'", "Juan Cuadrado 81' → Fredy Guarín 81'", "James Rodríguez 85' → Adrián Ramos 85'"], ["Álvaro Pereira 53' → Cristhian Stuani 53'", "Diego Forlán 53' → Gastón Ramírez 53'", "Álvaro González 67' → Abel Hernández 67'"]],
    pens: [[], []]
  },
  "2014_CRC_GRE": {
    cards: [["Óscar Duarte 42' 🟨", "Yeltsin Tejeda 48' 🟨", "Óscar Granados 57' 🟨", "Bryan Ruiz 70' 🟨", "Keylor Navas 90' 🟨"], ["Andreas Samaris 36' 🟨", "Kostas Manolas 72' 🟨"]],
    subs: [["Yeltsin Tejeda 66' → José Miguel Cubero 66'", "Cristian Gamboa 77' → Jhonny Acosta 77'", "Christian Bolaños 83' → Randall Brenes 83'"], ["Andreas Samaris 58' → Kostas Mitroglou 58'", "Dimitris Salpingidis 69' → Theofanis Gekas 69'", "Giannis Maniatis 78' → Kostas Katsouranis 78'"]],
    pens: [["Celso Borges ✓", "Bryan Ruiz ✓", "Giancarlo González ✓", "Joel Campbell ✓", "Michael Umaña ✓"], ["Kostas Mitroglou ✓", "Lazaros Christodoulopoulos ✓", "José Holebas ✓", "Theofanis Gekas ✗"]]
  },
  "2014_CRC_NED": {
    cards: [["Júnior Díaz 37' 🟨", "Michael Umaña 52' 🟨", "Giancarlo González 81' 🟨", "Jhonny Acosta 107' 🟨"], ["Bruno Martins Indi 64' 🟨", "Klaas-Jan Huntelaar 111' 🟨"]],
    subs: [["Joel Campbell 66' → Marco Ureña 66'", "Cristian Gamboa 79' → David Myrie 79'", "Yeltsin Tejeda 97' → José Miguel Cubero 97'"], ["Memphis Depay 76' → Jeremain Lens 76'", "Bruno Martins Indi 106' → Klaas-Jan Huntelaar 106'", "Jasper Cillessen 120'+1' → Tim Krul 120'+1'"]],
    pens: [["Celso Borges ✓", "Bryan Ruiz ✗", "Giancarlo González ✓", "Christian Bolaños ✓", "Michael Umaña ✗"], ["Robin van Persie ✓", "Arjen Robben ✓", "Wesley Sneijder ✓", "Dirk Kuyt ✓"]]
  },
  "2014_FRA_GER": {
    cards: [[], ["Sami Khedira 54' 🟨", "Bastian Schweinsteiger 80' 🟨"]],
    subs: [["Mamadou Sakho 72' → Laurent Koscielny 72'", "Yohan Cabaye 74' → Loïc Rémy 74'", "Mathieu Valbuena 84' → Olivier Giroud 84'"], ["Miroslav Klose 68' → André Schürrle 68'", "Mesut Özil 83' → Mario Götze 83'", "Toni Kroos 90'+3' → Christoph Kramer 90'+3'"]],
    pens: [[], []]
  },
  "2014_FRA_NGA": {
    cards: [["Blaise Matuidi 54' 🟨"], []],
    subs: [["Olivier Giroud 62' → Antoine Griezmann 62'", "Mathieu Valbuena 90'+4' → Moussa Sissoko 90'+4'"], ["Ogenyi Onazi 59' → Reuben Gabriel 59'", "Victor Moses 89' → Uche Nwofor 89'"]],
    pens: [[], []]
  },
  "2014_GER_ALG": {
    cards: [["Philipp Lahm 107' 🟨"], ["Rafik Halliche 42' 🟨"]],
    subs: [["Mario Götze 46' → André Schürrle 46'", "Shkodran Mustafi 70' → Sami Khedira 70'", "Bastian Schweinsteiger 109' → Christoph Kramer 109'"], ["Saphir Taïder 78' → Yacine Brahimi 78'", "Rafik Halliche 97' → Madjid Bougherra 97'", "Hillal Soudani 100' → Abdelmoumene Djabou 100'"]],
    pens: [[], []]
  },
  "2014_GER_ARG": {
    cards: [["Bastian Schweinsteiger 29' 🟨", "Benedikt Höwedes 34' 🟨"], ["Javier Mascherano 64' 🟨", "Sergio Agüero 65' 🟨"]],
    subs: [["Christoph Kramer 32' → André Schürrle 32'", "Miroslav Klose 88' → Mario Götze 88'", "Mesut Özil 120' → Per Mertesacker 120'"], ["Ezequiel Lavezzi 45' → Sergio Agüero 45'", "Gonzalo Higuaín 78' → Rodrigo Palacio 78'", "Enzo Pérez 86' → Fernando Gago 86'"]],
    pens: [[], []]
  },
  "2014_GER_BRA": {
    cards: [[], ["Dante 68' 🟨"]],
    subs: [["Mats Hummels 46' → Per Mertesacker 46'", "Miroslav Klose 58' → André Schürrle 58'", "Sami Khedira 76' → Julian Draxler 76'"], ["Fernandinho 46' → Ramires 46'", "Hulk 46' → Paulinho 46'", "Fred 70' → Willian 70'"]],
    pens: [[], []]
  },
  "2014_GER_FRA": {
    cards: [["Sami Khedira 54' 🟨", "Bastian Schweinsteiger 80' 🟨"], []],
    subs: [["Miroslav Klose 68' → André Schürrle 68'", "Mesut Özil 83' → Mario Götze 83'", "Toni Kroos 90'+3' → Christoph Kramer 90'+3'"], ["Mamadou Sakho 72' → Laurent Koscielny 72'", "Yohan Cabaye 74' → Loïc Rémy 74'", "Mathieu Valbuena 84' → Olivier Giroud 84'"]],
    pens: [[], []]
  },
  "2014_GRE_CRC": {
    cards: [["Andreas Samaris 36' 🟨", "Kostas Manolas 72' 🟨"], ["Óscar Duarte 42' 🟨", "Yeltsin Tejeda 48' 🟨", "Óscar Granados 57' 🟨", "Bryan Ruiz 70' 🟨", "Keylor Navas 90' 🟨"]],
    subs: [["Andreas Samaris 58' → Kostas Mitroglou 58'", "Dimitris Salpingidis 69' → Theofanis Gekas 69'", "Giannis Maniatis 78' → Kostas Katsouranis 78'"], ["Yeltsin Tejeda 66' → José Miguel Cubero 66'", "Cristian Gamboa 77' → Jhonny Acosta 77'", "Christian Bolaños 83' → Randall Brenes 83'"]],
    pens: [["Kostas Mitroglou ✓", "Lazaros Christodoulopoulos ✓", "José Holebas ✓", "Theofanis Gekas ✗"], ["Celso Borges ✓", "Bryan Ruiz ✓", "Giancarlo González ✓", "Joel Campbell ✓", "Michael Umaña ✓"]]
  },
  "2014_MEX_NED": {
    cards: [["Paul Aguilar 69' 🟨", "Rafael Márquez 90'+2' 🟨", "Andrés Guardado 90'+3' 🟨"], []],
    subs: [["Héctor Moreno 46' → Diego Reyes 46'", "Giovani dos Santos 61' → Javier Aquino 61'", "Oribe Peralta 75' → Javier Hernández 75'"], ["Nigel de Jong 9' → Bruno Martins Indi 9'", "Paul Verhaegh 56' → Memphis Depay 56'", "Robin van Persie 76' → Klaas-Jan Huntelaar 76'"]],
    pens: [[], []]
  },
  "2014_NED_ARG": {
    cards: [["Bruno Martins Indi 45' 🟨", "Klaas-Jan Huntelaar 105' 🟨"], ["Martín Demichelis 49' 🟨"]],
    subs: [["Bruno Martins Indi 46' → Daryl Janmaat 46'", "Nigel de Jong 62' → Jordy Clasie 62'", "Robin van Persie 96' → Klaas-Jan Huntelaar 96'"], ["Enzo Pérez 81' → Rodrigo Palacio 81'", "Gonzalo Higuaín 82' → Sergio Agüero 82'", "Ezequiel Lavezzi 101' → Maxi Rodríguez 101'"]],
    pens: [["Ron Vlaar ✗", "Arjen Robben ✓", "Wesley Sneijder ✗", "Dirk Kuyt ✓"], ["Lionel Messi ✓", "Ezequiel Garay ✓", "Sergio Agüero ✓", "Maxi Rodríguez ✓"]]
  },
  "2014_NED_CRC": {
    cards: [["Bruno Martins Indi 64' 🟨", "Klaas-Jan Huntelaar 111' 🟨"], ["Júnior Díaz 37' 🟨", "Michael Umaña 52' 🟨", "Giancarlo González 81' 🟨", "Jhonny Acosta 107' 🟨"]],
    subs: [["Memphis Depay 76' → Jeremain Lens 76'", "Bruno Martins Indi 106' → Klaas-Jan Huntelaar 106'", "Jasper Cillessen 120'+1' → Tim Krul 120'+1'"], ["Joel Campbell 66' → Marco Ureña 66'", "Cristian Gamboa 79' → David Myrie 79'", "Yeltsin Tejeda 97' → José Miguel Cubero 97'"]],
    pens: [["Robin van Persie ✓", "Arjen Robben ✓", "Wesley Sneijder ✓", "Dirk Kuyt ✓"], ["Celso Borges ✓", "Bryan Ruiz ✗", "Giancarlo González ✓", "Christian Bolaños ✓", "Michael Umaña ✗"]]
  },
  "2014_NED_MEX": {
    cards: [[], ["Paul Aguilar 69' 🟨", "Rafael Márquez 90'+2' 🟨", "Andrés Guardado 90'+3' 🟨"]],
    subs: [["Nigel de Jong 9' → Bruno Martins Indi 9'", "Paul Verhaegh 56' → Memphis Depay 56'", "Robin van Persie 76' → Klaas-Jan Huntelaar 76'"], ["Héctor Moreno 46' → Diego Reyes 46'", "Giovani dos Santos 61' → Javier Aquino 61'", "Oribe Peralta 75' → Javier Hernández 75'"]],
    pens: [[], []]
  },
  "2014_NGA_FRA": {
    cards: [[], ["Blaise Matuidi 54' 🟨"]],
    subs: [["Ogenyi Onazi 59' → Reuben Gabriel 59'", "Victor Moses 89' → Uche Nwofor 89'"], ["Olivier Giroud 62' → Antoine Griezmann 62'", "Mathieu Valbuena 90'+4' → Moussa Sissoko 90'+4'"]],
    pens: [[], []]
  },
  "2014_SUI_ARG": {
    cards: [["Granit Xhaka 36' 🟨", "Gélson Fernandes 73' 🟨"], ["Marcos Rojo 90' 🟨", "Ángel Di María 120' 🟨", "Ezequiel Garay 120'+4' 🟨"]],
    subs: [["Granit Xhaka 66' → Gélson Fernandes 66'", "Josip Drmić 82' → Haris Seferovic 82'", "Admir Mehmedi 113' → Blerim Džemaili 113'"], ["Ezequiel Lavezzi 74' → Rodrigo Palacio 74'", "Marcos Rojo 105'+1' → José María Basanta 105'+1'", "Fernando Gago 106' → Lucas Biglia 106'"]],
    pens: [[], []]
  },
  "2014_URU_COL": {
    cards: [["José Giménez 55' 🟨", "Diego Lugano 77' 🟨"], ["Pablo Armero 78' 🟨"]],
    subs: [["Álvaro Pereira 53' → Cristhian Stuani 53'", "Diego Forlán 53' → Gastón Ramírez 53'", "Álvaro González 67' → Abel Hernández 67'"], ["Teófilo Gutiérrez 68' → Alexander Mejía 68'", "Juan Cuadrado 81' → Fredy Guarín 81'", "James Rodríguez 85' → Adrián Ramos 85'"]],
    pens: [[], []]
  },
  "2014_USA_BEL": {
    cards: [["Geoff Cameron 18' 🟨"], ["Vincent Kompany 42' 🟨"]],
    subs: [["Fabian Johnson 32' → DeAndre Yedlin 32'", "Graham Zusi 72' → Chris Wondolowski 72'", "Alejandro Bedoya 105'+2' → Julian Green 105'+2'"], ["Dries Mertens 60' → Kevin Mirallas 60'", "Divock Origi 91' → Romelu Lukaku 91'", "Eden Hazard 111' → Nacer Chadli 111'"]],
    pens: [[], []]
  },
  "2018_ARG_FRA": {
    cards: [["Marcos Rojo 11' 🟨", "Nicolás Tagliafico 19' 🟨", "Javier Mascherano 43' 🟨", "Éver Banega 50' 🟨", "Nicolás Otamendi 90'+3' 🟨"], ["Blaise Matuidi 72' 🟨", "Benjamin Pavard 73' 🟨", "Olivier Giroud 90'+3' 🟨"]],
    subs: [["Marcos Rojo 46' → Federico Fazio 46'", "Enzo Pérez 66' → Sergio Agüero 66'", "Cristian Pavón 75' → Maximiliano Meza 75'"], ["Blaise Matuidi 75' → Corentin Tolisso 75'", "Antoine Griezmann 83' → Nabil Fekir 83'", "Kylian Mbappé 89' → Florian Thauvin 89'"]],
    pens: [[], []]
  },
  "2018_BEL_BRA": {
    cards: [["Toby Alderweireld 47' 🟨", "Thomas Meunier 71' 🟨"], ["Fernandinho 85' 🟨", "Fagner 90' 🟨"]],
    subs: [["Nacer Chadli 83' → Thomas Vermaelen 83'", "Romelu Lukaku 87' → Youri Tielemans 87'"], ["Willian 46' → Roberto Firmino 46'", "Gabriel Jesus 58' → Douglas Costa 58'", "Paulinho 73' → Renato Augusto 73'"]],
    pens: [[], []]
  },
  "2018_BEL_FRA": {
    cards: [["Eden Hazard 63' 🟨", "Toby Alderweireld 71' 🟨", "Jan Vertonghen 90'+4' 🟨"], ["N'Golo Kanté 87' 🟨", "Kylian Mbappé 90'+3' 🟨"]],
    subs: [["Mousa Dembélé 60' → Dries Mertens 60'", "Marouane Fellaini 80' → Yannick Carrasco 80'", "Nacer Chadli 90'+1' → Michy Batshuayi 90'+1'"], ["Olivier Giroud 85' → Steven Nzonzi 85'", "Blaise Matuidi 86' → Corentin Tolisso 86'"]],
    pens: [[], []]
  },
  "2018_BEL_JPN": {
    cards: [[], ["Gaku Shibasaki 40' 🟨"]],
    subs: [["Yannick Carrasco 65' → Marouane Fellaini 65'", "Dries Mertens 65' → Nacer Chadli 65'"], ["Gaku Shibasaki 81' → Hotaru Yamaguchi 81'", "Genki Haraguchi 81' → Keisuke Honda 81'"]],
    pens: [[], []]
  },
  "2018_BRA_BEL": {
    cards: [["Fernandinho 85' 🟨", "Fagner 90' 🟨"], ["Toby Alderweireld 47' 🟨", "Thomas Meunier 71' 🟨"]],
    subs: [["Willian 46' → Roberto Firmino 46'", "Gabriel Jesus 58' → Douglas Costa 58'", "Paulinho 73' → Renato Augusto 73'"], ["Nacer Chadli 83' → Thomas Vermaelen 83'", "Romelu Lukaku 87' → Youri Tielemans 87'"]],
    pens: [[], []]
  },
  "2018_BRA_MEX": {
    cards: [["Filipe Luís 43' 🟨", "Casemiro 59' 🟨"], ["Edson Álvarez 38' 🟨", "Héctor Herrera 55' 🟨", "Carlos Salcedo 77' 🟨", "Andrés Guardado 90'+2' 🟨"]],
    subs: [["Paulinho 80' → Fernandinho 80'", "Philippe Coutinho 86' → Roberto Firmino 86'", "Willian 90'+1' → Marquinhos 90'+1'"], ["Rafael Márquez 46' → Miguel Layún 46'", "Edson Álvarez 55' → Jonathan dos Santos 55'", "Javier Hernández 60' → Raúl Jiménez 60'"]],
    pens: [[], []]
  },
  "2018_COL_ENG": {
    cards: [["Wilmar Barrios 41' 🟨", "Santiago Arias 52' 🟨", "Carlos Sánchez 54' 🟨", "Radamel Falcao 63' 🟨", "Carlos Bacca 64' 🟨", "Juan Cuadrado 118' 🟨"], ["Jordan Henderson 56' 🟨", "Jesse Lingard 69' 🟨"]],
    subs: [["Jefferson Lerma 61' → Carlos Bacca 61'", "Carlos Sánchez 79' → Mateus Uribe 79'", "Juan Fernando Quintero 88' → Luis Muriel 88'", "Santiago Arias 116' → Cristián Zapata 116'"], ["Dele Alli 81' → Eric Dier 81'", "Raheem Sterling 88' → Jamie Vardy 88'", "Ashley Young 102' → Danny Rose 102'", "Kyle Walker 113' → Marcus Rashford 113'"]],
    pens: [["Radamel Falcao ✓", "Juan Cuadrado ✓", "Luis Muriel ✓", "Mateus Uribe ✗", "Carlos Bacca ✗"], ["Harry Kane ✓", "Marcus Rashford ✓", "Jordan Henderson ✗", "Kieran Trippier ✓", "Eric Dier ✓"]]
  },
  "2018_CRO_DEN": {
    cards: [[], ["Mathias Jørgensen 115' 🟨"]],
    subs: [["Marcelo Brozović 71' → Mateo Kovačić 71'", "Ivan Strinić 81' → Josip Pivarić 81'", "Ivan Perišić 97' → Andrej Kramarić 97'", "Mario Mandžukić 108' → Milan Badelj 108'"], ["Andreas Christensen 46' → Lasse Schöne 46'", "Andreas Cornelius 66' → Nicolai Jørgensen 66'", "Thomas Delaney 98' → Michael Krohn-Dehli 98'", "Martin Braithwaite 106' → Pione Sisto 106'"]],
    pens: [["Milan Badelj ✗", "Andrej Kramarić ✓", "Luka Modrić ✓", "Josip Pivarić ✗", "Ivan Rakitić ✓"], ["Christian Eriksen ✗", "Simon Kjær ✓", "Michael Krohn-Dehli ✓", "Lasse Schöne ✗", "Nicolai Jørgensen ✗"]]
  },
  "2018_CRO_ENG": {
    cards: [["Mario Mandžukić 48' 🟨", "Ante Rebić 96' 🟨"], ["Kyle Walker 54' 🟨"]],
    subs: [["Ivan Strinić 95' → Josip Pivarić 95'", "Ante Rebić 101' → Andrej Kramarić 101'", "Mario Mandžukić 115' → Vedran Ćorluka 115'", "Luka Modrić 119' → Milan Badelj 119'"], ["Raheem Sterling 74' → Marcus Rashford 74'", "Ashley Young 91' → Danny Rose 91'", "Jordan Henderson 97' → Eric Dier 97'", "Kyle Walker 112' → Jamie Vardy 112'"]],
    pens: [[], []]
  },
  "2018_CRO_FRA": {
    cards: [["Šime Vrsaljko 90'+2' 🟨"], ["N'Golo Kanté 27' 🟨", "Lucas Hernandez 41' 🟨"]],
    subs: [["Ante Rebić 71' → Andrej Kramarić 71'", "Ivan Strinić 81' → Marko Pjaca 81'"], ["N'Golo Kanté 55' → Steven Nzonzi 55'", "Blaise Matuidi 73' → Corentin Tolisso 73'", "Olivier Giroud 81' → Nabil Fekir 81'"]],
    pens: [[], []]
  },
  "2018_CRO_RUS": {
    cards: [["Dejan Lovren 35' 🟨", "Ivan Strinić 38' 🟨", "Domagoj Vida 101' 🟨", "Josip Pivarić 114' 🟨"], ["Yury Gazinsky 109' 🟨"]],
    subs: [["Ivan Perišić 63' → Marcelo Brozović 63'", "Ivan Strinić 74' → Josip Pivarić 74'", "Andrej Kramarić 88' → Mateo Kovačić 88'", "Šime Vrsaljko 97' → Vedran Ćorluka 97'"], ["Aleksandr Samedov 54' → Aleksandr Yerokhin 54'", "Denis Cheryshev 67' → Fyodor Smolov 67'", "Artem Dzyuba 79' → Yury Gazinsky 79'", "Aleksandr Golovin 102' → Alan Dzagoev 102'"]],
    pens: [["Marcelo Brozović ✓", "Mateo Kovačić ✗", "Luka Modrić ✓", "Domagoj Vida ✓", "Ivan Rakitić ✓"], ["Fyodor Smolov ✗", "Alan Dzagoev ✓", "Mário Fernandes ✗", "Sergei Ignashevich ✓", "Daler Kuzyayev ✓"]]
  },
  "2018_DEN_CRO": {
    cards: [["Mathias Jørgensen 115' 🟨"], []],
    subs: [["Andreas Christensen 46' → Lasse Schöne 46'", "Andreas Cornelius 66' → Nicolai Jørgensen 66'", "Thomas Delaney 98' → Michael Krohn-Dehli 98'", "Martin Braithwaite 106' → Pione Sisto 106'"], ["Marcelo Brozović 71' → Mateo Kovačić 71'", "Ivan Strinić 81' → Josip Pivarić 81'", "Ivan Perišić 97' → Andrej Kramarić 97'", "Mario Mandžukić 108' → Milan Badelj 108'"]],
    pens: [["Christian Eriksen ✗", "Simon Kjær ✓", "Michael Krohn-Dehli ✓", "Lasse Schöne ✗", "Nicolai Jørgensen ✗"], ["Milan Badelj ✗", "Andrej Kramarić ✓", "Luka Modrić ✓", "Josip Pivarić ✗", "Ivan Rakitić ✓"]]
  },
  "2018_ENG_COL": {
    cards: [["Jordan Henderson 56' 🟨", "Jesse Lingard 69' 🟨"], ["Wilmar Barrios 41' 🟨", "Santiago Arias 52' 🟨", "Carlos Sánchez 54' 🟨", "Radamel Falcao 63' 🟨", "Carlos Bacca 64' 🟨", "Juan Cuadrado 118' 🟨"]],
    subs: [["Dele Alli 81' → Eric Dier 81'", "Raheem Sterling 88' → Jamie Vardy 88'", "Ashley Young 102' → Danny Rose 102'", "Kyle Walker 113' → Marcus Rashford 113'"], ["Jefferson Lerma 61' → Carlos Bacca 61'", "Carlos Sánchez 79' → Mateus Uribe 79'", "Juan Fernando Quintero 88' → Luis Muriel 88'", "Santiago Arias 116' → Cristián Zapata 116'"]],
    pens: [["Harry Kane ✓", "Marcus Rashford ✓", "Jordan Henderson ✗", "Kieran Trippier ✓", "Eric Dier ✓"], ["Radamel Falcao ✓", "Juan Cuadrado ✓", "Luis Muriel ✓", "Mateus Uribe ✗", "Carlos Bacca ✗"]]
  },
  "2018_ENG_CRO": {
    cards: [["Kyle Walker 54' 🟨"], ["Mario Mandžukić 48' 🟨", "Ante Rebić 96' 🟨"]],
    subs: [["Raheem Sterling 74' → Marcus Rashford 74'", "Ashley Young 91' → Danny Rose 91'", "Jordan Henderson 97' → Eric Dier 97'", "Kyle Walker 112' → Jamie Vardy 112'"], ["Ivan Strinić 95' → Josip Pivarić 95'", "Ante Rebić 101' → Andrej Kramarić 101'", "Mario Mandžukić 115' → Vedran Ćorluka 115'", "Luka Modrić 119' → Milan Badelj 119'"]],
    pens: [[], []]
  },
  "2018_ENG_SWE": {
    cards: [["Harry Maguire 87' 🟨"], ["John Guidetti 87' 🟨", "Sebastian Larsson 90'+4' 🟨"]],
    subs: [["Dele Alli 77' → Fabian Delph 77'", "Jordan Henderson 85' → Eric Dier 85'", "Raheem Sterling 90'+1' → Marcus Rashford 90'+1'"], ["Emil Forsberg 65' → John Guidetti 65'", "Ola Toivonen 65' → Martin Olsson 65'", "Emil Krafth 85' → Pontus Jansson 85'"]],
    pens: [[], []]
  },
  "2018_ESP_RUS": {
    cards: [["Gerard Piqué 40' 🟨"], ["Ilya Kutepov 54' 🟨", "Roman Zobnin 71' 🟨"]],
    subs: [["David Silva 67' → Andrés Iniesta 67'", "Nacho 70' → Dani Carvajal 70'", "Diego Costa 80' → Iago Aspas 80'", "Marco Asensio 104' → Rodrigo 104'"], ["Yuri Zhirkov 46' → Vladimir Granat 46'", "Aleksandr Samedov 61' → Denis Cheryshev 61'", "Artem Dzyuba 65' → Fyodor Smolov 65'", "Daler Kuzyayev 97' → Aleksandr Yerokhin 97'"]],
    pens: [["Andrés Iniesta ✓", "Gerard Piqué ✓", "Koke ✗", "Sergio Ramos ✓", "Iago Aspas ✗"], ["Fyodor Smolov ✓", "Sergei Ignashevich ✓", "Aleksandr Golovin ✓", "Denis Cheryshev ✓"]]
  },
  "2018_FRA_ARG": {
    cards: [["Blaise Matuidi 72' 🟨", "Benjamin Pavard 73' 🟨", "Olivier Giroud 90'+3' 🟨"], ["Marcos Rojo 11' 🟨", "Nicolás Tagliafico 19' 🟨", "Javier Mascherano 43' 🟨", "Éver Banega 50' 🟨", "Nicolás Otamendi 90'+3' 🟨"]],
    subs: [["Blaise Matuidi 75' → Corentin Tolisso 75'", "Antoine Griezmann 83' → Nabil Fekir 83'", "Kylian Mbappé 89' → Florian Thauvin 89'"], ["Marcos Rojo 46' → Federico Fazio 46'", "Enzo Pérez 66' → Sergio Agüero 66'", "Cristian Pavón 75' → Maximiliano Meza 75'"]],
    pens: [[], []]
  },
  "2018_FRA_BEL": {
    cards: [["N'Golo Kanté 87' 🟨", "Kylian Mbappé 90'+3' 🟨"], ["Eden Hazard 63' 🟨", "Toby Alderweireld 71' 🟨", "Jan Vertonghen 90'+4' 🟨"]],
    subs: [["Olivier Giroud 85' → Steven Nzonzi 85'", "Blaise Matuidi 86' → Corentin Tolisso 86'"], ["Mousa Dembélé 60' → Dries Mertens 60'", "Marouane Fellaini 80' → Yannick Carrasco 80'", "Nacer Chadli 90'+1' → Michy Batshuayi 90'+1'"]],
    pens: [[], []]
  },
  "2018_FRA_CRO": {
    cards: [["N'Golo Kanté 27' 🟨", "Lucas Hernandez 41' 🟨"], ["Šime Vrsaljko 90'+2' 🟨"]],
    subs: [["N'Golo Kanté 55' → Steven Nzonzi 55'", "Blaise Matuidi 73' → Corentin Tolisso 73'", "Olivier Giroud 81' → Nabil Fekir 81'"], ["Ante Rebić 71' → Andrej Kramarić 71'", "Ivan Strinić 81' → Marko Pjaca 81'"]],
    pens: [[], []]
  },
  "2018_FRA_URU": {
    cards: [["Lucas Hernandez 33' 🟨", "Kylian Mbappé 69' 🟨"], ["Rodrigo Bentancur 38' 🟨", "Cristian Rodríguez 69' 🟨"]],
    subs: [["Corentin Tolisso 80' → Steven Nzonzi 80'", "Kylian Mbappé 88' → Ousmane Dembélé 88'", "Antoine Griezmann 90'+3' → Nabil Fekir 90'+3'"], ["Rodrigo Bentancur 59' → Maxi Gómez 59'", "Cristhian Stuani 59' → Cristian Rodríguez 59'", "Nahitan Nández 73' → Jonathan Urretaviscaya 73'"]],
    pens: [[], []]
  },
  "2018_JPN_BEL": {
    cards: [["Gaku Shibasaki 40' 🟨"], []],
    subs: [["Gaku Shibasaki 81' → Hotaru Yamaguchi 81'", "Genki Haraguchi 81' → Keisuke Honda 81'"], ["Yannick Carrasco 65' → Marouane Fellaini 65'", "Dries Mertens 65' → Nacer Chadli 65'"]],
    pens: [[], []]
  },
  "2018_MEX_BRA": {
    cards: [["Edson Álvarez 38' 🟨", "Héctor Herrera 55' 🟨", "Carlos Salcedo 77' 🟨", "Andrés Guardado 90'+2' 🟨"], ["Filipe Luís 43' 🟨", "Casemiro 59' 🟨"]],
    subs: [["Rafael Márquez 46' → Miguel Layún 46'", "Edson Álvarez 55' → Jonathan dos Santos 55'", "Javier Hernández 60' → Raúl Jiménez 60'"], ["Paulinho 80' → Fernandinho 80'", "Philippe Coutinho 86' → Roberto Firmino 86'", "Willian 90'+1' → Marquinhos 90'+1'"]],
    pens: [[], []]
  },
  "2018_POR_URU": {
    cards: [["Cristiano Ronaldo 90'+3' 🟨"], []],
    subs: [["Adrien Silva 65' → Ricardo Quaresma 65'", "Gonçalo Guedes 74' → André Silva 74'", "João Mário 84' → Manuel Fernandes 84'"], ["Rodrigo Bentancur 63' → Cristian Rodríguez 63'", "Edinson Cavani 74' → Cristhian Stuani 74'", "Nahitan Nández 81' → Carlos Sánchez 81'"]],
    pens: [[], []]
  },
  "2018_RUS_CRO": {
    cards: [["Yury Gazinsky 109' 🟨"], ["Dejan Lovren 35' 🟨", "Ivan Strinić 38' 🟨", "Domagoj Vida 101' 🟨", "Josip Pivarić 114' 🟨"]],
    subs: [["Aleksandr Samedov 54' → Aleksandr Yerokhin 54'", "Denis Cheryshev 67' → Fyodor Smolov 67'", "Artem Dzyuba 79' → Yury Gazinsky 79'", "Aleksandr Golovin 102' → Alan Dzagoev 102'"], ["Ivan Perišić 63' → Marcelo Brozović 63'", "Ivan Strinić 74' → Josip Pivarić 74'", "Andrej Kramarić 88' → Mateo Kovačić 88'", "Šime Vrsaljko 97' → Vedran Ćorluka 97'"]],
    pens: [["Fyodor Smolov ✗", "Alan Dzagoev ✓", "Mário Fernandes ✗", "Sergei Ignashevich ✓", "Daler Kuzyayev ✓"], ["Marcelo Brozović ✓", "Mateo Kovačić ✗", "Luka Modrić ✓", "Domagoj Vida ✓", "Ivan Rakitić ✓"]]
  },
  "2018_RUS_ESP": {
    cards: [["Ilya Kutepov 54' 🟨", "Roman Zobnin 71' 🟨"], ["Gerard Piqué 40' 🟨"]],
    subs: [["Yuri Zhirkov 46' → Vladimir Granat 46'", "Aleksandr Samedov 61' → Denis Cheryshev 61'", "Artem Dzyuba 65' → Fyodor Smolov 65'", "Daler Kuzyayev 97' → Aleksandr Yerokhin 97'"], ["David Silva 67' → Andrés Iniesta 67'", "Nacho 70' → Dani Carvajal 70'", "Diego Costa 80' → Iago Aspas 80'", "Marco Asensio 104' → Rodrigo 104'"]],
    pens: [["Fyodor Smolov ✓", "Sergei Ignashevich ✓", "Aleksandr Golovin ✓", "Denis Cheryshev ✓"], ["Andrés Iniesta ✓", "Gerard Piqué ✓", "Koke ✗", "Sergio Ramos ✓", "Iago Aspas ✗"]]
  },
  "2018_SUI_SWE": {
    cards: [["Valon Behrami 61' 🟨", "Granit Xhaka 68' 🟨", "Michael Lang 90'+4' 🟥"], ["Mikael Lustig 31' 🟨"]],
    subs: [["Blerim Džemaili 73' → Breel Embolo 73'", "Steven Zuber 73' → Haris Seferovic 73'"], ["Mikael Lustig 82' → Martin Olsson 82'", "Emil Forsberg 82' → Emil Krafth 82'", "Marcus Berg 90'+1' → Isaac Kiese Thelin 90'+1'"]],
    pens: [[], []]
  },
  "2018_SWE_ENG": {
    cards: [["John Guidetti 87' 🟨", "Sebastian Larsson 90'+4' 🟨"], ["Harry Maguire 87' 🟨"]],
    subs: [["Emil Forsberg 65' → John Guidetti 65'", "Ola Toivonen 65' → Martin Olsson 65'", "Emil Krafth 85' → Pontus Jansson 85'"], ["Dele Alli 77' → Fabian Delph 77'", "Jordan Henderson 85' → Eric Dier 85'", "Raheem Sterling 90'+1' → Marcus Rashford 90'+1'"]],
    pens: [[], []]
  },
  "2018_SWE_SUI": {
    cards: [["Mikael Lustig 31' 🟨"], ["Valon Behrami 61' 🟨", "Granit Xhaka 68' 🟨", "Michael Lang 90'+4' 🟥"]],
    subs: [["Mikael Lustig 82' → Martin Olsson 82'", "Emil Forsberg 82' → Emil Krafth 82'", "Marcus Berg 90'+1' → Isaac Kiese Thelin 90'+1'"], ["Blerim Džemaili 73' → Breel Embolo 73'", "Steven Zuber 73' → Haris Seferovic 73'"]],
    pens: [[], []]
  },
  "2018_URU_FRA": {
    cards: [["Rodrigo Bentancur 38' 🟨", "Cristian Rodríguez 69' 🟨"], ["Lucas Hernandez 33' 🟨", "Kylian Mbappé 69' 🟨"]],
    subs: [["Rodrigo Bentancur 59' → Maxi Gómez 59'", "Cristhian Stuani 59' → Cristian Rodríguez 59'", "Nahitan Nández 73' → Jonathan Urretaviscaya 73'"], ["Corentin Tolisso 80' → Steven Nzonzi 80'", "Kylian Mbappé 88' → Ousmane Dembélé 88'", "Antoine Griezmann 90'+3' → Nabil Fekir 90'+3'"]],
    pens: [[], []]
  },
  "2018_URU_POR": {
    cards: [[], ["Cristiano Ronaldo 90'+3' 🟨"]],
    subs: [["Rodrigo Bentancur 63' → Cristian Rodríguez 63'", "Edinson Cavani 74' → Cristhian Stuani 74'", "Nahitan Nández 81' → Carlos Sánchez 81'"], ["Adrien Silva 65' → Ricardo Quaresma 65'", "Gonçalo Guedes 74' → André Silva 74'", "João Mário 84' → Manuel Fernandes 84'"]],
    pens: [[], []]
  },
  "2022_ARG_AUS": {
    cards: [[], ["Jackson Irvine 15' 🟨", "Miloš Degenek 38' 🟨"]],
    subs: [["Papu Gómez 50' → Lisandro Martínez 50'", "Marcos Acuña 71' → Lautaro Martínez 71'", "Julián Álvarez 71' → Nicolás Tagliafico 71'", "Nahuel Molina 80' → Exequiel Palacios 80'", "Alexis Mac Allister 80' → Gonzalo Montiel 80'"], ["Keanu Baccus 58' → Ajdin Hrustic 58'", "Riley McGree 58' → Craig Goodwin 58'", "Miloš Degenek 71' → Garang Kuol 71'", "Mathew Leckie 71' → Jamie Maclaren 71'", "Mitchell Duke 71' → Fran Karačić 71'"]],
    pens: [[], []]
  },
  "2022_ARG_CRO": {
    cards: [["Cristian Romero 68' 🟨", "Nicolás Otamendi 71' 🟨"], ["Dominik Livaković 32' 🟨", "Mateo Kovačić 32' 🟨"]],
    subs: [["Leandro Paredes 62' → Lisandro Martínez 62'", "Rodrigo De Paul 74' → Exequiel Palacios 74'", "Julián Álvarez 74' → Paulo Dybala 74'", "Nahuel Molina 86' → Ángel Correa 86'", "Alexis Mac Allister 86' → Juan Foyth 86'"], ["Borna Sosa 46' → Mislav Oršić 46'", "Mario Pašalić 46' → Nikola Vlašić 46'", "Marcelo Brozović 50' → Bruno Petković 50'", "Andrej Kramarić 72' → Marko Livaja 72'", "Luka Modrić 81' → Lovro Majer 81'"]],
    pens: [[], []]
  },
  "2022_ARG_FRA": {
    cards: [["Enzo Fernández 45'+7' 🟨", "Marcos Acuña 90'+8' 🟨", "Leandro Paredes 114' 🟨", "Gonzalo Montiel 116' 🟨", "Emiliano Martínez 120'+5' 🟨"], ["Adrien Rabiot 55' 🟨", "Marcus Thuram 87' 🟨", "Olivier Giroud 90'+5' 🟨"]],
    subs: [["Ángel Di María 64' → Marcos Acuña 64'", "Nahuel Molina 91' → Gonzalo Montiel 91'", "Rodrigo De Paul 102' → Leandro Paredes 102'", "Julián Álvarez 102' → Lautaro Martínez 102'", "Alexis Mac Allister 116' → Germán Pezzella 116'", "Nicolás Tagliafico 120'+1' → Paulo Dybala 120'+1'"], ["Ousmane Dembélé 41' → Randal Kolo Muani 41'", "Olivier Giroud 41' → Marcus Thuram 41'", "Théo Hernandez 71' → Kingsley Coman 71'", "Antoine Griezmann 71' → Eduardo Camavinga 71'", "Adrien Rabiot 96' → Youssouf Fofana 96'", "Raphaël Varane 113' → Ibrahima Konaté 113'", "Jules Koundé 120'+1' → Axel Disasi 120'+1'"]],
    pens: [["Lionel Messi ✓", "Paulo Dybala ✓", "Leandro Paredes ✓", "Gonzalo Montiel ✓"], ["Kylian Mbappé ✓", "Kingsley Coman ✗", "Aurélien Tchouaméni ✗", "Randal Kolo Muani ✓"]]
  },
  "2022_ARG_NED": {
    cards: [["Marcos Acuña 43' 🟨", "Cristian Romero 45' 🟨", "Lisandro Martínez 76' 🟨", "Leandro Paredes 89' 🟨", "Lionel Messi 90'+10' 🟨", "Nicolás Otamendi 90'+12' 🟨", "Gonzalo Montiel 109' 🟨", "Germán Pezzella 112' 🟨"], ["Jurriën Timber 43' 🟨", "Wout Weghorst 45'+2' 🟨", "Memphis Depay 76' 🟨", "Steven Berghuis 88' 🟨", "Steven Bergwijn 91' 🟨", "Denzel Dumfries 120'+8' 🟨", "Noa Lang 120'+9' 🟨"]],
    subs: [["Rodrigo De Paul 67' → Leandro Paredes 67'", "Cristian Romero 78' → Nicolás Tagliafico 78'", "Marcos Acuña 78' → Germán Pezzella 78'", "Julián Álvarez 82' → Lautaro Martínez 82'", "Nahuel Molina 106' → Gonzalo Montiel 106'", "Lisandro Martínez 112' → Ángel Di María 112'"], ["Marten de Roon 46' → Steven Berghuis 46'", "Steven Bergwijn 46' → Teun Koopmeiners 46'", "Daley Blind 64' → Luuk de Jong 64'", "Memphis Depay 78' → Wout Weghorst 78'", "Cody Gakpo 113' → Noa Lang 113'"]],
    pens: [["Lionel Messi ✓", "Leandro Paredes ✓", "Gonzalo Montiel ✓", "Enzo Fernández ✗", "Lautaro Martínez ✓"], ["Virgil van Dijk ✗", "Steven Berghuis ✗", "Teun Koopmeiners ✓", "Wout Weghorst ✓", "Luuk de Jong ✓"]]
  },
  "2022_AUS_ARG": {
    cards: [["Jackson Irvine 15' 🟨", "Miloš Degenek 38' 🟨"], []],
    subs: [["Keanu Baccus 58' → Ajdin Hrustic 58'", "Riley McGree 58' → Craig Goodwin 58'", "Miloš Degenek 71' → Garang Kuol 71'", "Mathew Leckie 71' → Jamie Maclaren 71'", "Mitchell Duke 71' → Fran Karačić 71'"], ["Papu Gómez 50' → Lisandro Martínez 50'", "Marcos Acuña 71' → Lautaro Martínez 71'", "Julián Álvarez 71' → Nicolás Tagliafico 71'", "Nahuel Molina 80' → Exequiel Palacios 80'", "Alexis Mac Allister 80' → Gonzalo Montiel 80'"]],
    pens: [[], []]
  },
  "2022_BRA_CRO": {
    cards: [["Danilo 25' 🟨", "Casemiro 68' 🟨", "Marquinhos 77' 🟨"], ["Marcelo Brozović 31' 🟨", "Bruno Petković 117' 🟨"]],
    subs: [["Raphinha 56' → Antony 56'", "Vinícius Júnior 64' → Rodrygo 64'", "Richarlison 84' → Pedro 84'", "Éder Militão 106' → Alex Sandro 106'", "Lucas Paquetá 106' → Fred 106'"], ["Mario Pašalić 72' → Bruno Petković 72'", "Andrej Kramarić 72' → Nikola Vlašić 72'", "Mateo Kovačić 106' → Lovro Majer 106'", "Borna Sosa 110' → Ante Budimir 110'", "Marcelo Brozović 114' → Mislav Oršić 114'"]],
    pens: [["Rodrygo ✗", "Casemiro ✓", "Pedro ✓", "Marquinhos ✗"], ["Nikola Vlašić ✓", "Lovro Majer ✓", "Luka Modrić ✓", "Mislav Oršić ✓"]]
  },
  "2022_BRA_KOR": {
    cards: [[], ["Woo-young Jung 44' 🟨"]],
    subs: [["Éder Militão 63' → Dani Alves 63'", "Danilo 72' → Gabriel Martinelli 72'", "Vinícius Júnior 72' → Bremer 72'", "Alisson 80' → Weverton 80'", "Neymar 80' → Rodrygo 80'"], ["Kim Jin-su 46' → Chul Hong 46'", "Woo-young Jung 46' → Son Jun-ho 46'", "Hwang In-beom 65' → Paik Seung-ho 65'", "Jae-sung Lee 74' → Lee Kang-in 74'", "Cho Gue-sung 80' → Hwang Ui-jo 80'"]],
    pens: [[], []]
  },
  "2022_CRO_ARG": {
    cards: [["Dominik Livaković 32' 🟨", "Mateo Kovačić 32' 🟨"], ["Cristian Romero 68' 🟨", "Nicolás Otamendi 71' 🟨"]],
    subs: [["Borna Sosa 46' → Mislav Oršić 46'", "Mario Pašalić 46' → Nikola Vlašić 46'", "Marcelo Brozović 50' → Bruno Petković 50'", "Andrej Kramarić 72' → Marko Livaja 72'", "Luka Modrić 81' → Lovro Majer 81'"], ["Leandro Paredes 62' → Lisandro Martínez 62'", "Rodrigo De Paul 74' → Exequiel Palacios 74'", "Julián Álvarez 74' → Paulo Dybala 74'", "Nahuel Molina 86' → Ángel Correa 86'", "Alexis Mac Allister 86' → Juan Foyth 86'"]],
    pens: [[], []]
  },
  "2022_CRO_BRA": {
    cards: [["Marcelo Brozović 31' 🟨", "Bruno Petković 117' 🟨"], ["Danilo 25' 🟨", "Casemiro 68' 🟨", "Marquinhos 77' 🟨"]],
    subs: [["Mario Pašalić 72' → Bruno Petković 72'", "Andrej Kramarić 72' → Nikola Vlašić 72'", "Mateo Kovačić 106' → Lovro Majer 106'", "Borna Sosa 110' → Ante Budimir 110'", "Marcelo Brozović 114' → Mislav Oršić 114'"], ["Raphinha 56' → Antony 56'", "Vinícius Júnior 64' → Rodrygo 64'", "Richarlison 84' → Pedro 84'", "Éder Militão 106' → Alex Sandro 106'", "Lucas Paquetá 106' → Fred 106'"]],
    pens: [["Nikola Vlašić ✓", "Lovro Majer ✓", "Luka Modrić ✓", "Mislav Oršić ✓"], ["Rodrygo ✗", "Casemiro ✓", "Pedro ✓", "Marquinhos ✗"]]
  },
  "2022_CRO_JPN": {
    cards: [["Mateo Kovačić 90' 🟨", "Borna Barišić 116' 🟨"], []],
    subs: [["Bruno Petković 62' → Ante Budimir 62'", "Andrej Kramarić 68' → Mario Pašalić 68'", "Luka Modrić 99' → Nikola Vlašić 99'", "Mateo Kovačić 99' → Lovro Majer 99'", "Ivan Perišić 106' → Marko Livaja 106'", "Ante Budimir 106' → Mislav Oršić 106'"], ["Yuto Nagatomo 64' → Kaoru Mitoma 64'", "Daizen Maeda 64' → Takuma Asano 64'", "Daichi Kamada 75' → Hiroki Sakai 75'", "Ritsu Dōan 87' → Takumi Minamino 87'", "Hidemasa Morita 106' → Ao Tanaka 106'"]],
    pens: [["Nikola Vlašić ✓", "Marcelo Brozović ✓", "Marko Livaja ✗", "Mario Pašalić ✓"], ["Takumi Minamino ✗", "Kaoru Mitoma ✗", "Takuma Asano ✓", "Maya Yoshida ✗"]]
  },
  "2022_ENG_FRA": {
    cards: [["Harry Maguire 90' 🟨"], ["Antoine Griezmann 43' 🟨", "Ousmane Dembélé 46' 🟨", "Théo Hernandez 82' 🟨"]],
    subs: [["Jordan Henderson 79' → Mason Mount 79'", "Bukayo Saka 79' → Raheem Sterling 79'", "Phil Foden 85' → Marcus Rashford 85'", "John Stones 90'+8' → Jack Grealish 90'+8'"], ["Ousmane Dembélé 79' → Kingsley Coman 79'"]],
    pens: [[], []]
  },
  "2022_ENG_SEN": {
    cards: [[], ["Kalidou Koulibaly 76' 🟨"]],
    subs: [["Bukayo Saka 65' → Marcus Rashford 65'", "Phil Foden 65' → Jack Grealish 65'", "John Stones 76' → Mason Mount 76'", "Jude Bellingham 76' → Eric Dier 76'", "Jordan Henderson 82' → Kalvin Phillips 82'"], ["Pathé Ciss 46' → Pape Matar Sarr 46'", "Krépin Diatta 46' → Bamba Dieng 46'", "Iliman Ndiaye 46' → Pape Gueye 46'", "Boulaye Dia 72' → Famara Diédhiou 72'", "Ismail Jakobs 84' → Fodé Ballo-Touré 84'"]],
    pens: [[], []]
  },
  "2022_ESP_MAR": {
    cards: [["Aymeric Laporte 77' 🟨"], ["Romain Saïss 90' 🟨"]],
    subs: [["Gavi 63' → Álvaro Morata 63'", "Marco Asensio 63' → Carlos Soler 63'", "Ferran Torres 75' → Nico Williams 75'", "Jordi Alba 98' → Alejandro Balde 98'", "Dani Olmo 98' → Ansu Fati 98'", "Nico Williams 118' → Pablo Sarabia 118'"], ["Sofiane Boufal 66' → Abde Ezzalzouli 66'", "Noussair Mazraoui 82' → Abdelhamid Sabiri 82'", "Selim Amallah 82' → Walid Cheddira 82'", "Youssef En-Nesyri 82' → Yahia Attiyat Allah 82'", "Nayef Aguerd 84' → Jawad El Yamiq 84'", "Azzedine Ounahi 120' → Badr Benoun 120'"]],
    pens: [["Pablo Sarabia ✗", "Carlos Soler ✗", "Sergio Busquets ✗"], ["Abdelhamid Sabiri ✓", "Hakim Ziyech ✓", "Badr Benoun ✗", "Achraf Hakimi ✓"]]
  },
  "2022_FRA_ARG": {
    cards: [["Adrien Rabiot 55' 🟨", "Marcus Thuram 87' 🟨", "Olivier Giroud 90'+5' 🟨"], ["Enzo Fernández 45'+7' 🟨", "Marcos Acuña 90'+8' 🟨", "Leandro Paredes 114' 🟨", "Gonzalo Montiel 116' 🟨", "Emiliano Martínez 120'+5' 🟨"]],
    subs: [["Ousmane Dembélé 41' → Randal Kolo Muani 41'", "Olivier Giroud 41' → Marcus Thuram 41'", "Théo Hernandez 71' → Kingsley Coman 71'", "Antoine Griezmann 71' → Eduardo Camavinga 71'", "Adrien Rabiot 96' → Youssouf Fofana 96'", "Raphaël Varane 113' → Ibrahima Konaté 113'", "Jules Koundé 120'+1' → Axel Disasi 120'+1'"], ["Ángel Di María 64' → Marcos Acuña 64'", "Nahuel Molina 91' → Gonzalo Montiel 91'", "Rodrigo De Paul 102' → Leandro Paredes 102'", "Julián Álvarez 102' → Lautaro Martínez 102'", "Alexis Mac Allister 116' → Germán Pezzella 116'", "Nicolás Tagliafico 120'+1' → Paulo Dybala 120'+1'"]],
    pens: [["Kylian Mbappé ✓", "Kingsley Coman ✗", "Aurélien Tchouaméni ✗", "Randal Kolo Muani ✓"], ["Lionel Messi ✓", "Paulo Dybala ✓", "Leandro Paredes ✓", "Gonzalo Montiel ✓"]]
  },
  "2022_FRA_ENG": {
    cards: [["Antoine Griezmann 43' 🟨", "Ousmane Dembélé 46' 🟨", "Théo Hernandez 82' 🟨"], ["Harry Maguire 90' 🟨"]],
    subs: [["Ousmane Dembélé 79' → Kingsley Coman 79'"], ["Jordan Henderson 79' → Mason Mount 79'", "Bukayo Saka 79' → Raheem Sterling 79'", "Phil Foden 85' → Marcus Rashford 85'", "John Stones 90'+8' → Jack Grealish 90'+8'"]],
    pens: [[], []]
  },
  "2022_FRA_MAR": {
    cards: [[], ["Sofiane Boufal 27' 🟨"]],
    subs: [["Olivier Giroud 65' → Marcus Thuram 65'", "Ousmane Dembélé 78' → Randal Kolo Muani 78'"], ["Romain Saïss 21' → Selim Amallah 21'", "Noussair Mazraoui 46' → Yahia Attiyat Allah 46'", "Sofiane Boufal 66' → Abderrazak Hamdallah 66'", "Youssef En-Nesyri 66' → Zakaria Aboukhlal 66'", "Selim Amallah 78' → Abde Ezzalzouli 78'"]],
    pens: [[], []]
  },
  "2022_FRA_POL": {
    cards: [["Aurélien Tchouaméni 32' 🟨"], ["Bartosz Bereszyński 47' 🟨", "Matty Cash 88' 🟨"]],
    subs: [["Aurélien Tchouaméni 66' → Youssouf Fofana 66'", "Ousmane Dembélé 76' → Kingsley Coman 76'", "Olivier Giroud 76' → Marcus Thuram 76'", "Jules Koundé 90'+2' → Axel Disasi 90'+2'"], ["Sebastian Szymański 64' → Arkadiusz Milik 64'", "Grzegorz Krychowiak 71' → Nicola Zalewski 71'", "Jakub Kamiński 71' → Krystian Bielik 71'", "Jakub Kiwior 87' → Jan Bednarek 87'", "Przemysław Frankowski 87' → Kamil Grosicki 87'"]],
    pens: [[], []]
  },
  "2022_JPN_CRO": {
    cards: [[], ["Mateo Kovačić 90' 🟨", "Borna Barišić 116' 🟨"]],
    subs: [["Yuto Nagatomo 64' → Kaoru Mitoma 64'", "Daizen Maeda 64' → Takuma Asano 64'", "Daichi Kamada 75' → Hiroki Sakai 75'", "Ritsu Dōan 87' → Takumi Minamino 87'", "Hidemasa Morita 106' → Ao Tanaka 106'"], ["Bruno Petković 62' → Ante Budimir 62'", "Andrej Kramarić 68' → Mario Pašalić 68'", "Luka Modrić 99' → Nikola Vlašić 99'", "Mateo Kovačić 99' → Lovro Majer 99'", "Ivan Perišić 106' → Marko Livaja 106'", "Ante Budimir 106' → Mislav Oršić 106'"]],
    pens: [["Takumi Minamino ✗", "Kaoru Mitoma ✗", "Takuma Asano ✓", "Maya Yoshida ✗"], ["Nikola Vlašić ✓", "Marcelo Brozović ✓", "Marko Livaja ✗", "Mario Pašalić ✓"]]
  },
  "2022_KOR_BRA": {
    cards: [["Woo-young Jung 44' 🟨"], []],
    subs: [["Kim Jin-su 46' → Chul Hong 46'", "Woo-young Jung 46' → Son Jun-ho 46'", "Hwang In-beom 65' → Paik Seung-ho 65'", "Jae-sung Lee 74' → Lee Kang-in 74'", "Cho Gue-sung 80' → Hwang Ui-jo 80'"], ["Éder Militão 63' → Dani Alves 63'", "Danilo 72' → Gabriel Martinelli 72'", "Vinícius Júnior 72' → Bremer 72'", "Alisson 80' → Weverton 80'", "Neymar 80' → Rodrygo 80'"]],
    pens: [[], []]
  },
  "2022_MAR_ESP": {
    cards: [["Romain Saïss 90' 🟨"], ["Aymeric Laporte 77' 🟨"]],
    subs: [["Sofiane Boufal 66' → Abde Ezzalzouli 66'", "Noussair Mazraoui 82' → Abdelhamid Sabiri 82'", "Selim Amallah 82' → Walid Cheddira 82'", "Youssef En-Nesyri 82' → Yahia Attiyat Allah 82'", "Nayef Aguerd 84' → Jawad El Yamiq 84'", "Azzedine Ounahi 120' → Badr Benoun 120'"], ["Gavi 63' → Álvaro Morata 63'", "Marco Asensio 63' → Carlos Soler 63'", "Ferran Torres 75' → Nico Williams 75'", "Jordi Alba 98' → Alejandro Balde 98'", "Dani Olmo 98' → Ansu Fati 98'", "Nico Williams 118' → Pablo Sarabia 118'"]],
    pens: [["Abdelhamid Sabiri ✓", "Hakim Ziyech ✓", "Badr Benoun ✗", "Achraf Hakimi ✓"], ["Pablo Sarabia ✗", "Carlos Soler ✗", "Sergio Busquets ✗"]]
  },
  "2022_MAR_FRA": {
    cards: [["Sofiane Boufal 27' 🟨"], []],
    subs: [["Romain Saïss 21' → Selim Amallah 21'", "Noussair Mazraoui 46' → Yahia Attiyat Allah 46'", "Sofiane Boufal 66' → Abderrazak Hamdallah 66'", "Youssef En-Nesyri 66' → Zakaria Aboukhlal 66'", "Selim Amallah 78' → Abde Ezzalzouli 78'"], ["Olivier Giroud 65' → Marcus Thuram 65'", "Ousmane Dembélé 78' → Randal Kolo Muani 78'"]],
    pens: [[], []]
  },
  "2022_MAR_POR": {
    cards: [["Achraf Dari 70' 🟨", "Walid Cheddira 90'+1' 🟨"], ["Vitinha 87' 🟨"]],
    subs: [["Romain Saïss 57' → Achraf Dari 57'", "Selim Amallah 65' → Walid Cheddira 65'", "Youssef En-Nesyri 65' → Badr Benoun 65'", "Hakim Ziyech 82' → Zakaria Aboukhlal 82'", "Sofiane Boufal 82' → Yahya Jabrane 82'"], ["Raphaël Guerreiro 51' → João Cancelo 51'", "Rúben Neves 51' → Cristiano Ronaldo 51'", "Otávio 69' → Rafael Leão 69'", "Gonçalo Ramos 69' → Vitinha 69'", "Diogo Dalot 79' → Ricardo Horta 79'"]],
    pens: [[], []]
  },
  "2022_NED_ARG": {
    cards: [["Jurriën Timber 43' 🟨", "Wout Weghorst 45'+2' 🟨", "Memphis Depay 76' 🟨", "Steven Berghuis 88' 🟨", "Steven Bergwijn 91' 🟨", "Denzel Dumfries 120'+8' 🟨", "Noa Lang 120'+9' 🟨"], ["Marcos Acuña 43' 🟨", "Cristian Romero 45' 🟨", "Lisandro Martínez 76' 🟨", "Leandro Paredes 89' 🟨", "Lionel Messi 90'+10' 🟨", "Nicolás Otamendi 90'+12' 🟨", "Gonzalo Montiel 109' 🟨", "Germán Pezzella 112' 🟨"]],
    subs: [["Marten de Roon 46' → Steven Berghuis 46'", "Steven Bergwijn 46' → Teun Koopmeiners 46'", "Daley Blind 64' → Luuk de Jong 64'", "Memphis Depay 78' → Wout Weghorst 78'", "Cody Gakpo 113' → Noa Lang 113'"], ["Rodrigo De Paul 67' → Leandro Paredes 67'", "Cristian Romero 78' → Nicolás Tagliafico 78'", "Marcos Acuña 78' → Germán Pezzella 78'", "Julián Álvarez 82' → Lautaro Martínez 82'", "Nahuel Molina 106' → Gonzalo Montiel 106'", "Lisandro Martínez 112' → Ángel Di María 112'"]],
    pens: [["Virgil van Dijk ✗", "Steven Berghuis ✗", "Teun Koopmeiners ✓", "Wout Weghorst ✓", "Luuk de Jong ✓"], ["Lionel Messi ✓", "Leandro Paredes ✓", "Gonzalo Montiel ✓", "Enzo Fernández ✗", "Lautaro Martínez ✓"]]
  },
  "2022_NED_USA": {
    cards: [["Teun Koopmeiners 60' 🟨", "Frenkie de Jong 87' 🟨"], []],
    subs: [["Marten de Roon 46' → Teun Koopmeiners 46'", "Davy Klaassen 46' → Steven Bergwijn 46'", "Memphis Depay 83' → Xavi Simons 83'", "Nathan Aké 90'+3' → Matthijs de Ligt 90'+3'", "Cody Gakpo 90'+3' → Wout Weghorst 90'+3'"], ["Jesús Ferreira 46' → Giovanni Reyna 46'", "Weston McKennie 67' → Brenden Aaronson 67'", "Timothy Weah 67' → Haji Wright 67'", "Sergiño Dest 75' → DeAndre Yedlin 75'", "Antonee Robinson 90'+2' → Jordan Morris 90'+2'"]],
    pens: [[], []]
  },
  "2022_POL_FRA": {
    cards: [["Bartosz Bereszyński 47' 🟨", "Matty Cash 88' 🟨"], ["Aurélien Tchouaméni 32' 🟨"]],
    subs: [["Sebastian Szymański 64' → Arkadiusz Milik 64'", "Grzegorz Krychowiak 71' → Nicola Zalewski 71'", "Jakub Kamiński 71' → Krystian Bielik 71'", "Jakub Kiwior 87' → Jan Bednarek 87'", "Przemysław Frankowski 87' → Kamil Grosicki 87'"], ["Aurélien Tchouaméni 66' → Youssouf Fofana 66'", "Ousmane Dembélé 76' → Kingsley Coman 76'", "Olivier Giroud 76' → Marcus Thuram 76'", "Jules Koundé 90'+2' → Axel Disasi 90'+2'"]],
    pens: [[], []]
  },
  "2022_POR_MAR": {
    cards: [["Vitinha 87' 🟨"], ["Achraf Dari 70' 🟨", "Walid Cheddira 90'+1' 🟨"]],
    subs: [["Raphaël Guerreiro 51' → João Cancelo 51'", "Rúben Neves 51' → Cristiano Ronaldo 51'", "Otávio 69' → Rafael Leão 69'", "Gonçalo Ramos 69' → Vitinha 69'", "Diogo Dalot 79' → Ricardo Horta 79'"], ["Romain Saïss 57' → Achraf Dari 57'", "Selim Amallah 65' → Walid Cheddira 65'", "Youssef En-Nesyri 65' → Badr Benoun 65'", "Hakim Ziyech 82' → Zakaria Aboukhlal 82'", "Sofiane Boufal 82' → Yahya Jabrane 82'"]],
    pens: [[], []]
  },
  "2022_POR_SUI": {
    cards: [[], ["Fabian Schär 43' 🟨", "Eray Cömert 59' 🟨"]],
    subs: [["Otávio 74' → Ricardo Horta 74'", "Gonçalo Ramos 74' → Vitinha 74'", "João Félix 74' → Cristiano Ronaldo 74'", "Bernardo Silva 81' → Rúben Neves 81'", "Bruno Fernandes 87' → Rafael Leão 87'"], ["Fabian Schär 46' → Eray Cömert 46'", "Djibril Sow 54' → Denis Zakaria 54'", "Remo Freuler 54' → Haris Seferovic 54'", "Ruben Vargas 66' → Noah Okafor 66'", "Breel Embolo 89' → Ardon Jashari 89'"]],
    pens: [[], []]
  },
  "2022_SEN_ENG": {
    cards: [["Kalidou Koulibaly 76' 🟨"], []],
    subs: [["Pathé Ciss 46' → Pape Matar Sarr 46'", "Krépin Diatta 46' → Bamba Dieng 46'", "Iliman Ndiaye 46' → Pape Gueye 46'", "Boulaye Dia 72' → Famara Diédhiou 72'", "Ismail Jakobs 84' → Fodé Ballo-Touré 84'"], ["Bukayo Saka 65' → Marcus Rashford 65'", "Phil Foden 65' → Jack Grealish 65'", "John Stones 76' → Mason Mount 76'", "Jude Bellingham 76' → Eric Dier 76'", "Jordan Henderson 82' → Kalvin Phillips 82'"]],
    pens: [[], []]
  },
  "2022_SUI_POR": {
    cards: [["Fabian Schär 43' 🟨", "Eray Cömert 59' 🟨"], []],
    subs: [["Fabian Schär 46' → Eray Cömert 46'", "Djibril Sow 54' → Denis Zakaria 54'", "Remo Freuler 54' → Haris Seferovic 54'", "Ruben Vargas 66' → Noah Okafor 66'", "Breel Embolo 89' → Ardon Jashari 89'"], ["Otávio 74' → Ricardo Horta 74'", "Gonçalo Ramos 74' → Vitinha 74'", "João Félix 74' → Cristiano Ronaldo 74'", "Bernardo Silva 81' → Rúben Neves 81'", "Bruno Fernandes 87' → Rafael Leão 87'"]],
    pens: [[], []]
  },
  "2022_USA_NED": {
    cards: [[], ["Teun Koopmeiners 60' 🟨", "Frenkie de Jong 87' 🟨"]],
    subs: [["Jesús Ferreira 46' → Giovanni Reyna 46'", "Weston McKennie 67' → Brenden Aaronson 67'", "Timothy Weah 67' → Haji Wright 67'", "Sergiño Dest 75' → DeAndre Yedlin 75'", "Antonee Robinson 90'+2' → Jordan Morris 90'+2'"], ["Marten de Roon 46' → Teun Koopmeiners 46'", "Davy Klaassen 46' → Steven Bergwijn 46'", "Memphis Depay 83' → Xavi Simons 83'", "Nathan Aké 90'+3' → Matthijs de Ligt 90'+3'", "Cody Gakpo 90'+3' → Wout Weghorst 90'+3'"]],
    pens: [[], []]
  },
};

export function getStats(year: number, teamA: string, teamB: string): MatchStats | null {
  return STATS[`${year}_${teamA}_${teamB}`] ?? null;
}
