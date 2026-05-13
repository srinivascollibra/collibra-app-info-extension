# Changelog

## [1.0.2] — 2026-05-13

### Added
- Toolbar badge "INFO" overlay (blue background) to visually distinguish this extension from other Collibra browser extensions sharing the same logo
- Support for `*.collibra.dev` environments (e.g. `infra-main.collibra.dev`, `infra-release-*.collibra.dev`)
- Background service worker (`background.js`) that applies the badge on install and startup

### Changed
- `isCollibraOrigin` regex extended to recognise `.collibra.dev` alongside `.collibra.com` and `.collibra-ops.com`
- `host_permissions` extended to include `https://*.collibra.dev/*`

---

## [1.0.1] — 2026-05-02

### Added
- Auto-fetch DGC version on popup open when active tab is a Collibra environment
- "Copy for Jira" button: copies URL, Version, Full Version, and Build Number as an HTML table (pastes directly as a table in Jira)
- Clipboard icon button: copies URL + DGC Version as plain text for quick use
- Dark mode support via CSS custom properties and `prefers-color-scheme`
- Collibra brand logo in header with light/dark variants (`logo.png` / `logo-reverse.png`)
- Orange "Not a Collibra environment" banner shown automatically on non-Collibra tabs
- Collapsible "Try Another Environment" section for manual URL override
- Footer with copyright

### Changed
- Collibra domain detection tightened: only `.collibra.com` and `.collibra-ops.com` hostnames are recognised (fixes false positive on URLs like `engineering-collibra.atlassian.net`)
- Fetch calls now use `credentials: "omit"` — no auth headers or cookies are sent
- `host_permissions` narrowed from `https://*/*` to Collibra domains only

### Fixed
- HTML values in clipboard output are now properly escaped (prevents malformed HTML if API response contains special characters)

### Manifest
- Added `minimum_chrome_version: "98"` (required for `ClipboardItem` API)

---

## [1.0.0] — Initial release

### Added
- Fetch `/rest/2.0/application/info` and copy environment URL + DGC version to clipboard for bug reports
