const Withdrawal = require("./withdrawal.model");
const User = require("../user/user.model");
const Admin = require("../admin/admin.model");
const mongoose = require("mongoose");

// ===============================
// 🟢 CREATE WITHDRAWAL REQUEST
// ===============================
exports.createWithdrawal = async (req, res) => {
  try {
    console.log(req.body);
    const { user, amount, bankDetails, requestTo, currency } = req.body;

    if (!user || !amount) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid details" });
    }

    const userData = await User.findById(user);

    if (!userData) {
      return res.status(200).json({ status: false, message: "User not found" });
    }

    // 🚫 Check existing pending request
    const existingRequest = await Withdrawal.findOne({
      user: userData._id,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(200).json({
        status: false,
        message: "You already have a pending withdrawal request",
      });
    }

    // 🔥 Deduction Logic
    let deduction = 0;

    if (amount <= 100000) {
      deduction = amount * 0.3;
    } else if (amount <= 200000) {
      deduction = amount * 0.25;
    } else if (amount <= 700000) {
      deduction = amount * 0.2;
    } else if (amount <= 1000000) {
      deduction = amount * 0.18;
    } else if (amount > 2000000) {
      deduction = 15000;
    }

    const finalAmount = amount + deduction;

    if (userData.rCoin < finalAmount) {
      return res.status(200).json({
        status: false,
        message: "Insufficient rCoin balance",
      });
    }

    const withdrawal = new Withdrawal({
      user: userData._id,
      amount,
      deduction,
      finalAmount,
      currency: currency || "PKR",
      bankDetails: bankDetails || {},

      status: "pending",
      isForwarded: false,
    });
    if (requestTo) {
      const admin = await Admin.findOne({ uniqueId: requestTo });
      if (admin) withdrawal.requestTo = admin._id;
    }

    await withdrawal.save();

    return res.status(200).json({
      status: true,
      message: "Withdrawal request created",
      data: withdrawal,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

// ===============================
// 🔵 GET ALL (ADMIN PANEL)
// ===============================
exports.getAllWithdrawal = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const search = req.query.search || "";

    let match = {};

    // search filter
    if (search) {
      match = {
        $or: [{ amount: { $regex: search, $options: "i" } }],
      };
    }

    const [total, data] = await Promise.all([
      Withdrawal.countDocuments(match),
      Withdrawal.find(match)
        .populate("user", "name uniqueId image")
        .populate("requestTo", "name role uniqueId")
        .populate("forwardedTo", "name role uniqueId")
        .sort({ createdAt: -1 })
        .skip((start - 1) * limit)
        .limit(limit),
    ]);

    return res.status(200).json({
      status: true,
      message: "Success",
      total,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

// ===============================
// 🔁 FORWARD REQUEST (ADMIN → ADMIN)
// ===============================
exports.forwardWithdrawal = async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { adminId } = req.body;

    const withdrawal = await Withdrawal.findById(withdrawalId);
    const admin = await Admin.findById(adminId);

    if (!withdrawal) {
      return res
        .status(200)
        .json({ status: false, message: "Request not found" });
    }

    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "Admin not found" });
    }

    withdrawal.isForwarded = true;
    withdrawal.forwardedTo = admin._id;
    withdrawal.status = "pending"; // still pending

    await withdrawal.save();
    const data = await Withdrawal.findById(withdrawalId)
      .populate("user", "name uniqueId image")
      .populate("requestTo", "name role uniqueId")
      .populate("forwardedTo", "name role uniqueId");

    return res.status(200).json({
      status: true,
      message: "Forwarded successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

// ===============================
// ✅ APPROVE / REJECT
// ===============================
exports.updateStatus = async (req, res) => {
  try {
    console.log(req.body);
    const { withdrawalId } = req.params;
    const { status, adminId, isVisibleToSeller } = req.body;

    const withdrawal = await Withdrawal.findById(withdrawalId);

    if (!withdrawal) {
      return res
        .status(200)
        .json({ status: false, message: "Request not found" });
    }

    // if (
    //   !["approved", "rejected"].includes(status) ||
    //   isVisibleToSeller != "true"
    // ) {
    //   return res.status(200).json({ status: false, message: "Invalid status" });
    // }

    // =========================
    // ✅ ADD RECEIPT SUPPORT
    // =========================
    if (req.file) {
      withdrawal.receipt = req.file.path; // or req.file.filename depending on multer config
    }
    if (isVisibleToSeller != "true") {
      withdrawal.status = status;
      withdrawal.actionBy = adminId;
    } else withdrawal.isVisibleToSeller = true;

    if (status === "approved") {
      const user = await User.findById(withdrawal.user);

      if (!user) {
        return res
          .status(200)
          .json({ status: false, message: "User not found" });
      }

      // 🔥 CHECK BALANCE
      if (user.rCoin < withdrawal.finalAmount) {
        return res.status(200).json({
          status: false,
          message: "Insufficient rCoin balance",
        });
      }

      // 🔥 DEDUCT COINS
      user.rCoin -= withdrawal.finalAmount;
      await user.save();
    }
    await withdrawal.save();
    const data = await Withdrawal.findById(withdrawalId)
      .populate("user", "name uniqueId image")
      .populate("requestTo", "name role uniqueId")
      .populate("forwardedTo", "name role uniqueId");

    return res.status(200).json({
      status: true,
      message: `Request ${status}`,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};
