const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../util/multer");

const UserController = require("./user.controller");
const upload = multer({ storage });

const checkAccessWithKey = require("../../checkAccess");
const adminMiddleware = require("../middleware/admin.middleware");

//get user list
router.get("/getUsers", checkAccessWithKey(), UserController.index);
router.get("/get-one-user", checkAccessWithKey(), UserController.getOneUser);
router.post("/singup", UserController.signup);
router.post("/login", UserController.login);

//get type wise fake data
router.get("/getFakeData", checkAccessWithKey(), UserController.getFakeData);

//get popular user by followers
router.get(
  "/getPopularUser",
  checkAccessWithKey(),
  UserController.getPopularUser,
);

//get profile of user who login
router.get("/profile", UserController.getProfile);

//delete user account
router.delete(
  "/delete-account",
  checkAccessWithKey(),
  UserController.deleteAccount,
);

//get random match for call
router.get("/random", checkAccessWithKey(), UserController.randomMatch);

//online the user
router.post("/online", UserController.userIsOnline);

//check plan
router.get("/checkPlan", checkAccessWithKey(), UserController.checkPlan);

//search user by name and username
router.post("/user/search", checkAccessWithKey(), UserController.search);

//get user profile of post[feed]
router.post("/getUser", checkAccessWithKey(), UserController.getProfileUser);
router.post("/uploadTags", checkAccessWithKey(), UserController.getUplaodTag);
router.post(
  "/uploadBadges",
  checkAccessWithKey(),
  UserController.getUplaodBadge,
);

//user login and signup
router.post("/loginSignup", checkAccessWithKey(), UserController.loginSignup);

//check referral code is valid and add referral bonus
router.post(
  "/addReferralCode",
  checkAccessWithKey(),
  UserController.referralCode,
);

//admin add or less the rCoin or diamond of user through admin panel
router.post(
  "/addLessCoin",
  checkAccessWithKey(),
  UserController.addLessRcoinDiamond,
);

router.post("/edit-uid", adminMiddleware, UserController.editUniqueId);

//update user detail [android]
router.post(
  "/update",
  checkAccessWithKey(),
  upload.fields([{ name: "image" }, { name: "coverImage" }]),
  UserController.updateProfile,
);

//bock unblock user
router.patch(
  "/blockUnblock/:userId",
  checkAccessWithKey(),
  UserController.blockUnblock,
);

router.patch(
  "/userUniqueId",
  checkAccessWithKey(),
  UserController.userUniqueId,
);

//switch for user live or not by admin
router.put(
  "/switchForEnableLiveUser",
  checkAccessWithKey(),
  UserController.switchForEnableLiveUser,
);

//switch for user live or not by admin
router.put(
  "/gameBlock",
  checkAccessWithKey(),
  UserController.switchForGameBlock,
);

//create Fake user by admin
router.post(
  "/AddFakeUser",
  checkAccessWithKey(),
  upload.fields([
    { name: "image" },
    { name: "roomImage" },
    { name: "link" },
    { name: "pkVideoArray" },
    { name: "pkImageArray" },
  ]),
  UserController.AddFakeUser,
);

//update Fake user by admin
router.patch(
  "/updateFakeUser",
  checkAccessWithKey(),
  upload.fields([
    { name: "image" },
    { name: "roomImage" },
    { name: "link" },
    { name: "pkVideoArray" },
    { name: "pkImageArray" },
  ]),
  UserController.updateFakeUser,
);

//get uniqueId
router.get(
  "/getUsersUniqueIdForAgency",
  checkAccessWithKey(),
  UserController.getUsersUniqueIdForAgency,
);

//get all users with only uniqueId (for create coinSeller dropdown)
router.get(
  "/getUsersUniqueId",
  checkAccessWithKey(),
  UserController.getUsersUniqueId,
);

router.get(
  "/coin-seller",
  checkAccessWithKey(),
  UserController.getUsersForCoinSeller,
);

router.get(
  "/all-countries",
  checkAccessWithKey(),

  UserController.getUniqueCountries,
);

router.patch("/coin", adminMiddleware, UserController.updateUserSeller);

module.exports = router;
