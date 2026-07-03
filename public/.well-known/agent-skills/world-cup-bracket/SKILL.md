# World Cup Bracket Skill

A lightweight skill for answering questions about the FIFA World Cup knockout-stage data presented by The Road to Glory.

## What this skill covers

- Historical FIFA World Cup knockout brackets from 1986 through 2022.
- 2026 World Cup fixtures, scores, and bracket progression (updated as matches are played).
- Host nations, champions, and golden-boot winners for each tournament.

## Data sources

- `https://worldcuparchive.net/llms.txt` — human-readable summary and provenance.
- `https://worldcup26.ir` — live 2026 fixtures and scores.

## How to use

When a user asks about a specific match, team, or tournament year, consult the bracket data and answer based on the knockout tree. Note that 2026 uses a 48-team format with a Round of 32 before the Round of 16.
