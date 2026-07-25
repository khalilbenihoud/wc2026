## Context

The site is a Vite + TypeScript single-page app deployed to Netlify. It is not client-only for crawlers: `npm run build` runs `generate-sitemap → vite build → prerender`, and `scripts/prerender.ts` writes real static HTML per route (`/tournaments/<year>/`, `/countries/<slug>/`) with per-page `<title>`, description, canonical, `og:title`/`og:description`, `twitter:*`, and JSON-LD. Social crawlers (which do not run JS) already receive correct metadata.

Two gaps remain: (1) there is no in-page control to initiate a share, and (2) `og:image` is the same generic `og-image.webp` on every page (`src/schema.ts` `EVENT_IMAGE`). All data needed for richer cards is already computed in `prerender.ts`: country record/titles/appearances/scorers/epithet and tournament champion/runner-up/final score/host/Golden Boot. `public/fonts` holds the serif faces; `public/trophy.png` exists. No image library is currently installed.

## Goals / Non-Goals

**Goals:**
- A share control on tournament and country pages that feels native on mobile and degrades gracefully on desktop.
- A distinct, on-brand `1200×630` OG card per country and per tournament, baked into each page's static HTML so crawlers see it without JS.
- Zero runtime cost and no change to the deploy target (stay fully static; no Netlify function).

**Non-Goals:**
- Per-match OG cards (there are hundreds; out of scope for v1 — pages keep the generic image).
- On-demand/dynamic image generation via a serverless function (Tier 3).
- Share analytics/tracking beyond what `seoTracking.ts` already does.
- Localized cards or per-network custom copy.

## Decisions

### D1: Build-time image generation with `satori` + `@resvg/resvg-js`
Render each card as JSX → SVG (`satori`) → PNG (`@resvg/resvg-js`) in a new `scripts/generate-og-images.ts`.
- **Why**: Matches the existing static, build-time pipeline; no runtime cost, no cold starts, deterministic output committed to `dist/`. satori is the de-facto standard for HTML/CSS-flexbox-style OG cards and gives far more layout flexibility than hand-writing SVG.
- **Alternatives**: (a) Hand-authored SVG templates + resvg only — fewer deps but brittle text layout/wrapping for variable-length country names. (b) `sharp` compositing — good for photos, poor for typography-driven cards. (c) `@vercel/og` — bundles satori/resvg but is framework-flavored and heavier. (d) Netlify function (Tier 3) — runtime cost + caching complexity, rejected for v1.

### D2: Build ordering — generate images between `vite build` and `prerender`
New build script: `generate-sitemap → vite build → generate-og-images → prerender`.
- **Why**: `dist/` must exist before writing `dist/og/**`; and `prerender` must run last so it can reference the generated PNG paths when baking `og:image`. The image generator and prerender share the same source data (`countries.generated.ts`, `data.ts`), so filenames are derivable on both sides (`slugForCode`, year).
- **Alternative**: Generate into `public/og/**` before `vite build` so Vite copies them. Rejected — pollutes source tree with hundreds of build artifacts and couples image content to Vite's asset hashing.

### D3: `render()` gains an optional per-page image; fallback preserved
Add an `ogImage?: string` parameter (absolute URL) to `render()` in `prerender.ts`. When present, it overrides `og:image`, `twitter:image`, and adds/updates `og:image:alt`. When absent (homepage, per-match pages), the existing generic `og-image.webp` markup in the template is left untouched.
- **Why**: Backward-compatible, minimal blast radius, no regression for pages without a card.

### D4: ShareButton — Web Share API first, popover fallback
A `ShareButton` component: if `navigator.share` (and `navigator.canShare`) is available, call it with `{ title, url }`; otherwise render a small popover with **Copy link** (Clipboard API), **X**, **WhatsApp**, and **Facebook** using documented intent URLs. Share links are built by a small pure helper (`shareLinks.ts`) so they are unit-testable. The URL shared is the page canonical; the title reuses the page's existing SEO title.
- **Why**: Native sheet is the best mobile UX and covers most real sharing; the fallback guarantees desktop coverage. Keeping link construction pure isolates the one piece with correctness risk (URL encoding).
- **Alternative**: Always show the popover (ignore Web Share API) — simpler but worse mobile UX. Rejected.

### D5: Card visual language — reuse the site's champion hero card
The OG cards SHALL mirror the existing champion hero card in `TournamentPage.tsx`, not a bespoke text layout. Elements: full-bleed cover **photo**, a strong bottom+left **scrim**, the gold **country-map silhouette** (`src/countryMaps/<CODE>.json`, same `viewBox="0 0 1024 1024"` + transform as `CountryMap.tsx`) on the right, a mono uppercase label (`CHAMPION` / `N-TIME CHAMPION`), the **flag emoji** + country name in **Unbounded bold**, a result/stat subline, and a mono `Photo · <author> / Unsplash` credit. Brand tokens from `src/index.css`: bg `#09090b`, gold `#f6c453`, gold-hi `#ffdf8e`, text `#f4f4f5`, muted `#71717a`.
- **Tournament card**: champion photo, `CHAMPION` label, flag + champion name, `1–0 a.e.t. vs Argentina` result, champion-country silhouette.
- **Country card**: same shell; background = the country's champion photo if it is a World Cup winner, else a neutral fallback (`public/pitch-bg.jpg` or a dark gradient); label reflects status (`N-TIME CHAMPION` / `BEST: <result>`); subline carries the headline stat (titles · appearances · record).

### D6: Fonts must be static instances baked into the repo
satori cannot read the shipped **variable** woff2 (its opentype parser rejects the `fvar` table) and cannot read woff2 at all. The build SHALL bake **static** instances (TTF/OTF/woff) of Unbounded (700/600), JetBrains Mono (400/600), Inter (400), and Source Serif 4 into a build-assets location the generator reads. These are used only at build time; the site keeps shipping its variable woff2 to browsers.

### D7: Photo & silhouette embedding at build time
The generator SHALL embed each hero photo as a data URI fetched once from the committed `CHAMPION_IMAGES` Unsplash URLs, and embed each country silhouette as an inline SVG built from `src/countryMaps/*.json`. No runtime image fetching. Missing photo → neutral fallback background so every card still renders.

### D8: Flag emoji via Twemoji
satori has no emoji font, so the generator SHALL resolve flag emoji through a `loadAdditionalAsset` hook that maps the grapheme to its codepoints and inlines the corresponding Twemoji SVG (bundled or fetched at build). Cards must not fall back to blank/tofu flags.

### D9: Scrim is intentionally stronger than the on-site card
Because Unsplash photos vary in brightness (some are bright daytime pitches), the OG scrim is heavier than the site card's — a bottom gradient to opaque `#09090b` plus a left gradient — so the label, name, and subline stay legible on any photo.

## Risks / Trade-offs

- **Social platforms cache OG data aggressively** → When a card changes, previews may lag until re-scraped. Mitigation: filenames are stable per page; document the Facebook/X debugger re-scrape step in tasks. No cache-busting query strings (they fragment crawler caches).
- **Longer build time** (one satori render per ~71 countries + ~23 tournaments) → Mitigation: generation is embarrassingly parallel and satori is fast (<50ms/card); acceptable for a build-time step. Consider skipping unchanged cards later if it becomes slow.
- **Font loading in satori must be explicit** (it does not read system fonts) → Mitigation: load the exact `.ttf/.otf` from `public/fonts` used by the site; fail the build loudly if a weight is missing.
- **`@resvg/resvg-js` is a native module** → Mitigation: it ships prebuilt binaries for common platforms incl. Netlify's Linux build image; pin the version and verify the Netlify build once.
- **PNG vs WebP** → OG uses PNG for maximum crawler compatibility even though the generic asset is WebP; the `og:image:width/height` meta (1200×630) already matches, so no dimension mismatch.
- **Clipboard/Share APIs need secure context** → Production is HTTPS; the popover Copy-link path guards on `navigator.clipboard` and falls back to a selectable text/`document.execCommand` path if absent.

## Migration Plan

1. Add `satori` + `@resvg/resvg-js` to `devDependencies`.
2. Land `generate-og-images.ts` and wire the `build` script; verify `dist/og/**` is produced locally.
3. Extend `render()` + call sites in `prerender.ts`; verify baked `og:image` in built HTML for a sample country and tournament.
4. Add `ShareButton` + `shareLinks.ts`; mount on `TournamentPage` and `CountryPage`.
5. Deploy; validate one country + one tournament URL in the X and Facebook sharing debuggers.

Rollback: revert the `build` script to skip `generate-og-images` and drop the `ogImage` argument — pages fall back to the generic image; the ShareButton is independent and can be reverted separately.

## Open Questions

- Card accent art: use the country-map silhouette on country cards, or keep v1 text-only for speed? (Leaning silhouette, low risk.)
- Should the in-progress 2026 tournament card show live standings, or a neutral "in progress" treatment until decided?
