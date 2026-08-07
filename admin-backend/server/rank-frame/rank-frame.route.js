const express = require("express");
const router = express.Router();
const multer = require("multer");
const { svga: RankFrameStorage } = require("../../util/multer");

const RankFrameController = require("./rank-frame.controller");
const upload = multer({
  storage: RankFrameStorage,
});

const checkAccessWithKey = require("../../checkAccess");

// get all Rank Frame
router.get("/all", checkAccessWithKey(), RankFrameController.index);

//create
router.post(
  "/createRankFrame",
  checkAccessWithKey(),
  upload.single("file"),
  RankFrameController.store
);

// update
router.put(
  "/:Id",
  checkAccessWithKey(),
  upload.single("file"),
  RankFrameController.update
);

// delete
router.delete("/:Id", checkAccessWithKey(), RankFrameController.destroy);

module.exports = router;
