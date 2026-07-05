#!/usr/bin/env python3
"""Download golden-boot player photos from Wikipedia into public/golden-boot/
so they ship with the app (no runtime fetch). Prints the year -> path mapping
to paste into data.ts. Run once; re-run to refresh."""

import json, os, re, time, urllib.request, urllib.parse

ROOT = "/Users/khalilbenihoud/conductor/workspaces/wc2026/riyadh"
OUT = f"{ROOT}/public/golden-boot"
os.makedirs(OUT, exist_ok=True)

# Wikipedia page-slug overrides (disambiguation / special chars / "A / B" ties).
OVERRIDE = {
    "Ronaldo": "Ronaldo_Nazário",
    "Hristo Stoichkov / Oleg Salenko": "Hristo_Stoichkov",
    "Leônidas": "Leônidas_da_Silva",
}

UA = {"User-Agent": "wc2026-archive/1.0 (bundling golden boot photos)"}

def fetch(url):
    """GET with retry/backoff on 429."""
    for attempt in range(6):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(2 * (attempt + 1))
                continue
            raise
    raise RuntimeError(f"gave up on {url}")

content = open(f"{ROOT}/src/data.ts").read()
# year -> golden boot name (skip null)
pairs = re.findall(r'^  (\d{4}): \{.*?goldenBoot: \{ name: "([^"]+)"', content, re.S | re.M)

UA = {"User-Agent": "wc2026-archive/1.0 (bundling golden boot photos)"}
mapping = {}
for year, name in pairs:
    slug = OVERRIDE.get(name) or name.split("/")[0].split(" (")[0].strip()
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(slug)}"
    req = urllib.request.Request(url, headers=UA)
    data = json.load(urllib.request.urlopen(req))
    src = (data.get("thumbnail") or {}).get("source")
    if not src:
        print(f"!! {year} {name}: no thumbnail")
        continue
    ext = ".png" if ".png" in src.lower() else ".jpg"
    dest = f"{OUT}/{year}{ext}"
    with urllib.request.urlopen(urllib.request.Request(src, headers=UA)) as resp:
        open(dest, "wb").write(resp.read())
    size = os.path.getsize(dest)
    mapping[year] = (f"/golden-boot/{year}{ext}", name, size)
    print(f"{year}  {name:32}  {size//1024:4}KB  {src.split('/')[-1][:40]}")

print("\n// data.ts photo paths:")
for y, (path, name, _) in mapping.items():
    print(f'{y}: "{path}"  // {name}')
