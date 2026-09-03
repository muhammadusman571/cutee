// Detect hostname (browser or Node.js)
const hostname =
  typeof window !== "undefined"
    ? window.location.hostname
    : process.env.HOSTNAME || "";

// Map agency domains to their corresponding admin URLs
const casinoAdminMap = {
  "roulettecasino.fittolive.eagle-live.com":
    "https://admin.fittolive.eagle-live.com/",
  "casino.cutelive.site": "https://admin.cutelive.site/v1/",
  "casino.eveninglive.pro": "https://admin.eveninglive.pro/",
  "casino.smartlive.site": "https://admin.smartlive.site/",
  "casino.streamixlive.com": "https://admin.streamixlive.com/",
  "casino.awaralive.com": "https://admin.awaralive.com/",
};

export const baseURL = `https://${hostname}` || "http://localhost:5002/";
// export const baseURL = "http://localhost:5001/";
export const adminBaseURL = casinoAdminMap[hostname];
export const key = "5TIvw5cpc0";
