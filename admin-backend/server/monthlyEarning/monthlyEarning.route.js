const express = require("express");
const router = express.Router();

const MonthlyEarningController = require("./monthlyEarning.controller");
const adminMiddleware = require("../middleware/admin.middleware");

// GET /monthlyEarning?month=7&year=2026            -> list of all video hosts' earnings for that month
// GET /monthlyEarning?month=7&year=2026&userId=... -> single host's earnings for that month
router.get("/", MonthlyEarningController.getMonthlyEarnings);

module.exports = router;
