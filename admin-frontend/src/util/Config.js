// config.js

let baseURL = "";
let projectName = "";

const hostname = window.location.hostname;
console.log("hostname", hostname);

if (hostname === "admin.fittolive.eagle-live.com") {
  baseURL = "https://admin.fittolive.eagle-live.com/";
  projectName = "Fittolive";
} else if (hostname === "admin.cutelive.site") {
  baseURL = "https://admin.cutelive.site/v1/";
  projectName = "Follow Live";
} else if (hostname === "admin.eveninglive.pro") {
  baseURL = "https://admin.eveninglive.pro/";
  projectName = "Insaf Live";
} else if (hostname === "admin.smartlive.site") {
  baseURL = "https://admin.smartlive.site/";
  projectName = "Smart Live";
} else if (hostname === "admin.streamixlive.com") {
  baseURL = "https://admin.streamixlive.com/";
  projectName = "Streamix Live";
} else {
  // Default values (e.g., localhost)
  baseURL = "http://localhost:5000/";
  projectName = "LocalProject";
}

const key = "5TIvw5cpc0";
const Production = hostname !== "localhost";

// Export directly
export { baseURL, projectName, key, Production };
