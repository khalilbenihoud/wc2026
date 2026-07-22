# Champions Wall Specification

## Purpose
Offer an at-a-glance overview of every World Cup champion — an overlay listing
winning nations with their number of titles (shown as stars) reachable from the
home page and other surfaces.

## Requirements

### Requirement: Champions overview overlay
The system SHALL provide an overlay that lists World Cup champion nations, each
with its number of titles.

#### Scenario: Opening the champions wall
- **WHEN** the viewer activates the champions trigger
- **THEN** an overlay opens listing champion nations with their title counts

#### Scenario: Closing the champions wall
- **WHEN** the viewer closes the overlay
- **THEN** the overlay dismisses and returns to the underlying view

### Requirement: Title-count indication
The champions wall SHALL indicate each nation's number of championships (e.g. as
a star rating).

#### Scenario: Multi-title nation
- **WHEN** a nation with multiple championships is listed
- **THEN** its title count is shown (one filled star per title)

### Requirement: Navigating to a nation
The system SHALL let the viewer navigate from a champion entry to that nation's
profile when country pages are enabled.

#### Scenario: Selecting a champion
- **WHEN** the viewer selects a nation on the champions wall
- **THEN** that nation's country profile is opened
