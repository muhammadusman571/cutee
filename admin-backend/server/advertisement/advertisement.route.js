const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/admin.middleware");

const AdvertisementController = require("./advertisement.controller");

const checkAccessWithKey = require("../../checkAccess");

//for android and backend
router.get("/", checkAccessWithKey(), AdvertisementController.googleAd);

// router.post("/", checkAccessWithKey(), AdvertisementController.store);

router.patch("/:adId", adminMiddleware, AdvertisementController.update);

router.put("/:adId", adminMiddleware, AdvertisementController.showToggle);

module.exports = router;
