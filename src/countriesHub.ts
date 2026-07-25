// Grouping for the /countries hub, shared by the client component and the
// prerenderer so the static HTML and the React render list nations identically.
import { generateCountryProfiles } from "./countries.generated";
import { applyMockOverrides } from "./countries.mock";
import { COUNTRY_CODES, slugForCode } from "./countrySlug";

// Confederation display order; "Historic" always sorts last.
export const CONFEDERATIONS = ["UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC"] as const;
export const HISTORIC_GROUP = "Historic";

// Nations that no longer exist as football entities — shown in their own group
// rather than under a present-day confederation.
const HISTORIC = new Set(["URS", "FRG", "GDR", "TCH", "YUG", "ZAI", "IDN"]);

export interface HubNation {
  code: string;
  name: string;
  slug: string;
  titles: number;
  appearances: number;
}

export interface HubGroup {
  label: string;
  nations: HubNation[];
}

export interface HubData {
  total: number;
  champions: HubNation[]; // titles > 0, most titles first
  groups: HubGroup[]; // confederations in order, then Historic
}

const byName = (a: HubNation, b: HubNation) => a.name.localeCompare(b.name);

export function getHubData(): HubData {
  const profiles = applyMockOverrides(generateCountryProfiles());
  const nations: HubNation[] = [];
  for (const code of COUNTRY_CODES) {
    const p = profiles[code];
    const slug = slugForCode(code);
    if (!p || !slug) continue;
    nations.push({
      code,
      name: p.name,
      slug,
      titles: p.titles?.length ?? 0,
      appearances: p.appearances,
    });
  }

  const champions = nations
    .filter((n) => n.titles > 0)
    .sort((a, b) => b.titles - a.titles || byName(a, b));

  const groupOrder = [...CONFEDERATIONS, HISTORIC_GROUP];
  const buckets = new Map<string, HubNation[]>(groupOrder.map((g) => [g, []]));
  for (const n of nations) {
    const profileConf = profiles[n.code]!.confederation;
    const group = HISTORIC.has(n.code) ? HISTORIC_GROUP : profileConf;
    (buckets.get(group) ?? buckets.get(HISTORIC_GROUP)!).push(n);
  }

  const groups: HubGroup[] = groupOrder
    .map((label) => ({ label, nations: (buckets.get(label) ?? []).sort(byName) }))
    .filter((g) => g.nations.length > 0);

  return { total: nations.length, champions, groups };
}
