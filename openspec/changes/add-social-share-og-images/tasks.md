## 1. Dependencies & scaffolding

- [x] 1.1 Add `satori` and `@resvg/resvg-js` to `devDependencies` and install
- [x] 1.2 Confirm which `.ttf/.otf` faces/weights in `public/fonts` the site uses, so satori can load the exact serif

## 2. OG image generation (champion-hero design)

- [x] 2.1 Bake static font instances into a build-assets dir: Unbounded 700/600, JetBrains Mono 400/600, Inter 400, Source Serif 4 (shipped woff2 are variable — satori can't read them)
- [x] 2.2 Add a Twemoji `loadAdditionalAsset` hook (grapheme → codepoints → inline SVG) so flag emoji render
- [x] 2.3 Create `scripts/generate-og-images.ts`: shared card shell (full-bleed photo, strong bottom+left scrim, gold `CountryMap` silhouette from `src/countryMaps/*.json`, mono label, flag + Unbounded name, subline, `Photo · <author> / Unsplash` credit) + a `renderCard(node) → PNG` helper via satori + resvg
- [x] 2.4 Embed hero photos as data URIs fetched once from `CHAMPION_IMAGES`; non-champion countries fall back to `public/pitch-bg.jpg` / dark gradient
- [x] 2.5 Tournament card: champion photo, `CHAMPION` label, flag + champion name, final result (`1–0 a.e.t. vs Argentina`), champion silhouette; neutral "in progress" treatment for undecided 2026
- [x] 2.6 Country card: same shell; label reflects status (`N-TIME CHAMPION` / best result), subline carries headline stats (titles · appearances · record)
- [x] 2.7 Iterate all countries + tournaments, writing `dist/og/countries/<slug>.png` and `dist/og/tournaments/<year>.png` using the same slug/year derivation as prerender
- [x] 2.8 Fail the build loudly on missing font, missing map, or render error (no blank/tofu cards)

## 3. Prerender integration

- [x] 3.1 Add optional `ogImage?: string` (absolute URL) to `render()` in `scripts/prerender.ts`; inject `og:image`, `twitter:image`, and update `og:image:alt` when present
- [x] 3.2 Pass each country's card URL from `buildCountry`; pass each tournament's card URL from the tournament builder
- [x] 3.3 Leave homepage and per-match pages on the existing generic image (no `ogImage` argument)
- [x] 3.4 Wire the build order in `package.json`: `generate-sitemap → vite build → generate-og-images → prerender`

## 4. Share button

- [x] 4.1 Create `src/shareLinks.ts`: pure helpers returning correctly-encoded X / WhatsApp / Facebook share URLs from `{ title, url }`
- [x] 4.2 Create `ShareButton` component: use `navigator.share`/`canShare` when available; otherwise render a popover with Copy link (Clipboard API + selectable-text fallback), X, WhatsApp, Facebook
- [x] 4.3 Mount `ShareButton` in `TournamentPage`, passing canonical URL + SEO title
- [x] 4.4 Mount `ShareButton` in `CountryPage`, passing canonical URL + SEO title
- [x] 4.5 Style the button/popover to match the site (serif, dark theme); ensure it is keyboard-accessible and dismissible

## 5. Verification

- [x] 5.1 Run `npm run build`; confirm `dist/og/**` PNGs exist and are `1200×630`
- [x] 5.2 Inspect built HTML for a sample country and tournament: `og:image`/`twitter:image` point at the right absolute card URL; a page without a card still uses the generic image
- [x] 5.3 Manually exercise ShareButton: native sheet path (mobile/emulated) and desktop fallback (copy + each network link opens correct URL)
- [ ] 5.4 Post-deploy: validate one country + one tournament URL in the X and Facebook sharing debuggers
