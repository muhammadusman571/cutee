const crypto = require("crypto");

const verifySudSignature = (req, res, next) => {
  const signature = req.headers["x-sud-signature"];
  const timestamp = req.headers["x-sud-timestamp"];
  const appSecret = process.env.SUD_APP_SECRET;

  if (!signature || !timestamp) {
    return res.json({ ret_code: 1, ret_msg: "Missing headers", data: {} });
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    return res.json({ ret_code: 1, ret_msg: "Timestamp expired", data: {} });
  }

  const payload = JSON.stringify(req.body);
  const expectedSig = crypto
    .createHmac("sha256", appSecret)
    .update(timestamp + payload)
    .digest("hex");

  if (signature !== expectedSig) {
    return res.json({ ret_code: 1, ret_msg: "Invalid signature", data: {} });
  }

  next();
};

module.exports = { verifySudSignature };
