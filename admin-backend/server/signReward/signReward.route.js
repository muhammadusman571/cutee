const express = require("express");
const router = express.Router();
const multer = require("multer");
const { svga } = require("../../util/multer");
const checkAccessWithKey = require("../../checkAccess");

const SignRewardController = require("./signReward.controller");
const upload = multer({ storage: svga });

const adminMiddleware = require("../middleware/admin.middleware");

router.post(
  "/create",
  adminMiddleware,
  upload.fields([{ name: "imageVideo" }, { name: "thumbnail" }]),
  SignRewardController.createSignReward,
);

router.get("/all", adminMiddleware, SignRewardController.index);

router.get("", checkAccessWithKey(), SignRewardController.getSignRewardsByDay);

router.patch(
  "/:Id",
  adminMiddleware,
  upload.fields([{ name: "imageVideo" }, { name: "thumbnail" }]),
  SignRewardController.update,
);

router.delete("/:Id", adminMiddleware, SignRewardController.destroy);

module.exports = router;
