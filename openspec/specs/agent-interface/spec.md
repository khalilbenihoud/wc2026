# Agent Interface Specification

## Purpose
Make the site legible and actionable to AI agents that do not execute
JavaScript: serve a Markdown summary via content negotiation, advertise
agent-discovery resources, and expose an in-page tool an agent can invoke to
control the bracket.

## Requirements

### Requirement: Markdown content negotiation for the homepage
The system SHALL serve a static Markdown summary (`llms.txt`) in response to a
homepage request that explicitly asks for `text/markdown`, while browsers
requesting `text/html` continue to receive the SPA.

#### Scenario: Agent requests markdown
- **WHEN** a GET request for `/` includes `Accept: text/markdown`
- **THEN** the response body is the `llms.txt` summary with
  `Content-Type: text/markdown` and HTTP 200

#### Scenario: Browser requests HTML
- **WHEN** a GET request for `/` does not ask for markdown
- **THEN** the request falls through to the normal SPA / static asset pipeline

### Requirement: Agent-discovery link header
Homepage responses SHALL include an RFC 8288 `Link` header advertising
agent-discovery resources (e.g. `llms.txt`, `openapi.json`, sitemap, robots,
and `.well-known` resources).

#### Scenario: Discovery header present
- **WHEN** the homepage markdown response is returned
- **THEN** it carries a `Link` header referencing the discovery resources

### Requirement: In-page agent tool
The system SHALL expose a "select World Cup year" tool via the browser's
model-context API when available, so an agent can switch the displayed bracket
to a specific edition. When the API is unavailable the feature SHALL be a no-op.

#### Scenario: Model-context API available
- **WHEN** the browser exposes `navigator.modelContext`
- **THEN** a `select_world_cup_year` tool is registered whose year argument is
  constrained to the available editions, and invoking it switches the bracket

#### Scenario: Model-context API unavailable
- **WHEN** the browser does not expose `navigator.modelContext`
- **THEN** no tool is registered and nothing else changes
