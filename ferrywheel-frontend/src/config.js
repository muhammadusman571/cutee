// config.js

// Detect hostname (browser or Node.js)
const hostname =
  typeof window !== "undefined"
    ? window.location.hostname
    : process.env.HOSTNAME || "";

// Map agency domains to their corresponding admin URLs
const ferrywheelAdminMap = {
  "ferrywheel.fittolive.eagle-live.com":
    "https://admin.fittolive.eagle-live.com/",
  "garedy.cutelive.site": "https://admin.cutelive.site/v1/",
  "garedy.eveninglive.pro": "https://admin.eveninglive.pro/",
  "garedy.smartlive.site": "https://admin.smartlive.site/",
  "garedy.streamixlive.com": "https://admin.streamixlive.com/",
};

export const baseURL = `https://${hostname}` || "http://localhost:5003/";
// export const baseURL = "http://localhost:5001/";
export const adminBaseURL = ferrywheelAdminMap[hostname];
export const key = "5TIvw5cpc0";
