const express = require("express");
const router = express.Router();

const FansRankingController = require("./fansRanking.controller");

const checkAccessWithKey = require("../../checkAccess");

// get room's fans ranking (daily, weekly, monthly, total)
router.get("/roomRanking", checkAccessWithKey(), FansRankingController.getRoomRanking);

// get a user's fans ranking directly by userId, no room lookup needed (daily, weekly, monthly, total)
router.get("/userRanking", checkAccessWithKey(), FansRankingController.getUserRanking);

module.exports = router;
