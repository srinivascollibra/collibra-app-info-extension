# Collibra App Info — Release Notes

A quick guide to what's new in each release of the Collibra App Info Chrome extension.

---

## Unreleased

### What's new
- **Collibra.tech support** — The extension now auto-detects `.collibra.tech` environments (e.g., `dg-qa-pb4.collibra.tech`) and fetches version info without any manual setup
- **Smarter Jira table** — When you copy for Jira, the label column now fits to its content instead of taking up extra space, making the table more compact
- **Version in footer** — The popup footer now displays the extension version and release date, so you can always tell what version you're running

---

## v1.0.2 — May 13, 2026

### What's new
- **INFO badge on the icon** — A blue **INFO** badge now appears on the extension's toolbar icon to make it easy to distinguish from other Collibra browser extensions
- **Dev environment support** — The extension now recognises `.collibra.dev` environments (e.g., `infra-main.collibra.dev`), so you can fetch version info from dev instances

---

## v1.0.1 — May 2, 2026

### What's new
- **Auto-fetch on open** — When you open the popup on a Collibra tab, version info is fetched automatically — no button click needed
- **Copy for Jira** — New **Copy for Jira** button pastes URL, Version, Full Version, and Build Number as a formatted table directly into a Jira ticket
- **Quick-copy button** — Clipboard icon button copies URL + DGC Version as plain text for quick use
- **Dark mode** — The extension now respects your system's dark mode preference
- **Smart domain detection** — The extension now only recognises official Collibra domains (`.collibra.com`, `.collibra-ops.com`) and shows a warning banner on other sites
- **Collapsible manual override** — URL input and fetch button are hidden in a collapsible "Try Another Environment" section by default
- **Improved branding** — Collibra wordmark logo in the header with light and dark variants

---

## v1.0.0 — April 28, 2026

### What's new (Initial release)
- **Fetch DGC version** — Click the extension icon on any Collibra tab to instantly fetch the environment URL and DGC version
- **One-click copy** — Copy both the URL and version to your clipboard in a single click, ready to paste into bug reports
