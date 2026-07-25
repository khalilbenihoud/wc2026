## Why

Tournament and country pages already ship correct per-page titles and descriptions to social crawlers (baked in by `scripts/prerender.ts`), but two things hold back sharing: there is no way to trigger a share from the page, and every page serves the same generic `og-image.webp`. A shared link therefore previews with the right words next to an identical, forgettable image — the single biggest factor in whether a shared link gets clicked. Adding a share affordance plus a distinct card image per page turns organic sharing into a real acquisition channel.

## What Changes

- Add a **ShareButton** to `TournamentPage` and `CountryPage`.
  - Uses the Web Share API (`navigator.share`) when available (native sheet on mobile).
  - Falls back to a small popover on unsupported browsers: **Copy link**, **X**, **WhatsApp**, **Facebook** (intent URLs).
  - Shares the page's canonical URL and its already-correct per-page title.
- Add **build-time Open Graph image generation**: a new `scripts/generate-og-images.ts` renders a distinct `1200×630` PNG card for every country and every tournament.
  - Country card: name, epithet, and a stat row (titles, appearances, W-D-L, goals).
  - Tournament card: year, host, champion (with trophy), final score, Golden Boot.
  - Uses `satori` (JSX → SVG) + `@resvg/resvg-js` (SVG → PNG), reusing the site's serif fonts from `public/fonts`.
  - Runs in `npm run build` between `vite build` and `prerender`, writing to `dist/og/countries/<slug>.png` and `dist/og/tournaments/<year>.png`.
- Extend `scripts/prerender.ts` so `render()` accepts a per-page image and bakes `og:image` / `twitter:image` (absolute URLs) into each country and tournament page's static HTML. Pages without a generated card fall back to the existing generic image.

## Capabilities

### New Capabilities
- `social-share`: A per-page share control on tournament and country pages that invokes the native share sheet where supported and otherwise offers copy-link and per-network share links.
- `open-graph-images`: Build-time generation of distinct per-page Open Graph card images and their injection into prerendered page metadata.

### Modified Capabilities
<!-- None: no existing OpenSpec specs to modify. -->

## Impact

- **New dependencies**: `satori`, `@resvg/resvg-js` (build-time only, `devDependencies`).
- **New code**: `scripts/generate-og-images.ts`; a `ShareButton` React component; a small share-links helper.
- **Modified code**: `scripts/prerender.ts` (`render()` signature + og:image/twitter:image injection), `src/components/TournamentPage.tsx`, `src/components/CountryPage.tsx`, `package.json` (`build` script + deps).
- **Build output**: new `dist/og/**` PNG assets; longer build (one satori render per country + tournament).
- **No runtime cost**: images are static; no Netlify function or client image generation.
- **SEO**: existing `og:image:width`/`height` (`1200×630`) already match the card dimensions; no crawler-facing regression, only richer previews.
