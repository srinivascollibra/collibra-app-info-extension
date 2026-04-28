/**
 * Builds the Collibra-style application info URL from a project base.
 * Example: https://host/myapp/ → https://host/myapp/rest/2.0/application/info
 */
function buildInfoUrl(projectBase) {
  const trimmed = projectBase.trim().replace(/\/+$/, "");
  if (!trimmed) {
    throw new Error("Project base URL is empty.");
  }
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Invalid URL. Use https://host or https://host/path");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http and https URLs are supported.");
  }
  return `${trimmed}/rest/2.0/application/info`;
}

/**
 * Gets http(s) origin from the active tab, or null if not applicable.
 */
async function getActiveTabOrigin() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) {
    return null;
  }
  try {
    const u = new URL(tab.url);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return null;
    }
    return u.origin;
  } catch {
    return null;
  }
}

/**
 * Resolves which project base to use: manual input wins; else active tab origin.
 */
async function resolveProjectBase(manualInput) {
  const manual = manualInput.trim();
  if (manual) {
    return manual;
  }
  const origin = await getActiveTabOrigin();
  if (!origin) {
    throw new Error(
      "No project base entered and the active tab is not an http(s) page. Paste a base URL or open your app in a tab."
    );
  }
  return origin;
}

/**
 * One-click copy for bug reports: environment URL and DGC version.
 */
function formatClipboardText(baseUrl, fullVersion) {
  return `URL: ${baseUrl}\nDGC Version: ${fullVersion}`;
}

function setStatus(el, message, kind) {
  el.textContent = message;
  el.className = kind || "";
}

function setPreview(pre, text, visible) {
  pre.textContent = text;
  pre.classList.toggle("visible", visible);
  pre.setAttribute("aria-hidden", visible ? "false" : "true");
}

document.addEventListener("DOMContentLoaded", () => {
  const projectBaseInput = document.getElementById("projectBase");
  const copyBtn = document.getElementById("copyBtn");
  const statusEl = document.getElementById("status");
  const previewEl = document.getElementById("preview");

  copyBtn.addEventListener("click", async () => {
    setStatus(statusEl, "");
    setPreview(previewEl, "", false);
    copyBtn.disabled = true;

    try {
      const projectBase = await resolveProjectBase(projectBaseInput.value);
      const infoUrl = buildInfoUrl(projectBase);

      const res = await fetch(infoUrl, { method: "GET" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} — ${infoUrl}`);
      }

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Response is not valid JSON.");
      }

      const baseUrl = data?.baseUrl;
      const fullVersion = data?.version?.fullVersion;

      if (typeof baseUrl !== "string" || !baseUrl) {
        throw new Error('JSON missing string "baseUrl" (URL).');
      }
      if (typeof fullVersion !== "string" || !fullVersion) {
        throw new Error('JSON missing "version.fullVersion" (DGC Version).');
      }

      const clipboardText = formatClipboardText(baseUrl, fullVersion);
      await navigator.clipboard.writeText(clipboardText);

      setStatus(
        statusEl,
        "Copied to clipboard. Paste into your bug report.",
        "success"
      );
      setPreview(previewEl, clipboardText, true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus(statusEl, msg, "error");
    } finally {
      copyBtn.disabled = false;
    }
  });
});
