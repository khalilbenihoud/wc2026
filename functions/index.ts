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
// https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/

interface Env {
  ASSETS: { fetch: typeof fetch };
}

// Shared agent-discovery Link header for homepage responses (RFC 8288).
const linkHeader =
  '</.well-known/api-catalog>; rel="api-catalog", ' +
  '</.well-known/agent-skills/index.json>; rel="agent-skills", ' +
  '</.well-known/mcp/server-card.json>; rel="mcp-server-card", ' +
  '</.well-known/oauth-authorization-server>; rel="oauth-authorization-server", ' +
  '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource", ' +
  '</.well-known/openid-configuration>; rel="openid-configuration", ' +
  '</auth.md>; rel="auth-md", ' +
  '</llms.txt>; rel="llms.txt", ' +
  '</openapi.json>; rel="service-desc", ' +
  '</robots.txt>; rel="robots", ' +
  '</sitemap.xml>; rel="sitemap"';

// Map of resource paths to their markdown file for content negotiation.
const markdownResources: Record<string, string> = {
  "/": "/llms.txt",
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const accept = context.request.headers.get("Accept") ?? "";
  const url = new URL(context.request.url);

  // Content negotiation: if the agent asks for markdown and we have a
  // markdown variant for this path, serve it.
  if (accept.includes("text/markdown")) {
    const mdPath = markdownResources[url.pathname];
    if (mdPath) {
      const mdUrl = new URL(mdPath, context.request.url);
      const res = await context.env.ASSETS.fetch(new Request(mdUrl, context.request));
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
  }

  // Not a markdown request, or no markdown variant exists — hand off to
  // the static asset pipeline (the SPA or static files).
  return context.next();
};
