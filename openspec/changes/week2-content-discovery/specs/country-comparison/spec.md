## ADDED Requirements

### Requirement: Country comparison page URL routing
The system SHALL serve a country comparison page at `/compare/{slugA}-vs-{slugB}/` where both slugs are valid country codes. The route parser in `router.ts` MUST resolve both slugs against the country slug registry and map the match to a `"compare"` route with both country codes as params.

#### Scenario: Valid comparison URL
- **WHEN** the URL path is `/compare/brazil-vs-argentina/`
- **THEN** the router resolves to `{ path: "compare", params: { codeA: "BRA", codeB: "ARG" } }`

#### Scenario: Invalid slug redirects to 404
- **WHEN** the URL path is `/compare/brazil-vs-nonexistent/`
- **THEN** the router falls through to the `"home"` path and the page shows a 404 overlay

### Requirement: Comparison page renders head-to-head data
The system SHALL render a comparison page displaying: the head-to-head World Cup record (wins, draws, losses), a timeline of all tournament meetings with scores and rounds, a trophy count comparison, and links to both country profile pages. All data MUST be sourced from `src/countryStats.generated.ts` and `src/data.ts`.

#### Scenario: Two countries with rivalry history
- **WHEN** a user views the Brazil vs Argentina comparison page
- **THEN** the page displays 4+ tournament meetings with scores, the overall W/D/L record, and trophy counts (5 vs 3)

#### Scenario: Two countries with no World Cup meetings
- **WHEN** a user views a comparison between two countries that have never met in a World Cup
- **THEN** the page displays "No World Cup meetings" with trophy/stats comparison, but still links to both country profiles

### Requirement: Comparison page SEO metadata
The system SHALL set the page `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta property="og:*">`, and `<script type="application/ld+json">` for every comparison page. The title MUST follow the format: `{TeamA} vs {TeamB} World Cup Record · Head-to-Head History`.

#### Scenario: Comparison page metadata
- **WHEN** the comparison page for Brazil vs Germany loads
- **THEN** `<title>` is "Brazil vs Germany World Cup Record · Head-to-Head History" and JSON-LD includes a `SportsEvent` with both teams

### Requirement: Comparison pages are prerendered and indexed
The system SHALL generate static HTML for every valid rivalry pair at build time via `scripts/prerender.ts`, and SHALL include all comparison URLs in `public/sitemap.xml` with priority 0.7 and fortnightly changefreq.

#### Scenario: Build-time prerender
- **WHEN** `npm run build` completes
- **THEN** `dist/compare/brazil-vs-argentina/index.html` exists with full crawlable content and meta tags

### Requirement: Comparison page lazy loading with overlay transition
The comparison page component SHALL be code-split via `React.lazy()` and rendered as a full-screen overlay (`fixed inset-0 z-40`), consistent with the existing tournament/country overlay pattern. It MUST support the `instant` prop to skip fade-in when navigating from another overlay.

#### Scenario: Navigate to comparison from country page
- **WHEN** a user clicks a rivalry link on a country profile page
- **THEN** the comparison overlay appears instantly without flashing the home bracket
