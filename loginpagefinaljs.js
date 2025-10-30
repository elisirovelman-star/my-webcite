const users = JSON.parse(localStorage.getItem("users")) || [];
const istifadeci = document.querySelector("#istif");
const password = document.querySelector("#pass");
const btn = document.querySelector("#btn");

btn.addEventListener("click", loginPanel);

function loginPanel(e) {
  e.preventDefault();
  const form = document.querySelector(".form");

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  let currentUser = null;
  for (let i = 0; i < users.length; i++) {
    if (
      istifadeci.value.trim() === users[i].username &&
      password.value.trim() === users[i].password
    ) {
      currentUser = users[i];
      break;
    }
  }

  if (currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("userNumber",currentUser.phone || currentUser.username);
    
    sessionStorage.setItem("activeUser",currentUser.phone || currentUser.username);
    sessionStorage.setItem("showAlert", "true");
    setTimeout(() => {
      window.location.href = "homepagefinal.html";
    }, 300);
  } else {
    alert("İstifadəçi adı və ya şifrə yalnışdır!");
  }
}
