## ADDED Requirements

### Requirement: Per-page Open Graph card generation at build time
The build SHALL generate a distinct `1200×630` PNG Open Graph card for every country and every tournament, written to a deterministic path derived from the page's identity (country slug, tournament year).

#### Scenario: Country cards generated
- **WHEN** the build runs
- **THEN** a `1200×630` PNG is produced for each country at `dist/og/countries/<slug>.png`
- **AND** the card shows the country name plus its summary stats (titles, appearances, record)

#### Scenario: Tournament cards generated
- **WHEN** the build runs
- **THEN** a `1200×630` PNG is produced for each tournament at `dist/og/tournaments/<year>.png`
- **AND** the card shows the year, host, and champion (or an in-progress treatment when undecided)

#### Scenario: Generation runs before prerender
- **WHEN** the build pipeline executes
- **THEN** card generation completes after `vite build` and before `prerender`
- **AND** a missing font or failed render fails the build rather than producing a blank card

### Requirement: Prerendered pages reference their own card
`prerender.ts` SHALL inject the page's generated card as an absolute `og:image` and `twitter:image` in that page's static HTML, and SHALL update `og:image:alt` to describe the card.

#### Scenario: Country page metadata
- **WHEN** a country page is prerendered
- **THEN** its static HTML `og:image` and `twitter:image` point at that country's absolute card URL
- **AND** `og:image:alt` describes the country card

#### Scenario: Tournament page metadata
- **WHEN** a tournament page is prerendered
- **THEN** its static HTML `og:image` and `twitter:image` point at that tournament's absolute card URL

### Requirement: Fallback to the generic image
Pages without a generated card SHALL retain the existing generic Open Graph image with no regression.

#### Scenario: Page without a dedicated card
- **WHEN** a page (e.g. the homepage or a per-match page) is prerendered and has no generated card
- **THEN** its `og:image` remains the existing generic image
- **AND** the declared `og:image:width` and `og:image:height` continue to match the served image
