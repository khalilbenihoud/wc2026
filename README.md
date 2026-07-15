# The Road to Glory

Every FIFA World Cup knockout stage since 1930, visualized as a radial bracket.  
Explore tournament history through an interactive SVG — from the Round of 16 to the Final, each edition drawn as concentric rings with animated winning-team traces.

## Features

- **Radial bracket** — 16 knockout slots as SVG concentric rings (R16, QF, SF, Final, center trophy)
- **List view** — Segmented round-by-round match list with smooth mask fade, default on mobile
- **Responsive** — Radial bracket on desktop, segmented list on mobile; toggle anytime with a button below the bracket
- **Timeline sidebar** — Scroll through every edition from 1930 to 2026 with champion flag and host
- **Match details modal** — Scores, goal scorers, cards, substitutions, penalty shootouts, and stats
- **Live 2026 bracket** — Pulls current knockout data from an external REST API
- **Splash screen** — Animated year counter with parallax and reduced-motion support
- **Agent-first design** — Serves `llms.txt` via content negotiation, exposes AI tool for year selection

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · SVG · Netlify

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
npm run build        # Production build to dist/
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type check |

## Historical coverage

1930 · 1934 · 1938 · 1950 · 1954 · 1958 · 1962 · 1966 · 1970 · 1974 · 1978 · 1982 · 1986 · 1990 · 1994 · 1998 · 2002 · 2006 · 2010 · 2014 · 2018 · 2022 · 2026 (live)

## Data

Tournament results live in `src/data.ts`. Goal scorers and match stats are auto-generated from the [jfjelstul/worldcup](https://github.com/jfjelstul/worldcup) dataset via Python scripts in `scripts/`. The 2026 bracket pulls from a free REST API and is committed alongside historical data.

## Credits

Built by **Benihoud Khalil** — a personal project made for fun, by a football fan.

The radial bracket design was inspired by **Emilio Sansolini**.

## License

MIT
