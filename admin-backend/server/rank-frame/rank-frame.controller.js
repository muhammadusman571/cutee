const RankingFrame = require("./rank-frame.model");
const fs = require("fs");
const { deleteFile } = require("../../util/deleteFile");

// -----------------------------
// Get all Ranking Frames (for admin)
// -----------------------------
exports.index = async (req, res) => {
  try {
    const data = await RankingFrame.find({ isDelete: false }).sort({
      createdAt: -1,
    });
    
    return res.status(200).json({
      status: true,
      message: "Success!",
      data,
    });
  } catch (error) {
    console.error("RankingFrame Index Error:", error);
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

    const data = await RankingFrame.find({ isDelete: false })
      .sort({ createdAt: -1 })
      .skip(parseInt(start))
      .limit(parseInt(limit));

    return res.status(200).json({
      status: true,
      message: "Success!",
      data,
    });
  } catch (error) {
    console.error("RankingFrame Get Error:", error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

// -----------------------------
// Create new Ranking Frame
// -----------------------------
exports.store = async (req, res) => {
  try {
    const { name, rankType, rankNumber } = req.body;
    const file = req.file; // single file only

    if (!file || !name || !rankType || !rankNumber) {
      if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(400).json({
        status: false,
        message: "Missing required fields!",
      });
    }

    const frame = file.path; // Save uploaded file path
    const newFrame = await RankingFrame.create({
      name,
      rankType,
      rankNumber,
      frame,
    });

    return res.status(200).json({
      status: true,
      message: "Ranking frame created successfully!",
      data: newFrame,
    });
  } catch (error) {
    console.error("RankingFrame Store Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

// -----------------------------
// Update Ranking Frame
// -----------------------------
exports.update = async (req, res) => {
  try {
    const { Id } = req.params;
    const model = await RankingFrame.findById(Id);

    if (!model) {
      if (req.file && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      return res.status(404).json({
        status: false,
        message: "Ranking frame not found!",
      });
    }

    // Update basic fields
    model.name = req.body.name || model.name;
    model.rankType = req.body.rankType || model.rankType;
    model.rankNumber = req.body.rankNumber || model.rankNumber;

    // Replace file if new one uploaded
    if (req.file) {
      if (model.frame && fs.existsSync(model.frame)) fs.unlinkSync(model.frame);
      model.frame = req.file.path;
    }

    await model.save();

    return res.status(200).json({
      status: true,
      message: "Ranking frame updated successfully!",
      data: model,
    });
  } catch (error) {
    console.error("RankingFrame Update Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

// -----------------------------
// Soft Delete Ranking Frame
// -----------------------------
exports.destroy = async (req, res) => {
  try {
    const { Id } = req.params;
    const model = await RankingFrame.findById(Id);

    if (!model) {
      return res.status(404).json({
        status: false,
        message: "Ranking frame not found!",
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
      message: "Ranking frame deleted successfully!",
    });
  } catch (error) {
    console.error("RankingFrame Destroy Error:", error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};
