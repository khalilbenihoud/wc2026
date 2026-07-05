#!/usr/bin/env python3
"""Generate World Cup goal scorer data from jfjelstul/worldcup dataset.
Outputs JSON keyed by year -> round -> match_index -> { home: [scorers], away: [scorers] }.
"""

import csv, json, sys, re, collections

GOALS_CSV = "/var/folders/33/wm4_h31j37z8z0zr4y1l9xfc0000gn/T/opencode/goals.csv"
MATCHES_CSV = "/var/folders/33/wm4_h31j37z8z0zr4y1l9xfc0000gn/T/opencode/matches.csv"

# Rounds in the dataset: "round of sixteen", "quarter-final", "semi-final", "final", "third place match"
STAGE_TO_ROUND = {
    "round of 16": "r16",
    "quarter-finals": "qf",
    "quarter-final": "qf",
    "semi-finals": "sf",
    "semi-final": "sf",
    "final": "final",
    "third-place match": "third",
}

def load_matches():
    """Load knockout matches from CSV, keyed by match_id."""
    matches = {}
    with open(MATCHES_CSV, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("knockout_stage") != "1":
                continue
            if "Women's" in row.get("tournament_name", ""):
                continue
            year = int(row["tournament_name"].split()[0])
            stage = STAGE_TO_ROUND.get(row.get("stage_name", "").lower())
            if not stage or stage == "third":
                continue  # skip third place, our bracket doesn't track it
            if year < 1930:
                continue
            matches[row["match_id"]] = {
                "year": year,
                "stage": stage,
                "match_name": row["match_name"],
                "home_team_code": row["home_team_code"],
                "away_team_code": row["away_team_code"],
                "home_score": int(row["home_team_score"]),
                "away_score": int(row["away_team_score"]),
            }
    return matches

def load_goals():
    """Load goals grouped by match_id and team."""
    goals = collections.defaultdict(lambda: {"home": [], "away": []})
    with open(GOALS_CSV, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            mid = row["match_id"]
            is_home = row["home_team"] == "1"
            name = f"{row['given_name']} {row['family_name']}"
            # Clean up "not applicable" placeholder names
            name = name.replace("not applicable ", "")
            minute = row["minute_label"]
            own = row["own_goal"] == "1"
            pen = row["penalty"] == "1"

            # Format: "Name 23'" or "Name 23' (pen.)"
            suffix = ""
            if pen and own:
                suffix = " (o.g., pen.)"
            elif own:
                suffix = " (o.g.)"
            elif pen:
                suffix = " (pen.)"

            goal_str = f"{name} {minute}{suffix}"

            if is_home:
                goals[mid]["home"].append(goal_str)
            else:
                goals[mid]["away"].append(goal_str)
    return goals

def main():
    matches = load_matches()
    goals = load_goals()

    # Group by year and round, ordered by match_id
    result = collections.defaultdict(lambda: collections.defaultdict(list))

    for mid in sorted(matches.keys(), key=lambda m: int(m.split("-")[-1])):
        m = matches[mid]
        g = goals.get(mid, {"home": [], "away": []})
        if not g["home"] and not g["away"]:
            continue

        result[m["year"]][m["stage"]].append({
            "name": m["match_name"],
            "home_code": m["home_team_code"],
            "away_code": m["away_team_code"],
            "home_goals": g["home"],
            "away_goals": g["away"],
        })

    # Print in a format that's useful for data.ts
    for year in sorted(result.keys()):
        print(f"\n// ---- {year} ----")
        rounds = result[year]
        for stage in ["r16", "qf", "sf", "final"]:
            if stage not in rounds:
                continue
            print(f"// {stage}:")
            for i, m in enumerate(rounds[stage]):
                h = json.dumps(m["home_goals"], ensure_ascii=False)
                a = json.dumps(m["away_goals"], ensure_ascii=False)
                print(f"//   [{i}] {m['name']} ({m['home_code']}-{m['away_code']})")
                print(f"//       g: [{h}, {a}]")

    # Also output raw JSON
    out = {}
    for year in sorted(result.keys()):
        out[str(year)] = {}
        for stage in ["r16", "qf", "sf", "final"]:
            if stage in result[year]:
                out[str(year)][stage] = [
                    {"home": m["home_goals"], "away": m["away_goals"]}
                    for m in result[year][stage]
                ]

    print("\n\n// === RAW JSON ===")
    print(json.dumps(out, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
