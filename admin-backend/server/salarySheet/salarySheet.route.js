const express = require("express");
const router = express.Router();

const SalarySheetController = require("./salarySheet.controller");
const adminMiddleware = require("../middleware/admin.middleware");

// Salary sheet CRUD
router.get("/:agencyCode", SalarySheetController.getSalarySheets);
router.delete("/:id", adminMiddleware, SalarySheetController.deleteSalarySheet);

module.exports = router;
