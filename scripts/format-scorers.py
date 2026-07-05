#!/usr/bin/env python3
"""Generate g: fields for data.ts M() calls and R32 match objects using the scorer JSON."""

import json, sys

with open("/var/folders/33/wm4_h31j37z8z0zr4y1l9xfc0000gn/T/opencode/scorers.json") as f:
    scorer_data = json.load(f)

def format_g(home, away):
    h = json.dumps(home, ensure_ascii=False)
    a = json.dumps(away, ensure_ascii=False)
    return f"g: [{h}, {a}]"

# For R16/QF/SF/Final: these use M() calls. The g: field is the 6th param.
# For R32 (2026 only): these use { ta, tb, s, w, ... } objects. The g: field is inline.

def generate():
    for year_str in sorted(scorer_data.keys(), key=int):
        year = int(year_str)
        rounds = scorer_data[year_str]
        print(f"\n// ==== {year} ====")

        for stage in ["r16", "qf", "sf", "final"]:
            if stage not in rounds:
                continue
            matches = rounds[stage]
            print(f"// {stage}:")
            for i, m in enumerate(matches):
                h = json.dumps(m["home"], ensure_ascii=False)
                a = json.dumps(m["away"], ensure_ascii=False)
                # Check for " (o.g.)" or " (pen.)" suffixes
                has_special = any("(o.g.)" in g or "(pen.)" in g for g in m["home"] + m["away"])
                suffix = " // has o.g./pen." if has_special else ""
                print(f"//   [{i}] g: [{h}, {a}]{suffix}")

generate()
