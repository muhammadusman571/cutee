const Reaction = require("../reaction/reaction.model");

//fs
const fs = require("fs");

//config
const config = require("../../config");

//store reaction
exports.store = async (req, res) => {
  try {
    console.log("reaction file", req.files);

    if (!req.files || !req.body.name) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    }

    const reaction = new Reaction();
    if (req.files?.image?.length) {
      reaction.image = config.baseURL + req.files.image[0].path;
    }

    if (req.files?.svgaImage?.length) {
      reaction.svgaImage = config.baseURL + req.files.svgaImage[0].path;
    }

    reaction.name = req.body.name;
    await reaction.save();

    return res
      .status(200)
      .json({ status: true, message: "Success", data: reaction });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//update reaction
exports.update = async (req, res) => {
  try {
    if (!req.query.reactionId) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    }

    const reaction = await Reaction.findById(req.query.reactionId);
    if (!reaction) {
      return res
        .status(200)
        .json({ status: false, message: "Reaction does not found." });
    }

    var image = reaction?.image?.split("storage");
    var svgaImage = reaction?.svgaImage?.split("storage");
    if (image) {
      if (fs.existsSync("storage" + image[1])) {
        fs.unlinkSync("storage" + image[1]);
      }
    }
    if (svgaImage) {
      if (fs.existsSync("storage" + svgaImage[1])) {
        fs.unlinkSync("storage" + svgaImage[1]);
      }
    }

    reaction.image = config.baseURL + req.file.image[0].path;
    reaction.svgaImage = config.baseURL + req.file.svgaImage[0].path;
    await reaction.save();

    return res
      .status(200)
      .json({ status: true, message: "Success", data: reaction });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get reaction
exports.get = async (req, res) => {
  try {
    const reaction = await Reaction.find().sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ status: true, message: "Success", data: reaction });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//delete reaction
exports.destroy = async (req, res) => {
  try {
    if (!req.query.reactionId) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    }

    const reaction = await Reaction.findById(req.query.reactionId);
    if (!reaction) {
      return res
        .status(200)
        .json({ status: false, message: "Reaction does not found." });
    }

    var image = reaction?.image?.split("storage");
    var svgaImage = reaction?.svgaImage?.split("storage");
    if (image) {
      if (fs.existsSync("storage" + image[1])) {
        fs.unlinkSync("storage" + image[1]);
      }
    }
    if (svgaImage) {
      if (fs.existsSync("storage" + svgaImage[1])) {
        fs.unlinkSync("storage" + svgaImage[1]);
      }
    }

    await reaction.deleteOne();

    return res
      .status(200)
      .json({ status: true, message: "Success", data: reaction });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
