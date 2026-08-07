const express = require("express");
const router = express.Router();
const multer = require("multer");
const { svga } = require("../../util/multer");

const ProfileBgController = require("./profileBg.controller");
const upload = multer({
  storage: svga,
});

const adminMiddleware = require("../middleware/admin.middleware");

//create
router.post(
  "/create",
  adminMiddleware,
  upload.fields([{ name: "imageVideo" }, { name: "thumbnail" }]),
  ProfileBgController.createProfileBg,
);
router.get("/all", adminMiddleware, ProfileBgController.index);

router.patch(
  "/:Id",
  adminMiddleware,
  upload.fields([{ name: "imageVideo" }, { name: "thumbnail" }]),
  ProfileBgController.update,
);

// delete
router.delete("/:Id", adminMiddleware, ProfileBgController.destroy);

module.exports = router;
