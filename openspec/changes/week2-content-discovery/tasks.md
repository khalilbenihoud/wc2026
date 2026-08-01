## 1. Route and path helpers

- [x] 1.1 Add `/compare/:slugA-vs-:slugB` route matching in `src/router.ts` with slug validation against `SLUG_TO_CODE`
- [x] 1.2 Add `comparePath(codeA, codeB)` helper that alphabetizes codes and returns canonical compare URL
- [x] 1.3 Import `comparePath` into `src/App.tsx` route switch for the new `"compare"` path
- [x] 1.4 Add comparison preloading in the `requestIdleCallback` chain alongside existing CountryRoute/TournamentPage preloads

## 2. Structured data enhancements

- [x] 2.1 Export `faqPage(questions)` builder from `src/schema.ts` generating FAQPage JSON-LD
- [x] 2.2 Export `profilePage(sportsTeamNode, dateCreated, dateModified)` builder from `src/schema.ts`
- [x] 2.3 Export `itemList(items)` builder from `src/schema.ts` generating ItemList JSON-LD
- [x] 2.4 Export `videoObjectForMatch(matchData)` builder from `src/schema.ts` for match pages
- [x] 2.5 Wire FAQPage into `App.tsx` seoMeta for tournament routes using data from `TOURNAMENTS[year]`
- [x] 2.6 Wire ProfilePage into `App.tsx` seoMeta for country routes wrapping the existing SportsTeam schema
- [x] 2.7 Wire ItemList into `App.tsx` seoMeta for the `/countries/` route
- [x] 2.8 Wire VideoObject into `App.tsx` seoMeta for match routes when highlight data is available from `src/highlights.ts`
- [x] 2.9 Update `scripts/prerender.ts` to generate the new structured data in static HTML for all affected routes

## 3. Country comparison page

- [x] 3.1 Create `src/components/ComparePage.tsx` as a lazy-loaded overlay component following the TournamentPage/CountryRoute pattern (fixed inset-0 z-40, back button, breadcrumb, scroll container)
- [x] 3.2 Implement comparison data computation: read COUNTRY_STATS for both codes, find common match history from match enumeration, compute trophy comparison from COUNTRY_PROFILES
- [x] 3.3 Render head-to-head stats card (W/D/L record with win-percentage bar, total goals for/against)
- [x] 3.4 Render trophy comparison (title count side-by-side with trophy emoji and years)
- [x] 3.5 Render tournament meeting timeline (each match: year, round, score, winner highlight, link to match page if played)
- [x] 3.6 Implement canonical ordering: if codes are in non-alphabetical order, `replaceState` to canonical URL and set `<link rel="canonical">`
- [x] 3.7 Handle "no meetings" case: display trophy/stats comparison with a message "No World Cup meetings" and links to both country profiles
- [x] 3.8 Add SEO metadata via a `useMemo` returning title, description, canonical, JSON-LD (matchEvent for each meeting + breadcrumb)
- [x] 3.9 Wire ComparePage into `App.tsx` overlay section with lazy loading and `instant` prop support

## 4. Related content sections

- [ ] 4.1 Create `RelatedSection` component on tournament page: champion country link, runner-up country link (if any), host country link
- [ ] 4.2 Add a "Top rivalries" row to the country page: links to comparison pages for the top 3 rivalries by matches played
- [ ] 4.3 Add a "Recent World Cup" link on country pages: navigates to the country's most recent tournament appearance page
- [ ] 4.4 Add a post-close discovery prompt to `MatchDetailsModal`: shows "See all {year} matches" and "{teamA} vs {teamB} history" links after the modal closes
- [ ] 4.5 Ensure all related content links use `AppLink` (crawlable `<a href>` tags) with proper href attributes

## 5. Sitemap and prerender

- [ ] 5.1 Update `scripts/generate-sitemap.ts` to include all comparison URLs (priority 0.7, monthly changefreq)
- [ ] 5.2 Update `scripts/prerender.ts` to generate static HTML for all comparison pages with crawlable content
- [ ] 5.3 Ensure sitemap XML includes FAQPage-structured tournament URLs and ProfilePage-structured country URLs

## 6. Verification

- [ ] 6.1 Run `npx tsc --noEmit` — zero TypeScript errors
- [ ] 6.2 Run `npm run build` — build completes with comparison pages in dist/, sitemap includes compare URLs
- [ ] 6.3 Manual check: navigate between tournament → country → compare → match overlays with no flash
- [ ] 6.4 Manual check: canonical URL canonicalization works for reverse-ordered compare URLs
- [ ] 6.5 Manual check: view source on tournament, country, compare pages shows the new JSON-LD types
