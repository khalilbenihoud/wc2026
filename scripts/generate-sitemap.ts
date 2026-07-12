import { TOURNAMENTS, TEAMS } from "../src/data";
import { COUNTRY_PAGE_ENABLED } from "../src/router";
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE = "https://worldcuparchive.net";
const today = new Date().toISOString().slice(0, 10);

const urls: { loc: string; priority: number; changefreq: string }[] = [
  { loc: "/", priority: 1.0, changefreq: "weekly" },
];

for (const year of Object.keys(TOURNAMENTS).map(Number)) {
  // Trailing slash matches the 200 URL Netlify serves (pretty_urls 301s the
  // non-slash form), so canonicals/sitemap point at the real page, not a redirect.
  urls.push({ loc: `/tournaments/${year}/`, priority: 0.9, changefreq: "monthly" });

  const t = TOURNAMENTS[year];
  const allCodes = new Set<string>();
  for (const code of t.teams) allCodes.add(code);
  if (t.r32) {
    for (const m of t.r32) {
      allCodes.add(m.ta);
      allCodes.add(m.tb);
    }
  }

  if (t.r32) {
    for (const m of t.r32) {
      if (m.ta !== "TBD" && m.tb !== "TBD") {
        const slug = `${m.ta.toLowerCase()}-vs-${m.tb.toLowerCase()}`;
        urls.push({ loc: `/tournaments/${year}/matches/${slug}`, priority: 0.6, changefreq: "monthly" });
      }
    }
  }
}

const allCodes = new Set<string>();
for (const year of Object.keys(TOURNAMENTS).map(Number)) {
  const t = TOURNAMENTS[year];
  for (const code of t.teams) {
    if (code !== "TBD" && TEAMS[code]) allCodes.add(code);
  }
  if (t.r32) {
    for (const m of t.r32) {
      if (m.ta !== "TBD" && TEAMS[m.ta]) allCodes.add(m.ta);
      if (m.tb !== "TBD" && TEAMS[m.tb]) allCodes.add(m.tb);
    }
  }
}

// Country pages are disabled for now — keep their URLs out of the sitemap so we
// don't advertise routes that redirect back to the home bracket.
if (COUNTRY_PAGE_ENABLED) {
  for (const code of allCodes) {
    urls.push({ loc: `/countries/${code.toLowerCase()}`, priority: 0.8, changefreq: "monthly" });
  }
}

urls.sort((a, b) => b.priority - a.priority || a.loc.localeCompare(b.loc));

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(
    (u) =>
      `  <url>\n    <loc>${BASE}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority.toFixed(1)}</priority>\n  </url>`
  ),
  "</urlset>",
].join("\n");

const outPath = resolve(process.cwd(), "public", "sitemap.xml");
writeFileSync(outPath, xml + "\n");
console.log(`Sitemap: ${urls.length} URLs → ${outPath}`);
