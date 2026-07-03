# auth.md — The Road to Glory

This document describes how AI agents can register or authenticate with `worldcuparchive.net`.

## Audience

- AI agents and automated crawlers that need to understand the site's access model.

## Authentication status

`worldcuparchive.net` is a read-only, static website. It does not expose protected APIs and does not require authentication for any public resource.

## Registration / provisioning

No agent registration is required. All machine-readable resources are served publicly:

- `/.well-known/api-catalog` — API/resource catalog (RFC 9727).
- `/.well-known/agent-skills/index.json` — agent skills discovery index.
- `/llms.txt` — Markdown summary of the site for LLM crawlers.
- `/robots.txt` — crawler access rules and content-usage signals.
- `/sitemap.xml` — canonical URL list.

## Credential use

No credentials, tokens, or API keys are issued by this service.

## Contact

For questions about automated access, refer to `llms.txt` or `robots.txt`.
