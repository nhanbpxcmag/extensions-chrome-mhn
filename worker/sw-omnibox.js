chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  let c = false;
  const { apiSuggestions } = await chrome.storage.local.get("apiSuggestions");
  if (reason === "install" || (reason === "update" && !apiSuggestions)) c = true;
  if (c) {
    chrome.storage.local.set({
      apiSuggestions: [],
    });
  }
});
const URL_CHROME_EXTENSIONS_DOC = "https://tools.maihuunhan.name.vn/phim?tab=name&name_movie=";
const NUMBER_OF_PREVIOUS_SEARCHES = 4;

// Display the suggestions after user starts typing
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  await chrome.omnibox.setDefaultSuggestion({
    description: "Nhập tên phim",
  });
  const { apiSuggestions } = await chrome.storage.local.get("apiSuggestions");
  if (apiSuggestions) {
    const suggestions = apiSuggestions.map((api) => {
      return { content: api, description: `Phim: ${api}` };
    });
    suggest(suggestions);
  }
});
chrome.omnibox.onInputEntered.addListener((input) => {
  chrome.tabs.create({ url: URL_CHROME_EXTENSIONS_DOC + encodeURI(input) });
  // Save the latest keyword
  updateHistory(input);
});
async function updateHistory(input) {
  const { apiSuggestions } = await chrome.storage.local.get("apiSuggestions");
  console.log("🚀 --- updateHistory --- apiSuggestions:", apiSuggestions);
  if (apiSuggestions) {
    apiSuggestions.unshift(input);
    apiSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES);
  }
  return chrome.storage.local.set({ apiSuggestions });
}
