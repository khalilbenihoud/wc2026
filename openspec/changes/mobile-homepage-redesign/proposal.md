## Why

69% of visitors are mobile (281 mobile vs 124 desktop), and the funnel collapses there: 387 homepage visitors → 4 reached a tournament page (1%) → 1 reached a match page. Social links (Instagram, Facebook, LinkedIn) drive most traffic, but the splash-gated, desktop-first radial bracket actively discouraged mobile exploration. The mobile homepage needed to become a fast, content-first funnel into tournament and match pages.

## What Changes

- **Remove the mobile splash barrier** and the "Best viewed on desktop" banner — show content instantly.
- **Keep the radial bracket out of the mobile bundle** — it is desktop-only and lazy-loaded.
- **Replace the mobile homepage with a single, opinionated experience** (no layout switcher):
  - A **winner hero** for the live / most-recent edition that funnels into its tournament page.
  - A **tournament grid** ("World Cup Timeline") of winner-first cards for every edition, newest-first, each opening its tournament page.
- **Enlarge the mobile title** and make the **Hall of Champions** entry prominent.
- **Desktop is untouched** — all changes are mobile-only layers.

> Superseded during implementation: an earlier plan for three switchable layout variations (grid / timeline / featured) plus a persistent layout switcher was built and then removed in favor of the single hero + grid experience above. `LayoutSwitcher`, `HomepageTimeline`, `HomepageFeatured`, `HeaderMetaMobile`, and `MobileTimeline` no longer exist.

## Capabilities

### New Capabilities
- `hero-winner-card`: mobile winner hero for the live / most-recent edition; taps through to its tournament page.
- `homepage-tournament-grid`: mobile grid of winner-first tournament cards ("World Cup Timeline"), newest-first, excluding the hero's edition.

## Impact

- **src/App.tsx**: mobile branch renders the winner hero + tournament grid; desktop still renders the radial bracket. Enlarged title, prominent Hall of Champions.
- **New components**: `src/components/HeroCard.tsx`, `src/components/HomepageGrid.tsx`.
- **Removed components**: `LayoutSwitcher`, `HomepageTimeline`, `HomepageFeatured`, `HeaderMetaMobile`, `MobileTimeline`.
- **Performance**: RadialBracket SVG excluded from the mobile bundle via desktop-only lazy import.
- **No backend, routing, or prerender changes** — the mobile layers render client-side; the prerendered homepage HTML is unchanged.
