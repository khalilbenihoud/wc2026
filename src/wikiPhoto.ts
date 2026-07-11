import { useEffect, useRef, useState } from "react";

// Wikipedia award-winner → page slug override (special characters / split names).
const WIKI_SLUG_OVERRIDE: Record<string, string> = {
  "Ronaldo": "Ronaldo_Nazário",
  "Michel Preud'homme": "Michel_Preud'homme",
  "Emiliano Martínez": "Emiliano_Martínez",
  "Oldřich Nejedlý": "Oldřich_Nejedlý",
  "Leônidas": "Leônidas",
  "Salvatore Schillaci": "Salvatore_Schillaci",
  "Hristo Stoichkov / Oleg Salenko": "Hristo_Stoichkov",
  "Davor Šuker": "Davor_Šuker",
  "Miroslav Klose": "Miroslav_Klose",
  "Thomas Müller": "Thomas_Müller",
  "James Rodríguez": "James_Rodríguez",
  "Harry Kane": "Harry_Kane",
  "Kylian Mbappé": "Kylian_Mbappé",
};

// Wikipedia slug for an award-winner name (handles "A / B" ties and "(disamb)").
export const gbSlug = (name: string) =>
  WIKI_SLUG_OVERRIDE[name] || name.split("/")[0].split(" (")[0].trim();

// Prefetch a winner's Wikipedia thumbnail as soon as the name changes (not on
// hover): check the in-memory + localStorage cache first, otherwise fetch once,
// preload the image, and persist it so it's instant next time. Returns the photo
// URL, or null while loading / when Wikipedia has no thumbnail.
export function useWikiPhoto(name: string | null | undefined): string | null {
  const [photo, setPhoto] = useState<string | null>(null);
  const cache = useRef<Record<string, string>>({});
  useEffect(() => {
    if (!name) {
      setPhoto(null);
      return;
    }
    const slug = gbSlug(name);
    const cached =
      cache.current[slug] ??
      (typeof localStorage !== "undefined" ? localStorage.getItem(`gb:${slug}`) : null);
    if (cached) {
      cache.current[slug] = cached;
      setPhoto(cached);
      return;
    }
    setPhoto(null);
    let cancelled = false;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const src: string | undefined = data?.thumbnail?.source;
        if (!src || cancelled) return;
        cache.current[slug] = src;
        try {
          localStorage.setItem(`gb:${slug}`, src);
        } catch {
          /* storage full / unavailable — in-memory cache still applies */
        }
        new Image().src = src; // warm the browser cache before render
        setPhoto(src);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [name]);
  return photo;
}
