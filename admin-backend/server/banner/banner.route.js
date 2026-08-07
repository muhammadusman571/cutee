const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../util/multer");
const adminMiddleware = require("../middleware/admin.middleware");

const BannerController = require("./banner.controller");
const upload = multer({
  storage,
});

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get all banner for frontend
router.get("/all", adminMiddleware, BannerController.index);

// get VIP and normal banner [android]
router.get("/", checkAccessWithKey(), BannerController.getBanner);

//create banner
router.post(
  "/",
  adminMiddleware,
  upload.single("image"),
  BannerController.store
);

//update banner
router.patch(
  "/:bannerId",
  adminMiddleware,
  upload.single("image"),
  BannerController.update
);

//VIP switch
router.put(
  "/:bannerId",
  checkAccessWithKey(),
  BannerController.VIPBannerSwitch
);

//delete banner
router.delete("/:bannerId", adminMiddleware, BannerController.destroy);

module.exports = router;
