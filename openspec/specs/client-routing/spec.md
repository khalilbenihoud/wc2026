# Client Routing Specification

## Purpose
Map browser URLs to application views without a server round-trip, and generate
canonical paths for each route, so the SPA supports deep links, back/forward
navigation, and prerendered static pages.

## Requirements

### Requirement: URL-to-route resolution
The system SHALL resolve the current pathname to one of the known routes: home,
tournament, match, group, country, or player.

#### Scenario: Recognized paths
- **WHEN** the pathname matches a known pattern
- **THEN** it resolves to the corresponding route with parsed parameters:
  - `/tournaments/<year>` → tournament
  - `/tournaments/<year>/matches/<slug>` → match
  - `/tournaments/<year>/group/<letter>` → group
  - `/countries/<name-slug>` → country
  - `/players/<slug>` → player

#### Scenario: Unrecognized path
- **WHEN** the pathname matches no known pattern
- **THEN** it resolves to the home route

#### Scenario: Trailing slashes
- **WHEN** a path has one or more trailing slashes
- **THEN** they are normalized before matching

### Requirement: Programmatic navigation
The system SHALL update the URL and current view via the History API without a
full page reload, and SHALL respond to browser back/forward navigation.

#### Scenario: In-app navigation
- **WHEN** the app navigates to a new path
- **THEN** the History state is pushed, the route updates, and the window scrolls
  to the top

#### Scenario: Back/forward
- **WHEN** the viewer uses the browser back or forward button
- **THEN** the route updates to match the restored URL

### Requirement: Canonical path builders
The system SHALL expose canonical path builders for each route type so links and
metadata are generated consistently.

#### Scenario: Building a country path
- **WHEN** a country path is built for a team code
- **THEN** it uses the full-name slug, falling back to the lowercased code only
  if no slug is available
