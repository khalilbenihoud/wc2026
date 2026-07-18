#!/usr/bin/env python3
"""Dissolve the 12 admin regions of the simplemaps Morocco SVG into one clean
national outline (Western Sahara included), fitted to the 1024x1024 viewBox used
by <CountryMap>. Writes scripts/data/morocco-map.json, which generate-country-maps.ts
reads as a local override for MAR.

    python3 scripts/dissolve-morocco.py

Source: scripts/data/ma.svg — simplemaps.com (free for commercial use, attribution
appreciated). The region borders are dissolved with shapely (unary_union) because
naive edge-matching fails: the regions don't share exact vertices.

Requires: shapely (python3 -m pip install shapely)
"""
import json
import re
from pathlib import Path

from shapely.geometry import Polygon
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "data" / "ma.svg"
OUT = ROOT / "data" / "morocco-map.json"


def subpaths(d):
    """Parse an SVG path 'd' into a list of point rings (M/L/H/V/Z, abs+rel)."""
    toks = re.findall(r"[A-Za-z]|-?\d*\.?\d+", d)
    x = y = sx = sy = 0.0
    i = 0
    cmd = None
    rings = []
    cur = None

    def num():
        nonlocal i
        v = float(toks[i])
        i += 1
        return v

    while i < len(toks):
        if re.match(r"[A-Za-z]", toks[i]):
            cmd = toks[i]
            i += 1
        c = cmd
        if c in "Mm":
            dx, dy = num(), num()
            x, y = (dx, dy) if c == "M" else (x + dx, y + dy)
            if cur:
                rings.append(cur)
            cur = [(x, y)]
            sx, sy = x, y
            cmd = "L" if c == "M" else "l"
        elif c in "Ll":
            dx, dy = num(), num()
            x, y = (dx, dy) if c == "L" else (x + dx, y + dy)
            cur.append((x, y))
        elif c in "Hh":
            dx = num()
            x = dx if c == "H" else x + dx
            cur.append((x, y))
        elif c in "Vv":
            dy = num()
            y = dy if c == "V" else y + dy
            cur.append((x, y))
        elif c in "Zz":
            x, y = sx, sy
        else:
            i += 1
    if cur:
        rings.append(cur)
    return rings


def main():
    svg = SRC.read_text()
    paths = re.findall(r'<path\b[^>]*\bd="([^"]+)"', svg)

    polys = []
    for p in paths:
        for ring in subpaths(p):
            if len(ring) >= 3:
                poly = Polygon(ring)
                if not poly.is_valid:
                    poly = poly.buffer(0)
                if not poly.is_empty:
                    polys.append(poly)

    # Union all regions, then a tiny open/close to weld sub-pixel gaps where the
    # region borders don't quite meet, so no seams remain inside the outline.
    u = unary_union(polys).buffer(0.3).buffer(-0.3)
    g = u if u.geom_type == "Polygon" else max(u.geoms, key=lambda x: x.area)

    # Drop any specks the buffer left as holes (Morocco has no real enclaves) and
    # lightly simplify to trim vertex count without visibly changing the shape.
    g = Polygon(g.exterior).simplify(0.6, preserve_topology=True)
    coords = list(g.exterior.coords)

    xs = [c[0] for c in coords]
    ys = [c[1] for c in coords]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    w, h = max(xs) - min(xs), max(ys) - min(ys)
    # Fit the larger dimension into a 1000-unit box centred in the 1024 viewBox.
    s = 1000.0 / max(w, h)
    tx, ty = 512 - s * cx, 512 - s * cy

    pts = [(round(x), round(y)) for x, y in coords]
    dedup = [pts[0]]
    for pt in pts[1:]:
        if pt != dedup[-1]:
            dedup.append(pt)
    if dedup[0] == dedup[-1]:
        dedup = dedup[:-1]
    d = "M%d %d" % dedup[0] + "".join("L%d %d" % p for p in dedup[1:]) + "Z"

    out = {
        "transform": "translate(%.4f,%.4f) scale(%.5f)" % (tx, ty, s),
        "paths": [d],
    }
    OUT.write_text(json.dumps(out, indent=2) + "\n")
    print(f"Wrote {OUT} ({len(dedup)} vertices, {len(d)} bytes)")


if __name__ == "__main__":
    main()
