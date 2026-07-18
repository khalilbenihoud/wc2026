// Shared schema.org SportsEvent builders for tournament and match pages. One
// source of truth so the static prerender (scripts/prerender.ts) and the runtime
// SEO hook (src/seo.ts via App.tsx) emit an identical, complete event — Google
// Search Console flags a SportsEvent that's missing recommended fields
// (image / organizer / eventStatus / location.address / performer), and emitting
// two different copies per page shows up as duplicate items.
import { TournamentData } from "./types";
import { getTeamName } from "./data";

export const BASE_URL = "https://worldcuparchive.net";

// Site/brand name — the breadcrumb root, shown in the visible breadcrumb and in
// the BreadcrumbList structured data so the two stay identical (Google wants the
// structured breadcrumb to mirror the one on the page).
export const SITE_NAME = "The Road to Glory";

const FIFA_ORGANIZER = {
  "@type": "Organization",
  name: "FIFA",
  url: "https://www.fifa.com",
};

// og-image is the one image we ship for every page; absolute URL, as Google wants.
const EVENT_IMAGE = [`${BASE_URL}/og-image.webp`];

const team = (name: string) => ({ "@type": "SportsTeam", name });

// Host string can be a single nation ("Brazil") or co-hosts ("USA · Canada ·
// Mexico"); either way we surface it as the Place name + address country so the
// "address" recommendation is satisfied.
const place = (host: string) => ({
  "@type": "Place",
  name: host,
  address: { "@type": "PostalAddress", addressCountry: host },
});

export function tournamentEvent(
  year: number,
  t: TournamentData,
  championCode: string | null
): Record<string, unknown> {
  const ev: Record<string, unknown> = {
    "@type": "SportsEvent",
    name: `${year} FIFA World Cup`,
    sport: "Association football",
    startDate: `${year}-06-01`,
    endDate: `${year}-07-31`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: place(t.host),
    image: EVENT_IMAGE,
    organizer: FIFA_ORGANIZER,
    description: t.quote || `${year} FIFA World Cup in ${t.host}.`,
    url: `${BASE_URL}/tournaments/${year}/`,
  };
  // The champion stands in as the event's performer once the tournament is
  // decided (ongoing editions simply omit it rather than list a placeholder).
  if (championCode) ev.performer = [team(getTeamName(championCode))];
  return ev;
}

export function matchEvent(
  year: number,
  host: string,
  taName: string,
  tbName: string,
  roundName: string,
  slug: string
): Record<string, unknown> {
  return {
    "@type": "SportsEvent",
    name: `${taName} vs ${tbName} — ${year} FIFA World Cup ${roundName}`,
    sport: "Association football",
    startDate: `${year}-06-01`,
    endDate: `${year}-07-31`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: place(host),
    image: EVENT_IMAGE,
    organizer: FIFA_ORGANIZER,
    competitor: [team(taName), team(tbName)],
    performer: [team(taName), team(tbName)],
    url: `${BASE_URL}/tournaments/${year}/matches/${slug}/`,
  };
}

// A BreadcrumbList so pages earn the breadcrumb SERP treatment and Google reads
// the Home › Tournament › Match hierarchy. Emitted alongside the SportsEvent /
// SportsTeam node (as a @graph) by both the static prerender and the runtime SEO
// hook, so the crawler-served HTML and the JS-rendered DOM stay identical. The
// last crumb is the current page (its `item` URL is still included, which Google
// accepts). `url` values should be absolute, trailing-slash canonicals.
export function breadcrumbList(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// Convert a country-page video highlight into schema.org VideoObject. Real
// title, thumbnail, and URL are available for every clip; the edition year is
// used as an approximate uploadDate so Google treats the page as eligible for
// video rich results.
export function videoObject(v: {
  title: string;
  thumbnail: string;
  url: string;
  year?: number;
}): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    "@type": "VideoObject",
    name: v.title,
    description: v.title,
    thumbnailUrl: v.thumbnail,
    contentUrl: v.url,
    url: v.url,
  };
  if (v.year) obj.uploadDate = `${v.year}-01-01`;
  return obj;
}
