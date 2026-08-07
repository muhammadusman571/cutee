const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminMiddleware = require("../middleware/admin.middleware");

const LevelController = require("./level.controller");

var checkAccessWithKey = require("../../checkAccess");

const { storage } = require("../../util/multer");
const upload = multer({ storage });

// router.use(checkAccessWithSecretKey());

// get levels for mobile
router.get("/list", checkAccessWithKey(), LevelController.mobileList); 

// get level
router.get("/", adminMiddleware, LevelController.index);

// create level
router.post(
  "/",
  adminMiddleware,
  upload.single("image"),
  LevelController.store,
);

// update level
router.patch(
  "/:levelId",
  adminMiddleware,
  upload.single("image"),
  LevelController.update,
);

// update accessible function of level
router.patch("/", adminMiddleware, LevelController.updateAccessibleFunction);

// delete level
router.delete("/:levelId", adminMiddleware, LevelController.destroy);

module.exports = router;
