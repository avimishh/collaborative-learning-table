const serverOnLocal = "http://localhost:3000/";
const serverOnCloud = "https://co-learn.herokuapp.com/";
const hostname = window.location.hostname;

export function getServerUrl() {
  if (hostname === "localhost") return serverOnLocal;
  return serverOnCloud;
}

export function getServerApiUrl() {
  if (hostname === "localhost") return serverOnLocal + "api/";
  return serverOnCloud + "api/";
}

export function passwordToggle() {
  $("#user_password").attr(
    "type",
    $("#user_password").attr("type") === "password" ? "text" : "password"
  );
  $(".icon-eye").find("i").toggleClass("fa-eye fa-eye-slash");
}

export function initSignInPage() {
  window.passwordToggle = passwordToggle;
}

export function alertMessage(){
  alert("Hello");
}

export function globalInit() {
  include("./../pics/logo3.png");
}

function include(file) {
  var link = document.createElement("link");
  link.rel = "icon";
  link.href = file;
  link.type = "image/png";
  link.defer = true;

  document.getElementsByTagName("head").item(0).appendChild(link);
}