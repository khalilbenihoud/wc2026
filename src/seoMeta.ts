// Per-route SEO metadata (title / description / canonical / JSON-LD) for the
// client shell, split out of App so the component keeps to composition. Mirrors
// what scripts/prerender.ts bakes into the static HTML for the same routes.

import { TournamentAnalysis } from "./types";
import { TOURNAMENTS, getTeamName } from "./data";
import { ROUND_NAME } from "./constants";
import { findMatchBySlug } from "./matches";
import { getHighlights } from "./highlights";
import {
  tournamentEvent, matchEvent, breadcrumbList, videoObject, faqPage,
  videoObjectForMatch, BASE_URL, SITE_NAME,
} from "./schema";
import { countryPath, countriesPath, tournamentPath, matchPath, type Route } from "./router";
import type { CountryProfile } from "./countries.mock";
import type { SeoMeta } from "./seo";

interface SeoMetaArgs {
  route: Route;
  countryProfile: CountryProfile | undefined;
  tournamentYear: number | null;
  matchYear: number | null;
  analyses: Record<number, TournamentAnalysis>;
  activeYear: number;
  champCode: string | null;
}

export function buildSeoMeta({
  route, countryProfile, tournamentYear, matchYear, analyses, activeYear, champCode,
}: SeoMetaArgs): SeoMeta {
  if (route.path === "country" && countryProfile) {
    const p = countryProfile;
    const desc = p.titles.length > 0
      ? `${p.name} — ${p.titles.length}× World Cup champion${p.titles.length > 1 ? "s" : ""}. ${p.appearances} tournament appearances since ${p.firstAppearance}. ${p.epithet}`
      : `${p.name} — ${p.bestResult}. ${p.appearances} World Cup appearance${p.appearances > 1 ? "s" : ""} since ${p.firstAppearance}. ${p.epithet}`;
    const videoNodes = p.videos.map(videoObject);
    return {
      title: `${p.name} World Cup History — Record, Results & Top Scorers · The Road to Glory`,
      description: desc,
      // Trailing slash = the prerendered 200 URL Netlify serves.
      canonical: `${countryPath(p.code)}/`,
      jsonLd: {
        "@type": "SportsTeam",
        name: p.name,
        sport: "Association football",
        description: p.epithet,
        url: `${BASE_URL}${countryPath(p.code)}/`,
      },
      jsonLdNodes: videoNodes,
      breadcrumb: breadcrumbList([
        { name: SITE_NAME, url: `${BASE_URL}/` },
        { name: "Countries", url: `${BASE_URL}${countriesPath}/` },
        { name: p.name, url: `${BASE_URL}${countryPath(p.code)}/` },
      ]),
    };
  }
  if (route.path === "countries") {
    return {
      title: "World Cup Nations — All 71 Teams, Titles & Records · The Road to Glory",
      description:
        "Every nation to play a FIFA World Cup, 1930–2026 — champions ranked by titles and all teams by confederation, each linking to its full record, results and top scorers.",
      canonical: `${countriesPath}/`,
      jsonLd: {
        "@type": "CollectionPage",
        name: "World Cup Nations",
        url: `${BASE_URL}${countriesPath}/`,
      },
      breadcrumb: breadcrumbList([
        { name: SITE_NAME, url: `${BASE_URL}/` },
        { name: "Countries", url: `${BASE_URL}${countriesPath}/` },
      ]),
    };
  }
  if (route.path === "match" && matchYear && TOURNAMENTS[matchYear]) {
    const t = TOURNAMENTS[matchYear];
    const analysis = analyses[matchYear];
    const found = analysis ? findMatchBySlug(t, analysis, route.params.slug) : null;
    if (found) {
      const taName = getTeamName(found.ta);
      const tbName = getTeamName(found.tb);
      const roundName = ROUND_NAME[found.round];
      const scoreStr = found.score ? `${found.score[0]}–${found.score[1]}` : null;
      const resultTitle = scoreStr ? `${taName} ${scoreStr} ${tbName}` : `${taName} vs ${tbName}`;
      const winnerName = found.winner ? getTeamName(found.winner) : null;
      const highlight = getHighlights(matchYear, found.ta, found.tb);
      const videoNode = highlight
        ? videoObjectForMatch({
            videoId: highlight.videoId,
            title: highlight.title,
            thumbnail: highlight.thumbnail,
            year: matchYear,
          })
        : null;
      return {
        title: `${resultTitle} — ${matchYear} FIFA World Cup ${roundName} · The Road to Glory`,
        description:
          `${taName} vs ${tbName}, ${matchYear} FIFA World Cup ${roundName} in ${t.host}. ` +
          (scoreStr
            ? `Final score ${scoreStr}${found.pens ? ` (${found.pens} pens)` : found.extra ? ` ${found.extra}` : ""}.${winnerName ? ` ${winnerName} advanced.` : ""} `
            : "") +
          `Goalscorers, result, and match details.`,
        canonical: `${matchPath(matchYear, found.slug)}/`,
        jsonLd: matchEvent(matchYear, t.host, taName, tbName, roundName, found.slug),
        jsonLdNodes: videoNode ? [videoNode] : undefined,
        breadcrumb: breadcrumbList([
          { name: SITE_NAME, url: `${BASE_URL}/` },
          { name: `${matchYear} FIFA World Cup`, url: `${BASE_URL}${tournamentPath(matchYear)}/` },
          { name: resultTitle, url: `${BASE_URL}${matchPath(matchYear, found.slug)}/` },
        ]),
      };
    }
  }
  if (route.path === "tournament" && tournamentYear && TOURNAMENTS[tournamentYear]) {
    const t = TOURNAMENTS[tournamentYear];
    const champ = getChampionForYear(tournamentYear, analyses);
    const champName = champ ? getTeamName(champ) : "TBD";
    const faqNodes = faqPage([
      { question: `Who won the ${tournamentYear} FIFA World Cup?`, answer: champName },
      { question: `Where was the ${tournamentYear} World Cup held?`, answer: t.host },
      { question: `Who was the top scorer of the ${tournamentYear} World Cup?`, answer: t.goldenBoot ? `${t.goldenBoot.name} with ${t.goldenBoot.goals} goals` : "Not yet decided" },
      { question: `How many teams participated in the ${tournamentYear} World Cup?`, answer: `${t.teams.length} teams` },
    ]);
    return {
      title: `${tournamentYear} FIFA World Cup Results — ${champName} Champion · The Road to Glory`,
      description: `${tournamentYear} FIFA World Cup in ${t.host}. ${t.quote || ""} Full knockout results, golden boot, and all participating nations.`,
      canonical: `${tournamentPath(tournamentYear)}/`,
      jsonLd: tournamentEvent(tournamentYear, t, champ),
      jsonLdNodes: [faqNodes],
      breadcrumb: breadcrumbList([
        { name: SITE_NAME, url: `${BASE_URL}/` },
        { name: `${tournamentYear} FIFA World Cup`, url: `${BASE_URL}${tournamentPath(tournamentYear)}/` },
      ]),
    };
  }
  return {
    title: `${activeYear} World Cup Bracket — ${champCode ? getTeamName(champCode) : "TBD"} · The Road to Glory`,
    description: "Every FIFA World Cup knockout stage since 1930, drawn as one interactive radial bracket.",
    canonical: "/",
  };
}

function getChampionForYear(year: number, analyses: Record<number, TournamentAnalysis>): string | null {
  const a = analyses[year];
  const d = TOURNAMENTS[year];
  if (!a || !d || a.champ === null) return null;
  return d.teams[a.champ] ?? null;
}
