function onClick() {
  if (window.containsGoogleMapsSearch()) {
    const modal = new bootstrap.Modal(document.getElementById("modalResult"));
    modal.show();
  }
}

const button = document.createElement("button");
function createButton() {
  button.textContent = "Add";
  button.className = "btn btn-success";
  button.style.position = "absolute";
  button.style.bottom = "40px";
  button.style.left = "10px";
  button.id = "btn-add";
  button.addEventListener("click", onClick);
  document.body.appendChild(button);
}
const target = {
  disableBtn: !window.containsGoogleMapsSearch(),
};
const proxy = new Proxy(target, {
  set: function (target, key, value) {
    target[key] = value;
    if (key === "disableBtn") {
      button.style.display = value ? "none" : "flex";
    }
    return true;
  },
  get(target, prop, receiver) {
    return Reflect.get(...arguments);
  },
});
window.navigation.addEventListener("navigate", (event) => {
  proxy.disableBtn = !window.containsGoogleMapsSearch();
});
// Create the modal when the content script loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createButton);
} else {
  createButton();
}
