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
- `/.well-known/mcp/server-card.json` — MCP server card.
- `/.well-known/oauth-authorization-server` — OAuth 2.0 Authorization Server metadata.
- `/.well-known/oauth-protected-resource` — OAuth protected resource metadata (RFC 9728).
- `/.well-known/openid-configuration` — OpenID Connect discovery metadata.
- `/llms.txt` — Markdown summary of the site for LLM crawlers.
- `/robots.txt` — crawler access rules and content-usage signals.
- `/sitemap.xml` — canonical URL list.

## Agent auth block

```json
{
  "agent_auth": {
    "register_uri": "https://worldcuparchive.net/auth.md",
    "supported_identity_types": [],
    "supported_credential_types": []
  }
}
```

This site is fully public and read-only. No registration endpoint, identity types, or credential types are needed. The `register_uri` points to this document for reference.

## Credential use

No credentials, tokens, or API keys are issued by this service.

## Contact

For questions about automated access, refer to `llms.txt` or `robots.txt`.
