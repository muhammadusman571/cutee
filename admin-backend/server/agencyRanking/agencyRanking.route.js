const express = require("express");
const router = express.Router();

const AgencyRankingController = require("./agencyRanking.controller");

const checkAccessWithKey = require("../../checkAccess");

// agency contribution list: members ranked by diamonds received (type: total | daily | weekly | monthly)
router.get("/contribution", checkAccessWithKey(), AgencyRankingController.contribution);

// agency member list (owner first, then hosts by level)
router.get("/members", checkAccessWithKey(), AgencyRankingController.members);

// agencies ranked by diamonds received (type: daily | weekly | monthly | total)
router.get("/ranking", checkAccessWithKey(), AgencyRankingController.ranking);

// the user's own agency with its total and rank
router.get("/myAgency", checkAccessWithKey(), AgencyRankingController.myAgency);

// profile: diamonds sent, follow / fans counts, top 3 contributors
router.get("/profileStats", checkAccessWithKey(), AgencyRankingController.profileStats);

module.exports = router;
