# Tournament Page Specification

## Purpose
Provide a full, crawlable page for a single tournament edition at
`/tournaments/<year>`, summarizing the host, champion, golden boot, and the
complete knockout results and participating nations — the primary landing
surface for edition-level search queries.

## Requirements

### Requirement: Per-tournament page route
The system SHALL render a dedicated page for a tournament edition when the URL
matches `/tournaments/<year>` for a year that has data.

#### Scenario: Valid tournament year
- **WHEN** the viewer navigates to `/tournaments/<year>` for a known edition
- **THEN** the tournament page for that edition is displayed over the app

#### Scenario: Unknown tournament year
- **WHEN** the year has no data
- **THEN** the viewer is redirected to the home page

### Requirement: Tournament summary content
The tournament page SHALL show the edition's host, champion, golden boot winner,
and its knockout results and participating nations.

#### Scenario: Displaying a completed edition
- **WHEN** a completed edition's page is shown
- **THEN** it presents the host, the champion, the golden boot, the knockout
  results, and the participating teams

### Requirement: Navigating from the tournament page
The system SHALL let the viewer open a match's details or navigate to a nation's
profile from the tournament page.

#### Scenario: Opening a match from the tournament page
- **WHEN** the viewer selects a played match on the tournament page
- **THEN** that match's details are shown

#### Scenario: Returning home
- **WHEN** the viewer dismisses the tournament page
- **THEN** the home bracket is shown
