# SEO Analytics Specification

## Purpose
Attribute inbound traffic from organic search so the impact of SEO work can be
measured, by capturing a tracking event when a visitor arrives from a search
engine.

## Requirements

### Requirement: Organic search visit tracking
The system SHALL capture an analytics event when a visitor's referrer is a
recognized search engine (Google, Bing, or DuckDuckGo), recording the engine,
referring domain, and landing page.

#### Scenario: Arrival from a search engine
- **WHEN** the document referrer is a recognized search engine
- **THEN** an `seo_organic_visit` event is captured with the engine, referring
  domain, and landing page

#### Scenario: No referrer or non-search referrer
- **WHEN** there is no referrer, or the referrer is not a recognized search
  engine
- **THEN** no organic-visit event is captured

### Requirement: Deferred capture until analytics is ready
The system SHALL wait for the analytics client to become available before
capturing, and SHALL give up after a bounded time rather than polling forever.

#### Scenario: Analytics not yet loaded
- **WHEN** a qualifying visit occurs before the analytics client is ready
- **THEN** capture is retried until the client is available, and abandoned after
  a bounded timeout
