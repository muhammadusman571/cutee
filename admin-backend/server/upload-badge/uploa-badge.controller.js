const UploadBadge = require("./upload-badge.model");
const User = require("../user/user.model");
const fs = require("fs");
const { deleteFile } = require("../../util/deleteFile");

exports.index = async (req, res) => {
  try {
    const data = await UploadBadge.find({ isDelete: false }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      status: true,
      message: "Success!",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

exports.get = async (req, res) => {
  try {
    const { start = 0, limit = 20 } = req.query;

    const data = await UploadBadge.find({ isDelete: false })
      .sort({ createdAt: -1 })
      .skip(parseInt(start))
      .limit(parseInt(limit));

    return res.status(200).json({
      status: true,
      message: "Success!",
      data,
    });
  } catch (error) {
    console.error("UploadBadge Get Error:", error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

exports.store = async (req, res) => {
  try {
    const { name, type } = req.body;
    const file = req.file;

    if (!type || !name) {
      if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(400).json({
        status: false,
        message: "Missing required fields!",
      });
    }
    let frame;
    if (file?.path) frame = file.path;
    const data = await UploadBadge.create({
      name,
      frame,

      type,
    });

    return res.status(200).json({
      status: true,
      message: "Upload Badge created successfully!",
      data,
    });
  } catch (error) {
    console.log(error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { Id } = req.params;
    const model = await UploadBadge.findById(Id);

    if (!model) {
      if (req.file && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      return res.status(404).json({
        status: false,
        message: "Upload Badge not found!",
      });
    }

    model.name = req.body.name || model.name;

    if (req.file) {
      if (model.frame && fs.existsSync(model.frame)) fs.unlinkSync(model.frame);
      model.frame = req.file.path;
    }

    await model.save();

    return res.status(200).json({
      status: true,
      message: "Upload Badge updated successfully!",
      data: model,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

exports.destroy = async (req, res) => {
  try {
    const { Id } = req.params;
    const model = await UploadBadge.findById(Id);

    if (!model) {
      return res.status(404).json({
        status: false,
        message: "Upload Badge not found!",
      });
    }

    if (model.frame && fs.existsSync(model.frame)) {
      fs.unlinkSync(model.frame);
    }

    model.isDelete = true;
    await model.save();

    return res.status(200).json({
      status: true,
      message: "Upload Badge deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

exports.giveFrameToUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const { frameIds } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found!",
      });
    }
    user.uploadBadges = frameIds;
    user.isUploadBadge = true;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Upload Badge to user successfully!",
      data: {
        isOfficialFrame: user.isOfficialFrame,
        avatarFrameImage: user.avatarFrameImage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

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
        message: "User does not have an Upload Badge assigned!",
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
