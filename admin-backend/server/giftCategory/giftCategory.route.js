const express = require("express");
const router = express.Router();
const multer = require("multer");
const {storage} = require("../../util/multer");
const adminMiddleware = require("../middleware/admin.middleware");

const CategoryController = require("./giftCategory.controller");
const upload = multer({
  storage,
});

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get category
router.get("/", checkAccessWithKey(), CategoryController.index);

//create category
router.post("/", adminMiddleware, upload.any(), CategoryController.store);

//update category
router.patch("/:categoryId", adminMiddleware, upload.single("image"), CategoryController.update);

//delete category
router.delete("/:categoryId", adminMiddleware, CategoryController.destroy);

module.exports = router;
