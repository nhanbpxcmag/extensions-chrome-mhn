function createModal() {
  const modalHtml = `
      <div class="modal fade modal-dialog-scrollable" id="modalResult" tabindex="-1" aria-labelledby="modalResultLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalResultLabel">Kết quả</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="IMmQkgu">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="vgWQSie" class="btn btn-primary">Copy</button>
            </div>
            </div>
        </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  document.getElementById("vgWQSie").addEventListener("click", onClick);
  const myModal = document.getElementById("modalResult");
  myModal.addEventListener("shown.bs.modal", () => {
    getData();
  });
  myModal.addEventListener("hidden.bs.modal", () => {
    const modalContent = document.getElementById("IMmQkgu");
    modalContent.innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
  });
}
function convertStringToNumber(str) {
  const standardizedString = str.replace(",", ".");
  const number = parseFloat(standardizedString);
  return number;
}
function convertToInteger(str) {
  const cleanedString = str.replace(/[^\d]/g, "");
  const number = parseInt(cleanedString);
  return number;
}
function convertValuePrice(input) {
  let standardizedInput = input;
  // Handle "Tr" (likely meaning "trillion" in some contexts)
  if (standardizedInput.endsWith("Tr")) {
    const value = parseFloat(standardizedInput.slice(0, -2)?.replace(",", ".")); // Remove "Tr"
    return value * 1000000; // Multiply by 1 trillion
  }

  // Handle "N" (likely meaning "thousand" in some contexts)
  if (standardizedInput.endsWith("N")) {
    const value = parseFloat(convertToInteger(standardizedInput.slice(0, -1)?.replace(",", "."))); // Remove "N"
    return value * 1000; // Multiply by 1000
  }
  // Handle regular numbers
  return parseFloat(standardizedInput);
}
let json_string = "";
function getData() {
  const data = [];
  json_string = JSON.stringify(data, null, 2);
  if (window.containsGoogleMapsSearch()) {
    const element1 = document.getElementsByClassName("m6QErb DxyBCb kA9KIf dS8AEf XiKgde ecceSd")[0];
    // const element2 = document.querySelector(".m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde.ecceSd");
    if (element1) {
      // Lấy tất cả các thẻ chứa thông tin nhà hàng
      const cards = element1.querySelectorAll(".Nv2PK");

      // Duyệt qua từng thẻ và lấy thông tin
      cards.forEach((card, index) => {
        const item = card.querySelectorAll(".UaQhfb.fontBodyMedium")[0];
        const item_img = card.querySelector(".SpFAAb");
        const el_link = card.querySelector(".hfpxzc");
        let link = el_link ? el_link.getAttribute("href") || "" : "";
        if (item) {
          const name = item.querySelector(".qBF1Pd.fontHeadlineSmall")?.innerText.trim();
          const vote = item.querySelector(".ZkP5Je");
          let _vote = { star: 0, numVote: 0 };
          let price = 0;
          if (vote) {
            let star = vote.querySelector(".MW4etd").innerText.trim() || "";
            let numVote = vote.querySelector(".UY7F9").innerText.trim() || "";
            _vote = {
              rating: convertStringToNumber(star),
              votes: convertToInteger(numVote),
            };
          }
          if (item_img) {
            const temp = item_img.querySelector(".wcldff.fontHeadlineSmall");
            if (temp) {
              price = convertValuePrice(temp.innerText.trim());
            }
          }
          data.push({
            title: name,
            ..._vote,
            price,
            link,
          });
        }
      });
      json_string = JSON.stringify(data, null, 2);
    }
    updateModalContent(data);
  }
  return data;
}
function onClick() {
  // Copy the text inside the text field
  navigator.clipboard.writeText(json_string);
}
function updateModalContent(data = []) {
  const modalContent = document.getElementById("IMmQkgu");

  if (modalContent) {
    if (data.length > 0) {
      // Build the table HTML string
      let tableHead = `
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên</th>
            <th scope="col">Vote</th>
            <th scope="col">Lượt</th>
            <th scope="col">Tiền</th>
          </tr>
        `;
      let tableBody = "";
      for (let i = 0; i < data.length; i++) {
        const { name, star, numVote, price } = data[i];
        tableBody += `
              <tr>
                <th scope="row">${i + 1}</th>
                <td>${name}</td>
                <td>${star}</td>
                <td>${numVote}</td>
                <td>${price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
              </tr>
            `;
      }
      modalContent.innerHTML = `
          <table class="table">
          <thead>${tableHead}</thead>
          <tbody>${tableBody}</tbody>
          </table>
          `;
    } else {
      modalContent.innerHTML = `<div class="d-flex justify-content-center"><p>Không tìm thấy dữ liệu</p></div>`;
    }
  }
}
// Create the modal when the content script loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createModal);
} else {
  createModal();
}
