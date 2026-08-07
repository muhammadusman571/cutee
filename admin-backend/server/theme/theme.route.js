const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../util/multer");

const ThemeController = require("./theme.controller");
const upload = multer({
  storage,
});

const checkAccessWithKey = require("../../checkAccess");
const adminMiddleware = require("../middleware/admin.middleware");

router.patch("/setDefaultTheme", adminMiddleware, ThemeController.setDefaultTheme);

router.get("/", adminMiddleware, ThemeController.index);

router.get("/get", checkAccessWithKey(), ThemeController.get);

router.post("/", adminMiddleware, upload.any(), ThemeController.store);

router.patch("/:themeId", adminMiddleware, upload.single("theme"), ThemeController.update);

router.delete("/:themeId", adminMiddleware, ThemeController.destroy);

router.post("/purchase", checkAccessWithKey(), ThemeController.purchase);

router.post("/select", checkAccessWithKey(), ThemeController.select);

module.exports = router;
