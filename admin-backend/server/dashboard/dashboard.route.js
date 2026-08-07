const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/admin.middleware");

const DashboardController = require("./dashboard.controller");

var checkAccessWithKey = require("../../checkAccess");

// get dashboard
router.get("/", adminMiddleware, DashboardController.dashboard);

// analytic
router.get("/analytic", adminMiddleware, DashboardController.analytic);

module.exports = router;
