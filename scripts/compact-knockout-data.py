#!/usr/bin/env python3
"""Compact src/scorers.ts and src/stats.ts by dropping the duplicate reverse
orientation entries and updating the lookup functions to swap results on the fly."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"


def parse_string_literal(s: str, i: int):
    """Parse a double-quoted JS/TS string starting at index i."""
    assert s[i] == '"'
    i += 1
    out = []
    while i < len(s):
        c = s[i]
        if c == '"':
            return "".join(out), i + 1
        if c == "\\" and i + 1 < len(s):
            nxt = s[i + 1]
            escapes = {'n': '\n', 't': '\t', 'r': '\r', '\\': '\\', '"': '"', "'": "'"}
            out.append(escapes.get(nxt, nxt))
            i += 2
            continue
        out.append(c)
        i += 1
    raise ValueError("unterminated string")


def parse_value(s: str, i: int):
    """Parse a JS value (string, array, object, number, boolean) starting at i.
    Returns (python_value, next_index)."""
    while i < len(s) and s[i] in ' \t\n,':
        i += 1
    c = s[i]
    if c == '"':
        return parse_string_literal(s, i)
    if c == '[':
        return parse_array(s, i)
    if c == '{':
        return parse_object(s, i)
    if c == 't' and s.startswith('true', i):
        return True, i + 4
    if c == 'f' and s.startswith('false', i):
        return False, i + 5
    if c == 'n' and s.startswith('null', i):
        return None, i + 4
    # number
    m = re.match(r'-?\d+(?:\.\d+)?', s[i:])
    if not m:
        raise ValueError(f"unexpected char {c!r} at {i}")
    return (int(m.group()) if '.' not in m.group() else float(m.group())), i + len(m.group())


def parse_array(s: str, i: int):
    assert s[i] == '['
    i += 1
    out = []
    while i < len(s):
        while i < len(s) and s[i] in ' \t\n,':
            i += 1
        if i >= len(s):
            raise ValueError("unterminated array")
        if s[i] == ']':
            return out, i + 1
        val, i = parse_value(s, i)
        out.append(val)
    raise ValueError("unterminated array")


def parse_object(s: str, i: int):
    assert s[i] == '{'
    start = i
    depth = 0
    # First find the matching closing brace, accounting for braces inside strings.
    in_str = False
    escape = False
    j = i
    while j < len(s):
        c = s[j]
        if in_str:
            if escape:
                escape = False
            elif c == '\\':
                escape = True
            elif c == '"':
                in_str = False
            j += 1
            continue
        if c == '"':
            in_str = True
            j += 1
            continue
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                j += 1
                break
        j += 1
    if depth != 0:
        raise ValueError("unterminated object")
    body = s[start + 1:j - 1]
    # Now parse the body.
    out = {}
    k = 0
    while k < len(body):
        while k < len(body) and body[k] in ' \t\n,':
            k += 1
        if k >= len(body):
            break
        if body[k] == '"':
            key, k = parse_string_literal(body, k)
        elif re.match(r'[A-Za-z_$]', body[k]):
            m = re.match(r'[A-Za-z_$][A-Za-z0-9_$]*', body[k:])
            key = m.group()
            k += len(key)
        else:
            raise ValueError(f"expected key at {k}, got {body[k]!r}")
        while k < len(body) and body[k] in ' \t':
            k += 1
        if body[k] != ':':
            raise ValueError(f"expected colon at {k}, got {body[k]!r}")
        k += 1
        val, k = parse_value(body, k)
        out[key] = val
    return out, j


def js_repr(obj):
    """Render a Python value as a compact JS literal."""
    if isinstance(obj, str):
        s = obj.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        return f'"{s}"'
    if isinstance(obj, bool):
        return "true" if obj else "false"
    if obj is None:
        return "null"
    if isinstance(obj, (int, float)):
        return str(obj)
    if isinstance(obj, list):
        return "[" + ", ".join(js_repr(x) for x in obj) + "]"
    if isinstance(obj, dict):
        items = [f'{js_repr(k)}: {js_repr(v)}' for k, v in obj.items()]
        return "{" + ", ".join(items) + "}"
    raise TypeError(type(obj))


def compact_scorers():
    text = (SRC / "scorers.ts").read_text()
    entries = {}
    for m in re.finditer(r'\s+"(\d{4})_([A-Z]{3})_([A-Z]{3})":', text):
        year, a, b = m.groups()
        i = m.end()
        while i < len(text) and text[i] in ' \t':
            i += 1
        arr, _ = parse_array(text, i)
        key = f"{year}_{min(a, b)}_{max(a, b)}"
        if key not in entries:
            if a < b:
                entries[key] = arr
            else:
                entries[key] = [arr[1], arr[0]]

    lines = [
        "// Auto-generated from jfjelstul/worldcup dataset — DO NOT EDIT BY HAND.",
        "// Key: `${year}_${teamA}_${teamB}` -> [teamA goals, teamB goals].",
        "// Canonical orientation only (teams sorted alphabetically); lookup swaps",
        "// the arrays when the requested order is reversed.",
        "",
        "const SCORERS: Record<string, [string[], string[]]> = {",
    ]
    for key in sorted(entries):
        lines.append(f'  "{key}": {js_repr(entries[key])},')
    lines += [
        "};",
        "",
        "export function getScorers(year: number, teamA: string, teamB: string): [string[], string[]] | null {",
        "  const [a, b] = [teamA, teamB].sort();",
        "  const key = `${year}_${a}_${b}`;",
        "  const v = SCORERS[key];",
        "  if (!v) return null;",
        "  return teamA === a ? v : [v[1], v[0]];",
        "}",
    ]
    (SRC / "scorers.ts").write_text("\n".join(lines) + "\n")
    print(f"scorers: {len(entries)} canonical entries")


def extract_object(text: str, marker: str):
    """Extract the first JS object literal after a marker string.
    The marker is expected to be followed by `... = {`."""
    i = text.find(marker)
    if i == -1:
        return None, text
    eq = text.find("=", i)
    if eq == -1:
        return None, text
    i = text.find("{", eq)
    if i == -1:
        return None, text
    obj, j = parse_object(text, i)
    return obj, text[j:]


def compact_stats():
    text = (SRC / "stats.ts").read_text()

    # Parse the main STATS object only.
    stats_obj, rest = extract_object(text, "const STATS: Record<string, MatchStats>")
    if stats_obj is None:
        raise ValueError("STATS object not found")

    stats_entries = {}
    for key, obj in stats_obj.items():
        year, a, b = key.split("_")
        ckey = f"{year}_{min(a, b)}_{max(a, b)}"
        if ckey not in stats_entries:
            if a < b:
                stats_entries[ckey] = obj
            else:
                # Reverse all paired fields so the lower code is team A.
                rev = {}
                for k, v in obj.items():
                    if isinstance(v, list) and len(v) == 2:
                        rev[k] = [v[1], v[0]]
                    else:
                        rev[k] = v
                stats_entries[ckey] = rev

    # Parse the optional POSSESSION_STATS object.
    poss_obj, _ = extract_object(rest, "const POSSESSION_STATS:")
    poss_entries = {}
    if poss_obj:
        for key, val in poss_obj.items():
            year, a, b = key.split("_")
            ckey = f"{year}_{min(a, b)}_{max(a, b)}"
            if ckey not in poss_entries:
                if a < b:
                    poss_entries[ckey] = val
                else:
                    poss_entries[ckey] = {k: [v[1], v[0]] for k, v in val.items()}

    lines = [
        "// Auto-generated from jfjelstul/worldcup dataset — DO NOT EDIT BY HAND.",
        "// Key: `${year}_${teamA}_${teamB}` -> stats oriented [teamA, teamB].",
        "// Canonical orientation only (teams sorted alphabetically); lookup swaps",
        "// the arrays when the requested order is reversed.",
        "",
        "export interface MatchStats {",
        "  cards: [string[], string[]];",
        "  subs: [string[], string[]];",
        "  pens: [string[], string[]];",
        "  possession?: [string, string];",
        "  totalShots?: [number, number];",
        "  fouls?: [number, number];",
        "}",
        "",
        "const STATS: Record<string, MatchStats> = {",
    ]
    for key in sorted(stats_entries):
        lines.append(f'  "{key}": {js_repr(stats_entries[key])},')
    lines += [
        "};",
        "",
    ]
    if poss_entries:
        lines += [
            "const POSSESSION_STATS: Record<string, { possession: [string, string]; totalShots: [number, number]; fouls: [number, number] }> = {",
        ]
        for key in sorted(poss_entries):
            lines.append(f'  "{key}": {js_repr(poss_entries[key])},')
        lines += [
            "};",
            "",
        ]
    lines += [
        "export function getStats(year: number, teamA: string, teamB: string): MatchStats | null {",
        "  const [a, b] = [teamA, teamB].sort();",
        "  const key = `${year}_${a}_${b}`;",
        "  const base = STATS[key];",
        "  if (!base) return null;",
        "  const reversed = teamA !== a;",
    ]
    if poss_entries:
        lines += [
            "  const extras = POSSESSION_STATS[key];",
            "  if (extras) {",
            "    const out: MatchStats = { ...base, ...extras };",
            "    if (reversed) {",
            "      out.possession = [out.possession![1], out.possession![0]];",
            "      out.totalShots = [out.totalShots![1], out.totalShots![0]];",
            "      out.fouls = [out.fouls![1], out.fouls![0]];",
            "    }",
            "    return out;",
            "  }",
        ]
    lines += [
        "  if (!reversed) return base;",
        "  return {",
        "    cards: [base.cards[1], base.cards[0]],",
        "    subs: [base.subs[1], base.subs[0]],",
        "    pens: [base.pens[1], base.pens[0]],",
        "  };",
        "}",
    ]
    (SRC / "stats.ts").write_text("\n".join(lines) + "\n")
    print(f"stats: {len(stats_entries)} canonical entries, {len(poss_entries)} possession entries")


if __name__ == "__main__":
    compact_scorers()
    compact_stats()
