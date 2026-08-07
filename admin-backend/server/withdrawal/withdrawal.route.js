const express = require("express");
const router = express.Router();

const checkAccessWithSecretKey = require("../../checkAccess");
const adminMiddleware = require("../middleware/admin.middleware");
const multer = require("multer");
const { storage } = require("../../util/multer");
const upload = multer({ storage });
const WithdrawalController = require("./withdrawal.controller");

// ===============================
// 🟢 CREATE WITHDRAWAL (USER SIDE)
// ===============================
router.post(
  "/create",
  checkAccessWithSecretKey(),
  WithdrawalController.createWithdrawal,
);

// ===============================
// 🔵 GET ALL (ADMIN PANEL)
// ===============================
router.get("/getAll", adminMiddleware, WithdrawalController.getAllWithdrawal);

// ===============================
// 🔁 FORWARD REQUEST (ADMIN → ADMIN)
// ===============================
router.patch(
  "/forward/:withdrawalId",
  adminMiddleware,
  WithdrawalController.forwardWithdrawal,
);

// ===============================
// ✅ APPROVE / REJECT
// ===============================
router.patch(
  "/status/:withdrawalId",
  adminMiddleware,
  upload.single("receipt"),
  WithdrawalController.updateStatus,
);

module.exports = router;
