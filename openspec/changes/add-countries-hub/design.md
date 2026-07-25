## Context

Routing is a hand-rolled matcher in `src/router.ts`: `matchRoute(pathname)` returns `{ path, params }`, `App.tsx` renders a full-screen lazy overlay per `route.path` (e.g. `CountryRoute` for `country`, `TournamentPage` for `tournament`). SEO/crawlability comes from `scripts/prerender.ts`, which writes real static HTML per route into `dist/**/index.html` with per-page title/description/canonical/JSON-LD; `scripts/generate-sitemap.ts` lists every URL. Country data is `generateCountryProfiles()` (name, code, titles[], appearances, firstAppearance, confederation via `CONFEDERATION_MAP`, bestResult, epithet); `slugForCode`/`countryPath` map codes to `/countries/<slug>`. There is currently no `/countries` index — country pages are reached only through tournament nation lists.

## Goals / Non-Goals

**Goals:**
- One authoritative page linking all 71 country pages, prerendered and in the sitemap.
- A scannable, grouped layout (roll of honour + by confederation) with descriptive anchor context — not a link dump.
- Reachable from the homepage and from country pages.

**Non-Goals:**
- A records/all-time hub (champions table, all-time scorers) — separate future change.
- Filtering/search/sorting UI on the hub (static grouping only for v1).
- Changing how individual country pages render.

## Decisions

### D1: New `route.path === "countries"`, rendered as a lazy overlay
Add `matchRoute` rule `^/countries$` → `{ path: "countries" }`, ordered so it does not collide with the existing `^/countries/<slug>$` country rule. Render `CountriesHub` in `App.tsx` as a `Suspense` overlay, mirroring `CountryRoute` (code-split so the homepage bundle is unaffected).
- **Alternative**: a top-level non-overlay page — rejected; the site's whole UX is overlay-based and prerender already targets `#root`.

### D2: Layout — roll of honour + confederation groups
Top: champions ordered by title count (5× → 1×) as a highlighted strip. Below: all nations grouped by confederation (UEFA, CONMEBOL, CONCACAF, CAF, AFC, OFC), alphabetical within each group. Each nation is a card/link showing name + a stat line (`N× champions` or `N appearances`), reusing the copy the OG generator already derives.
- **Why**: Confederation is the most natural browse structure and adds keyword-relevant sub-headings; the honour roll gives editorial pull and internal links to the most important pages first.
- **Alternative**: group by titles tier only — less complete for a "all nations" page; or a flat A–Z — scannable but flat for SEO. Confederation + honour roll gives both.

### D3: Prerender `buildCountriesHub()` → `dist/countries/index.html`
Mirror `buildCountry`/`buildHome`: unique title (`World Cup Nations — All 71 Teams …`), description, canonical `/countries/`, `CollectionPage` + `BreadcrumbList` JSON-LD, and crawlable `<a>` links to every `/countries/<slug>/`. Writes to `dist/countries/index.html` (no conflict with `dist/countries/<slug>/index.html`). Reuse `render()` and pass the hub's OG image.
- **Note**: prerender must emit the same grouped link list the client renders, so pre-hydration HTML and the React render agree.

### D4: Entry points
Homepage: a link/button into `/countries`. Country page: prepend a "Countries" crumb to the existing `Breadcrumb` (`Home › Countries › <Nation>`), which also strengthens the hub's inbound links from all 71 pages.

### D5: OG card for the hub
Reuse `scripts/generate-og-images.ts`: render one hub card (e.g. label `WORLD CUP NATIONS`, name `71 Teams`, subline `Every nation, 1930–2026`, pitch background, no single silhouette) to `dist/og/countries.png`, and bake it via `buildCountriesHub`.

## Risks / Trade-offs

- **Route collision** between `/countries` and `/countries/<slug>` → Mitigation: exact `^/countries$` match; add a test-worthy assertion that `/countries` resolves to the hub and `/countries/brazil` still resolves to the country.
- **Prerender/client divergence** (grouped list must match) → Mitigation: derive both from the same profiles + grouping helper; keep ordering deterministic (confederation order constant, alphabetical within).
- **Confederation data gaps** (`CONFEDERATION_MAP[code] || "Unknown"`) → Mitigation: an "Other/Historic" bucket catches unmapped or defunct codes (URS, FRG, etc.) so no nation is dropped.

## Open Questions

- Should defunct nations (Soviet Union, West Germany, Yugoslavia, Zaire…) sit in their historic confederation or a dedicated "Historic nations" group? (Leaning: historic group, clearly labelled.)
- Homepage entry point placement — header nav vs. a footer/section link? (Leaning: a small header/nav link so it's on the highest-authority page.)
