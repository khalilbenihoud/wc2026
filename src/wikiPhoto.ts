import { useEffect, useRef, useState } from "react";

const WIKI_SLUG_OVERRIDE: Record<string, string> = {
  "Ronaldo": "Ronaldo_Nazário",
  "Michel Preud'homme": "Michel_Preud'homme",
  "Emiliano Martínez": "Emiliano_Martínez",
  "Oldřich Nejedlý": "Oldřich_Nejedlý",
  "Leônidas": "Leônidas",
  "Salvatore Schillaci": "Salvatore_Schillaci",
  "Hristo Stoichkov / Oleg Salenko": "Hristo_Stoichkov",
  "Davor Šuker": "Davor_Šuker",
  "Miroslav Klose": "Miroslav_Klose",
  "Thomas Müller": "Thomas_Müller",
  "James Rodríguez": "James_Rodríguez",
  "Harry Kane": "Harry_Kane",
  "Kylian Mbappé": "Kylian_Mbappé",
  "Pelé": "Pelé", "Romário": "Romário", "Zico": "Zico_(footballer)",
  "Bebeto": "Bebeto", "Garrincha": "Garrincha", "Jairzinho": "Jairzinho",
  "Rivaldo": "Rivaldo", "Cafu": "Cafu", "Tostão": "Tostão", "Neymar": "Neymar",
  "Mbappé": "Kylian_Mbappé", "Messi": "Lionel_Messi",
  "Cristiano Ronaldo": "Cristiano_Ronaldo",
  "Lionel Messi": "Lionel_Messi", "Diego Maradona": "Diego_Maradona",
  "Suárez": "Luis_Suárez_(footballer,_born_1987)",
  "Luis Suárez": "Luis_Suárez_(footballer,_born_1987)",
  "Maradona": "Diego_Maradona", "Batistuta": "Gabriel_Batistuta",
  "Gabriel Batistuta": "Gabriel_Batistuta", "Kempes": "Mario_Kempes",
  "Mario Kempes": "Mario_Kempes", "Crespo": "Hernán_Crespo",
  "Aguero": "Sergio_Agüero", "Sergio Agüero": "Sergio_Agüero",
  "Di María": "Ángel_Di_María", "Di Maria": "Ángel_Di_María",
  "Ángel Di María": "Ángel_Di_María", "Higuain": "Gonzalo_Higuaín",
  "Gonzalo Higuaín": "Gonzalo_Higuaín",
  "Julián Álvarez": "Julián_Álvarez", "Enzo Fernández": "Enzo_Fernández",
  "Daniel Passarella": "Daniel_Passarella",
  "Gerd Müller": "Gerd_Müller", "Klose": "Miroslav_Klose",
  "Podolski": "Lukas_Podolski", "Lukas Podolski": "Lukas_Podolski",
  "Schweinsteiger": "Bastian_Schweinsteiger",
  "Bastian Schweinsteiger": "Bastian_Schweinsteiger",
  "Ozil": "Mesut_Özil", "Mesut Özil": "Mesut_Özil",
  "Müller": "Thomas_Müller", "Xavi": "Xavi",
  "Iniesta": "Andrés_Iniesta", "Andrés Iniesta": "Andrés_Iniesta",
  "Casillas": "Iker_Casillas", "Iker Casillas": "Iker_Casillas",
  "Zidane": "Zinedine_Zidane", "Zinedine Zidane": "Zinedine_Zidane",
  "Henry": "Thierry_Henry", "Thierry Henry": "Thierry_Henry",
  "Villa": "David_Villa", "David Villa": "David_Villa",
  "Raúl": "Raúl_(footballer)", "Raúl González": "Raúl_(footballer)",
  "Torres": "Fernando_Torres", "Fernando Torres": "Fernando_Torres",
  "Fernando Morientes": "Fernando_Morientes",
  "Puyol": "Carles_Puyol", "Carles Puyol": "Carles_Puyol",
  "Sergio Ramos": "Sergio_Ramos",
  "Robben": "Arjen_Robben", "Arjen Robben": "Arjen_Robben",
  "Sneijder": "Wesley_Sneijder", "Wesley Sneijder": "Wesley_Sneijder",
  "van Persie": "Robin_van_Persie", "Robin van Persie": "Robin_van_Persie",
  "Dirk Kuyt": "Dirk_Kuyt",
  "Bergkamp": "Dennis_Bergkamp", "Cruyff": "Johan_Cruyff",
  "Gullit": "Ruud_Gullit", "Baggio": "Roberto_Baggio",
  "Roberto Baggio": "Roberto_Baggio", "Pirlo": "Andrea_Pirlo",
  "Andrea Pirlo": "Andrea_Pirlo", "Totti": "Francesco_Totti",
  "Francesco Totti": "Francesco_Totti",
  "Del Piero": "Alessandro_Del_Piero",
  "Alessandro Del Piero": "Alessandro_Del_Piero",
  "Maldini": "Paolo_Maldini", "Paolo Maldini": "Paolo_Maldini",
  "Gianluigi Buffon": "Gianluigi_Buffon",
  "Lineker": "Gary_Lineker", "Gary Lineker": "Gary_Lineker",
  "Beckham": "David_Beckham", "David Beckham": "David_Beckham",
  "Gerrard": "Steven_Gerrard", "Lampard": "Frank_Lampard",
  "Rooney": "Wayne_Rooney", "Wayne Rooney": "Wayne_Rooney",
  "Owen": "Michael_Owen", "Michael Owen": "Michael_Owen",
  "Shearer": "Alan_Shearer", "Alan Shearer": "Alan_Shearer",
  "Kane": "Harry_Kane",
  "Stoichkov": "Hristo_Stoichkov", "Hristo Stoichkov": "Hristo_Stoichkov",
  "Salenko": "Oleg_Salenko", "Oleg Salenko": "Oleg_Salenko",
  "Shevchenko": "Andriy_Shevchenko",
  "Andriy Shevchenko": "Andriy_Shevchenko",
  "Drogba": "Didier_Drogba", "Didier Drogba": "Didier_Drogba",
  "Eto'o": "Samuel_Eto'o", "Samuel Eto'o": "Samuel_Eto'o",
  "Mill": "Mill", "Roger Milla": "Roger_Milla",
  "Eusébio": "Eusébio", "Figo": "Luís_Figo",
  "Luis Figo": "Luís_Figo", "Rui Costa": "Rui_Costa",
  "Pauleta": "Pauleta",
  "Rajko Mitić": "Rajko_Mitić", "Stjepan Bobek": "Stjepan_Bobek",
  "Milan Galić": "Milan_Galić", "Dražan Jerković": "Dražan_Jerković",
  "Just Fontaine": "Just_Fontaine", "Raymond Kopa": "Raymond_Kopa",
  "Michel Platini": "Michel_Platini",
  "Zbigniew Boniek": "Zbigniew_Boniek", "Grzegorz Lato": "Grzegorz_Lato",
  "Uwe Seeler": "Uwe_Seeler", "Helmut Rahn": "Helmut_Rahn",
  "Fritz Walter": "Fritz_Walter_(footballer)",
  "Lothar Matthäus": "Lothar_Matthäus",
  "Paolo Rossi": "Paolo_Rossi", "Luigi Riva": "Luigi_Riva",
  "Christian Vieri": "Christian_Vieri",
  "Sándor Kocsis": "Sándor_Kocsis", "Ferenc Puskás": "Ferenc_Puskás",
  "Flórián Albert": "Flórián_Albert", "Lajos Tichy": "Lajos_Tichy",
  "Josef Masopust": "Josef_Masopust",
  "Didi": "Didi_(footballer,_born_1928)", "Vavá": "Vavá",
  "Mário Coluna": "Mário_Coluna", "José Torres": "José_Torres_(footballer)",
  "Kurt Hamrin": "Kurt_Hamrin", "Gunnar Gren": "Gunnar_Gren",
  "Nils Liedholm": "Nils_Liedholm",
  "Johnny Rep": "Johnny_Rep", "Rob Rensenbrink": "Rob_Rensenbrink",
  "Rivelino": "Rivelino",
  "Bobby Charlton": "Bobby_Charlton", "Bobby Moore": "Bobby_Moore",
  "Geoff Hurst": "Geoff_Hurst", "Kevin Keegan": "Kevin_Keegan",
  "Paul Gascoigne": "Paul_Gascoigne",
  "Romelu Lukaku": "Romelu_Lukaku", "Kevin De Bruyne": "Kevin_De_Bruyne",
  "Eden Hazard": "Eden_Hazard",
  "Rudi Völler": "Rudi_Völler", "Jürgen Klinsmann": "Jürgen_Klinsmann",
  "Mario Götze": "Mario_Götze", "Toni Kroos": "Toni_Kroos",
  "Sami Khedira": "Sami_Khedira",
  "Robert Lewandowski": "Robert_Lewandowski",
  "Zlatan Ibrahimović": "Zlatan_Ibrahimović",
  "Edin Džeko": "Edin_Džeko", "Luka Modrić": "Luka_Modrić",
  "Ivan Perišić": "Ivan_Perišić", "Mario Mandžukić": "Mario_Mandžukić",
  "Dejan Stanković": "Dejan_Stanković",
  "Xavi Hernández": "Xavi",
  "Antoine Griezmann": "Antoine_Griezmann",
  "Olivier Giroud": "Olivier_Giroud", "Karim Benzema": "Karim_Benzema",
  "Ciro Immobile": "Ciro_Immobile",
  "Mohamed Salah": "Mohamed_Salah", "Sadio Mané": "Sadio_Mané",
  "Nwankwo Kanu": "Nwankwo_Kanu", "Jay-Jay Okocha": "Jay-Jay_Okocha",
  "Abedi Pelé": "Abedi_Pelé", "Asamoah Gyan": "Asamoah_Gyan",
  "Ivan Klasnić": "Ivan_Klasnić", "Josip Skoblar": "Josip_Skoblar",
  "Bernard Vukas": "Bernard_Vukas", "Alen Bokšić": "Alen_Bokšić",
  "Claudio Pizarro": "Claudio_Pizarro", "Paolo Guerrero": "Paolo_Guerrero",
  "Teófilo Cubillas": "Teófilo_Cubillas",
  "Emilio Butragueño": "Emilio_Butragueño", "Julio Salinas": "Julio_Salinas",
  "Aritz Aduriz": "Aritz_Aduriz",
  "Alvaro Morata": "Álvaro_Morata", "Álvaro Morata": "Álvaro_Morata",
  "Fernando Hierro": "Fernando_Hierro", "Gaizka Mendieta": "Gaizka_Mendieta",
  "Txiki Begiristain": "Txiki_Begiristain",
  "Ole Gunnar Solskjær": "Ole_Gunnar_Solskjær",
  "Erling Haaland": "Erling_Haaland",
  "Mohamed Aboutrika": "Mohamed_Aboutrika",
  "Essam El-Hadary": "Essam_El-Hadary", "Sunil Chhetri": "Sunil_Chhetri",
  "Ali Daei": "Ali_Daei", "Karim Bagheri": "Karim_Bagheri",
  "Sardar Azmoun": "Sardar_Azmoun", "Mehdi Taremi": "Mehdi_Taremi",
  "Tim Cahill": "Tim_Cahill", "Mark Viduka": "Mark_Viduka",
  "Harry Kewell": "Harry_Kewell", "Brett Emerton": "Brett_Emerton",
  "Mile Jedinak": "Mile_Jedinak",
  "Clint Dempsey": "Clint_Dempsey", "Landon Donovan": "Landon_Donovan",
  "Michael Bradley": "Michael_Bradley_(soccer)",
  "Jozy Altidore": "Jozy_Altidore",
  "Christian Pulisic": "Christian_Pulišić",
  "Keisuke Honda": "Keisuke_Honda", "Shinji Kagawa": "Shinji_Kagawa",
  "Shinji Okazaki": "Shinji_Okazaki",
  "Heung-min Son": "Son_Heung-min", "Son Heung-min": "Son_Heung-min",
  "Ji-sung Park": "Park_Ji-sung", "Park Ji-sung": "Park_Ji-sung",
  "Jung-hwan Ahn": "Ahn_Jung-hwan", "Ahn Jung-hwan": "Ahn_Jung-hwan",
  "Cha Bum-kun": "Cha_Bum-kun",
  "Chung-yong Lee": "Lee_Chung-yong", "Lee Chung-yong": "Lee_Chung-yong",
  "Seung-zin Pak": "Pak_Seung-zin", "Dong-woon Li": "Li_Dong-woon",
  "Doo-ik Pak": "Pak_Doo-ik", "Seung-kook Yang": "Yang_Seung-kook",
  "Yun-nam Ji": "Ji_Yun-nam",
  "Yoshito Okubo": "Yoshito_Ōkubo",
  "Park Chu-young": "Park_Chu-young",
  "Ali Mabkhout": "Ali_Mabkhout", "Omar Al Somah": "Omar_Al_Somah",
  "Yasser Al-Qahtani": "Yasser_Al-Qahtani", "Younis Mahmoud": "Younis_Mahmoud",
  "Mohanad Ali": "Mohanad_Ali", "Hussain Al-Hadhri": "Hussain_Al-Hadhri",
  "Ahmed Radhi": "Ahmed_Radhi", "Razzaq Farhan": "Razzaq_Farhan",
  "Hussein Saeed": "Hussein_Saeed",
  "Youssef Msakni": "Youssef_Msakni", "Wahbi Khazri": "Wahbi_Khazri",
  "Mohamed Amine": "Mohamed_Amine", "Ferjani Sassi": "Ferjani_Sassi",
  "Naim Sliti": "Naïm_Sliti", "Sabri Lamouchi": "Sabri_Lamouchi",
  "Hakim Ziyech": "Hakim_Ziyech", "Achraf Hakimi": "Achraf_Hakimi",
  "Youssef En-Nesyri": "Youssef_En-Nesyri", "Romain Saïss": "Romain_Saïss",
  "Sofiane Boufal": "Sofiane_Boufal", "Yassine Bounou": "Yassine_Bounou",
  "Riyad Mahrez": "Riyad_Mahrez", "Islam Slimani": "Islam_Slimani",
  "Rafik Djebbour": "Rafik_Djebbour", "Nabil Bentaleb": "Nabil_Bentaleb",
  "Abdelmoumene Djabou": "Abdelmoumene_Djabou",
  "Salah Assad": "Salah_Assad", "Djamel Zidane": "Djamel_Zidane",
  "Lakhdar Belloumi": "Lakhdar_Belloumi", "Rabah Madjer": "Rabah_Madjer",
  "Mustapha Dahleb": "Mustapha_Dahleb",
  "Abdelaziz Ben Tifour": "Abdelaziz_Ben_Tifour",
  "Ali Benarbia": "Ali_Benarbia", "Sofiane Feghouli": "Sofiane_Feghouli",
  "Raïs M'Bolhi": "Raïs_M'Bolhi", "Nabil Ghilas": "Nabil_Ghilas",
  "Abdelkader Mesbah": "Abdelkader_Mesbah", "Mehdi Lacen": "Mehdi_Lacen",
  "Carlos Vela": "Carlos_Vela", "Javier Hernández": "Javier_Hernández",
  "Guillermo Ochoa": "Guillermo_Ochoa", "Rafael Márquez": "Rafael_Márquez",
  "Andrés Guardado": "Andrés_Guardado",
  "Giovani dos Santos": "Giovani_dos_Santos",
  "Hirving Lozano": "Hirving_Lozano", "Raúl Jiménez": "Raúl_Jiménez",
  "Jorge Campos": "Jorge_Campos", "Hugo Sánchez": "Hugo_Sánchez",
  "Cuauhtémoc Blanco": "Cuauhtémoc_Blanco",
  "Luis Hernández": "Luis_Hernández_(footballer)",
  "Omar Bravo": "Omar_Bravo", "Jared Borgetti": "Jared_Borgetti",
};

// Wikipedia slug for an award-winner name (handles "A / B" ties and "(disamb)").
export const gbSlug = (name: string) =>
  WIKI_SLUG_OVERRIDE[name] || name.split("/")[0].split(" (")[0].trim();

// Prefetch a winner's Wikipedia thumbnail as soon as the name changes (not on
// hover): check the in-memory + localStorage cache first, otherwise fetch once,
// preload the image, and persist it so it's instant next time. Returns the photo
// URL, or null while loading / when Wikipedia has no thumbnail.
export function useWikiPhoto(name: string | null | undefined): string | null {
  const [photo, setPhoto] = useState<string | null>(null);
  const cache = useRef<Record<string, string>>({});
  useEffect(() => {
    if (!name) {
      setPhoto(null);
      return;
    }
    const slug = gbSlug(name);
    const cached =
      cache.current[slug] ??
      (typeof localStorage !== "undefined" ? localStorage.getItem(`gb:${slug}`) : null);
    if (cached) {
      cache.current[slug] = cached;
      setPhoto(cached);
      return;
    }
    setPhoto(null);
    let cancelled = false;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const src: string | undefined = data?.thumbnail?.source;
        if (!src || cancelled) return;
        cache.current[slug] = src;
        try {
          localStorage.setItem(`gb:${slug}`, src);
        } catch {
          /* storage full / unavailable — in-memory cache still applies */
        }
        new Image().src = src; // warm the browser cache before render
        setPhoto(src);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [name]);
  return photo;
}
