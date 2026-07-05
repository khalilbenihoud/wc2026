#!/usr/bin/env python3
"""Regenerate src/scorers.ts and src/stats.ts from the jfjelstul/worldcup CSVs,
keyed by TEAM CODES (year_TA_TB) instead of a positional match index.

Why: the previous generators keyed matches by their position in dataset
match-id order, which does NOT match the bracket ordering hand-authored in
data.ts. That mis-mapped goals/cards onto the wrong fixtures. Team-code keys
are order-independent, so the modal can look them up with the ta/tb it already
resolves. Both orientations (TA_TB and TB_TA) are emitted so lookups work
regardless of which side data.ts lists first.
"""

import csv, json, re, collections, sys

T = "/var/folders/33/wm4_h31j37z8z0zr4y1l9xfc0000gn/T/opencode"
ROOT = "/Users/khalilbenihoud/conductor/workspaces/wc2026/riyadh"
DATA_TS = f"{ROOT}/src/data.ts"

STAGE_MAP = {
    "round of 16": "r16", "quarter-finals": "qf", "quarter-final": "qf",
    "semi-finals": "sf", "semi-final": "sf", "final": "final",
}

# ---- data.ts team registry: name -> code, and the set of valid codes ----
content = open(DATA_TS).read()
block = content[content.index("export const TEAMS"):content.index("export const COLORS")]
data_code_name = dict(re.findall(r'(\w+):\s*\["([^"]+)",', block))
data_codes = set(data_code_name)
name_to_code = {n: c for c, n in data_code_name.items()}
# Years we actually render (keeps output lean + avoids out-of-scope teams)
DATA_YEARS = {int(y) for y in re.findall(r'^  (\d{4}): \{', content, re.M)}

def to_data_code(code, name):
    """Map a CSV team code to the data.ts code: identity first, then by name."""
    if code in data_codes:
        return code
    return name_to_code.get(name)

def clean_name(given, family):
    n = f"{given} {family}".replace("not applicable ", "").strip()
    return n

# ---- load matches (men's knockout, in-scope years) ----
match_meta = {}  # match_id -> (year, stage, home_data_code, away_data_code)
unmapped = set()
with open(f"{T}/matches.csv", newline='', encoding='utf-8') as f:
    for r in csv.DictReader(f):
        if "Men's" not in r["tournament_name"]:
            continue
        if r["knockout_stage"] != "1":
            continue
        # Early World Cups replayed drawn ties; data.ts records the decisive
        # replay, so drop the original (replayed==1) and keep the replay.
        if r["replayed"] == "1":
            continue
        year = int(r["tournament_name"].split()[0])
        if year not in DATA_YEARS:
            continue
        stage = STAGE_MAP.get(r["stage_name"].lower())
        if not stage:
            continue
        hc = to_data_code(r["home_team_code"], r["home_team_name"])
        ac = to_data_code(r["away_team_code"], r["away_team_name"])
        if not hc or not ac:
            unmapped.add((r["home_team_code"], r["home_team_name"]) if not hc
                         else (r["away_team_code"], r["away_team_name"]))
            continue
        match_meta[r["match_id"]] = (year, stage, hc, ac)

if unmapped:
    print("!! UNMAPPED knockout teams (need a synonym):", sorted(unmapped), file=sys.stderr)

# ---- goals ----
goals = collections.defaultdict(lambda: {"home": [], "away": []})
with open(f"{T}/goals.csv", newline='', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))
def gmin(row):
    reg = int(row["minute_regulation"]) if row["minute_regulation"].isdigit() else 0
    st = int(row["minute_stoppage"]) if row["minute_stoppage"].isdigit() else 0
    return (reg, st)
for row in sorted(rows, key=gmin):
    mid = row["match_id"]
    if mid not in match_meta:
        continue
    name = clean_name(row["given_name"], row["family_name"])
    label = row["minute_label"]
    suffix = " (o.g.)" if row["own_goal"] == "1" else (" (pen.)" if row["penalty"] == "1" else "")
    entry = f"{name} {label}{suffix}"
    side = "home" if row["home_team"] == "1" else "away"
    goals[mid][side].append(entry)

# ---- bookings / subs / pens (same formatting as before) ----
cards = collections.defaultdict(lambda: {"home": [], "away": []})
with open(f"{T}/bookings.csv", newline='', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        mid = row["match_id"]
        if mid not in match_meta:
            continue
        card = "🟥" if row["red_card"] == "1" else "🟨"
        entry = f'{clean_name(row["given_name"], row["family_name"])} {row["minute_label"]} {card}'
        cards[mid]["home" if row["home_team"] == "1" else "away"].append(entry)

subs_raw = collections.defaultdict(lambda: {"home_off": [], "home_on": [], "away_off": [], "away_on": []})
with open(f"{T}/substitutions.csv", newline='', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        mid = row["match_id"]
        if mid not in match_meta:
            continue
        entry = f'{clean_name(row["given_name"], row["family_name"])} {row["minute_label"]}'
        side = "home" if row["home_team"] == "1" else "away"
        key = f'{side}_' + ("off" if row["going_off"] == "1" else "on")
        subs_raw[mid][key].append(entry)
subs = collections.defaultdict(lambda: {"home": [], "away": []})
for mid, r in subs_raw.items():
    for side in ["home", "away"]:
        off_l, on_l = r[f"{side}_off"], r[f"{side}_on"]
        for i in range(max(len(off_l), len(on_l))):
            off = off_l[i] if i < len(off_l) else "?"
            on = on_l[i] if i < len(on_l) else "?"
            subs[mid][side].append(f"{off} → {on}")

pens = collections.defaultdict(lambda: {"home": [], "away": []})
with open(f"{T}/penalty_kicks.csv", newline='', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        mid = row["match_id"]
        if mid not in match_meta:
            continue
        mark = "✓" if row["converted"] == "1" else "✗"
        entry = f'{clean_name(row["given_name"], row["family_name"])} {mark}'
        pens[mid]["home" if row["home_team"] == "1" else "away"].append(entry)

# ---- assemble by team-code key, both orientations ----
def add_both(store, year, hc, ac, home_val, away_val):
    store[f"{year}_{hc}_{ac}"] = [home_val, away_val]
    store[f"{year}_{ac}_{hc}"] = [away_val, home_val]

scorers_out = {}
stats_out = {}
collisions = []
for mid, (year, stage, hc, ac) in match_meta.items():
    g = goals.get(mid, {"home": [], "away": []})
    if g["home"] or g["away"]:
        k = f"{year}_{hc}_{ac}"
        if k in scorers_out:
            collisions.append(k)
        add_both(scorers_out, year, hc, ac, g["home"], g["away"])
    c = cards.get(mid, {"home": [], "away": []})
    s = subs.get(mid, {"home": [], "away": []})
    p = pens.get(mid, {"home": [], "away": []})
    if c["home"] or c["away"] or s["home"] or s["away"] or p["home"] or p["away"]:
        key = f"{year}_{hc}_{ac}"
        stats_out[key] = {
            "cards": [c["home"], c["away"]], "subs": [s["home"], s["away"]], "pens": [p["home"], p["away"]],
        }
        stats_out[f"{year}_{ac}_{hc}"] = {
            "cards": [c["away"], c["home"]], "subs": [s["away"], s["home"]], "pens": [p["away"], p["home"]],
        }

if collisions:
    print("!! KEY COLLISIONS:", collisions, file=sys.stderr)

# ---- write scorers.ts ----
def arr(x):
    return json.dumps(x, ensure_ascii=False)

lines = [
    "// Auto-generated from jfjelstul/worldcup dataset — DO NOT EDIT BY HAND.",
    "// Key: `${year}_${teamA}_${teamB}` -> [teamA goals, teamB goals].",
    "// Both orientations are emitted so lookups work in either team order.",
    "",
    "const SCORERS: Record<string, [string[], string[]]> = {",
]
for k in sorted(scorers_out):
    h, a = scorers_out[k]
    lines.append(f'  "{k}": [{arr(h)}, {arr(a)}],')
lines += [
    "};",
    "",
    "export function getScorers(year: number, teamA: string, teamB: string): [string[], string[]] | null {",
    "  return SCORERS[`${year}_${teamA}_${teamB}`] ?? null;",
    "}",
]
open(f"{ROOT}/src/scorers.ts", "w").write("\n".join(lines) + "\n")

# ---- write stats.ts ----
lines = [
    "// Auto-generated from jfjelstul/worldcup dataset — DO NOT EDIT BY HAND.",
    "// Key: `${year}_${teamA}_${teamB}` -> stats oriented [teamA, teamB].",
    "// Both orientations are emitted so lookups work in either team order.",
    "",
    "export interface MatchStats {",
    "  cards: [string[], string[]];  // [teamA, teamB]",
    "  subs: [string[], string[]];",
    "  pens: [string[], string[]];  // penalty shootouts only",
    "}",
    "",
    "const STATS: Record<string, MatchStats> = {",
]
for k in sorted(stats_out):
    m = stats_out[k]
    lines.append(f'  "{k}": {{')
    lines.append(f'    cards: [{arr(m["cards"][0])}, {arr(m["cards"][1])}],')
    lines.append(f'    subs: [{arr(m["subs"][0])}, {arr(m["subs"][1])}],')
    lines.append(f'    pens: [{arr(m["pens"][0])}, {arr(m["pens"][1])}]')
    lines.append(f'  }},')
lines += [
    "};",
    "",
    "export function getStats(year: number, teamA: string, teamB: string): MatchStats | null {",
    "  return STATS[`${year}_${teamA}_${teamB}`] ?? null;",
    "}",
]
open(f"{ROOT}/src/stats.ts", "w").write("\n".join(lines) + "\n")

print(f"scorers keys: {len(scorers_out)} (={len(scorers_out)//2} matches)")
print(f"stats keys:   {len(stats_out)} (={len(stats_out)//2} matches)")
print(f"years in scope: {sorted(DATA_YEARS)}")
