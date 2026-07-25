## ADDED Requirements

### Requirement: Share control on tournament and country pages
The system SHALL present a share control on every tournament page and every country page that lets a visitor share that page. The control SHALL share the page's canonical URL and the page's current SEO title.

#### Scenario: Control present on a country page
- **WHEN** a visitor views a country page
- **THEN** a visible share control is rendered in the page header area
- **AND** activating it targets that country's canonical URL and title

#### Scenario: Control present on a tournament page
- **WHEN** a visitor views a tournament page
- **THEN** a visible share control is rendered in the page header area
- **AND** activating it targets that tournament's canonical URL and title

### Requirement: Native share sheet when supported
When the Web Share API is available in the browser, the control SHALL invoke the native share sheet instead of showing a custom fallback UI.

#### Scenario: Web Share API available
- **WHEN** the visitor activates the share control in a browser where `navigator.share` (and `navigator.canShare`) is available
- **THEN** the system calls `navigator.share` with the page title and canonical URL
- **AND** no custom share popover is shown

#### Scenario: Visitor dismisses the native sheet
- **WHEN** the visitor cancels the native share sheet
- **THEN** the page continues to function with no error surfaced to the visitor

### Requirement: Fallback share options when native sharing is unavailable
When the Web Share API is not available, the control SHALL present a fallback with, at minimum, Copy link, X, WhatsApp, and Facebook options that open the correct share destination for the current page.

#### Scenario: Copy link
- **WHEN** the visitor chooses Copy link in the fallback
- **THEN** the page's canonical URL is written to the clipboard
- **AND** the visitor receives confirmation that the link was copied

#### Scenario: Share to a specific network
- **WHEN** the visitor chooses X, WhatsApp, or Facebook in the fallback
- **THEN** the corresponding network share URL opens with the page's canonical URL correctly encoded

#### Scenario: Clipboard API unavailable
- **WHEN** the visitor chooses Copy link and the Clipboard API is unavailable
- **THEN** the system falls back to a selectable-text copy path rather than failing silently
