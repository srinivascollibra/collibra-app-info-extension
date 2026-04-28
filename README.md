# Collibra App Info (Chrome extension)

Fetches `{projectBase}/rest/2.0/application/info` and copies the environment **URL** and **DGC Version** in one click for Jira/bug templates. Toolbar and popup use the [collibra.com](https://www.collibra.com/) favicon, resized into `icons/`

## Load unpacked in Chrome

1. Clone or download this repository.
2. Open `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select this folder: `chrome-extension-app-info`.
5. If Chrome lists **Site access** or host permissions, allow access for the sites you test (this extension uses broad `https://*/*` and `http://*/*` for internal and local test URLs—narrow in `manifest.json` if your org requires it).

## How to use

1. Open a tab on your project (any path on the same origin), or stay on any tab if you will paste a base URL.
2. Click the **Collibra App Info** extension icon.
3. Optional: type a **Project base URL** (e.g. `https://ai-model-registry.dev-aws.cp.collibra-ops.com` or `https://host/myapp` with a path prefix). If you leave it empty, the **active tab’s origin** is used.
4. Click **Copy URL & DGC version**. The clipboard will contain:

   ```text
   URL: <baseUrl from JSON>
   DGC Version: <version.fullVersion from JSON>
   ```

## Manual verification (optional)

With network access, you can confirm the same JSON in a shell:

```bash
curl -sS "https://ai-model-registry.dev-aws.cp.collibra-ops.com/rest/2.0/application/info" | head -c 500
```

The copied lines should match `baseUrl` and `version.fullVersion` in that response.

## Privacy note

The extension only runs when you open the popup and click the button. It does not read page content; it only uses the active tab’s URL to derive the origin when the optional field is empty, or uses your typed base URL.
