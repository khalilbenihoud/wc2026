# Tournament Timeline Specification

## Purpose
Let the viewer move through every World Cup edition from 1930 to the live 2026
tournament, showing each edition's champion and host, and driving which
tournament the bracket displays. Includes the animated splash intro shown on
first load of the home page.

## Requirements

### Requirement: Edition navigation
The system SHALL present every tournament edition it has data for as a
selectable timeline, and SHALL update the displayed bracket to the selected
edition.

#### Scenario: Selecting an edition
- **WHEN** the viewer selects a year from the timeline
- **THEN** the active year updates and the bracket, header metadata, and awards
  re-render for that edition

#### Scenario: Default edition
- **WHEN** the home page loads with no specific tournament in the URL
- **THEN** the most recent edition (2026) is shown by default

### Requirement: Edition summary in the timeline
The system SHALL show, for each edition in the timeline, at least the year, the
host, and the champion's flag (where a champion has been decided).

#### Scenario: Displaying a decided edition
- **WHEN** an edition with a known champion is listed
- **THEN** its champion flag and host are shown alongside the year

### Requirement: Responsive timeline placement
The system SHALL render the timeline as a sidebar rail on desktop and as a fixed
bottom picker on phones.

#### Scenario: Desktop layout
- **WHEN** the app is viewed on desktop
- **THEN** the timeline appears in the left sidebar rail

#### Scenario: Mobile layout
- **WHEN** the app is viewed on a phone
- **THEN** a fixed bottom tournament picker is shown

### Requirement: Splash intro
The system SHALL show an animated splash screen with a year counter when the home
page is opened, and SHALL not show it again for the rest of the browser session
once dismissed.

#### Scenario: First visit in a session
- **WHEN** the home page opens and the splash has not been dismissed this session
- **THEN** the splash is shown and can be dismissed to enter the app

#### Scenario: Returning within the session
- **WHEN** the splash was already dismissed this session, or the entry URL is not
  the home page
- **THEN** the splash is skipped

#### Scenario: Reduced motion
- **WHEN** the viewer prefers reduced motion
- **THEN** the splash animation is suppressed or minimized accordingly
