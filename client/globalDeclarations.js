const serverOnLocal = "http://localhost:3000/";
const serverOnCloud = "https://colearn2.herokuapp.com/";
const hostname = window.location.hostname;

export function getServerUrl() {
    if (hostname === "localhost") return serverOnLocal;
    return serverOnCloud;
  }

export function getServerApiUrl() {
  if (hostname === "localhost") return serverOnLocal + "api/";
  return serverOnCloud + "api/";
}
