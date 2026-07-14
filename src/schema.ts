// Shared schema.org SportsEvent builders for tournament and match pages. One
// source of truth so the static prerender (scripts/prerender.ts) and the runtime
// SEO hook (src/seo.ts via App.tsx) emit an identical, complete event — Google
// Search Console flags a SportsEvent that's missing recommended fields
// (image / organizer / eventStatus / location.address / performer), and emitting
// two different copies per page shows up as duplicate items.
import { TournamentData } from "./types";
import { getTeamName } from "./data";

export const BASE_URL = "https://worldcuparchive.net";

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
