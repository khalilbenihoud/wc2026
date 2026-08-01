## Why

The site has extensive data (71 countries, 22 tournaments, hundreds of matches with stats and rivalries) but no cross-linked editorial content that search engines can index. Deep pages are siloed — a user on a tournament page has no path to explore rivalries, and a country page doesn't surface head-to-head history. Google accounts for only 7 organic clicks in 30 days because there are too few entry points and no high-intent comparison pages. Week 2 builds the bridge from data to discovery.

## What Changes

- **Country comparison pages**: New `/compare/{a}-vs-{b}/` routes auto-generated from existing rivalry data (`countryStats.generated.ts`), showing head-to-head records, tournament meeting history, trophy comparisons, and links to both country profiles
- **Related content sections**: Tournament pages, country pages, and match modals each get cross-links to sibling pages (prev/next tournament, champion's country profile, rival nations, related matches)
- **Structured data enhancements**: `FAQPage` on tournament pages, `ProfilePage` on country pages, `ItemList` on the countries hub — targeting rich result eligibility
- **Sitemap expansion**: New `/compare/` and updated country/tournament sitemap entries

## Capabilities

### New Capabilities
- `country-comparison`: Head-to-head rivalry pages between any two nations, auto-generated from existing data with slugged URLs, crawlable content, and OG metadata
- `related-content`: Cross-linking sections appended to tournament, country, and match pages that surface discovery paths to sibling content
- `structured-data-v2`: Additional Schema.org types (FAQPage, ProfilePage, ItemList) layered onto existing routes for rich result eligibility in Google SERPs

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- **Routes**: New `/compare/:slugA-vs-:slugB` route in `src/router.ts`; new lazy-loaded ComparePage component; new compare path helpers
- **Components**: `TournamentPage.tsx` (related section), `CountryRoute.tsx` / `CountryPage.tsx` (related section), `MatchDetailsModal.tsx` (related section), `CountriesHub.tsx` (ItemList schema)
- **Data**: `src/schema.ts` (export FAQPage, ProfilePage, ItemList builders), `src/countryStats.generated.ts` (consumed for rivalry data, no changes needed)
- **Sitemap**: `scripts/generate-sitemap.ts` (add `/compare/` URLs, add FAQPage-structured entries)
- **Prerender**: `scripts/prerender.ts` (add compare pages to static HTML generation)
