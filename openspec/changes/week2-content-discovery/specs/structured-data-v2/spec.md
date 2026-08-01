## ADDED Requirements

### Requirement: FAQPage schema on tournament pages
The system SHALL emit `FAQPage` structured data on every tournament page, containing 3-5 question/answer pairs about that tournament (winner, top scorer, host, notable facts). Each Q&A MUST use the `Question`/`Answer` schema types. The JSON-LD MUST be injected via the existing `useSeo` hook's JSON-LD mechanism.

#### Scenario: Tournament page with winner
- **WHEN** the 1998 tournament page loads
- **THEN** the JSON-LD includes an `FAQPage` with at minimum: "Who won the 1998 FIFA World Cup?" (Answer: France), "Who was the top scorer?" (Answer: Davor Šuker with 6 goals), and "Where was it held?" (Answer: France)

#### Scenario: Future tournament with no results
- **WHEN** the 2026 tournament page loads (no winner yet)
- **THEN** the FAQPage includes questions about host, participating teams count, and format but omits winner/scorer questions

### Requirement: ProfilePage schema on country pages
The system SHALL emit `ProfilePage` structured data on every country page, wrapping the existing `SportsTeam` schema with `mainEntity` and adding `dateCreated`/`dateModified` metadata. The JSON-LD MUST use the `@graph` array pattern consistent with the existing JSON-LD emission.

#### Scenario: Country page with profile schema
- **WHEN** the Brazil country page loads
- **THEN** the JSON-LD `@graph` includes a `ProfilePage` node with `mainEntity` referencing the `SportsTeam` node, and `dateCreated`/`dateModified` reflecting the site's build date

### Requirement: ItemList schema on countries hub
The system SHALL emit `ItemList` structured data on the `/countries/` hub page, listing each country as a `ListItem` with `position`, `url`, and `name`. The list MUST be grouped by confederation sections matching the visual layout.

#### Scenario: Countries hub item list
- **WHEN** the /countries/ page loads
- **THEN** the JSON-LD includes an `ItemList` with 71 items, each having a `url` pointing to the country page and a `name` matching the country display name

### Requirement: VideoObject schema on match pages
The system SHALL emit `VideoObject` structured data on match detail pages when YouTube highlight video IDs are available from `src/highlights.ts`. The `VideoObject` MUST include `thumbnailUrl`, `embedUrl`, `uploadDate`, and `description`.

#### Scenario: Match page with highlight video
- **WHEN** the France vs Croatia 2018 final match page loads
- **THEN** the JSON-LD includes a `VideoObject` with `embedUrl` pointing to the YouTube embed and `description` naming the teams and tournament

### Requirement: Schema data is baked into prerendered HTML
All new structured data types SHALL be included in the static HTML output from `scripts/prerender.ts`, ensuring search engines discover them without executing JavaScript. The prerender script MUST call the same schema builder functions used at runtime.

#### Scenario: Prerendered tournament page contains FAQPage
- **WHEN** `npm run build` completes
- **THEN** `dist/tournaments/1998/index.html` contains `<script type="application/ld+json">` with FAQPage data
