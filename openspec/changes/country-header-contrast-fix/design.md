# Design: Country Header Contrast Fix

## Context

Both `CountryPage.tsx` and `TournamentPage.tsx` share the same sticky header styling:
```
bg-brand-bg/80 backdrop-blur-md border-b border-brand-line/40
```

The Country page additionally renders aurora gradient blobs (full-page, z-0) using flag palette colors from `getTeamPalette()`. The 80% opacity header (z-20) sits above these blobs, letting their colors bleed through.

## Decision

Make the Country page header fully opaque by using `bg-brand-bg` instead of `bg-brand-bg/80 backdrop-blur-md`. Since the page background behind the header is already `bg-brand-bg`, there's no visual difference beyond blocking the aurora bleed.

The Tournament page retains its current styling since it has no aurora layer.

## Tradeoffs

- Removes the subtle frosted glass effect on the country page header. This is acceptable since the benefit (no color bleed) outweighs the minor aesthetic change.
- No shared CSS class change needed — it's an inline Tailwind class swap in one file.
