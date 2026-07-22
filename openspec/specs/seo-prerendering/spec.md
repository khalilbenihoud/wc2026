# SEO & Prerendering Specification

## Purpose
Make a client-rendered SPA fully indexable: set correct per-route metadata at
runtime, bake real static HTML (title, meta, canonical, Open Graph, JSON-LD, and
crawlable content) for each route at build time, and advertise every page in a
generated sitemap.

## Requirements

### Requirement: Per-route metadata
The system SHALL set the document title, meta description, canonical link, Open
Graph tags, and JSON-LD structured data appropriate to the current route at
runtime.

#### Scenario: Tournament route
- **WHEN** a tournament route is active
- **THEN** the title, description, canonical, and a SportsEvent JSON-LD node for
  that edition are set

#### Scenario: Match route
- **WHEN** a match route is active for a resolvable match
- **THEN** the metadata reflects the specific fixture, score, round, and host

#### Scenario: Home route
- **WHEN** the home route is active
- **THEN** default site-level title, description, and canonical are set

### Requirement: Structured data consistency
The runtime SHALL emit JSON-LD nodes under a single element such that the
client-rendered structured data matches what the prerender bakes in, without
duplicating or diverging.

#### Scenario: Single vs multiple nodes
- **WHEN** one JSON-LD node applies
- **THEN** it is written flat, and when multiple apply they share one context via
  a graph

### Requirement: Build-time prerendering
The build SHALL generate static HTML with real content and correct metadata for
the home page, every tournament, every played knockout match, and every country
page, such that the SPA takes over on mount without a hydration mismatch.

#### Scenario: Prerendered routes exist after build
- **WHEN** the production build runs
- **THEN** static HTML files are written for the home page, each tournament, each
  played knockout match, and each country page

#### Scenario: Client takeover
- **WHEN** a prerendered page loads and the app mounts
- **THEN** the app replaces `#root` without a hydration mismatch

### Requirement: Sitemap generation
The build SHALL generate a sitemap advertising the home page, every tournament,
every played knockout match, and (when enabled) every country page, using the
trailing-slash canonical URLs.

#### Scenario: Generating the sitemap
- **WHEN** the build generates the sitemap
- **THEN** it lists the home, tournament, played-match, and country URLs with
  priorities and change frequencies

### Requirement: Self-hosted fonts
The system SHALL self-host its web fonts rather than loading them from a
third-party CDN, keeping render-blocking third-party font requests off the
critical path.

#### Scenario: Loading fonts
- **WHEN** a page loads
- **THEN** fonts are served from the site's own `public/fonts/` via `@font-face`
  and not from the Google Fonts CDN
