# Tournament Data Specification

## Purpose
Define the data model for tournament results and the datasets that back the
archive: hand-maintained bracket results, generated goalscorers / match stats /
country stats, and the live 2026 edition (including its third-place play-off and
ESPN-sourced statistics).

## Requirements

### Requirement: Tournament data model
The system SHALL represent each edition as a tournament record containing the
host, participating teams (as 3-letter codes), knockout rounds (R16 → final,
plus optional R32 and third-place match), and optional awards (golden boot,
golden glove) and editorial quote.

#### Scenario: Reading an edition
- **WHEN** an edition is read from the tournament dataset
- **THEN** its host, teams, and available knockout rounds are exposed with the
  documented fields

#### Scenario: Editions predating a round
- **WHEN** an edition did not have a given knockout round (e.g. no Round of 16)
- **THEN** that round is absent/null and downstream analysis handles it

### Requirement: Bracket analysis
The system SHALL derive, from a tournament's raw match data, which team advanced
out of each knockout round and who the champion is, so views can draw traces and
resolve competitors without duplicating that logic.

#### Scenario: Resolving advancement
- **WHEN** a tournament is analyzed
- **THEN** the per-round winners and the champion (where decided) are computed
  from the recorded match winners

### Requirement: Generated supporting datasets
The system SHALL source goalscorers, match statistics, player of the match, and
country stats from generated datasets keyed by year and team codes, produced by
the repo's generation scripts from external datasets.

#### Scenario: Looking up match data
- **WHEN** scorers, stats, or MOTM are requested for a match by year and both
  team codes
- **THEN** the corresponding generated record is returned when present, in the
  correct per-team orientation, or null when absent

### Requirement: Live 2026 edition
The system SHALL support the in-progress 2026 edition, including matches that are
scheduled but not yet played, a third-place play-off represented as a single
match, and statistics sourced from ESPN for played matches.

#### Scenario: Not-yet-played 2026 match
- **WHEN** a 2026 knockout match has no result yet
- **THEN** it is represented without a winner and surfaced as not yet played
  rather than as a completed match

#### Scenario: Third-place play-off
- **WHEN** the third-place play-off is present
- **THEN** it is treated as a single match, distinct from the two-legged final
  round array
