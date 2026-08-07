const OfficialFrame = require("./official-frame.model");
const User = require("../user/user.model");
const fs = require("fs");
const { deleteFile } = require("../../util/deleteFile");

// -----------------------------
// Get all Official Frames (for admin)
// -----------------------------
exports.index = async (req, res) => {
  try {
    const data = await OfficialFrame.find({ isDelete: false }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      status: true,
      message: "Success!",
      data,
    });
  } catch (error) {
    console.error("OfficialFrame Index Error:", error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

// -----------------------------
// Get Frames (for Android / client use, with pagination)
// -----------------------------
exports.get = async (req, res) => {
  try {
    const { start = 0, limit = 20 } = req.query;

    const data = await OfficialFrame.find({ isDelete: false })
      .sort({ createdAt: -1 })
      .skip(parseInt(start))
      .limit(parseInt(limit));

    return res.status(200).json({
      status: true,
      message: "Success!",
      data,
    });
  } catch (error) {
    console.error("OfficialFrame Get Error:", error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

// -----------------------------
// Create new Official Frame
// -----------------------------
exports.store = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file; // single file only

    if (!file || !name) {
      if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(400).json({
        status: false,
        message: "Missing required fields!",
      });
    }

    const frame = file.path; // Save uploaded file path
    const newFrame = await OfficialFrame.create({
      name,
      frame,
    });

    return res.status(200).json({
      status: true,
      message: "Official frame created successfully!",
      data: newFrame,
    });
  } catch (error) {
    console.error("OfficialFrame Store Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

// -----------------------------
// Update Official Frame
// -----------------------------
exports.update = async (req, res) => {
  try {
    const { Id } = req.params;
    const model = await OfficialFrame.findById(Id);

    if (!model) {
      if (req.file && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      return res.status(404).json({
        status: false,
        message: "Official frame not found!",
      });
    }

    // Update basic fields
    model.name = req.body.name || model.name;

    // Replace file if new one uploaded
    if (req.file) {
      if (model.frame && fs.existsSync(model.frame)) fs.unlinkSync(model.frame);
      model.frame = req.file.path;
    }

    await model.save();

    return res.status(200).json({
      status: true,
      message: "Official frame updated successfully!",
      data: model,
    });
  } catch (error) {
    console.error("OfficialFrame Update Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

// -----------------------------
// Soft Delete Official Frame
// -----------------------------
exports.destroy = async (req, res) => {
  try {
    const { Id } = req.params;
    const model = await OfficialFrame.findById(Id);

    if (!model) {
      return res.status(404).json({
        status: false,
        message: "Official frame not found!",
      });
    }

    // Delete file from server
    if (model.frame && fs.existsSync(model.frame)) {
      fs.unlinkSync(model.frame);
    }

    // Soft delete
    model.isDelete = true;
    await model.save();

    return res.status(200).json({
      status: true,
      message: "Official frame deleted successfully!",
    });
  } catch (error) {
    console.error("OfficialFrame Destroy Error:", error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

exports.giveFrameToUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const frameId = req.params.frameId;

    const frame = await OfficialFrame.findById(frameId);
    if (!frame) {
      return res.status(404).json({
        status: false,
        message: "Official frame not found!",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found!",
      });
    }

    user.avatarFrameImage = frame.frame;
    user.isOfficialFrame = true;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Frame assigned to user successfully!",
      data: {
        isOfficialFrame: user.isOfficialFrame,
        avatarFrameImage: user.avatarFrameImage,
      },
    });
  } catch (error) {
    console.log("Give Frame To User Error:", error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

//remove official frame from user
exports.removeFrameFromUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found!",
      });
    }
    if (user.isOfficialFrame === false) {
      return res.status(400).json({
        status: false,
        message: "User does not have an official frame assigned!",
      });
    }

    user.avatarFrameImage = "";
    user.isOfficialFrame = false;
    await user.save();
    return res.status(200).json({
      status: true,
      message: "Frame removed from user successfully!",
      data: user,
    });
  } catch (error) {
    console.log("Remove Frame From User Error:", error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};
