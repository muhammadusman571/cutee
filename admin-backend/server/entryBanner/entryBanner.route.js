const express = require("express");
const router = express.Router();
const multer = require("multer");
const { svga } = require("../../util/multer");

const EntryBannerController = require("./entryBanner.controller");
const upload = multer({
  storage: svga,
});

const adminMiddleware = require("../middleware/admin.middleware");

//create
router.post(
  "/create",
  adminMiddleware,
  upload.fields([{ name: "imageVideo" }, { name: "thumbnail" }]),
  EntryBannerController.createBanner,
);
router.get("/all", adminMiddleware, EntryBannerController.index);

router.patch(
  "/:Id",
  adminMiddleware,
  upload.fields([{ name: "imageVideo" }, { name: "thumbnail" }]),
  EntryBannerController.update,
);

// delete
router.delete("/:Id", adminMiddleware, EntryBannerController.destroy);

module.exports = router;
