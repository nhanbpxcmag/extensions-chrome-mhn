const URL_CHROME_EXTENSIONS_DOC = "https://nhanbpx.maihuunhan.name.vn/app/movies?name=";
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "JQsSCcC",
    title: "Tìm kiếm phim - MHN",
    contexts: ["selection"],
  });
});
function onClick(info) {
  switch (info.menuItemId) {
    case "JQsSCcC":
      const { selectionText } = info;
      chrome.tabs.create({ url: URL_CHROME_EXTENSIONS_DOC + encodeURI(selectionText) });
      break;
    default:
      // Standard context menu item function
      console.log("Standard context menu item clicked.");
  }
}
chrome.contextMenus.onClicked.addListener(onClick);
