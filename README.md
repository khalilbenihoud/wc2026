# The Road to Glory

Every FIFA World Cup knockout stage since 1930, visualized as a radial bracket.  
Explore tournament history through an interactive SVG — from the Round of 16 to the Final, each edition drawn as concentric rings with animated winning-team traces — plus per-nation profiles and head-to-head records across every World Cup.

## Features

- **Radial bracket** — 16 knockout slots as SVG concentric rings (R16, QF, SF, Final, center trophy), with flag-hover traces
- **Responsive** — the radial map on desktop; a champion-timeline grid with a hero card on mobile
- **Timeline sidebar** — scroll through every edition from 1930 to 2026 with champion flag and host
- **Match details** — scores, goal scorers, cards, substitutions, penalty shootouts, and stats, on their own crawlable pages
- **Nation profiles** — all-time record, top scorers, biggest rivalries, honours and tournament-by-tournament results for every team (`/countries`)
- **Head-to-head** — complete World Cup meeting history for any pair of teams, 1930–2026 (`/compare/…`), group and knockout
- **Hall of Champions** — every World Cup winner from 1930 to today
- **2026 edition** — the complete knockout bracket, hand-curated from openfootball with full scorers and stats
- **Built for search** — ~1,000 pages prerendered to static HTML with per-page titles, canonical, JSON-LD (SportsEvent / FAQ / breadcrumb) and generated OG cards
- **Splash screen** — animated year counter with parallax and reduced-motion support
- **Agent-first design** — serves `llms.txt` via content negotiation and exposes a WebMCP tool for year selection

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · SVG · Netlify

Static pages are prerendered after `vite build` by `scripts/prerender.ts`; OG
cards are rendered with satori + resvg and encoded as WebP with sharp.

### Fonts

Inter and Unbounded are **self-hosted** in `public/fonts/` (`@font-face` in
`src/index.css`), not loaded from the Google Fonts CDN — this keeps two
render-blocking third-party requests off the critical path and lets us preload
the LCP heading font. Both are variable fonts, so one `woff2` per subset
(`latin`, `latin-ext`) covers every weight. **Please don't re-add the Google
Fonts `<link>` tags** in `index.html`; to change weights or subsets, update the
vendored files and the `@font-face` rules instead.

## Getting started

```bash
npm install
npm run dev          # Dev server on port 3000
npm run build        # Sitemap + Vite build + OG images + prerender to dist/
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Full production build (sitemap → Vite → OG images → prerender) |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type check |
| `npm run gen:country-stats` | Regenerate nation records, scorers, rivalries and the head-to-head meeting log from the jfjelstul dataset |
| `npm run gen:og-images` | Regenerate the per-page OG cards |
| `npm run gen:champion-images` | Regenerate champion hero images |
| `npm run gen:country-maps` | Regenerate country map outlines |

## Historical coverage

1930 · 1934 · 1938 · 1950 · 1954 · 1958 · 1962 · 1966 · 1970 · 1974 · 1978 · 1982 · 1986 · 1990 · 1994 · 1998 · 2002 · 2006 · 2010 · 2014 · 2018 · 2022 · 2026

## Data

Tournament results are hand-curated in `src/data.ts` (2026 sourced from
[openfootball](https://github.com/openfootball/world-cup)). Per-nation records,
top scorers, rivalries, and the complete head-to-head meeting log
(`src/countryH2H.generated.ts`) are generated from the
[jfjelstul/worldcup](https://github.com/jfjelstul/worldcup) dataset via
`npm run gen:country-stats` — group stage included, 1930–2022 — with the 2026
edition folded in at runtime from `src/data.ts`.

## Credits

Built by **Benihoud Khalil** — a personal project made for fun, by a football fan.

The radial bracket design was inspired by **Emilio Sansolini**.

## Disclaimer

This is an independent, non-commercial fan project. It is **not affiliated with, endorsed by, or associated with FIFA** or any football federation. "FIFA" and "FIFA World Cup", along with all team and tournament names, are trademarks of their respective owners and are used here for identification and editorial purposes only.

## License

MIT
