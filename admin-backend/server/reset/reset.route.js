const express = require("express");
const router = express.Router();

const User = require("../user/user.model");
const Agency = require("../agency/agency.model");
const adminMiddleware = require("../middleware/admin.middleware");

// Body must be { confirm: "RESET" } so a stray request can't wipe balances

// Coin sellers share the user page but must never wipe balances
const noCoinSellers = (req, res, next) => {
  if (["super_coin", "sub_coin_seller"].includes(req.admin?.role)) {
    return res.status(403).json({ status: false, message: "Not allowed for coin sellers" });
  }
  next();
};

// reset R coins of every user and agency to 0
router.post("/rcoin", adminMiddleware, noCoinSellers, async (req, res) => {
  try {
    if (req.body?.confirm !== "RESET") {
      return res.status(400).json({ status: false, message: "Confirmation missing!" });
    }

    const users = await User.updateMany({ rCoin: { $ne: 0 } }, { $set: { rCoin: 0 } });
    const agencies = await Agency.updateMany({ rCoin: { $ne: 0 } }, { $set: { rCoin: 0 } });
    console.log(`[reset] rCoin set to 0 by admin ${req.admin?._id}: ${users.modifiedCount} users, ${agencies.modifiedCount} agencies`);

    return res.status(200).json({
      status: true,
      message: `R coins reset: ${users.modifiedCount} users, ${agencies.modifiedCount} agencies`,
      users: users.modifiedCount,
      agencies: agencies.modifiedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
});

// reset R coins of every agency to 0 (users untouched)
router.post("/agency-rcoin", adminMiddleware, noCoinSellers, async (req, res) => {
  try {
    if (req.body?.confirm !== "RESET") {
      return res.status(400).json({ status: false, message: "Confirmation missing!" });
    }

    const agencies = await Agency.updateMany({ rCoin: { $ne: 0 } }, { $set: { rCoin: 0 } });
    console.log(`[reset] agency rCoin set to 0 by admin ${req.admin?._id}: ${agencies.modifiedCount} agencies`);

    return res.status(200).json({
      status: true,
      message: `Agency R coins reset: ${agencies.modifiedCount} agencies`,
      agencies: agencies.modifiedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
});

// reset diamonds of every user to 0
router.post("/diamond", adminMiddleware, noCoinSellers, async (req, res) => {
  try {
    if (req.body?.confirm !== "RESET") {
      return res.status(400).json({ status: false, message: "Confirmation missing!" });
    }

    const users = await User.updateMany({ diamond: { $ne: 0 } }, { $set: { diamond: 0 } });
    console.log(`[reset] diamond set to 0 by admin ${req.admin?._id}: ${users.modifiedCount} users`);

    return res.status(200).json({
      status: true,
      message: `Diamonds reset: ${users.modifiedCount} users`,
      users: users.modifiedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
});

module.exports = router;
