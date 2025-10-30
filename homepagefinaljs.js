const h2 = document.querySelector(".user");
const exit = document.querySelector(".exit");
const mecomp = document.querySelector(".mecomp");
const login = document.querySelector(".login");
const mesag = document.getElementById("mesag");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {
  exit.classList.remove("d-none");
  mecomp.classList.remove("d-none");
  login.classList.add("d-none");
  h2.textContent = `Istifadəçi adı: ${currentUser.username}`;

  if (sessionStorage.getItem("showAlert")) {
    $(mesag).fadeIn(300).delay(1000).fadeOut(300);
    sessionStorage.removeItem("showAlert");
  }
}

exit.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userNumber");
  sessionStorage.removeItem("activeUser");
  sessionStorage.removeItem("showAlert");

  location.reload();
});
