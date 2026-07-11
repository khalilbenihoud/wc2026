import { useState, useEffect, useCallback, useMemo } from "react";

export interface Route {
  path: string;
  params: Record<string, string>;
}

const matchRoute = (pathname: string): Route => {
  const p = pathname.replace(/\/+$/, "") || "/";

  let m = p.match(/^\/countries\/([a-zA-Z]{3})$/);
  if (m) return { path: "country", params: { code: m[1].toUpperCase() } };

  m = p.match(/^\/tournaments\/(\d{4})\/matches\/(.+)$/);
  if (m) return { path: "match", params: { year: m[1], slug: m[2] } };

  m = p.match(/^\/tournaments\/(\d{4})\/group\/([a-zA-Z])$/);
  if (m) return { path: "group", params: { year: m[1], group: m[2].toUpperCase() } };

  m = p.match(/^\/tournaments\/(\d{4})$/);
  if (m) return { path: "tournament", params: { year: m[1] } };

  m = p.match(/^\/players\/(.+)$/);
  if (m) return { path: "player", params: { slug: m[1] } };

  return { path: "home", params: {} };
};

export function useRouter() {
  const [route, setRoute] = useState<Route>(() =>
    matchRoute(window.location.pathname)
  );

  useEffect(() => {
    const onPop = () => setRoute(matchRoute(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState(null, "", to);
    setRoute(matchRoute(to));
    window.scrollTo(0, 0);
  }, []);

  return useMemo(() => ({ route, navigate }), [route, navigate]);
}

// The country page is disabled for now (its profile data isn't ready to ship).
// Flip to true to re-enable the page, all links to it, and the country routes.
export const COUNTRY_PAGE_ENABLED = false;

export const countryPath = (code: string) => `/countries/${code.toLowerCase()}`;
export const tournamentPath = (year: number) => `/tournaments/${year}`;
export const matchPath = (year: number, slug: string) =>
  `/tournaments/${year}/matches/${slug}`;
export const groupPath = (year: number, group: string) =>
  `/tournaments/${year}/group/${group.toLowerCase()}`;
export const playerPath = (slug: string) => `/players/${slug}`;
