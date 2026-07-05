#!/usr/bin/env python3
"""Generate match statistics data from jfjelstul/worldcup CSVs.
Outputs src/stats.ts with cards, subs, and penalty shootout data."""

import csv, json, collections

URLS = {
    "bookings": "https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/bookings.csv",
    "substitutions": "https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/substitutions.csv",
    "penalty_kicks": "https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/penalty_kicks.csv",
}

def download(name, url):
    import urllib.request
    path = f"/var/folders/33/wm4_h31j37z8z0zr4y1l9xfc0000gn/T/opencode/{name}.csv"
    urllib.request.urlretrieve(url, path)
    return path

def load_bookings(path):
    """Group bookings by match_id -> { home_cards, away_cards }"""
    data = collections.defaultdict(lambda: {"home": [], "away": []})
    with open(path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            mid = row["match_id"]
            is_home = row["home_team"] == "1"
            card = "🟥" if row["red_card"] == "1" else "🟨"
            name = f"{row['given_name']} {row['family_name']}"
            name = name.replace("not applicable ", "")
            minute = row["minute_label"]
            entry = f"{name} {minute} {card}"
            if is_home:
                data[mid]["home"].append(entry)
            else:
                data[mid]["away"].append(entry)
    return data

def load_substitutions(path):
    """Group subs by match_id -> { home_subs, away_subs }"""
    raw = collections.defaultdict(lambda: {"home_off": [], "home_on": [], "away_off": [], "away_on": []})
    with open(path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            mid = row["match_id"]
            is_home = row["home_team"] == "1"
            name = f"{row['given_name']} {row['family_name']}"
            name = name.replace("not applicable ", "")
            minute = row["minute_label"]
            entry = f"{name} {minute}"
            if is_home:
                if row["going_off"] == "1":
                    raw[mid]["home_off"].append(entry)
                else:
                    raw[mid]["home_on"].append(entry)
            else:
                if row["going_off"] == "1":
                    raw[mid]["away_off"].append(entry)
                else:
                    raw[mid]["away_on"].append(entry)

    # Pair off/on substitutions by matching indices
    data = collections.defaultdict(lambda: {"home": [], "away": []})
    for mid, r in raw.items():
        for side in ["home", "away"]:
            off_list = r[f"{side}_off"]
            on_list = r[f"{side}_on"]
            for i in range(max(len(off_list), len(on_list))):
                off = off_list[i] if i < len(off_list) else "?"
                on = on_list[i] if i < len(on_list) else "?"
                data[mid][side].append(f"{off} → {on}")
    return data

def load_penalties(path):
    """Group penalty kicks by match_id -> { home_pens, away_pens }"""
    data = collections.defaultdict(lambda: {"home": [], "away": []})
    with open(path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            mid = row["match_id"]
            is_home = row["home_team"] == "1"
            name = f"{row['given_name']} {row['family_name']}"
            name = name.replace("not applicable ", "")
            scored = "✓" if row["converted"] == "1" else "✗"
            entry = f"{name} {scored}"
            if is_home:
                data[mid]["home"].append(entry)
            else:
                data[mid]["away"].append(entry)
    return data

def main():
    bookings = load_bookings(download("bookings", URLS["bookings"]))
    subs = load_substitutions(download("substitutions", URLS["substitutions"]))
    pens = load_penalties(download("penalty_kicks", URLS["penalty_kicks"]))

    # Build lookup: match_id -> { cards: {home:[], away:[]}, subs: {home:[], away:[]}, pens: {home:[], away:[]} }
    all_matches = set()
    for d in [bookings, subs, pens]:
        all_matches.update(d.keys())

    # Also load matches to get year + round info
    import urllib.request
    matches_csv = "/var/folders/33/wm4_h31j37z8z0zr4y1l9xfc0000gn/T/opencode/matches.csv"
    urllib.request.urlretrieve(URLS["bookings"].replace("bookings", "matches"), matches_csv)

    match_info = {}
    STAGE_MAP = {
        "round of 16": "r16", "quarter-finals": "qf", "quarter-final": "qf",
        "semi-finals": "sf", "semi-final": "sf", "final": "final",
    }
    with open(matches_csv, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if "Women" in row["tournament_name"]:
                continue
            stage = STAGE_MAP.get(row["stage_name"].lower())
            if not stage:
                continue
            year = int(row["tournament_name"].split()[0])
            if year < 1930:
                continue
            match_info[row["match_id"]] = {"year": year, "stage": stage}

    # Build output by year_round_index
    # We need to map match_id to index position within each year/round
    # Match IDs are sequential, so order by match_id gives bracket order
    by_year_round = collections.defaultdict(list)
    for mid in sorted(all_matches):
        info = match_info.get(mid)
        if not info:
            continue
        key = (info["year"], info["stage"])
        b = bookings.get(mid, {"home": [], "away": []})
        s = subs.get(mid, {"home": [], "away": []})
        p = pens.get(mid, {"home": [], "away": []})

        # Only include if there's data
        if not (b["home"] or b["away"] or s["home"] or s["away"] or p["home"] or p["away"]):
            continue

        by_year_round[key].append({
            "cards_home": b["home"], "cards_away": b["away"],
            "subs_home": s["home"], "subs_away": s["away"],
            "pens_home": p["home"], "pens_away": p["away"],
        })

    # Generate TypeScript
    lines = [
        "// Auto-generated from jfjelstul/worldcup dataset",
        "// Key: year_round_index -> match statistics",
        "",
        "export interface MatchStats {",
        "  cards: [string[], string[]];  // [home, away]",
        "  subs: [string[], string[]];",
        "  pens: [string[], string[]];  // penalty shootouts only",
        "}",
        "",
        "const STATS: Record<string, MatchStats> = {",
    ]

    for (year, stage), matches in sorted(by_year_round.items()):
        for i, m in enumerate(matches):
            key = f"{year}_{stage}_{i}"
            c_h = json.dumps(m["cards_home"], ensure_ascii=False)
            c_a = json.dumps(m["cards_away"], ensure_ascii=False)
            s_h = json.dumps(m["subs_home"], ensure_ascii=False)
            s_a = json.dumps(m["subs_away"], ensure_ascii=False)
            p_h = json.dumps(m["pens_home"], ensure_ascii=False)
            p_a = json.dumps(m["pens_away"], ensure_ascii=False)
            lines.append(f'  "{key}": {{')
            lines.append(f'    cards: [{c_h}, {c_a}],')
            lines.append(f'    subs: [{s_h}, {s_a}],')
            lines.append(f'    pens: [{p_h}, {p_a}]')
            lines.append(f'  }},')

    lines.append("};")
    lines.append("")
    lines.append("export function getStats(year: number, round: string, index: number): MatchStats | null {")
    lines.append("  const key = `${year}_${round}_${index}`;")
    lines.append("  return STATS[key] ?? null;")
    lines.append("}")

    out_path = "/Users/khalilbenihoud/conductor/workspaces/wc2026/riyadh/src/stats.ts"
    with open(out_path, 'w') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"Wrote {len(lines)} lines to {out_path}")

if __name__ == "__main__":
    main()
