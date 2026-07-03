// Cloudflare Pages Function — "Markdown for Agents".
//
// The homepage is a client-rendered SPA: an agent that doesn't execute
// JavaScript sees only `<div id="root"></div>`. This intercepts requests to
// "/" that explicitly ask for `Accept: text/markdown` and serves the static
// llms.txt summary instead, so agents that support content negotiation get
// something real to read rather than an empty shell. Browsers (which send
// `Accept: text/html`) are unaffected and fall through to the normal SPA.
//
// https://developers.cloudflare.com/pages/functions/

interface Env {
  ASSETS: { fetch: typeof fetch };
}

// Shared agent-discovery Link header for homepage responses (RFC 8288).
const linkHeader =
  '</.well-known/api-catalog>; rel="api-catalog", ' +
  '</.well-known/agent-skills/index.json>; rel="agent-skills", ' +
  '</auth.md>; rel="auth-md", ' +
  '</llms.txt>; rel="llms.txt", ' +
  '</openapi.json>; rel="service-desc", ' +
  '</robots.txt>; rel="robots", ' +
  '</sitemap.xml>; rel="sitemap"';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const accept = context.request.headers.get("Accept") ?? "";
  const url = new URL(context.request.url);

  // Only the homepage supports Markdown for Agents content negotiation.
  if (url.pathname === "/" && accept.includes("text/markdown")) {
    const llmsUrl = new URL("/llms.txt", context.request.url);
    const res = await context.env.ASSETS.fetch(new Request(llmsUrl, context.request));
    const body = await res.text();

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        Link: linkHeader,
      },
    });
  }

  // Not a markdown request — hand off to the static asset pipeline (the SPA).
  return context.next();
};
