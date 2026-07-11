import { useEffect } from "react";

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, props?: Record<string, unknown>) => void;
      identify?: (id: string) => void;
    };
  }
}

export function useSeoTracking() {
  useEffect(() => {
    const referrer = document.referrer;
    if (!referrer) return;

    try {
      const url = new URL(referrer);
      const isGoogle = /google\./i.test(url.hostname);
      const isBing = /bing\.com/i.test(url.hostname);
      const isDuckDuckGo = /duckduckgo\.com/i.test(url.hostname);

      if (isGoogle || isBing || isDuckDuckGo) {
        const engine = isGoogle ? "google" : isBing ? "bing" : "duckduckgo";
        const capture = () => {
          window.posthog?.capture("seo_organic_visit", {
            search_engine: engine,
            referring_domain: url.hostname,
            landing_page: window.location.pathname,
            $set: { seo_source: engine },
          });
        };
        if (window.posthog?.capture) {
          capture();
        } else {
          const check = setInterval(() => {
            if (window.posthog?.capture) {
              capture();
              clearInterval(check);
            }
          }, 500);
          setTimeout(() => clearInterval(check), 10000);
        }
      }
    } catch {
      // invalid referrer URL
    }
  }, []);
}
