const Admin = require("../admin/admin.model");
const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = async (req, res, next) => {
  try {
    // ✅ Get token from cookies
    const token = req.cookies?.auth_token;

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized: No token found" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // ✅ Find admin from DB
    const admin = await Admin.findById(decoded._id).select("-password");
    if (!admin) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized: Admin not found" });
    }

    // ✅ Attach admin and token to request
    req.admin = admin;
    req.token = token;

    next();
  } catch (error) {
    console.error("Admin auth error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ status: false, message: "Session expired. Please log in again." });
    }

    return res
      .status(401)
      .json({ status: false, message: "Invalid token or unauthorized" });
  }
};
