const express = require("express");
const router = express.Router();

const SalarySettingController = require("./salarySetting.controller");
const adminMiddleware = require("../middleware/admin.middleware");

router.get("/", adminMiddleware, SalarySettingController.getSalarySettings);
router.post("/", adminMiddleware, SalarySettingController.createSalarySetting);
router.patch(
  "/:id",
  adminMiddleware,
  SalarySettingController.updateSalarySetting
);
router.delete(
  "/:id",
  adminMiddleware,
  SalarySettingController.deleteSalarySetting
);

module.exports = router;
