# Design — Mobile Homepage Redesign

## Context

Mobile is ~69% of traffic but converted at ~1% into tournament content. The desktop radial bracket does not translate to a phone (it is dense, hover-driven, and was splash-gated). The mobile homepage is re-cast as a content-first funnel: show the marquee moment, then an obvious directory into every edition.

## Decisions

### Single experience, not a switcher
An earlier iteration shipped three switchable mobile layouts (grid / timeline / featured) behind a persistent `LayoutSwitcher`. In review this proved to be choice-paralysis and duplicated navigation surfaces (a directory grid *and* a floating year rail *and* the switcher). It was collapsed to one opinionated path: **winner hero → tournament grid**. The switcher and the timeline/featured variants were deleted.

### The games live on the tournament page, not the homepage
The homepage does not reproduce the bracket/results on mobile. It orients (hero) and funnels (grid). Depth — full knockout results, scorers, highlights — lives on the tournament and match pages the cards open. This keeps the homepage light and gives a reason to tap through (which the funnel needs).

### Winner-first, low-clutter cards
Tournament cards originally showed year + host flag + champion flag, which was ambiguous (two unlabeled flags, host larger than the winner). Reorganized to lead with the winner: year eyebrow, champion flag + **name**, final score. The host flag was cut — it is trivia that belongs on the tournament page. Editions are a flat, most-recent-first list under one "World Cup Timeline" heading (the arbitrary Recent/Classic/Vintage eras were removed).

### Hero treatment
The hero is the "Tifo" design: an oversized `CHAMPIONS` wordmark in the display face (Unbounded, sized in container-query units so it stays one line and fills the width) with the champion unveiled on a draped fold below. The live/most-recent edition (2026) owns the hero and is excluded from the grid to avoid duplication.

## Architecture

- `src/App.tsx` — on mobile renders `<HeroCard>` + `<HomepageGrid embedded excludeYear={activeYear}>`; on desktop renders the radial/list bracket unchanged. `isMobile` gates the split.
- `src/components/HeroCard.tsx` — the winner hero; handles decided and upcoming states.
- `src/components/HomepageGrid.tsx` — the tournament directory grid; `embedded` flows with the page, `excludeYear` drops the hero's edition.
- Desktop-only surfaces (`RadialBracket`) stay lazy-loaded so their SVG/JS is not in the mobile bundle.

## Non-goals

- No new routes; the mobile homepage is still the `/` route rendered client-side.
- No prerender changes; the prerendered homepage HTML is unchanged (mobile layers apply after mount).
- No backend.
