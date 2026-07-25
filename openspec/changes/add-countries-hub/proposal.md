## Why

The 71 country pages are only reachable by first landing on a tournament page and finding a nation in its list — there is no single page that links them all, and no page that answers broad "head" queries like *"all World Cup teams"*, *"World Cup winners list"*, or *"most World Cup titles"*. This leaves the country cluster semi-orphaned for crawlers and gives users no browse-by-nation entry point. A **countries hub** fixes both: it de-orphans all 71 pages with direct links from one authoritative page, concentrates internal-link equity, targets high-volume evergreen queries, and gives visitors somewhere to explore.

## What Changes

- Add a new **`/countries` hub page** listing all 71 World Cup nations.
  - A "roll of honour" strip at the top: champions ordered by number of titles.
  - All nations grouped by **confederation** (UEFA, CONMEBOL, CONCACAF, CAF, AFC, OFC), each as a card with descriptive context (titles · appearances) linking to its country page.
  - Unique intro copy framing the topic (not a bare link list).
- Add routing: `/countries` resolves to the hub (distinct from `/countries/<slug>`).
- **Prerender** the hub to static HTML (`dist/countries/index.html`) with its own title/description/canonical + `CollectionPage`/`BreadcrumbList` JSON-LD, matching how tournament/country pages are prerendered.
- Add `/countries/` to the sitemap.
- Add entry points to the hub: a link from the homepage and a "Countries" breadcrumb crumb on each country page.
- Generate an OG card for the hub (reusing the existing build-time generator).

## Capabilities

### New Capabilities
- `countries-hub`: A browsable index page at `/countries` that lists and links every World Cup nation, grouped for scanning, prerendered for search, and reachable from the homepage and country pages.

### Modified Capabilities
<!-- None: no existing OpenSpec specs change their requirements. -->

## Impact

- **New code**: `src/components/CountriesHub.tsx` (lazy overlay, mirrors `CountryRoute`); a `buildCountriesHub()` in `scripts/prerender.ts`.
- **Modified code**: `src/router.ts` (`/countries` route), `src/App.tsx` (render the overlay + preload), `scripts/generate-sitemap.ts` (add URL), `scripts/generate-og-images.ts` (hub card), plus a homepage link and country-page breadcrumb.
- **No new dependencies.** Reuses existing country profiles (`generateCountryProfiles`), `countryPath`/`slugForCode`, and the OG generator.
- **SEO**: new internal-linking hub → better crawl coverage of the 71 country pages and a new ranking target for broad nation/winners queries.
