import { useEffect } from "react";

interface SeoMeta {
  title: string;
  description: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = "https://worldcuparchive.net";

const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
};

const setCanonical = (href: string) => {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
};

const setJsonLd = (data: Record<string, unknown> | null) => {
  const id = "seo-jsonld";
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({ "@context": "https://schema.org", ...data });
  document.head.appendChild(script);
};

export function useSeo(meta: SeoMeta | null) {
  useEffect(() => {
    if (!meta) return;
    document.title = meta.title;
    setMeta("description", meta.description);
    setMeta("og:title", meta.title, "property");
    setMeta("og:description", meta.description, "property");
    setMeta("twitter:title", meta.title);
    setMeta("twitter:description", meta.description);
    const url = meta.canonical ? `${BASE_URL}${meta.canonical}` : BASE_URL;
    setCanonical(url);
    setMeta("og:url", url, "property");
    setJsonLd(meta.jsonLd ?? null);
  }, [meta]);
}

export { BASE_URL };
