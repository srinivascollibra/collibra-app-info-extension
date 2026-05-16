function isCollibraOrigin(origin) {
  try {
    const { hostname } = new URL(origin);
    // must end with .collibra.com, .collibra-ops.com, .collibra.dev, or .collibra.tech (or be the apex)
    return /(?:^|\.)collibra(?:\.com|-ops\.com|\.dev|\.tech)$/.test(hostname.toLowerCase());
  } catch {
    return false;
  }
}

function buildInfoUrl(base) {
  const trimmed = base.trim().replace(/\/+$/, "");
  if (!trimmed) throw new Error("URL is empty.");
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

async function getActiveTabOrigin() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return null;
  try {
    const u = new URL(tab.url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.origin;
  } catch {
    return null;
  }
}

async function fetchAppInfo(base) {
  const infoUrl = buildInfoUrl(base);
  const res = await fetch(infoUrl, { method: "GET", credentials: "omit" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} — ${infoUrl}`);
  let data;
  try {
    data = JSON.parse(await res.text());
  } catch {
    throw new Error("Response is not valid JSON.");
  }
  if (typeof data?.baseUrl !== "string" || !data.baseUrl) {
    throw new Error('JSON missing "baseUrl".');
  }
  if (typeof data?.version?.fullVersion !== "string" || !data.version.fullVersion) {
    throw new Error('JSON missing "version.fullVersion".');
  }
  return data;
}

function formatSimpleText(data) {
  return `URL: ${data.baseUrl}\nDGC Version: ${data.version.fullVersion}`;
}

function formatJiraPlain(data) {
  const v = data.version;
  const lines = [`URL: ${data.baseUrl}`];
  if (v.displayVersion) lines.push(`Version: ${v.displayVersion}`);
  lines.push(`Full Version: ${v.fullVersion}`);
  if (v.buildNumber != null) lines.push(`Build: ${v.buildNumber}`);
  return lines.join("\n");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatJiraHtml(data) {
  const v = data.version;
  const rows = [["URL", data.baseUrl]];
  if (v.displayVersion) rows.push(["Version", v.displayVersion]);
  rows.push(["Full Version", v.fullVersion]);
  if (v.buildNumber != null) rows.push(["Build", String(v.buildNumber)]);
  const rowsHtml = rows
    .map(([label, value]) => `<tr><th style="width: auto;"><strong>${escapeHtml(label)}</strong></th><td>${escapeHtml(value)}</td></tr>`)
    .join("");
  return `<table style="width: 100%;"><tbody>${rowsHtml}</tbody></table>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const projectBaseInput = document.getElementById("projectBase");
  const fetchBtn = document.getElementById("fetchBtn");
  const copySimpleBtn = document.getElementById("copySimpleBtn");
  const copyJiraBtn = document.getElementById("copyJiraBtn");
  const statusEl = document.getElementById("status");
  const previewEl = document.getElementById("preview");
  const autoInfoPanel = document.getElementById("autoInfoPanel");
  const notCollibra = document.getElementById("notCollibra");
  const loadingEl = document.getElementById("loading");
  const infoUrlEl = document.getElementById("infoUrl");
  const infoDgcVersionEl = document.getElementById("infoDgcVersion");

  let currentData = null;

  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = kind || "";
  }

  function setPreview(text, visible) {
    previewEl.textContent = text;
    previewEl.classList.toggle("visible", visible);
    previewEl.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  function showInfo(data) {
    currentData = data;
    infoUrlEl.textContent = data.baseUrl;
    infoDgcVersionEl.textContent = data.version.fullVersion;
    autoInfoPanel.style.display = "block";
  }

  function hideInfo() {
    autoInfoPanel.style.display = "none";
    currentData = null;
  }

  // Auto-fetch on open if on a Collibra instance
  const origin = await getActiveTabOrigin();
  if (origin && isCollibraOrigin(origin)) {
    loadingEl.style.display = "block";
    try {
      showInfo(await fetchAppInfo(origin));
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err), "error");
    } finally {
      loadingEl.style.display = "none";
    }
  } else if (origin) {
    notCollibra.style.display = "block";
  }

  // Manual fetch via override URL or active tab
  fetchBtn.addEventListener("click", async () => {
    setStatus("");
    setPreview("", false);
    fetchBtn.disabled = true;
    loadingEl.style.display = "block";
    hideInfo();
    try {
      const base = projectBaseInput.value.trim() || (await getActiveTabOrigin());
      if (!base) throw new Error("No URL entered and active tab is not http(s).");
      showInfo(await fetchAppInfo(base));
      setStatus("Fetched successfully.", "success");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err), "error");
    } finally {
      fetchBtn.disabled = false;
      loadingEl.style.display = "none";
    }
  });

  // Small icon: copy URL + DGC Version
  copySimpleBtn.addEventListener("click", async () => {
    if (!currentData) return;
    try {
      const text = formatSimpleText(currentData);
      await navigator.clipboard.writeText(text);
      setStatus("Copied URL & DGC version.", "success");
      setPreview(text, true);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err), "error");
    }
  });

  // Copy for Jira: HTML table (pastes as table in Jira) + plain text fallback
  copyJiraBtn.addEventListener("click", async () => {
    if (!currentData) return;
    try {
      const html = formatJiraHtml(currentData);
      const plain = formatJiraPlain(currentData);
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
      setStatus("Copied for Jira.", "success");
      setPreview(plain, true);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err), "error");
    }
  });
});
