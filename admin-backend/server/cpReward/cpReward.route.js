const express = require("express");
const router = express.Router();
const multer = require("multer");
const { svga } = require("../../util/multer");

const upload = multer({
  storage: svga,
});

const CPRewardController = require("./cpReward.controller");

const adminMiddleware = require("../middleware/admin.middleware");

router.get("/", adminMiddleware, CPRewardController.index);

router.post(
  "/",
  adminMiddleware,
  upload.fields([{ name: "imageVideo" }, { name: "thumbnail" }]),
  CPRewardController.store,
);
router.patch(
  "/:Id",
  adminMiddleware,
  upload.fields([{ name: "imageVideo" }, { name: "thumbnail" }]),
  CPRewardController.update,
);

router.delete("/:Id", adminMiddleware, CPRewardController.destroy);

module.exports = router;
