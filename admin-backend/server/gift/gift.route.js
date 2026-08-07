const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../../util/multer");
const upload = multer({ storage });
const adminMiddleware = require("../middleware/admin.middleware");

const GiftController = require("./gift.controller");

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get all gifts
router.get("/all", adminMiddleware, GiftController.index);

// get category wise gift
router.get("/lucky-gift", adminMiddleware, GiftController.getLuckyGift);
router.get(
  "/:categoryId",
  checkAccessWithKey(),
  GiftController.categoryWiseGift,
);

// create gift
router.post(
  "/",
  adminMiddleware,
  upload.fields([
    { name: "image" },
    { name: "thumbnail" },
    { name: "backgroundImage" },
  ]),
  GiftController.store,
);

// svga Add
router.post(
  "/svgaAdd",
  adminMiddleware,
  upload.fields([
    { name: "image" },
    { name: "thumbnail" },
    { name: "backgroundImage" },
  ]),
  GiftController.svgaAdd,
);

// update gift
router.patch(
  "/:giftId",
  adminMiddleware,
  upload.fields([
    { name: "image" },
    { name: "thumbnail" },
    { name: "backgroundImage" },
  ]),
  GiftController.update,
);

// delete image
router.delete("/:giftId", adminMiddleware, GiftController.destroy);

router.post(
  "/lucky-gift",
  adminMiddleware,
  GiftController.createOrUpdateLuckyGift,
);

module.exports = router;
