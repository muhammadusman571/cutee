const express = require("express");
const router = express.Router();
const multer = require("multer");
const { svga: OfficialFrameStorage } = require("../../util/multer");
const AdminMiddleware = require("../middleware/admin.middleware");
const UploadTagController = require("./upload-tag.controller");
const upload = multer({
  storage: OfficialFrameStorage,
});

const checkAccessWithKey = require("../../checkAccess");

router.get("/", checkAccessWithKey(), UploadTagController.index);

router.post(
  "/",
  checkAccessWithKey(),
  upload.single("file"),
  UploadTagController.store,
);

// update
router.put(
  "/:Id",
  checkAccessWithKey(),
  upload.single("file"),
  UploadTagController.update,
);

// delete
router.delete("/:Id", checkAccessWithKey(), UploadTagController.destroy);

//give frame to user
router.post(
  "/give/:userId",
  AdminMiddleware,
  UploadTagController.giveFrameToUser,
);

//give frame to user
router.post(
  "/remove/:userId",
  AdminMiddleware,
  UploadTagController.removeFrameFromUser,
);

module.exports = router;
