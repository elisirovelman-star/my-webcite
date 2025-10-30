$(document).ready(function () {
   const table = $("#dataTable").DataTable({
    stateSave: false,
    destroy: true,
    data: [],
    columns: [
        { title: "ID" },
        { title: "Ad" },
        { title: "Şəkil" },
        { title: "Qiymət" },
        { title: "Əməliyyatlar" }
    ]
});
    const modal = new bootstrap.Modal(document.getElementById("dataModal"));
    let editIndex = null;

    function loadData() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const activeUser = sessionStorage.getItem("activeUser");

    if (!currentUser || !activeUser || (currentUser.phone || currentUser.username) !== activeUser) {
        const table = $("#dataTable").DataTable();
        table.clear().draw();
        alert("Zəhmət olmasa daxil olun!");
        window.location.href = "loginpagefinal.html";
        return;
    }

    const userNumber = currentUser.phone || currentUser.username;
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];

    const userProducts = allProducts.filter(p => p.user === userNumber);

    table.clear();

    userProducts.forEach((item, idx) => {
        const id = 1001 + idx;
        table.row.add([
            id,
            item.ad || "—",
            `<img src="${item.photo || 'https://via.placeholder.com/100'}"
                class="preview-img clickable-img"
                style="width:50px;height:50px;object-fit:contain;">`,
            item.qiymet || "—",
            `
            <button class="btn btn-sm btn-danger delete-btn me-2" data-index="${idx}">Sil</button>
            <button class="btn btn-sm btn-primary edit-btn" data-index="${idx}">Redaktə</button>
            `
        ]);
    });

    table.draw(false);
}

    loadData();

    $("#dataForm").on("submit", function (e) {
        e.preventDefault();
        const form = this;
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const userNumber = currentUser.phone || currentUser.username;

        const newProduct = {
            kateqoriya: $("#kateqoriya").val(),
            emmeliyaddas: $("#emmeliyaddas").val(),
            ad: $("#ad").val(),
            prossessor: $("#prossessor").val(),
            qiymet: $("#qiymet").val(),
            daimiyaddas: $("#daimiyaddas").val(),
            tesvir: $("#tesvir").val(),
            daimiyaddastipi: $("#daimiyaddastipi").val(),
            batareya: $("#batareya").val(),
            ekran: $("#ekran").val(),
            emmeliyyatsistem: $("#emmeliyyatsistem").val(),
            yeni: $("#yeni").val(),
            photo: $("#photo").val(),
            user: userNumber
        };

        let allProducts = JSON.parse(localStorage.getItem("products")) || [];

        if (editIndex !== null) {
            const userProducts = allProducts.filter(p => p.user === userNumber);
            const productToEdit = userProducts[editIndex];
            const realIndex = allProducts.findIndex(p => p === productToEdit);
            if (realIndex !== -1) {
                allProducts[realIndex] = newProduct;
            }
            editIndex = null;
        } else {
            allProducts.push(newProduct);
        }

        localStorage.setItem("products", JSON.stringify(allProducts));
        loadData();
        modal.hide();
        form.reset();
        form.classList.remove("was-validated");
        $("#preview").hide();
    });

    $("#dataTable").on("click", ".edit-btn", function () {
        const index = $(this).data("index");
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const userNumber = currentUser.phone || currentUser.username;
        const data = JSON.parse(localStorage.getItem("products")) || [];
        const userProducts = data.filter(p => p.user === userNumber);
        const item = userProducts[index];
        if (!item) return alert("Xəta: Məhsul tapılmadı!");

        $("#kateqoriya").val(item.kateqoriya);
        $("#emmeliyaddas").val(item.emmeliyaddas);
        $("#ad").val(item.ad);
        $("#prossessor").val(item.prossessor);
        $("#qiymet").val(item.qiymet);
        $("#daimiyaddas").val(item.daimiyaddas);
        $("#tesvir").val(item.tesvir);
        $("#daimiyaddastipi").val(item.daimiyaddastipi);
        $("#batareya").val(item.batareya);
        $("#ekran").val(item.ekran);
        $("#emmeliyyatsistem").val(item.emmeliyyatsistem);
        $("#yeni").val(item.yeni);
        $("#photo").val(item.photo);
        $("#preview").attr("src", item.photo).show();

        editIndex = index;
        modal.show();
    });

    $("#dataTable").on("click", ".delete-btn", function () {
        const index = $(this).data("index");
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const userNumber = currentUser.phone || currentUser.username;
        let data = JSON.parse(localStorage.getItem("products")) || [];
        const userProducts = data.filter(p => p.user === userNumber);
        const productToDelete = userProducts[index];
        const realIndex = data.findIndex(p => p === productToDelete);

        if (realIndex !== -1 && confirm("Məhsulu silmək istəyirsən?")) {
            data.splice(realIndex, 1);
            localStorage.setItem("products", JSON.stringify(data));
            loadData();
        }
    });

    $("#dataTable").on("click", ".preview-img", function () {
        $("#modalImage").attr("src", $(this).attr("src"));
        new bootstrap.Modal(document.getElementById("photoModal")).show();
    });

    $("#photo").on("input", function () {
        const url = $(this).val().trim();
        if (url) $("#preview").attr("src", url).show();
        else $("#preview").hide();
    });

    $('[data-bs-target="#dataModal"]').on("click", function () {
        editIndex = null;
        $("#dataForm")[0].reset();
        $("#preview").hide();
    });
});