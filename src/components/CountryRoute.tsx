// Lazy boundary for the (parked) country page. Bundling the generated country
// profiles + stats here — instead of in App — keeps ~150KB of data out of the
// initial home-bracket payload. Only loaded when COUNTRY_PAGE_ENABLED is on and
// a /countries/<code> route is active.
import { CountryProfile, MOCK_COUNTRIES } from "../countries.mock";
import { generateCountryProfiles } from "../countries.generated";
import CountryPage from "./CountryPage";

let cached: Record<string, CountryProfile> | null = null;
function allCountries(): Record<string, CountryProfile> {
  if (!cached) cached = { ...generateCountryProfiles(), ...MOCK_COUNTRIES };
  return cached;
}

interface CountryRouteProps {
  code: string;
  onBack: () => void;
  onNavigate: (path: string) => void;
  onSelectCountry: (code: string) => void;
}

export default function CountryRoute({ code, onBack, onNavigate, onSelectCountry }: CountryRouteProps) {
  const countries = allCountries();
  const profile = countries[code];
  if (!profile) return null;

  return (
    <CountryPage
      profile={profile}
      allCountries={countries}
      onBack={onBack}
      onNavigate={onNavigate}
      onSelectCountry={onSelectCountry}
    />
  );
}
