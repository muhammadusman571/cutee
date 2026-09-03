// config.js

// Detect hostname (browser or Node.js)
const hostname =
  typeof window !== "undefined"
    ? window.location.hostname
    : process.env.HOSTNAME || "";

// Map agency domains to their corresponding admin URLs
const hostAdminMap = {
  "host.fittolive.eagle-live.com": "https://admin.fittolive.eagle-live.com/",
  "host.cutelive.site": "https://admin.cutelive.site/v1/",
  "host.eveninglive.pro": "https://admin.eveninglive.pro/",
  "host.smartlive.site": "https://admin.smartlive.site/",
  "host.streamixlive.com": "https://admin.streamixlive.com/",
  "host.awaralive.com": "https://admin.awaralive.com/",
};

export const baseURL = `https://${hostname}` || "http://localhost:5005/";
// export const baseURL = "http://localhost:5001/";
// export const adminBaseURL = hostAdminMap[hostname];
export const adminBaseURL = hostAdminMap[hostname];
export const key = "5TIvw5cpc0";
