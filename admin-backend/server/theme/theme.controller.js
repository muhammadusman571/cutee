const { baseURL } = require("../../config");
const { deleteFiles, deleteFile } = require("../../util/deleteFile");
const Theme = require("./theme.model");
const User = require("../user/user.model");
const Purchase = require("../purchase/purchase.model");
const Wallet = require("../wallet/wallet.model");
const moment = require("moment");

const fs = require("fs");
const agenda = require("../../util/agenda");

// get theme list
exports.index = async (req, res) => {
  try {
    const theme = await Theme.aggregate([
      { $match: { _id: { $ne: null } } },
      {
        $project: {
          theme: 1,
          type: 1,
          diamond: 1,
          validity: 1,
          validityType: 1,
          isDefault: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]).sort({ createdAt: -1 });

    if (!theme)
      return res.status(200).json({ status: false, message: "No data found!" });

    return res.status(200).json({ status: true, message: "Success!!", theme });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get all themes for android
exports.get = async (req, res) => {
  try {
    const { userId, start = 0, limit = 20 } = req.query;

    // 1️⃣ Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User not found!",
      });
    }

    // 2️⃣ Get all purchased themes for this user
    const purchasedThemesIds = await Purchase.find({ userId }).distinct(
      "theme"
    );
    // 3️⃣ Get currently active Theme for marking `isSelected`
    const selectedThemeId = user?.activeTheme || null; // assuming you store it like this

    // 4️⃣ Fetch and decorate theme data
    const data = await Theme.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          isPurchase: {
            $or: [
              { $in: ["$_id", purchasedThemesIds] }, // if user bought this specific theme
            ],
          },
          isSelected: { $eq: ["$_id", selectedThemeId] },
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
    console.error("❌ Theme Get Error:", error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

// store multiple theme
exports.store = async (req, res) => {
  try {
    if (!req.files)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const theme = req.files.map((theme) => ({
      theme: theme.path,
      diamond: req.body.diamond,
      validity: req.body.validity,
      validityType: req.body.validityType,
    }));

    const themes = await Theme.insertMany(theme);

    return res
      .status(200)
      .json({ status: true, message: "Success!", theme: themes });
  } catch (error) {
    console.log(error);
    deleteFiles(req.files);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update theme
exports.update = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.themeId);

    if (!theme) {
      deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "theme does not Exist!" });
    }

    if (req.file) {
      if (fs.existsSync(theme.theme)) {
        fs.unlinkSync(theme.theme);
      }
      theme.theme = req.file.path;
    }
    ((theme.diamond = req.body.diamond || theme.diamond),
      (theme.validity = req.body.validity || theme.validity),
      (theme.validityType = req.body.validityType || theme.validityType),
      await theme.save());

    // const theme_ = { ...theme, theme: baseURL + theme };

    return res
      .status(200)
      .json({ status: true, message: "Success!", theme: theme });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// delete theme
exports.destroy = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.themeId);

    if (!theme)
      return res
        .status(200)
        .json({ status: false, message: "theme does not Exist!" });

    if (fs.existsSync(theme.theme)) {
      fs.unlinkSync(theme.theme);
    }

    await theme.deleteOne();

    return res.status(200).json({ status: true, message: "Success!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// set a theme as the default
exports.setDefaultTheme = async (req, res) => {
  try {
    const theme = await Theme.findById(req.query.themeId);

    if (!theme) {
      return res.status(200).json({
        status: false,
        message: "Theme not found. Please provide a valid theme ID.",
      });
    }

    await Theme.updateMany(
      { _id: { $ne: theme._id } },
      { $set: { isDefault: false } }
    );

    theme.isDefault = true;
    await theme.save();

    return res.status(200).json({
      status: true,
      message: `Theme '${theme.name}' has been set as default.`,
      theme,
    });
  } catch (error) {
    console.error("Error in setDefaultTheme:", error);
    return res.status(500).json({
      status: false,
      message: "An unexpected error occurred while setting the default theme.",
      error: error.message,
    });
  }
};

exports.purchase = async (req, res) => {
  try {
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

    // ✅ Fetch THEME model
    const model = await Theme.findById(Id);
    if (!model) {
      return res.status(404).json({
        status: false,
        message: "Theme not found.",
      });
    }

    // ✅ Check if already purchased
    const existingPurchase = await Purchase.findOne({
      userId,
      theme: model._id,
    });

    if (existingPurchase) {
      return res.status(400).json({
        status: false,
        message: "You have already purchased this theme.",
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
      theme: model._id,
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
      themeId: model._id,
      type: 12, // You can choose a unique type code for Theme purchases
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
    await agenda.schedule(expiresAt, "expire theme", {
      userThemeId: model._id,
    });

    return res.status(200).json({
      status: true,
      message: "Theme purchased successfully!",
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

    // ✅ Find theme
    const theme = await Theme.findById(Id);
    if (!theme) {
      return res
        .status(404)
        .json({ status: false, message: "Theme not found!" });
    }

    // ✅ users must have purchased it first
    const purchased = await Purchase.findOne({
      userId,
      theme: theme._id,
    });

    if (!purchased) {
      return res.status(403).json({
        status: false,
        message: "Please purchase this theme first!",
      });
    }

    // ✅ Update user's active SVIP
    if (selectType === true) {
      user.activeTheme = Theme._id;
    } else {
      user.activeTheme = null;
    }
    await user.save();

    // ✅ Return updated user with populated Theme
    user = await User.findById(userId).populate("activeTheme level");

    res.status(200).json({
      status: true,
      message: "The,e selection updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Select Theme Error:", error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
