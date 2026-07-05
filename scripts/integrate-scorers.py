#!/usr/bin/env python3
"""Integrate scorer data into data.ts by matching team codes.
Outputs the modified data.ts content.
"""

import json, re, sys

SCORERS_JSON = "/var/folders/33/wm4_h31j37z8z0zr4y1l9xfc0000gn/T/opencode/scorers.json"
DATA_TS = "/Users/khalilbenihoud/conductor/workspaces/wc2026/riyadh/src/data.ts"

with open(SCORERS_JSON) as f:
    scorer_data = json.load(f)

with open(DATA_TS) as f:
    content = f.read()

def format_g_arr(home, away):
    h = json.dumps(home, ensure_ascii=False)
    a = json.dumps(away, ensure_ascii=False)
    return f"g: [{h}, {a}]"

# Build a lookup: (year, stage, home_code, away_code) -> (home_goals, away_goals)
lookup = {}
for year_str, rounds in scorer_data.items():
    year = int(year_str)
    for stage, matches in rounds.items():
        # The matches are in dataset order which should match bracket order
        # We'll use the data.ts teams array to determine bracket positions
        pass

# Actually, the simplest approach: for each year section in data.ts,
# find M() calls and add g: based on round + index position.
# The scorer data order matches the bracket order.

# Let's parse data.ts year by year and modify M() calls
lines = content.split('\n')
result = []
current_year = None
current_stage = None
match_idx = 0

import re

# Track which year/stage we're in
in_year = False

for line in lines:
    # Detect year sections
    year_match = re.match(r'^\s*(\d{4}):\s*\{', line)
    if year_match:
        current_year = int(year_match.group(1))
        in_year = True
        match_idx = 0
        current_stage = None
        result.append(line)
        continue

    if in_year and re.match(r'^\s*\}', line):
        in_year = False
        current_year = None
        result.append(line)
        continue

    # Detect stage arrays
    stage_match = re.match(r'^\s*(r16|qf|sf|final):\s*\[', line)
    if stage_match:
        current_stage = stage_match.group(1)
        match_idx = 0
        result.append(line)
        continue

    # Detect M() calls within stage arrays
    m_match = re.match(r'^\s*(M\([^)]+\))(,?)\s*$', line)
    if m_match and current_year and current_stage:
        year_str = str(current_year)
        if year_str in scorer_data and current_stage in scorer_data[year_str]:
            stage_matches = scorer_data[year_str][current_stage]
            if match_idx < len(stage_matches):
                sm = stage_matches[match_idx]
                g_field = format_g_arr(sm["home"], sm["away"])
                # Insert g: before the closing paren if not already there
                call = m_match.group(1)
                comma = m_match.group(2)
                if 'g:' not in call:
                    call = call.rstrip(')') + ', ' + g_field + ')'
                result.append('      ' + call + comma)
                match_idx += 1
                continue
        match_idx += 1

    # Detect R32 match objects
    r32_match = re.match(r"^\s*(\{\s*ta:\s*\"(\w+)\",\s*tb:\s*\"(\w+)\".*?\})(,?)\s*$", line)
    if r32_match and current_year == 2026:
        # R32 matches only for 2026
        full = r32_match.group(1)
        comma = r32_match.group(4)
        ta_code = r32_match.group(2)
        tb_code = r32_match.group(3)
        # Don't modify - R32 data already has g: fields for 2026
        result.append(line)
        continue

    result.append(line)

# Print the first 200 lines and last 50 to check
output = '\n'.join(result)
print(output[:500])
print("...")
print(output[-500:])
