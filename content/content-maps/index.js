console.log("Running");

// Ví dụ: Tải file CSS

// Kiểm tra xem URL hiện tại có phải là trang Google Maps không
// Lắng nghe thay đổi URL qua popstate
window.addEventListener("popstate", () => {
  console.log("URL thay đổi qua popstate:", window.location.href);
});

// Lắng nghe thay đổi phần hash
window.addEventListener("hashchange", () => {
  console.log("Hash thay đổi:", window.location.hash);
});

// Theo dõi pushState và replaceState
const originalPushState = history.pushState;
history.pushState = function (...args) {
  console.log("URL được thay đổi (pushState):", args[2]);
  originalPushState.apply(history, args);
};

const originalReplaceState = history.replaceState;
history.replaceState = function (...args) {
  console.log("URL được thay đổi (replaceState):", args[2]);
  originalReplaceState.apply(history, args);
};
