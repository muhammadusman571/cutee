const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../util/multer");
const upload = multer({ storage });

const AnnouncementController = require("./announcements.controller");
const checkAccessWithKey = require("../../checkAccess");
const adminMiddleware = require("../middleware/admin.middleware");

router.get("/", adminMiddleware, AnnouncementController.index);


router.post("/", adminMiddleware, upload.any(), AnnouncementController.store);
router.patch("/:announcementId", adminMiddleware, upload.any(), AnnouncementController.update);
router.delete("/:announcementId", adminMiddleware, AnnouncementController.destroy);

module.exports = router;