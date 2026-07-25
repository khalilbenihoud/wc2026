## 1. Data & grouping helper

- [x] 1.1 Add a small helper that, from `generateCountryProfiles()`, returns champions ordered by title count and nations bucketed by confederation (with a "Historic" bucket for defunct/unmapped codes), deterministic ordering
- [x] 1.2 Confirm the confederation order constant (UEFA, CONMEBOL, CONCACAF, CAF, AFC, OFC, Historic)

## 2. Routing

- [x] 2.1 Add `^/countries$` → `{ path: "countries" }` in `src/router.ts` (ordered so `/countries/<slug>` still resolves to a country)
- [x] 2.2 Add a `countriesPath` export (`/countries`) for links

## 3. Hub component

- [x] 3.1 Create `src/components/CountriesHub.tsx`: full-screen overlay with intro copy, an honour-roll strip, and confederation groups; each nation a card/link to `countryPath(code)` with a stat line
- [x] 3.2 Style to match the site (dark theme, mono labels, Unbounded headings); keyboard-accessible links and a back/close affordance
- [x] 3.3 Wire into `src/App.tsx`: render the lazy overlay when `route.path === "countries"`, add to `OVERLAY_ROUTES`, and add an idle preload
- [x] 3.4 Add `useSeo` metadata for the client route (title/description/canonical + CollectionPage JSON-LD)

## 4. Prerender & sitemap

- [x] 4.1 Add `buildCountriesHub()` in `scripts/prerender.ts` → `dist/countries/index.html` with hub title/description/canonical, `CollectionPage` + `BreadcrumbList` JSON-LD, and crawlable links to every country page (same grouping as the client)
- [x] 4.2 Call it from prerender's main routine and confirm it does not clobber `dist/countries/<slug>/index.html`
- [x] 4.3 Add `/countries/` to `scripts/generate-sitemap.ts`

## 5. Entry points

- [x] 5.1 Add a link to `/countries` from the homepage (high-authority inbound link)
- [x] 5.2 Prepend a "Countries" crumb to the `Breadcrumb` on country pages (`Home › Countries › <Nation>`)

## 6. OG card

- [x] 6.1 In `scripts/generate-og-images.ts`, render a hub card → `dist/og/countries.png` and bake it via `buildCountriesHub`

## 7. Verification

- [x] 7.1 `tsc --noEmit` clean
- [x] 7.2 `npm run build`; confirm `dist/countries/index.html` exists, links all 71 nations, and `/countries/brazil/` still builds correctly
- [x] 7.3 Confirm `/countries/` is in the sitemap and the hub OG card exists
- [x] 7.4 Dev server: `/countries` shows the hub, `/countries/brazil` shows Brazil, homepage + country breadcrumb link to the hub
