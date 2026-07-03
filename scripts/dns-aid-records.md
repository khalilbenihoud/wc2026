# DNS for AI Discovery (DNS-AID) Records

To publish DNS-AID records for agent discovery, add the following DNS records
in the Cloudflare dashboard for `worldcuparchive.net`:

## ServiceMode SVCB/HTTPS records

These use the SVCB/HTTPS record type (RFC 9460) with alpn and endpoint parameters.

### Agent Index Service

```
_index._agents.worldcuparchive.net.  HTTPS  1 . alpn="h2,h3" endpoint="https://worldcuparchive.net/.well-known/agent-skills/index.json"
```

### A2A Service (Agent-to-Agent)

```
_a2a._agents.worldcuparchive.net.    HTTPS  1 . alpn="h2,h3" endpoint="https://worldcuparchive.net/"
```

## DNSSEC

Ensure DNSSEC is enabled for the `worldcuparchive.net` zone in the Cloudflare
dashboard so validating resolvers return authenticated data.

## Verification

After adding the records, verify with:

```bash
dig _index._agents.worldcuparchive.net HTTPS
dig _a2a._agents.worldcuparchive.net HTTPS
```

References:
- https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/
- https://www.rfc-editor.org/rfc/rfc9460
