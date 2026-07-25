// Build-time Open Graph card generator. Renders one 1200×630 PNG per country and
// per tournament into dist/og, reusing the site's champion-hero visual language
// (cover photo + scrim + gold country silhouette + flag + Unbounded name). Runs
// after `vite build` (so dist/ exists) and before prerender (so prerender can
// bake each card's og:image). No runtime cost — everything is embedded here.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { TOURNAMENTS, getTeamName, getTeamFlag } from "../src/data";
import { champion, runnerUp } from "./tournament-result";
import { CHAMPION_IMAGES } from "../src/championImages.generated";
import { generateCountryProfiles } from "../src/countries.generated";
import { applyMockOverrides } from "../src/countries.mock";
import { COUNTRY_CODES, slugForCode } from "../src/countrySlug";
import { getHubData } from "../src/countriesHub";

const ROOT = resolve(process.cwd());
const DIST = resolve(ROOT, "dist");
const FONTS = resolve(ROOT, "scripts/og-assets/fonts");
const MAPS = resolve(ROOT, "src/countryMaps");
// @twemoji/svg ships one SVG per emoji, named by codepoint.
const TWEMOJI = dirname(fileURLToPath(import.meta.resolve("@twemoji/svg/package.json")));

// ── Brand tokens (src/index.css @theme, dark) ──────────────────────────
const BG = "#09090b";
const GOLD = "#f6c453";
const TEXT = "#f4f4f5";
const MUTE = "#a1a1aa";

// ── Fonts (static instances; the shipped woff2 are variable, unreadable) ─
const font = (f: string) => readFileSync(resolve(FONTS, f));
const FONT_SET = [
  { name: "Unbounded", data: font("unbounded-bold.woff"), weight: 700 as const, style: "normal" as const },
  { name: "Unbounded", data: font("unbounded-semibold.woff"), weight: 600 as const, style: "normal" as const },
  { name: "JetBrainsMono", data: font("mono-regular.ttf"), weight: 400 as const, style: "normal" as const },
  { name: "JetBrainsMono", data: font("mono-semibold.ttf"), weight: 600 as const, style: "normal" as const },
  { name: "Inter", data: font("inter.woff"), weight: 400 as const, style: "normal" as const },
];

const dataUri = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString("base64")}`;

// Neutral fallback background for pages without a hero photo.
const PITCH = dataUri(readFileSync(resolve(ROOT, "public/pitch-bg.jpg")), "image/jpeg");

// Fetch a hero photo once and embed it. Falls back to the pitch on any failure
// so a card is never blank.
const photoCache = new Map<string, string>();
async function embedPhoto(url: string | null): Promise<string> {
  if (!url) return PITCH;
  if (photoCache.has(url)) return photoCache.get(url)!;
  try {
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    const uri = dataUri(buf, "image/jpeg");
    photoCache.set(url, uri);
    return uri;
  } catch {
    console.warn(`  ! photo fetch failed, using pitch fallback: ${url}`);
    return PITCH;
  }
}

// Country silhouette → inline SVG, same viewBox/transform as CountryMap.tsx.
function mapUri(code: string): string | null {
  const p = resolve(MAPS, `${code}.json`);
  if (!existsSync(p)) return null;
  const map = JSON.parse(readFileSync(p, "utf8")) as { transform: string; paths: string[] };
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="none">` +
    `<g transform="${map.transform}">` +
    // stroke-width matches the canonical 1:1 map transform (was 34 for scale 0.1).
    map.paths.map((d) => `<path d="${d}" fill="none" stroke="${GOLD}" stroke-width="3.4" stroke-linejoin="round"/>`).join("") +
    `</g></svg>`;
  return dataUri(Buffer.from(svg), "image/svg+xml");
}

// Emoji grapheme → Twemoji codepoint filename (drops the fe0f variation selector).
const toCodePoints = (s: string) =>
  Array.from(s).map((c) => c.codePointAt(0)!.toString(16)).filter((hx) => hx !== "fe0f").join("-");

const h = (type: string, props: any = {}, ...children: any[]): any => ({
  type,
  props: { ...props, children: children.length <= 1 ? children[0] : children },
});

interface Card {
  photo: string; // data URI
  mapCode: string | null;
  flag: string | null;
  label: string;
  name: string;
  subline: string;
  credit: string | null;
}

async function renderCard(c: Card): Promise<Buffer> {
  const map = c.mapCode ? mapUri(c.mapCode) : null;
  const node = h(
    "div",
    { style: { position: "relative", width: 1200, height: 630, display: "flex", background: BG } },
    h("img", { src: c.photo, width: 1200, height: 630, style: { position: "absolute", inset: 0, objectFit: "cover" } }),
    // Scrims — heavier than the on-site card because photos vary in brightness.
    h("div", {
      style: {
        position: "absolute", left: 0, top: 0, width: 1200, height: 630, display: "flex",
        background: `linear-gradient(to top, ${BG} 32%, rgba(9,9,11,0.94) 47%, rgba(9,9,11,0.55) 67%, rgba(9,9,11,0.12) 100%)`,
      },
    }),
    h("div", {
      style: {
        position: "absolute", left: 0, top: 0, width: 1200, height: 630, display: "flex",
        background: `linear-gradient(to right, rgba(9,9,11,0.82) 0%, rgba(9,9,11,0.3) 42%, rgba(9,9,11,0) 62%)`,
      },
    }),
    map && h("img", { src: map, width: 430, height: 430, style: { position: "absolute", right: 70, top: 90, opacity: 0.7 } }),
    c.credit &&
      h(
        "div",
        { style: { position: "absolute", top: 30, right: 40, fontFamily: "JetBrainsMono", fontSize: 20, letterSpacing: 1, color: "rgba(244,244,245,0.55)" } },
        `Photo · ${c.credit} / Unsplash`
      ),
    h(
      "div",
      { style: { position: "absolute", left: 64, bottom: 60, display: "flex", flexDirection: "column" } },
      h(
        "div",
        { style: { fontFamily: "JetBrainsMono", fontWeight: 600, fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: GOLD, marginBottom: 22 } },
        c.label
      ),
      h(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 24 } },
        c.flag && h("span", { style: { fontSize: 76 } }, c.flag),
        h("span", { style: { fontFamily: "Unbounded", fontWeight: 700, fontSize: 82, color: TEXT, letterSpacing: -2 } }, c.name)
      ),
      h("div", { style: { fontFamily: "Inter", fontSize: 30, color: MUTE, marginTop: 14 } }, c.subline)
    )
  );

  const svg = await satori(node, {
    width: 1200,
    height: 630,
    fonts: FONT_SET,
    loadAdditionalAsset: async (code: string, text: string) => {
      if (code !== "emoji") return "";
      const cp = toCodePoints(text);
      const p = resolve(TWEMOJI, `${cp}.svg`);
      if (!existsSync(p)) return "";
      return dataUri(readFileSync(p), "image/svg+xml");
    },
  });
  return Buffer.from(new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng());
}

// Final result line from the champion's perspective (final `s` stored top–bottom).
function finalResult(t: (typeof TOURNAMENTS)[number], champ: string, ru: string | null): string {
  const m = t.final?.[0];
  if (!m?.s) return ru ? `vs ${getTeamName(ru)}` : "World Cup final";
  const score = m.w === 0 ? `${m.s[0]}–${m.s[1]}` : `${m.s[1]}–${m.s[0]}`;
  const pens = m.p ? (m.w === 0 ? m.p : m.p.split("-").reverse().join("-")) : null;
  const extra = pens ? ` (pens ${pens})` : m.x ? ` ${m.x}` : "";
  return `${score}${extra}${ru ? ` vs ${getTeamName(ru)}` : ""}`;
}

async function main() {
  mkdirSync(resolve(DIST, "og/countries"), { recursive: true });
  mkdirSync(resolve(DIST, "og/tournaments"), { recursive: true });

  // ── Tournaments ──────────────────────────────────────────────────────
  const years = Object.keys(TOURNAMENTS).map(Number).sort((a, b) => a - b);
  for (const year of years) {
    const t = TOURNAMENTS[year];
    const champ = champion(t);
    let card: Card;
    if (champ) {
      const pool = CHAMPION_IMAGES[champ];
      const hero = pool?.[0] ?? null;
      card = {
        photo: await embedPhoto(hero?.url ?? null),
        mapCode: champ,
        flag: getTeamFlag(champ),
        label: "Champion",
        name: getTeamName(champ),
        subline: finalResult(t, champ, runnerUp(t)),
        credit: hero?.authorName ?? null,
      };
    } else {
      // Undecided / in-progress edition (e.g. 2026): neutral treatment.
      card = {
        photo: PITCH,
        mapCode: null,
        flag: null,
        label: "FIFA World Cup",
        name: String(year),
        subline: `${t.host} · in progress`,
        credit: null,
      };
    }
    writeFileSync(resolve(DIST, `og/tournaments/${year}.png`), await renderCard(card));
    console.log(`  ✓ tournament ${year}`);
  }

  // ── Countries hub card ───────────────────────────────────────────────
  const hub = getHubData();
  writeFileSync(
    resolve(DIST, "og/countries.png"),
    await renderCard({
      photo: PITCH,
      mapCode: null,
      flag: null,
      label: "World Cup Nations",
      name: `${hub.total} Teams`,
      subline: "Every nation · 1930–2026",
      credit: null,
    })
  );
  console.log("  ✓ countries hub");

  // ── Countries ────────────────────────────────────────────────────────
  const profiles = applyMockOverrides(generateCountryProfiles());
  for (const code of COUNTRY_CODES) {
    const p = profiles[code];
    const slug = slugForCode(code);
    if (!p || !slug) continue;
    const n = p.titles?.length ?? 0;
    const isChamp = n > 0;
    const hero = isChamp ? CHAMPION_IMAGES[code]?.[0] ?? null : null;
    const card: Card = {
      photo: await embedPhoto(hero?.url ?? null),
      mapCode: code,
      flag: getTeamFlag(code),
      label: isChamp ? `${n}-time champion${n > 1 ? "s" : ""}` : p.bestResult,
      name: p.name,
      subline: isChamp
        ? `${n}× World Cup · ${p.appearances} appearance${p.appearances === 1 ? "" : "s"}`
        : `${p.appearances} appearance${p.appearances === 1 ? "" : "s"} · since ${p.firstAppearance}`,
      credit: hero?.authorName ?? null,
    };
    writeFileSync(resolve(DIST, `og/countries/${slug}.png`), await renderCard(card));
    console.log(`  ✓ country ${slug}`);
  }
}

main().catch((e) => {
  console.error("OG image generation failed:", e);
  process.exit(1);
});
