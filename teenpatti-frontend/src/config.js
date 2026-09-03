const hostname =
  typeof window !== "undefined"
    ? window.location.hostname
    : process.env.HOSTNAME || "";

const teenpattiAdminMap = {
  "teenpatti.fittolive.eagle-live.com":
    "https://admin.fittolive.eagle-live.com/",
  "tenpatii.cutelive.site": "https://admin.cutelive.site/v1/",
  "tenpatii.eveninglive.pro": "https://admin.eveninglive.pro/",
  "tenpatii.smartlive.site": "https://admin.smartlive.site/",
  "tenpatii.streamixlive.com": "https://admin.streamixlive.com/",
  "teenpatti.awaralive.com": "https://admin.awaralive.com/",
  localhost: "http://localhost:5000",
};

// ✅ FIXED BASE URL LOGIC
export const baseURL =
  hostname === "localhost" ? "http://localhost:5000" : `https://${hostname}`;

export const adminBaseURL = teenpattiAdminMap[hostname];
export const key = "5TIvw5cpc0";
