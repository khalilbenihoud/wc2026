# Country Profiles Specification

## Purpose
Provide a per-nation World Cup history page at `/countries/<name-slug>`, showing
a country's record, championships, top scorers, tournament-by-tournament
results, rivalries, and highlight videos — generated from real datasets and
prerendered for search.

## Requirements

### Requirement: Country page route
The system SHALL render a nation's profile when the URL matches
`/countries/<name-slug>` for a slug that resolves to a known team code, when
country pages are enabled.

#### Scenario: Valid country slug
- **WHEN** the viewer navigates to `/countries/<name-slug>` for a known nation
- **THEN** that nation's profile page is displayed

#### Scenario: Legacy hash URL
- **WHEN** a legacy `#/country/<CODE>` hash URL is opened
- **THEN** it is rewritten to the canonical `/countries/<name-slug>` path

#### Scenario: Country pages disabled
- **WHEN** country pages are disabled (`COUNTRY_PAGE_ENABLED` is false)
- **THEN** any country URL redirects to the home page instead of a blank page

### Requirement: Country profile content
A country profile SHALL present the nation's name, epithet, number of
appearances and first appearance, championships (or best result when none), top
scorers, rivalries, and available highlight videos.

#### Scenario: Nation with titles
- **WHEN** a nation with one or more championships is shown
- **THEN** its titles (with final results), appearances, top scorers, and
  rivalries are displayed

#### Scenario: Nation without titles
- **WHEN** a nation has no championship
- **THEN** its best result is shown in place of a titles list

### Requirement: Generated profiles with overrides
The system SHALL derive country profiles from the tournament and stats datasets,
allowing curated overrides (editorial epithet, milestones, videos, and
special-case nations) to be merged over the generated data.

#### Scenario: Applying an override
- **WHEN** a nation has a curated override
- **THEN** the override fields are merged over the generated profile for that
  nation
