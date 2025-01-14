// Replace this with the domain you want to target
const targetDomain = "https://www.google.com/maps";
chrome.runtime.onInstalled.addListener(() => {
  //   chrome.storage.local.set({ cssEnabled: true });
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.includes(targetDomain)) {
    chrome.tabs.sendMessage(tabId, { action: "injectCSS" });
  }
});
