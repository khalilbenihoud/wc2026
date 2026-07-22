# Knockout Bracket Specification

## Purpose
Render a single FIFA World Cup edition's knockout stage as an interactive
bracket, in two interchangeable views — a radial concentric-ring visualization
(desktop) and a segmented round-by-round list (mobile / opt-in) — with animated
traces showing how each team advanced toward the trophy.

## Requirements

### Requirement: Radial bracket rendering
The system SHALL render the active tournament's knockout stage as an SVG of
concentric rings, with the Round of 16 on the outermost ring, then the
quarter-finals, semi-finals, and final drawn inward toward a center trophy.

#### Scenario: Rendering a completed tournament
- **WHEN** a year with a fully-played knockout stage is active
- **THEN** all 16 Round-of-16 slots, 8 quarter-final, 4 semi-final and 2 final
  competitors are placed on their respective rings with team flags
- **AND** the champion is indicated at the center

#### Scenario: Rendering a tournament that predates the Round of 16
- **WHEN** the active edition's data has no `r16` bracket (`r16` is null)
- **THEN** the bracket resolves and draws from the earliest round that edition
  actually contains without error

### Requirement: Winning-team trace
The system SHALL let the viewer trace a team's run through the knockout stage by
highlighting the path a team took from its entry slot to the round it reached.

#### Scenario: Hovering or tapping a competitor
- **WHEN** the viewer hovers (desktop) or taps (touch) a team flag or slot
- **THEN** the winning path for that leaf is highlighted from its outer slot
  inward as far as the team advanced

#### Scenario: Clearing the trace
- **WHEN** the pointer leaves the highlighted leaf and no leaf is active
- **THEN** no trace is highlighted

### Requirement: Match tooltip
The system SHALL show a floating tooltip describing a knockout match on
hover, including the round name, both competitors, the score, the winner, and
any match notes (e.g. extra time, penalties).

#### Scenario: Hovering a played match
- **WHEN** the viewer hovers a match slot whose match has been played
- **THEN** a tooltip shows the round, both teams with flags, the final score,
  the winning side emphasized, and notes such as penalty results
- **AND** the tooltip is clamped to stay within the viewport

#### Scenario: Hovering a not-yet-played slot
- **WHEN** the viewer hovers a slot whose match has not been played
- **THEN** the tooltip indicates the match is "not yet played" instead of a score

### Requirement: List (segmented) view
The system SHALL provide a round-by-round list view of the same knockout data as
an alternative to the radial bracket.

#### Scenario: Viewing the list
- **WHEN** the list view is active
- **THEN** matches are grouped by round (R16 → Final) with competitors, flags,
  and scores shown per match

### Requirement: Responsive view selection
The system SHALL choose the bracket view based on viewport width, defaulting to
the radial view on desktop and forcing the list view on phones, while allowing
desktop viewers to toggle between the two.

#### Scenario: Viewing on a phone
- **WHEN** the viewport matches `max-width: 767px`
- **THEN** the list view is used regardless of the stored preference, and the
  radial/list toggle is hidden

#### Scenario: Toggling on desktop
- **WHEN** a desktop viewer activates the view toggle
- **THEN** the bracket switches between radial and list views

#### Scenario: Crossing the breakpoint
- **WHEN** the viewport is resized across the 767px breakpoint
- **THEN** the effective view updates reactively to match the new width

### Requirement: Opening match details from the bracket
The system SHALL open a match's detail view when the viewer selects a played
match from either bracket view.

#### Scenario: Selecting a match
- **WHEN** the viewer selects (clicks/taps) a match slot
- **THEN** the match details surface opens for that round and slot index
