## ADDED Requirements

### Requirement: Mobile tournament grid
The system SHALL render, below the winner hero on the mobile homepage, a two-column grid of tournament cards for every World Cup edition, ordered most-recent first, under a section heading ("World Cup Timeline").

#### Scenario: Grid renders all editions
- **WHEN** the mobile homepage loads
- **THEN** each World Cup edition is shown as a tappable card, newest first, beneath the section heading

#### Scenario: Featured edition excluded
- **WHEN** an edition is already presented in the winner hero
- **THEN** that edition is omitted from the grid to avoid duplication

#### Scenario: Card content is winner-first
- **WHEN** a tournament card renders
- **THEN** it shows the year, the champion's flag and name, and the final score (or "Champions" when no score) — and it does NOT show the host flag

#### Scenario: Undecided edition
- **WHEN** an edition has no champion (seeded / undecided)
- **THEN** the card shows 🔮 with "Upcoming" / "TBD" in place of a champion

#### Scenario: Tapping a card navigates
- **WHEN** a user taps a tournament card
- **THEN** the app navigates to that tournament's page (`/tournaments/<year>`)

### Requirement: Touch targets
Tournament cards SHALL present a tap target of at least 44×44 CSS pixels.

#### Scenario: Minimum tap area
- **WHEN** a user taps a card
- **THEN** the tappable area is at least 44×44px
