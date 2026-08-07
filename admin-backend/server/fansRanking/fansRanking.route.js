const express = require("express");
const router = express.Router();

const FansRankingController = require("./fansRanking.controller");

const checkAccessWithKey = require("../../checkAccess");

// get room's fans ranking (daily, weekly, monthly, total)
router.get("/roomRanking", checkAccessWithKey(), FansRankingController.getRoomRanking);

module.exports = router;
