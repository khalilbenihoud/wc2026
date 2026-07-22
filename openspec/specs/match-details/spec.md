# Match Details Specification

## Purpose
Present the full detail of a single knockout match in a modal overlay: the
result, goalscorers per team, cards, substitutions, penalty shootouts, match
statistics, player of the match, and video highlights where available.

## Requirements

### Requirement: Match details modal
The system SHALL display a match's details in a modal overlay showing the two
competitors, the final score, and the round.

#### Scenario: Opening a match
- **WHEN** a match is selected from the bracket or via a match URL
- **THEN** a modal opens showing both teams, flags, the score, and the round name

#### Scenario: Closing the modal
- **WHEN** the viewer closes the modal
- **THEN** the modal dismisses and, if opened from a match URL, the URL drops the
  `/matches/<slug>` segment back to the tournament page

### Requirement: Goalscorers
The system SHALL show goalscorers for each team when scorer data exists for the
match.

#### Scenario: Match with recorded scorers
- **WHEN** a match has goalscorer data
- **THEN** each team's scorers are listed on that team's side

### Requirement: Cards, substitutions, and penalties
The system SHALL show yellow/red cards, substitutions, and penalty-shootout
outcomes for a match when statistics for it are available.

#### Scenario: Match decided on penalties
- **WHEN** a match was decided by a penalty shootout
- **THEN** the shootout result is shown in the details

#### Scenario: Match with disciplinary data
- **WHEN** a match has card data
- **THEN** yellow and red cards are shown per team

### Requirement: Match statistics
The system SHALL show available match statistics such as possession, total
shots, and fouls when present for the match.

#### Scenario: Match with stats
- **WHEN** statistics exist for the match (keyed by year and both team codes)
- **THEN** possession, shots, and fouls are displayed, oriented to each team

### Requirement: Player of the match and highlights
The system SHALL show the player of the match and link to a video highlight when
that data exists for the match.

#### Scenario: Match with a named player of the match
- **WHEN** player-of-the-match data exists for the match
- **THEN** that player is shown

#### Scenario: Match with a highlight video
- **WHEN** a highlight exists for the match
- **THEN** a link/embed to the highlight video is presented

### Requirement: Background inertness
The system SHALL make the page behind the open match modal inert so that
keyboard and pointer focus stay within the dialog.

#### Scenario: Modal open
- **WHEN** the match modal is open
- **THEN** the background content is marked inert and cannot receive focus
