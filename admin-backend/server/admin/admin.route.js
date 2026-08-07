const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../../util/multer");
const upload = multer({ storage });

const AdminController = require("./admin.controller");

const AdminMiddleware = require("../middleware/admin.middleware");

//create admin
router.post("/signup", AdminController.signUp);

//register management
router.post(
  "/registerManagement",
  AdminMiddleware,
  AdminController.registerManagement,
);

router.post(
  "/super-coin-seller",
  AdminMiddleware,
  AdminController.registerSuperCoinSeller,
);
router.get(
  "/super-coin-seller",
  AdminMiddleware,
  AdminController.superCoinSellerList,
);

router.get(
  "/sub-coin-seller",
  AdminMiddleware,
  AdminController.subCoinSellerList,
);

router.patch(
  "/super-coin-seller",
  AdminMiddleware,
  AdminController.updateSuperCoinSeller,
);
//admin login
router.post("/login", AdminController.adminLogin);

//update admin password
router.put("/", AdminMiddleware, AdminController.updatePassword);

//update admin profile
router.patch("/", AdminMiddleware, AdminController.update);

//update admin Profile Image ,
router.patch(
  "/updateImage",
  AdminMiddleware,
  upload.single("image"),
  AdminController.updateImage,
);

//get admin profile
router.get("/profile", AdminMiddleware, AdminController.getProfile);

//send email
router.post("/sendEmail", AdminController.forgotPassword);

//change password
router.post(
  "/setPassword/:adminId",
  AdminMiddleware,
  AdminController.setPassword,
);

router.get("/list", AdminMiddleware, AdminController.adminList);
router.patch("/status/:id", AdminMiddleware, AdminController.toggleAdminStatus);

router.get(
  "/all-sub-seller/:id",
  AdminMiddleware,
  AdminController.allSubCoinSellerList,
);
router.get("/all-coin-seller", AdminMiddleware, AdminController.allCoinSeller);
router.get("/coin-seller", AdminController.allCoinSellerForMobileApp);

module.exports = router;
