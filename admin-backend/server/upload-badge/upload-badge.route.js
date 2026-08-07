const express = require("express");
const router = express.Router();
const multer = require("multer");
const { svga: OfficialFrameStorage } = require("../../util/multer");
const AdminMiddleware = require("../middleware/admin.middleware");
const UploadBadgeController = require("./uploa-badge.controller");
const upload = multer({
  storage: OfficialFrameStorage,
});

const checkAccessWithKey = require("../../checkAccess");

router.get("/", checkAccessWithKey(), UploadBadgeController.index);

router.post(
  "/",
  checkAccessWithKey(),
  upload.single("file"),
  UploadBadgeController.store,
);

// update
router.put(
  "/:Id",
  checkAccessWithKey(),
  upload.single("file"),
  UploadBadgeController.update,
);

// delete
router.delete("/:Id", checkAccessWithKey(), UploadBadgeController.destroy);

//give frame to user
router.post(
  "/give/:userId",
  AdminMiddleware,
  UploadBadgeController.giveFrameToUser,
);

//give frame to user
router.post(
  "/remove/:userId",
  AdminMiddleware,
  UploadBadgeController.removeFrameFromUser,
);

module.exports = router;
