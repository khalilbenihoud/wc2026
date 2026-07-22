## ADDED Requirements

### Requirement: Mobile winner hero
The system SHALL display a winner hero card at the top of the mobile homepage for the live / most-recent edition, funneling into that edition's tournament page.

#### Scenario: Hero renders for a decided edition
- **WHEN** the mobile homepage loads and the featured edition has a champion
- **THEN** a hero card shows the champion's flag and name, an oversized "CHAMPIONS" wordmark, and the year with "World Champions"

#### Scenario: Tapping the hero
- **WHEN** a user taps the winner hero
- **THEN** the app navigates to that edition's tournament page (`/tournaments/<year>`)

#### Scenario: Undecided or upcoming edition
- **WHEN** the featured edition has no champion yet (seeded / undecided)
- **THEN** the hero shows an "Upcoming" state (🔮 and "<year> World Cup") instead of a champion

### Requirement: Hero is mobile-only
The winner hero SHALL render only on mobile viewports; desktop continues to show the radial bracket.

#### Scenario: Hidden on desktop
- **WHEN** the viewport is desktop width (> 767px)
- **THEN** the winner hero is not rendered and the radial bracket is shown instead
