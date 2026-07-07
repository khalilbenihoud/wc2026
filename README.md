# The Road to Glory

Interactive radial bracket archive of every FIFA World Cup knockout stage since 1930. Explore the tournament history through a circular SVG visualization — from the Round of 16 to the Final, each tournament drawn as concentric rings with animated winning-team traces.

## Features

- **Radial bracket** — 16 knockout slots rendered as SVG concentric rings (R16, QF, SF, Final, center trophy)
- **Timeline sidebar** — Scroll through every edition from 1930 to 2026 with champion flag and host
- **Match details modal** — Scores, goal scorers, cards, substitutions, and penalty shootout details
- **Live 2026 bracket** — Pulls current knockout data from an external REST API
- **Splash screen** — Animated year counter with parallax and reduced-motion support
- **Dark/light mode** — Theme toggle persisted to localStorage
- **Agent-first design** — Serves `llms.txt` via content negotiation, exposes AI tool for year selection

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · SVG · Cloudflare Pages

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
