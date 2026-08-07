const express = require("express");
const router = express.Router();
const multer = require("multer");
const { svga: SvipStorage } = require("../../util/multer");

const SvipController = require("./svip.controller");
const upload = multer({
  storage: SvipStorage,
});

const checkAccessWithKey = require("../../checkAccess");
const adminMiddleware = require("../middleware/admin.middleware");

// get all svip
router.get("/all", adminMiddleware, SvipController.index);

//get all svip  for android
router.get("/get", checkAccessWithKey(), SvipController.get);

//create
router.post(
  "/createSvip",
  adminMiddleware,
  upload.array("files", 8), // accept up to 10 files
  SvipController.store,
);

// update
router.patch(
  "/:Id",
  adminMiddleware,
  upload.array("files", 8),
  SvipController.update,
);

// delete
router.delete("/:Id", adminMiddleware, SvipController.destroy);

// purchase
router.post("/purchase", checkAccessWithKey(), SvipController.purchase);

//user select the svip
router.post("/select", checkAccessWithKey(), SvipController.select);
router.patch("/delete-field/:Id", adminMiddleware, SvipController.deleteField);

module.exports = router;
