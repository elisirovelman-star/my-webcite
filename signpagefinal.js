const users = JSON.parse(localStorage.getItem("users")) || [];
const name = document.querySelector("#name");
const username = document.querySelector("#username");
const password = document.querySelector("#pass");
const phone = document.querySelector("#phone");
const btn = document.querySelector("#btn");
const form = document.querySelector("form");

btn.addEventListener("click", sign);

function sign(e) {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const newUser = {
    name: name.value.trim(),
    username: username.value.trim(),
    password: password.value.trim(),
    phone: phone.value.trim(),
  };

  const istifadeciVar = users.some(
    (u) => u.username.toLowerCase() === newUser.username.toLowerCase()
  );

  if (istifadeciVar) {
    alert("Bu istifadəçi adı artıq mövcuddur!");
    return;
  }

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  $("#mesag").fadeIn();
  setTimeout(() => {
    $("#mesag").fadeOut();
  }, 1000);

  setTimeout(() => {
    window.location.href = "loginpagefinal.html";
  }, 1300);
}
