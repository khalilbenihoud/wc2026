## ADDED Requirements

### Requirement: Countries hub lists and links every nation
The system SHALL provide a page at `/countries` that lists every World Cup nation and links each one to its country page, grouped for scanning rather than presented as a flat list.

#### Scenario: Every nation is linked
- **WHEN** a visitor opens `/countries`
- **THEN** each World Cup nation appears with a link to its `/countries/<slug>/` page
- **AND** each entry shows brief context (titles won or appearances)

#### Scenario: Grouped presentation
- **WHEN** the hub renders
- **THEN** champions are shown in an honour roll ordered by number of titles
- **AND** all nations are grouped by confederation with a heading per group

### Requirement: Hub route is distinct from country pages
The router SHALL resolve `/countries` to the hub and continue resolving `/countries/<slug>` to the corresponding country page.

#### Scenario: Hub path
- **WHEN** the path is exactly `/countries`
- **THEN** the countries hub is shown

#### Scenario: Country path still works
- **WHEN** the path is `/countries/brazil`
- **THEN** the Brazil country page is shown, not the hub

### Requirement: Hub is prerendered and discoverable
The hub SHALL be prerendered to static HTML with its own metadata and be listed in the sitemap, so crawlers index it and reach every country page through it.

#### Scenario: Prerendered static HTML
- **WHEN** the site is built
- **THEN** `dist/countries/index.html` exists with a hub-specific title, description, canonical `/countries/`, and structured data
- **AND** it contains crawlable links to every country page

#### Scenario: Listed in the sitemap
- **WHEN** the sitemap is generated
- **THEN** it includes the `/countries/` URL

### Requirement: Hub is reachable from key pages
The system SHALL link to the hub from the homepage and from each country page.

#### Scenario: Link from a country page
- **WHEN** a visitor is on a country page
- **THEN** a breadcrumb or link leads to `/countries`

#### Scenario: Link from the homepage
- **WHEN** a visitor is on the homepage
- **THEN** a link leads to `/countries`
