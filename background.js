const BADGE_TEXT = "INFO";
const BADGE_COLOR = "#1E88E5";

function applyBadge() {
  chrome.action.setBadgeText({ text: BADGE_TEXT });
  chrome.action.setBadgeBackgroundColor({ color: BADGE_COLOR });
}

chrome.runtime.onInstalled.addListener(applyBadge);
chrome.runtime.onStartup.addListener(applyBadge);
