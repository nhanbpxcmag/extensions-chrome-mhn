function loadCSSFileLocal(file) {
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL(`css/${file}`);
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}
// Listen for messages from the background script
function loadCSSFile(url) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = url;
  document.head.appendChild(link);
}
function init() {
  // loadCSSFile("https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/versions/bulma-prefixed.min.css");
}
init();
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "injectCSS") {
    // loadCSSFileLocal("bulma.min.css");
  }
});
function containsGoogleMapsSearch() {
  const url = window.location.href;
  const keyword = "https://www.google.com/maps/search/";
  return url.includes(keyword);
}
window.containsGoogleMapsSearch = containsGoogleMapsSearch;
