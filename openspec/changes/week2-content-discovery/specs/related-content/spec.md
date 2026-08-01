## ADDED Requirements

### Requirement: Tournament page shows champion and runner-up country links
The tournament page SHALL include a "Related" section below the results that links to the champion's country profile, the runner-up's country profile, and the host nation's country profile. Each link MUST use `AppLink` (crawlable `<a href>` tag).

#### Scenario: Completed tournament with champion
- **WHEN** a user views the 1998 tournament page
- **THEN** a "Related" section appears with links to France (champion), Brazil (runner-up), and France (host)

#### Scenario: Future tournament with no champion
- **WHEN** a user views the 2026 tournament page (no champion yet)
- **THEN** a "Related" section appears with a link to the host nation's country profile but no champion/runner-up links

### Requirement: Country page shows related rivalries and tournaments
The country page SHALL include a "Related" section linking to the country's top 3 rivalries (comparison pages) and the country's most recent tournament appearance. Links MUST be crawlable `<a href>` tags.

#### Scenario: Country with rivalries
- **WHEN** a user views the Brazil country page
- **THEN** a "Related" section shows links to Argentina, Germany, and Italy comparison pages, plus a link to Brazil's latest World Cup appearance

#### Scenario: Country with no rivalries
- **WHEN** a user views a country with no recorded World Cup rivalries
- **THEN** the rivalry portion of the "Related" section is omitted; only tournament links remain

### Requirement: Match modal shows related content after close
The match details modal SHALL, after the user closes it, trigger a subtle prompt at the top of the bracket showing "See all {year} matches" and "{teamA} vs {teamB} rivalry history" links.

#### Scenario: Match modal close shows discovery prompt
- **WHEN** a user closes a match details modal for Brazil vs Germany 2014
- **THEN** a non-intrusive prompt appears offering links to the 2014 tournament page and the Brazil vs Germany comparison page

### Requirement: Related content links render as real anchor tags
All related-content cross-links SHALL render as semantic `<a href>` elements with proper `href` attributes, enabling search engine crawling and browser accessibility (right-click, open in new tab, hover preview).

#### Scenario: Crawler discovers country page from tournament page
- **WHEN** a search engine crawler follows links from a tournament page
- **THEN** it discovers and follows `<a href="/countries/brazil/">` and `<a href="/compare/brazil-vs-germany/">` links
