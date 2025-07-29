function showform(type) {
  const banner = document.getElementById("bannerBox");
  const formBox = document.getElementById("formBox");
  const signup = document.getElementById("signupForm");
  const login = document.getElementById("loginForm");
  const forgot = document.getElementById("forgotForm");
  banner.classList.add("shrink");
  formBox.classList.add("expand");
  signup.classList.add("hidden");
  login.classList.add("hidden");
  if (forgot) forgot.classList.add("hidden");
  if (type === "signup") {
    signup.classList.remove("hidden");
  } else if (type === "login") {
    login.classList.remove("hidden");
  } else if (type === "forgot") {
    if (forgot) forgot.classList.remove("hidden");
  }
}
function goBack() {
  const banner = document.getElementById("bannerBox");
  const formBox = document.getElementById("formBox");
  const signup = document.getElementById("signupForm");
  const login = document.getElementById("loginForm");
  banner.classList.remove("shrink");
  formBox.classList.remove("expand");
  signup.classList.add("hidden");
  login.classList.add("hidden");
  forgot.classList.add("hidden");
  // Clear all input fields
  const inputs = document.querySelectorAll(".form-inner input");
  inputs.forEach(input => input.value = "");
  // Also hide error message
  const msg = document.getElementById("msg");
  if (msg) msg.style.display = "none";
}
// ya form ka fetch logic ha 
// Signup Form kly.
document.querySelector('#signupForm button').onclick = async function () {
  const name = document.querySelector("#signupForm input[type='text']").value;
  const email = document.querySelector("#signupForm input[type='email']").value;
  const password = document.querySelectorAll("#signupForm input[type='password']")[0].value;
  const confirm = document.querySelectorAll("#signupForm input[type='password']")[1].value;
  if (password !== confirm) return alert("Passwords don't match");
  const res = await fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
 alert(data.message);
if (res.ok) {
  showform("login"); // 👈 switch to login form
  // Clear signup fields
  document.querySelector("#signupForm input[type='text']").value = "";
  document.querySelector("#signupForm input[type='email']").value = "";
  document.querySelectorAll("#signupForm input[type='password']")[0].value = "";
  document.querySelectorAll("#signupForm input[type='password']")[1].value = "";
}
};
// Login Form kly
document.querySelector('#loginForm button').onclick = async function () {
  const email = document.querySelector("#loginForm input[type='email']").value;
  const password = document.querySelector("#loginForm input[type='password']").value;
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    alert("Login Success");
  } else {
    document.getElementById("msg").innerText = data.message;
    document.getElementById("msg").style.display = "block";
  }
};
async function handleReset() {
  const email = document.getElementById("resetEmail").value;
  const code = document.getElementById("resetCode").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmPassword").value;
  if (newPassword !== confirm) {
    return alert("Passwords don't match");
  }
  const res = await fetch("/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword })
  });
  const data = await res.json();
  alert(data.message);
}
async function sendResetCode() {
  const email = document.getElementById("resetEmail").value;
  if (!email) return alert("Please enter your email first");
  const res = await fetch("/send-reset-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  alert(data.message);
}



