// Lazy boundary for the country page. Bundling the generated country profiles
// + stats here — instead of in App — keeps ~150KB of data out of the initial
// home-bracket payload. Only loaded when COUNTRY_PAGE_ENABLED is on and a
// /countries/<code> route is active.
import { MOCK_COUNTRIES } from "../countries.mock";
import { generateCountryProfiles } from "../countries.generated";
import CountryPage from "./CountryPage";

let cached: ReturnType<typeof generateCountryProfiles> | null = null;
function allCountries() {
  if (!cached) cached = { ...generateCountryProfiles(), ...MOCK_COUNTRIES };
  return cached;
}

interface CountryRouteProps {
  code: string;
  onBack: () => void;
  onNavigate: (path: string) => void;
}

export default function CountryRoute({ code, onBack, onNavigate }: CountryRouteProps) {
  const profile = allCountries()[code];
  if (!profile) return null;

  return (
    <CountryPage
      profile={profile}
      onBack={onBack}
      onNavigate={onNavigate}
    />
  );
}
