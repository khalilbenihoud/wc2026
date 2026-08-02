// Self-contained effect hooks lifted out of App to keep the component focused on
// composition. Each is a behaviour-preserving move of an effect that App used to
// inline.

import { useState, useEffect } from "react";
import { TOURNAMENTS } from "./data";

// The radial bracket is desktop-only; phones get the champion-timeline grid.
// Tracks the viewport reactively so resizing across the breakpoint stays correct.
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// Preload the sibling overlay's code-split chunk so navigating between them is
// instant — otherwise the Suspense fallback flashes the home bracket while the
// chunk downloads. Deferred to idle so it doesn't contend with the current
// overlay's own load.
export function useOverlayPreload(routePath: string): void {
  useEffect(() => {
    const preload = () => {
      if (routePath === "tournament" || routePath === "match") {
        import("./components/CountryRoute");
        import("./components/CountriesHub");
        import("./components/ComparePage");
      } else if (routePath === "country") {
        import("./components/TournamentPage");
        import("./components/CountriesHub");
        import("./components/ComparePage"); // reachable via rivalry links
      } else if (routePath === "countries") {
        import("./components/CountryRoute");
      } else if (routePath === "compare") {
        import("./components/CountryRoute");
        import("./components/TournamentPage");
      }
    };
    const ric = window.requestIdleCallback;
    if (ric) {
      // timeout so a busy main thread (e.g. the champion confetti) can't starve
      // the preload — otherwise the chunk isn't ready when the user taps through.
      const id = ric(preload, { timeout: 200 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(preload, 400);
    return () => window.clearTimeout(id);
  }, [routePath]);
}

// WebMCP: expose "switch tournament year" as an agent-invokable tool, when the
// browser supports it. Experimental API (navigator.modelContext isn't in the DOM
// lib yet), feature-detected so this is a no-op everywhere else.
export function useYearToolContext(setActiveYear: (year: number) => void): void {
  useEffect(() => {
    const modelContext = (
      navigator as unknown as {
        modelContext?: { provideContext: (options: unknown) => void };
      }
    ).modelContext;
    if (!modelContext) return;

    modelContext.provideContext({
      tools: [
        {
          name: "select_world_cup_year",
          description:
            "Switch the displayed bracket to a specific FIFA World Cup year, to view that tournament's host, champion, and knockout results.",
          inputSchema: {
            type: "object",
            properties: {
              year: {
                type: "number",
                enum: Object.keys(TOURNAMENTS).map(Number),
                description: "The tournament year to display, e.g. 2022.",
              },
            },
            required: ["year"],
          },
          execute: async ({ year }: { year: number }) => {
            setActiveYear(year);
            return {
              content: [{ type: "text", text: `Now showing the ${year} World Cup bracket.` }],
            };
          },
        },
      ],
    });
  }, [setActiveYear]);
}
