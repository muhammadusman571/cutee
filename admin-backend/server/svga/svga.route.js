const express = require("express");
const router = express.Router();
const multer = require("multer");
const { svga } = require("../../util/multer");

const SvgaController = require("./svga.controller");
const upload = multer({
  storage: svga,
});

const checkAccessWithKey = require("../../checkAccess");
const adminMiddleware = require("../middleware/admin.middleware");

// get all svga or frame
router.get("/all", adminMiddleware, SvgaController.index);

//get all svga or frame for android
router.get("/get", checkAccessWithKey(), SvgaController.get);

//create
router.post(
  "/create",
  adminMiddleware,
  upload.fields([{ name: "imageVideo" }, { name: "thumbnail" }]),
  SvgaController.store,
);
//create
router.post(
  "/createFrame",
  adminMiddleware,
  upload.any(),
  SvgaController.frameStore,
);
// update
router.patch(
  "/:Id",
  adminMiddleware,
  upload.fields([{ name: "imageVideo" }, { name: "thumbnail" }]),
  SvgaController.update,
);

// delete
router.delete("/:Id", adminMiddleware, SvgaController.destroy);

// purchase
router.post("/purchase", checkAccessWithKey(), SvgaController.purchase);

//user select the svga or frame
router.post("/select", checkAccessWithKey(), SvgaController.select);

module.exports = router;
