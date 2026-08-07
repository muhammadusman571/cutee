// config.js

// Detect hostname (browser or Node.js)
const hostname =
  typeof window !== "undefined"
    ? window.location.hostname
    : process.env.HOSTNAME || "";

// Map agency domains to their corresponding admin URLs
const agencyAdminMap = {
  "agency.fittolive.eagle-live.com": "https://admin.fittolive.eagle-live.com/",
  "agency.cutelive.site": "https://admin.cutelive.site/v1/",
  "agency.eveninglive.pro": "https://admin.eveninglive.pro/",
  "agency.smartlive.site": "https://admin.smartlive.site/",
  "agency.streamixlive.com": "https://admin.streamixlive.com/",
};

// Determine adminBaseURL based on agency hostname
export const baseURL = agencyAdminMap[hostname] || "http://localhost:5000/";

// Optional: export the agency URL itself
// export const baseURL = `https://${hostname}` || "http://localhost:5004/";

// Shared constant
export const key = "5TIvw5cpc0";
