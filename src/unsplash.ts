import { useEffect, useState } from "react";

// Free Unsplash API integration. Requires a free "Access Key" in
// VITE_UNSPLASH_ACCESS_KEY. Without it, useUnsplashImage always returns null
// and callers fall back to their non-image layout — the app still builds/runs.
//
// Unsplash search over-weights the country term (a plain "Argentina football"
// query returns mountains and flags), so instead of taking the first hit we
// fetch a batch and pick the result whose description best matches a set of
// football keywords. If nothing in the country batch reads as football, we
// fall back to a generic football query so the hero is always on-theme.

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const UTM = "utm_source=the_road_to_glory&utm_medium=referral";

// Whether a hero photo can be fetched at all. Callers use this to reserve the
// image's space before the request resolves, avoiding a layout jump.
export const UNSPLASH_ENABLED = Boolean(ACCESS_KEY);

export interface UnsplashImage {
  url: string;
  alt: string;
  authorName: string;
  authorUrl: string;
}

interface Options {
  /** Words that mark a result as on-theme; the highest-scoring photo wins. */
  keywords?: string[];
  /** Searched when no result in the primary batch matches any keyword. */
  fallbackQuery?: string;
}

interface Photo {
  urls: { regular: string };
  alt_description: string | null;
  description: string | null;
  links?: { download_location?: string };
  user?: { name?: string; links?: { html?: string } };
}

async function search(query: string): Promise<Photo[]> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=12&orientation=landscape&content_filter=high`,
    { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
  );
  if (!res.ok) throw new Error(`Unsplash ${res.status}`);
  const data = await res.json();
  return (data.results ?? []) as Photo[];
}

// Number of keyword hits in a photo's text — used to rank on-theme results.
function score(photo: Photo, keywords: string[]): number {
  if (keywords.length === 0) return 0;
  const text = `${photo.alt_description ?? ""} ${photo.description ?? ""}`.toLowerCase();
  return keywords.reduce((n, k) => (text.includes(k) ? n + 1 : n), 0);
}

// Pick a photo from the batch we already fetched. Rather than always taking the
// single best match, we randomise among the strongest on-theme results so each
// fresh load can surface a different picture — at no extra request cost. Returns
// null when keywords are given but nothing in the batch is on-theme, so the
// caller can fall back to a generic query.
function pick(photos: Photo[], keywords: string[]): Photo | null {
  if (photos.length === 0) return null;
  if (keywords.length === 0) return photos[Math.floor(Math.random() * photos.length)];

  const scored = photos.map((p) => ({ p, s: score(p, keywords) }));
  const max = Math.max(...scored.map((x) => x.s));
  if (max === 0) return null;

  // Pool the top tier (best score and one below) for variety without dropping quality.
  const pool = scored.filter((x) => x.s >= max - 1 && x.s > 0);
  return pool[Math.floor(Math.random() * pool.length)].p;
}

function toImage(photo: Photo): UnsplashImage {
  // Unsplash API guideline: trigger a download event when a photo is used.
  if (photo.links?.download_location) {
    fetch(`${photo.links.download_location}&client_id=${ACCESS_KEY}`).catch(() => {});
  }
  return {
    url: photo.urls.regular,
    alt: photo.alt_description ?? "",
    authorName: photo.user?.name ?? "Unsplash",
    authorUrl: `${photo.user?.links?.html ?? "https://unsplash.com"}?${UTM}`,
  };
}

export function useUnsplashImage(query: string | null, opts: Options = {}): UnsplashImage | null {
  const { keywords = [], fallbackQuery } = opts;
  const [image, setImage] = useState<UnsplashImage | null>(null);

  useEffect(() => {
    if (!query || !ACCESS_KEY) return;

    // No caching: each visit fetches fresh so the random pick differs every time.
    let cancelled = false;
    setImage(null);
    (async () => {
      try {
        const primary = await search(query);
        let photo = pick(primary, keywords);

        // Nothing in the country batch reads as football → use the fallback.
        if (!photo && fallbackQuery) {
          const generic = await search(fallbackQuery);
          photo = pick(generic, keywords);
        }

        // Last resort: any result, even if off-theme.
        photo = photo ?? primary[0] ?? null;

        if (photo && !cancelled) setImage(toImage(photo));
      } catch {
        // Network error / rate limit / bad key — silently fall back.
      }
    })();

    return () => {
      cancelled = true;
    };
    // keywords/fallbackQuery are config constants per call site; query drives fetches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return image;
}
