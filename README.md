# Collibra Application Information — Chrome Extension

A lightweight Chrome extension for Collibra employees. Opens on any Collibra environment tab and copies the environment URL and DGC version in one click — ready to paste into a Jira ticket or bug report.

## Requirements

- Chrome 98 or later

## Install (load unpacked)

1. Clone or download this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the repository folder.
5. The **Collibra App Info** icon will appear in your Chrome toolbar. Look for the blue **INFO** badge on the icon — that's how you tell it apart from other Collibra extensions that share the same logo.

## How to use

### On a Collibra environment tab

Open any tab on a Collibra instance (e.g. `https://your-instance.collibra.com`). Click the extension icon — the DGC version and URL are fetched and displayed automatically.

Two copy actions are available:

| Button | What it copies |
| --- | --- |
| Clipboard icon | `URL: …` and `DGC Version: …` as plain text |
| **Copy for Jira** | URL, Version, Full Version, and Build Number as an HTML table — pastes directly as a formatted table in Jira |

## Supported domains

The extension auto-detects and fetches version info only for:

- `*.collibra.com`
- `*.collibra-ops.com`
- `*.collibra.dev`

## Dark mode

The extension respects the operating system's appearance setting and switches between light and dark themes automatically.

## Privacy

The extension activates only when you open the popup and click a button. It does not read page content, inject scripts, or send any data externally. The only network request made is a `GET` to `/rest/2.0/application/info` on the Collibra instance, with no credentials attached.

## Verification

To manually verify the API response in a terminal:

```bash
curl -sS "https://your-instance.collibra.com/rest/2.0/application/info" | head -c 500
```

The copied values match `baseUrl` and `version.fullVersion` (plus `version.displayVersion` and `version.buildNumber` for the Jira format).
