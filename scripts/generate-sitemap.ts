import { TOURNAMENTS } from "../src/data";
import { COUNTRY_PAGE_ENABLED } from "../src/router";
import { COUNTRY_CODES, slugForCode } from "../src/countrySlug";
import { analyze } from "../src/analysis";
import { enumerateMatches } from "../src/matches";
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
  // Per-match detail pages are prerendered (scripts/prerender.ts) for every
  // played knockout match, so advertise those real static pages too.
  const t = TOURNAMENTS[year];
  for (const m of enumerateMatches(t, analyze(t))) {
    if (!m.played) continue;
    urls.push({ loc: `/tournaments/${year}/matches/${m.slug}/`, priority: 0.7, changefreq: "monthly" });
  }
}

// Per-nation country pages are prerendered (scripts/prerender.ts) at their
// full-name slug; advertise the trailing-slash 200 URL, consistent with the
// tournament/match entries above.
if (COUNTRY_PAGE_ENABLED) {
  for (const code of COUNTRY_CODES) {
    const slug = slugForCode(code);
    if (slug) urls.push({ loc: `/countries/${slug}/`, priority: 0.8, changefreq: "monthly" });
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
