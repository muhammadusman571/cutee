const express = require("express");
const router = express.Router();
const multer = require("multer");
const { svga: OfficialFrameStorage } = require("../../util/multer");
const AdminMiddleware = require("../middleware/admin.middleware");
const OfficialFrameController = require("./official-frame.controller");
const upload = multer({
  storage: OfficialFrameStorage,
});

const checkAccessWithKey = require("../../checkAccess");

// get all Rank Frame
router.get("/all", checkAccessWithKey(), OfficialFrameController.index);

//create
router.post(
  "/createOfficialFrame",
  checkAccessWithKey(),
  upload.single("file"),
  OfficialFrameController.store
);

// update
router.put(
  "/:Id",
  checkAccessWithKey(),
  upload.single("file"),
  OfficialFrameController.update
);

// delete
router.delete("/:Id", checkAccessWithKey(), OfficialFrameController.destroy);

//give frame to user
router.post(
  "/give/:userId/:frameId",
  AdminMiddleware,
  OfficialFrameController.giveFrameToUser
);

//give frame to user
router.post(
  "/remove/:userId",
  AdminMiddleware,
  OfficialFrameController.removeFrameFromUser
);

module.exports = router;
