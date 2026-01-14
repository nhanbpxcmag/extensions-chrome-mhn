const BLOCKLIST_URL = "https://raw.githubusercontent.com/nhanbpxcmag/adblock-filter/refs/heads/main/autoCloseTabs";

// Parse dòng kiểu uBO: ||hbet.*^$document
function parseUBOLine(line) {
  if (!line.startsWith("||")) return null;
  if (!line.includes("$document")) return null;

  // Lấy phần domain giữa || và ^
  const domain = line.split("||")[1].split("^")[0].trim();
  if (!domain) return null;

  // Tạo regex dạng /:\/\/(.*\.)?hbet\.*/i
  const escaped = domain.replace(/\./g, "\\.").replace(/\*/g, ".*");
  return new RegExp(`:\/\/(.*\\.)?${escaped}`, "i");
}

let blockRegexList = [];

// Tải blocklist từ GitHub
async function loadBlockList() {
  try {
    const res = await fetch(BLOCKLIST_URL);
    const text = await res.text();
    const lines = text.split("\n");

    blockRegexList = lines
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("!")) // bỏ comment
      .map(parseUBOLine)
      .filter(Boolean);

    console.log("Loaded blocklist:", blockRegexList);
  } catch (e) {
    console.error("Failed to load blocklist:", e);
  }
}

// Kiểm tra URL có match domain không
function isBlocked(url) {
  return blockRegexList.some((regex) => regex.test(url));
}

// Mỗi khi tab load
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tab.url) return;
  if (isBlocked(tab.url)) {
    chrome.tabs.remove(tabId);
  }
});

// Load lần đầu
loadBlockList();

// Reload danh sách mỗi 10 phút
setInterval(loadBlockList, 10 * 60 * 1000);
