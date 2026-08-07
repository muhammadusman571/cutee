const express = require("express");
const router = express.Router();

const LiveUserController = require("./liveUser.controller");

const checkAccessWithKey = require("../../checkAccess");

const multer = require("multer");
const { storage } = require("../../util/multer");
const adminMiddleware = require("../middleware/admin.middleware");
const upload = multer({ storage });

router.patch(
  "/updateRoomImage",
  checkAccessWithKey(),
  upload.single("roomImage"),
  LiveUserController.updateRoomImage,
);

router.patch(
  "/updatePrivateCode",
  checkAccessWithKey(),
  LiveUserController.updatePrivateCode,
);

router.get("/", checkAccessWithKey(), LiveUserController.getLiveUser);

router.get("/rooms", adminMiddleware, LiveUserController.getLiveUsersForAdmin);
router.patch(
  "/pin-room/:roomId",
  adminMiddleware,
  LiveUserController.togglePinRoomForAdmin,
);

router.get(
  "/fakeLiveUser",
  checkAccessWithKey(),
  LiveUserController.fakeLiveUser,
);

router.patch(
  "/live",
  // checkAccessWithKey(),
  upload.single("roomImage"),
  LiveUserController.userIsLive,
);

router.patch(
  "/broadcastAlertSound",
  checkAccessWithKey(),
  LiveUserController.broadcastAlertSound,
);

router.get("/getTime", checkAccessWithKey(), LiveUserController.liveTime);

router.get(
  "/generateAgoraToken",
  checkAccessWithKey(),
  LiveUserController.generateToken,
);

router.get(
  "/getLiveUserByAdmin",
  checkAccessWithKey(),
  LiveUserController.getLiveUserByAdmin,
);

router.post(
  "/liveStreamingCutByAdmin",
  checkAccessWithKey(),
  LiveUserController.liveStreamingCutByAdmin,
);

router.delete(
  "/terminateAudioSession",
  checkAccessWithKey(),
  LiveUserController.terminateAudioSession,
);

router.get("/checkLive", checkAccessWithKey(), LiveUserController.checkLive);

router.get(
  "/fansRanking",
  checkAccessWithKey(),
  LiveUserController.fansRanking,
);

router.get(
  "/fetchUserSpendingRankings",
  checkAccessWithKey(),
  LiveUserController.fetchUserSpendingRankings,
);

router.get(
  "/fetchHostReceivingRankings",
  checkAccessWithKey(),
  LiveUserController.fetchHostReceivingRankings,
);

router.get(
  "/fetchAgencyReceivingRankings",
  checkAccessWithKey(),
  LiveUserController.fetchAgencyReceivingRankings,
);

router.patch(
  "/active-room/:roomId",
  adminMiddleware,
  LiveUserController.toggleRoomActiveForAdmin,
);
router.delete(
  "/room/:roomId",
  adminMiddleware,
  LiveUserController.deleteRoomForAdmin,
);
router.get(
  "/:roomId/top-users",
  // checkAccessWithKey(),
  LiveUserController.getTopUsersByRoom,
);
module.exports = router;
