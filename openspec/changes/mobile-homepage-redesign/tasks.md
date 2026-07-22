## 1. Mobile readiness

- [x] 1.1 Remove the "Best viewed on desktop" banner
- [x] 1.2 Skip the splash screen on mobile (`isMobile` check before rendering `Splash`)
- [x] 1.3 Lazy-load `RadialBracket` (desktop-only) to keep it out of the mobile bundle

## 2. Winner hero (`HeroCard`)

- [x] 2.1 Create `src/components/HeroCard.tsx` — Tifo design: champion flag + name, oversized "CHAMPIONS" wordmark, year + "World Champions"
- [x] 2.2 Handle the undecided / upcoming edition state (🔮)
- [x] 2.3 Tap → navigate to the edition's tournament page
- [x] 2.4 Render only on mobile

## 3. Tournament grid (`HomepageGrid`)

- [x] 3.1 Winner-first two-column cards for every edition, newest-first
- [x] 3.2 Drop the host flag; show year + champion flag/name + final score (or "Champions")
- [x] 3.3 "World Cup Timeline" section heading
- [x] 3.4 Exclude the hero's edition from the grid (`excludeYear`)
- [x] 3.5 Tap a card → navigate to its tournament page

## 4. Header

- [x] 4.1 Enlarge the mobile title
- [x] 4.2 Make the Hall of Champions entry prominent on mobile
- [x] 4.3 Unify mobile gutters and vertical spacing

## 5. Cleanup — superseded variations

- [x] 5.1 Remove `LayoutSwitcher`, `HomepageTimeline`, `HomepageFeatured`, `HeaderMetaMobile`, `MobileTimeline` and their wiring

## 6. Verify

- [x] 6.1 `tsc --noEmit` clean; production build succeeds
- [x] 6.2 Verify on a mobile viewport (iPhone 13 / 390px, Playwright + Chrome) — funnel drives homepage → tournament → match; touch targets ≥44px (card 168×108, match row 350×58); back-nav returns match → tournament → homepage
