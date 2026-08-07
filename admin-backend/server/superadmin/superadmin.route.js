const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../../util/multer");
const upload = multer({ storage });

const SuperAdminController = require("./superadmin.controller");

const AdminMiddleware = require("../middleware/admin.middleware");

//create super admin
router.post("/signup", SuperAdminController.signUp);

//admin login
router.post("/login", SuperAdminController.login);

//update super admin password
router.put("/", AdminMiddleware, SuperAdminController.updatePassword);

//update super admin profile
router.patch("/", AdminMiddleware, SuperAdminController.update);

//update super admin Profile Image ,
router.patch("/updateImage", AdminMiddleware, upload.single("image"), SuperAdminController.updateImage);

//get super admin profile
router.get("/profile", AdminMiddleware, SuperAdminController.getProfile);

//send email
router.post("/sendEmail", SuperAdminController.forgotPassword);

//change password
router.post("/setPassword/:adminId", AdminMiddleware, SuperAdminController.setPassword);

module.exports = router;
