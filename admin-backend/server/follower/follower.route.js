const express = require("express");
const router = express.Router();

const FollowerController = require("./follower.controller");

var checkAccessWithKey = require("../../checkAccess");

// router.get(checkAccessWithSecretKey());

router.post(
  "/followingList",
  checkAccessWithKey(),
  FollowerController.followingList
);

router.post(
  "/followerList",
  checkAccessWithKey(),
  FollowerController.followerList
);

//for admin panel (user wise follower or following list)
router.get(
  "/followFollowing",
  checkAccessWithKey(),
  FollowerController.followerFollowing
);

router.post(
  "/followUnfollow",
  checkAccessWithKey(),
  FollowerController.followUnFollow
);

// friends list (mutual follow) with live status
router.get(
  "/friends",
  checkAccessWithKey(),
  FollowerController.friendsList
);
// router.post("/follow", checkAccessWithKey(), FollowerController.follow);

// router.post("/unFollow", checkAccessWithKey(), FollowerController.unFollow);

module.exports = router;
