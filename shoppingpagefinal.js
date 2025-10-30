// 🔹 Firebase bağlantısı
import { db, ref, onValue } from "./firebase.js";

// 🔹 HTML elementlərini seçirik
const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const floatingSearchInput = document.getElementById("floatingSearchInput");
const brandList = document.getElementById("brandList");
const loadingOverlay = document.getElementById("loadingOverlay");

// 🔹 Məhsul siyahısı Firebase-dən gələcək
let firebaseProducts = [];

// 🔹 Yüklənmə animasiyası
function showLoading(callback) {
  if (!loadingOverlay) return callback && callback();
  loadingOverlay.classList.add("show");
  setTimeout(() => {
    loadingOverlay.classList.remove("show");
    if (callback) callback();
  }, 800);
}

// 🔹 Məhsulları ekrana yazmaq funksiyası
function renderProducts(list) {
  if (!productList) return;
  productList.innerHTML = "";
  if (!list || list.length === 0) {
    productList.innerHTML = `<h4 class='text-center text-muted mt-5'>Heç bir məhsul tapılmadı</h4>`;
    return;
  }

  list.forEach((prod) => {
    const userDisplay = prod.user?.trim() || "Qeydiyyatsız";
    const col = document.createElement("div");
    col.className = "col-sm-6 col-md-4 col-lg-3";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${prod.photo || "https://via.placeholder.com/200x150"}"
             class="card-img-top"
             alt="${prod.ad}">
        <div class="card-body">
          <h5 class="card-title">${prod.ad}</h5>
          <p class="card-text"><b>Qiymət:</b> ${prod.qiymet} AZN</p>
          <p class="card-text"><b>Kateqoriya:</b> ${prod.kateqoriya}</p>
          <p class="card-text"><b>İstifadəçi nömrəsi:</b> ${userDisplay}</p>
        </div>
        <div class="card-footer text-center">
          <button class="btn btn-primary btn-detail"
            data-product='${JSON.stringify(prod)}'>Ətraflı</button>
        </div>
      </div>`;
    productList.appendChild(col);
  });

  document.querySelectorAll(".btn-detail").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prod = JSON.parse(btn.dataset.product);
      showDetails(prod);
    });
  });
}

// 🔹 Məhsul detalları (modal)
function showDetails(prod) {
  const userDisplay = prod.user || "Qeydiyyatsız";
  document.getElementById("detailTitle").textContent = prod.ad;
  document.getElementById("detailBody").innerHTML = `
    <div class="text-center mb-3">
      <img src="${prod.photo || "https://via.placeholder.com/300x200"}"
           class="img-fluid mb-3 object-fit-contain" style="max-height:250px;">
    </div>
    <ul class="list-group">
      <li class="list-group-item"><b>Ad:</b> ${prod.ad}</li>
      <li class="list-group-item"><b>Qiymət:</b> ${prod.qiymet} AZN</li>
      <li class="list-group-item"><b>Kateqoriya:</b> ${prod.kateqoriya}</li>
      <li class="list-group-item"><b>Əməli yaddaş:</b> ${prod.emmeliyaddas || "-"}</li>
      <li class="list-group-item"><b>Daimi yaddaş:</b> ${prod.daimiyaddas || "-"}</li>
      <li class="list-group-item"><b>Prosessor:</b> ${prod.prossessor || "-"}</li>
      <li class="list-group-item"><b>Ekran:</b> ${prod.ekran || "-"}</li>
      <li class="list-group-item"><b>Əməliyyat sistemi:</b> ${prod.emmeliyyatsistem || "-"}</li>
      <li class="list-group-item"><b>Təsvir:</b> ${prod.tesvir || "-"}</li>
      <li class="list-group-item"><b>İstifadəçi nömrəsi:</b> ${userDisplay}</li>
    </ul>`;
  new bootstrap.Modal(document.getElementById("detailModal")).show();
}

// 🔹 Firebase məlumatlarını oxuma (REAL-TIME)
const productsRef = ref(db, "products");
onValue(productsRef, (snapshot) => {
  const data = snapshot.val();
  firebaseProducts = data ? Object.values(data) : [];
  renderProducts(firebaseProducts);
});

// 🔹 Axtarış funksiyası
function searchProducts(value) {
  showLoading(() => {
    const filtered = firebaseProducts.filter(
      (p) =>
        p.ad?.toLowerCase().includes(value) ||
        p.tesvir?.toLowerCase().includes(value)
    );
    renderProducts(filtered);
  });
}

searchInput?.addEventListener("input", (e) =>
  searchProducts(e.target.value.toLowerCase())
);
floatingSearchInput?.addEventListener("input", (e) =>
  searchProducts(e.target.value.toLowerCase())
);

// 🔹 Marka/kateqoriya filtr
brandList?.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const brand = e.target.textContent.trim();
    showLoading(() => {
      const filtered = firebaseProducts.filter(
        (p) => p.kateqoriya === brand
      );
      renderProducts(filtered);
    });
  }
});
