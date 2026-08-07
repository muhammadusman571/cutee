const express = require("express");
const router = express.Router();

const RankingController = require("./ranking.controller");

const checkAccessWithKey = require("../../checkAccess");

// get all gift and charm ranking
router.get(
  "/gift_charm_ranking",
  checkAccessWithKey(),
  RankingController.giftAndCharmRanking
);

// get all room ranking
router.get(
  "/room-ranking",
  checkAccessWithKey(),
  RankingController.getRoomRanking
);

module.exports = router;
