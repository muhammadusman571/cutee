const express = require("express");
const router = express.Router();
const checkAccessWithKey = require("../../checkAccess");
const RewardController = require("./reward.controller");

router.post(
  "/create",

  RewardController.createOrUpdateReward,
);
router.get("/config", RewardController.getRewardConfig);

router.get("/all", RewardController.getAllRewardForAdmin);

router.get("", checkAccessWithKey(), RewardController.getAllRewardForMobileApp);

module.exports = router;
