#!/usr/bin/env python3
"""Scrape World Cup goal scorers from Wikipedia for all knockout matches."""

import json, re, sys, urllib.request, urllib.parse, html, time

PAGES = {
    1934: "1934_FIFA_World_Cup_knockout_stage",
    1938: "1938_FIFA_World_Cup_knockout_stage",
    1950: "1950_FIFA_World_Cup_final_round",
    1954: "1954_FIFA_World_Cup_knockout_stage",
    1958: "1958_FIFA_World_Cup_knockout_stage",
    1962: "1962_FIFA_World_Cup_knockout_stage",
    1966: "1966_FIFA_World_Cup_knockout_stage",
    1970: "1970_FIFA_World_Cup_knockout_stage",
    1974: "1974_FIFA_World_Cup_knockout_stage",
    1978: "1978_FIFA_World_Cup_knockout_stage",
    1982: "1982_FIFA_World_Cup_knockout_stage",
    1986: "1986_FIFA_World_Cup_knockout_stage",
    1990: "1990_FIFA_World_Cup_knockout_stage",
    1994: "1994_FIFA_World_Cup_knockout_stage",
    1998: "1998_FIFA_World_Cup_knockout_stage",
    2002: "2002_FIFA_World_Cup_knockout_stage",
    2006: "2006_FIFA_World_Cup_knockout_stage",
    2010: "2010_FIFA_World_Cup_knockout_stage",
    2014: "2014_FIFA_World_Cup_knockout_stage",
    2018: "2018_FIFA_World_Cup_knockout_stage",
    2022: "2022_FIFA_World_Cup_knockout_stage",
}

def fetch_json(params):
    url = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "WorldCupArchive/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())

def parse_goals(html_text):
    home_goals = []
    away_goals = []

    for cls_name, target in [("fhgoal", home_goals), ("fagoal", away_goals)]:
        divs = re.findall(rf'class="{cls_name}">(.*?)</div>', html_text, re.DOTALL)
        for div in divs:
            clean = re.sub(r'<style[^>]*>.*?</style>', '', div, flags=re.DOTALL)
            clean = re.sub(r'<[^>]+>', ' ', clean)
            clean = html.unescape(clean)
            clean = clean.replace("&#32;", " ")

            for line in clean.split('\n'):
                line = line.strip()
                if not line or line.startswith('.') or '{' in line or line.startswith('@'):
                    continue

                # Split on comma for players with multiple goal times
                # e.g. "Mbappé 74', 90+1'"
                parts = re.split(r',\s*(?=\d)', line)
                name = None
                for part in parts:
                    part = part.strip()
                    m = re.match(r'^(.+?)\s+(\d+\+?\d*\')(?:\s*\(.*?\))?$', part)
                    if m:
                        name = m.group(1).strip()
                        minute = m.group(2)
                        target.append(f"{name} {minute}")
                    elif name and re.search(r'\d+\+?\d*\'', part):
                        # This is a second time for the same player
                        m2 = re.match(r'^(\d+\+?\d*\')', part)
                        if m2:
                            target.append(f"{name} {m2.group(1)}")

    return home_goals, away_goals

def scrape_tournament(year):
    page = PAGES.get(year)
    if not page:
        return None

    print(f"  Fetching sections...")
    try:
        sections = fetch_json({
            "action": "parse", "page": page,
            "prop": "sections", "format": "json",
        }).get("parse", {}).get("sections", [])
    except Exception as e:
        print(f"  Failed: {e}")
        return None

    match_sections = []
    for s in sections:
        title = s.get("line", "")
        if (" vs " in title.lower() or " v " in title.lower()) and s.get("level") == "3":
            match_sections.append(s)

    if not match_sections:
        print(f"  No match sections found")
        return None

    print(f"  Found {len(match_sections)} matches")
    results = []

    for s in match_sections:
        idx = s["index"]
        title = s["line"]
        try:
            text = fetch_json({
                "action": "parse", "page": page,
                "prop": "text", "section": idx, "format": "json",
            }).get("parse", {}).get("text", {}).get("*", "")
            home, away = parse_goals(text)
            if home or away:
                results.append({"match": title, "home": home, "away": away})
        except Exception as e:
            print(f"    Error '{title}': {e}")
        time.sleep(0.3)

    return results

def main():
    all_results = {}
    for year in sorted(PAGES.keys()):
        print(f"\n=== {year} ===")
        data = scrape_tournament(year)
        if data:
            all_results[str(year)] = data
        time.sleep(1)

    print("\n\n=== JSON OUTPUT ===")
    print(json.dumps(all_results, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
