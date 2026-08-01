## Context

The site already has rich data for every country (record, scorers, rivalries) in `src/countryStats.generated.ts` and `src/countries.generated.ts`. The rivalry data (`profile.rivalries`) includes opponent codes with W/D/L records. The site uses a custom hash-free SPA router, lazy-loaded overlay components, and prerendered static HTML at build time. Existing design patterns: `AppLink` for crawlable links, `useSeo` for runtime meta, `scripts/prerender.ts` for static HTML, `scripts/generate-sitemap.ts` for sitemap generation.

## Goals / Non-Goals

**Goals:**
- Add `/compare/A-vs-B/` routes auto-generated from rivalry data, each rendering a full comparison page with head-to-head stats, tournament meeting history, trophy comparison, and links to both country profiles
- Add "Related" cross-linking sections to tournament pages, country pages, and match modals that surface discovery paths using existing `AppLink` pattern
- Add `FAQPage`, `ProfilePage`, `ItemList`, and `VideoObject` structured data to existing routes
- Prerender all new comparison pages as static HTML for search engine indexation
- Include comparison URLs in sitemap

**Non-Goals:**
- A dynamic search bar (deferred to a future change)
- User-generated content or comments
- New external dependencies
- Changes to the data pipeline (`countryStats.generated.ts`, `countries.generated.ts`) — all needed data already exists
- Player comparison pages (only country-vs-country)
- Group stage match data (comparison pages use knockout data already present; group stage is future work)

## Decisions

### Decision 1: Single compare route with `vs` separator
**Choice:** `/compare/{slugA}-vs-{slugB}/` as one unified route matched by a single regex in `router.ts`.

**Alternatives considered:**
- `/compare/{slugA}/{slugB}/` — cleaner but ambiguous with country paths and harder to parse from the existing router pattern
- `/head-to-head/{slugA}-{slugB}` — separate URL namespace adds complexity without SEO benefit

**Rationale:** The `-vs-` separator is unambiguous, human-readable, matches the match slug pattern (`brazil-vs-germany`), and works with a single regex: `/^\/compare\/(.+)-vs-(.+)$/`. Both slugs are validated against the `SLUG_TO_CODE` map and route falls to `"home"` on invalid slugs.

### Decision 2: Comparison data computed at render time from existing sources
**Choice:** The `ComparePage` component reads both countries' `CountryStats` and `CountryProfile` from existing modules, cross-references their match history from `src/matches.ts` (which enumerates all knockout matches), and computes the comparison inline.

**Alternatives considered:**
- Pre-generate a `comparisons.generated.ts` — adds a build step, creates ~2,500 static entries, most of which are empty/no-meeting pages. Not worth the binary size.
- Server-side endpoint — no backend exists.

**Rationale:** `COUNTRY_STATS` and `COUNTRY_PROFILES` are already in-memory at import time. Computing a comparison takes O(matches) per render, which is negligible (max ~300 knockout matches to scan). The compute-at-render approach keeps the bundle small and creates zero new data files.

### Decision 3: Comparison page slug is order-independent but canonicalized
**Choice:** Both `compare/brazil-vs-argentina/` and `compare/argentina-vs-brazil/` render the same page, but the canonical URL alphabetizes the slugs: `compare/argentina-vs-brazil/`. The reverse order redirects via `window.history.replaceState` + canonical tag.

**Alternatives considered:**
- 301 redirect on reverse order — requires Netlify redirect rules for every pair. Not viable at scale.
- Only one order works, other is 404 — poor UX for users who type the URL.

**Rationale:** `replaceState` + canonical tag provides a soft redirect that search engines respect (via `<link rel="canonical">`) and users don't notice. No build-time or server config needed.

### Decision 4: Related content sections reuse existing `AppLink` and layout patterns
**Choice:** Each "Related" section is a small component appended to the bottom of existing page components (`TournamentPage`, `CountryPage`, `MatchDetailsModal`) using the same grey panel borders and hover-gold interaction as the rest of the UI.

**Alternatives considered:**
- A separate "discovery bar" at page bottom — adds yet another layout pattern to maintain.
- Popovers/tooltips on hover — not crawlable.

**Rationale:** Consistency with the existing UI language (pill buttons in TournamentPage, card grid in CountriesHub) reduces cognitive load and keeps the CSS footprint small.

### Decision 5: Structured data builders added to `src/schema.ts` with the same pattern as existing builders
**Choice:** Export `faqPage()`, `profilePage()`, `itemList()` builder functions from `src/schema.ts` following the existing `tournamentEvent()`, `matchEvent()` pattern. They return plain objects that the `useSeo` hook serializes as JSON-LD.

**Rationale:** Keeps all schema logic in one file, uses the same JSON-LD `@graph` array pattern already established, and is consumed identically by both runtime (`useSeo`) and build-time (`prerender.ts`).

### Decision 6: Comparison pages use the same lazy-load overlay pattern as tournaments/countries
**Choice:** `ComparePage` is code-split via `lazy(() => import(...))`, rendered as `fixed inset-0 z-40` overlay, preloaded in the same `requestIdleCallback` chain as other overlays.

**Rationale:** Consistent UX, avoids shipping comparison code to the homepage bundle, and the overlay-z-40 stack already handles the overlay-to-overlay transition without flashing.

## Risks / Trade-offs

- **[Risk] Large number of comparison URLs (~2,500 pairs)** → Only pairings with actual head-to-head history (~300) get full prerendered HTML; the rest get a lightweight "No meetings" template. Sitemap includes all pairs. Prerender time increases by ~5s per build.
- **[Risk] Order-independent routing may confuse bots** → The canonical URL is always alphabetized, and the `<link rel="canonical">` tag points to the canonical form. Search engines consolidate signals to the canonical.
- **[Trade-off] FAQPage content is templated, not editorial** → FAQ answers are generated from data (e.g., "Who won X?" → champion name). This is less compelling than editorial content but requires zero ongoing maintenance and covers high-volume "who won" queries.
- **[Risk] Related content adds visual weight to already-dense pages** → Sections are collapsible by design: each "Related" block is a single small card row, not a full-width takeover. Can be A/B tested for engagement impact.
