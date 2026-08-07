const Svip = require("./svip.model");
const User = require("../user/user.model");
const Frame = require("../avatarFrame/avatarFrame.model");
const Wallet = require("../wallet/wallet.model");
const Purchase = require("../purchase/purchase.model");
const LiveUser = require("../liveUser/liveUser.model");
const agenda = require("../../util/agenda");

const moment = require("moment");

const fs = require("fs");
const { deleteFiles, deleteFile } = require("../../util/deleteFile");
// get all svga
exports.index = async (req, res) => {
  try {
    let data = await Svip.aggregate([
      // { $match: { isDelete: false } },
      {
        $lookup: {
          from: "purchases",
          localField: "_id",
          foreignField: "svip",
          as: "purchases",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return res.status(200).json({
      status: true,
      message: "Success!!",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get all svga for android
exports.get = async (req, res) => {
  try {
    const { userId, start = 0, limit = 20 } = req.query;
    console.log(userId);

    // 1️⃣ Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User not found!",
      });
    }

    // 2️⃣ Get all purchased Svips for this user
    const purchasedSvipIds = await Purchase.find({ userId }).distinct("svip");
    // 3️⃣ Get currently active Svip for marking `isSelected`
    const selectedSvipId = user?.activeSvip || null; // assuming you store it like this

    // 4️⃣ Fetch and decorate Svip data
    const data = await Svip.aggregate([
      { $match: { isDelete: false } },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          isPurchase: {
            $or: [
              { $in: ["$_id", purchasedSvipIds] }, // if user bought this specific Svip
            ],
          },
          isSelected: { $eq: ["$_id", selectedSvipId] },
        },
      },
      { $skip: parseInt(start) },
      { $limit: parseInt(limit) },
    ]);

    return res.status(200).json({
      status: true,
      message: "Success!",
      data,
    });
  } catch (error) {
    console.error("❌ Svip Get Error:", error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

//store svip

exports.store = async (req, res) => {
  try {
    if (!req.files || !req.body.name) {
      // Clean up invalid uploads
      if (req.files) {
        req.files.forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      return res
        .status(400)
        .json({ status: false, message: "Invalid details!" });
    }

    // Extract vip stage from request (e.g., "baron", "duke", "king")
    const rest = req.body;

    // Initialize the object with empty fields
    const dataObj = {
      ...rest,
      frame: "",
      badge: "",
      borderFinal: "",
      entry: "",
      msgBox: "",
      vipNamePlate: "",
      profileCard: "",
      roomBg: "",
      entryEffect: "",
    };

    // Helper to normalize and match words in filename
    const normalize = (str) =>
      str
        .replace(/[-_]/g, " ")
        .replace(/\.[^/.]+$/, "")
        .toLowerCase();

    // Loop over uploaded files
    req.files.forEach((file) => {
      const filename = normalize(file.originalname).toLowerCase(); // ensure case-insensitive
      console.log("fileName", file.path);

      // ✅ Simple and consistent keyword mapping
      if (filename.includes("badge")) dataObj.badge = file.path;
      else if (filename.includes("border")) dataObj.borderFinal = file.path;
      else if (filename.includes("entry")) dataObj.entryEffect = file.path;
      else if (filename.includes("frame")) dataObj.frame = file.path;
      else if (filename.includes("msg")) dataObj.msgBox = file.path;
      else if (filename.includes("name")) dataObj.vipNamePlate = file.path;
      else if (filename.includes("profile")) dataObj.profileCard = file.path;
      else if (filename.includes("room")) dataObj.roomBg = file.path;
    });
    console.log(dataObj);

    // Save the new record
    const data = await new Svip(dataObj).save();

    return res.status(200).json({
      status: true,
      message: "Svip created successfully!",
      data: { ...data.toObject(), type: "svip" },
    });
  } catch (error) {
    console.error(error);

    // Clean up any uploaded files on error
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }

    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update svga
exports.update = async (req, res) => {
  try {
    console.log("req.files:", req.files);

    const model = await Svip.findById(req.params.Id);
    if (!model) {
      if (req.files) {
        req.files.forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      return res
        .status(404)
        .json({ status: false, message: "Svip does not exist!" });
    }

    // ✅ Update basic fields
    model.name = req.body.name || model.name;
    model.diamond = req.body.diamond || model.diamond;
    model.validity = req.body.validity || model.validity;
    ((model.validityType = req.body.validityType || model.validityType),
      (model.validationTag = req.body.validationTag || model.validationTag));
    // ✅ If there are any uploaded files, update only the corresponding ones
    if (req.files && req.files.length > 0) {
      const normalize = (str) =>
        str
          .replace(/[-_\\\/]/g, " ")
          .replace(/\.[^/.]+$/, "")
          .toLowerCase()
          .trim();

      // Helper function: safely replace old file
      const replaceFile = (oldPath, newPath) => {
        if (oldPath && fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
        return newPath;
      };

      req.files.forEach((file) => {
        const filename = normalize(file.originalname);

        // Match uploaded file name with specific Svip field
        if (filename.includes("badge")) {
          model.badge = replaceFile(model.badge, file.path);
        } else if (filename.includes("border")) {
          model.borderFinal = replaceFile(model.borderFinal, file.path);
        } else if (filename.includes("entry")) {
          model.entryEffect = replaceFile(model.entryEffect, file.path);
        } else if (filename.includes("frame")) {
          model.frame = replaceFile(model.frame, file.path);
        } else if (filename.includes("msg")) {
          model.msgBox = replaceFile(model.msgBox, file.path);
        } else if (filename.includes("name")) {
          model.vipNamePlate = replaceFile(model.vipNamePlate, file.path);
        } else if (filename.includes("profile")) {
          model.profileCard = replaceFile(model.profileCard, file.path);
        } else if (filename.includes("room")) {
          model.roomBg = replaceFile(model.roomBg, file.path);
        }
      });
    }

    await model.save();

    return res.status(200).json({
      status: true,
      message: "Svip updated successfully!",
      data: model,
    });
  } catch (error) {
    console.error(error);

    // Cleanup uploaded files on error
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }

    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.destroy = async (req, res) => {
  try {
    const { Id } = req.params;

    let model;

    model = await Svip.findById(Id);
    if (!model)
      return res
        .status(404)
        .json({ status: false, message: "Svip does not exist!" });

    // 🧹 Delete all file paths if they exist
    const fileFields = [
      "frame",
      "badge",
      "borderFinal",
      "msgBox",
      "vipName",
      "profileCard",
      "roomBg",
      "entryEffect",
    ];

    fileFields.forEach((field) => {
      const filePath = model[field];
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // 🧠 Update related models (if needed)
    await Purchase.updateMany({ svip: model._id }, { svip: null });
    await User.updateMany(
      { liveJoinSvip: model._id },
      { $set: { liveJoinSvip: null } },
    );

    // 🧾 Soft delete
    model.isDelete = true;
    await model.save();

    return res
      .status(200)
      .json({ status: true, message: "Svip deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
// purchase the svip
exports.purchase = async (req, res) => {
  try {
    console.log("body", req.body);
    const { userId, Id } = req.body;

    // ✅ Validate input
    if (!userId || !Id) {
      return res.status(400).json({
        status: false,
        message: "Oops! Invalid details.",
      });
    }

    // ✅ Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    // ✅ Fetch SVIP model
    const model = await Svip.findById(Id);
    if (!model) {
      return res.status(404).json({
        status: false,
        message: "Svip not found.",
      });
    }

    // ✅ Check if already purchased
    const existingPurchase = await Purchase.findOne({
      userId,
      svip: model._id,
    });

    if (existingPurchase) {
      return res.status(400).json({
        status: false,
        message: "You have already purchased this SVIP package.",
      });
    }

    // ✅ Check balance
    if (user.diamond < model.diamond) {
      return res.status(400).json({
        status: false,
        message: "You do not have enough diamonds.",
      });
    }

    // ✅ Create purchase record
    const validDate = moment().add(model.validity, model.validityType);

    const purchase = new Purchase({
      userId,
      svip: model._id,
      time: validDate.toISOString(),
    });

    // ✅ Deduct diamonds & log wallet transaction
    user.diamond -= model.diamond;
    user.spentCoin += model.diamond;

    const wallet = new Wallet({
      userId,
      diamond: model.diamond,
      isIncome: false,
      date: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
      svipId: model._id,
      type: 12, // You can choose a unique type code for SVIP purchases
    });

    await Promise.all([user.save(), purchase.save(), wallet.save()]);

    // Calculate expiration date
    const expiresAt = new Date();
    if (model.validityType === "day")
      expiresAt.setDate(expiresAt.getDate() + model.validity);
    else if (model.validityType === "month")
      expiresAt.setMonth(expiresAt.getMonth() + model.validity);
    else if (model.validityType === "year")
      expiresAt.setFullYear(expiresAt.getFullYear() + model.validity);

    // Schedule job
    await agenda.schedule(expiresAt, "expire svip", {
      userSvipId: model._id,
    });

    return res.status(200).json({
      status: true,
      message: "SVIP purchased successfully!",
      user,
    });
  } catch (error) {
    console.error("Purchase Error:", error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

exports.select = async (req, res) => {
  try {
    const { userId, Id, selectType } = req.body;

    if (!userId || !Id) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid request data!" });
    }

    // ✅ Find user
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found!" });
    }

    // ✅ Find SVIP
    const svip = await Svip.findById(Id);
    if (!svip) {
      return res
        .status(404)
        .json({ status: false, message: "Svip not found!" });
    }

    // ✅ Non-VIP users must have purchased it first
    const purchased = await Purchase.findOne({
      userId,
      svip: svip._id,
    }).select("svip");

    if (!purchased) {
      return res.status(403).json({
        status: false,
        message: "Please purchase this SVIP first!",
      });
    }

    // ✅ Update user's active SVIP
    if (selectType === true) {
      user.activeSvip = purchased.svip;
    } else {
      user.activeSvip = null;
    }
    await user.save();

    // ✅ Return updated user with populated SVIP
    user = await User.findById(userId).populate("activeSvip level");

    res.status(200).json({
      status: true,
      message: "SVIP selection updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Select SVIP Error:", error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.deleteField = async (req, res) => {
  try {
    const { Id } = req.params;
    const { field } = req.body;

    const allowedFields = [
      "frame",
      "badge",
      "borderFinal",
      "msgBox",
      "vipNamePlate",
      "profileCard",
      "roomBg",
      "entryEffect",
    ];

    // ❌ invalid field check
    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        status: false,
        message: "Invalid field name!",
      });
    }

    const model = await Svip.findById(Id);

    if (!model) {
      return res.status(404).json({
        status: false,
        message: "Svip not found!",
      });
    }

    const filePath = model[field];

    // 🧹 delete file from server
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 🧼 remove from DB
    model[field] = "";
    await model.save();

    return res.status(200).json({
      status: true,
      message: `${field} deleted successfully!`,
      data: model,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};
