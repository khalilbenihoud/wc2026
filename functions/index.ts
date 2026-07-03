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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const accept = context.request.headers.get("Accept") ?? "";

  if (accept.includes("text/markdown")) {
    const llmsUrl = new URL("/llms.txt", context.request.url);
    const res = await context.env.ASSETS.fetch(new Request(llmsUrl, context.request));
    const body = await res.text();

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Not a markdown request — hand off to the static asset pipeline (the SPA).
  return context.next();
};
