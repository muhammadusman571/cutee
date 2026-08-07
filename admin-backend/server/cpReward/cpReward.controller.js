const CPReward = require("./cpReward.model");
const fs = require("fs");

exports.index = async (req, res) => {
  try {
    let data = await CPReward.find({ isDelete: false }).sort({
      createdAt: -1,
    });
    console.log("data", data);

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

exports.store = async (req, res) => {
  try {
    if (!req.files || !req.files?.imageVideo?.length) {
      return res
        .status(400)
        .json({ status: false, message: "Images are required!" });
    }

    // ---------- Parse Rules ----------
    let parsedRules = [];

    if (req.body.rules) {
      try {
        parsedRules = JSON.parse(req.body.rules);
      } catch (err) {
        parsedRules = req.body.rules.split(",");
      }
    }

    // ---------- Multiple Images ----------
    const images = req.files.imageVideo.map((file) => file.path);

    const dataObj = {
      images: images,
      thumbnail: req.files?.thumbnail?.[0]?.path || "",
      name: req.body.name,
      rules: parsedRules,

      startValidityType: req.body.startValidityType,
      startDays: Number(req.body.startDays) || 0,
      position: Number(req.body.position) || 0,
      startHours: Number(req.body.startHours) || 0,
      startMinutes: Number(req.body.startMinutes) || 0,
      startSeconds: Number(req.body.startSeconds) || 0,

      endValidityType: req.body.endValidityType,
      endDays: Number(req.body.endDays) || 0,
      endHours: Number(req.body.endHours) || 0,
      endMinutes: Number(req.body.endMinutes) || 0,
      endSeconds: Number(req.body.endSeconds) || 0,
      validity: Number(req.body.validity) || 0, // ✅ New field
      validityType: req.body.validityType || "day",
    };

    const data = await new CPReward(dataObj).save();

    return res.status(200).json({
      status: true,
      message: "Success!",
      data,
    });
  } catch (error) {
    console.log(error);

    // cleanup uploaded images
    if (req.files?.imageVideo) {
      req.files.imageVideo.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    if (req.files?.thumbnail?.[0]?.path) {
      if (fs.existsSync(req.files.thumbnail[0].path)) {
        fs.unlinkSync(req.files.thumbnail[0].path);
      }
    }

    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.update = async (req, res) => {
  try {
    const model = await CPReward.findById(req.params.Id);

    if (!model) {
      return res
        .status(404)
        .json({ status: false, message: "CPReward not found!" });
    }

    // ---------- Update Images ----------
    if (req.files?.imageVideo?.length) {
      // delete old images
      model.images.forEach((img) => {
        if (fs.existsSync(img)) {
          fs.unlinkSync(img);
        }
      });

      model.images = req.files.imageVideo.map((file) => file.path);
    }

    // ---------- Parse Rules ----------
    if (req.body.rules) {
      try {
        model.rules = JSON.parse(req.body.rules);
      } catch (err) {
        model.rules = req.body.rules.split(",");
      }
    }

    // ---------- Basic Fields ----------
    model.name = req.body.name || model.name;

    model.position =
      req.body.position !== undefined
        ? Number(req.body.position)
        : model.position;

    model.startValidityType =
      req.body.startValidityType || model.startValidityType;

    model.startDays =
      req.body.startDays !== undefined
        ? Number(req.body.startDays)
        : model.startDays;

    model.startHours =
      req.body.startHours !== undefined
        ? Number(req.body.startHours)
        : model.startHours;

    model.startMinutes =
      req.body.startMinutes !== undefined
        ? Number(req.body.startMinutes)
        : model.startMinutes;

    model.startSeconds =
      req.body.startSeconds !== undefined
        ? Number(req.body.startSeconds)
        : model.startSeconds;
    model.validity =
      req.body.validity !== undefined
        ? Number(req.body.validity)
        : model.validity;
    model.validityType = req.body.validityType || model.validityType;

    model.endValidityType = req.body.endValidityType || model.endValidityType;

    model.endDays =
      req.body.endDays !== undefined ? Number(req.body.endDays) : model.endDays;

    model.endHours =
      req.body.endHours !== undefined
        ? Number(req.body.endHours)
        : model.endHours;

    model.endMinutes =
      req.body.endMinutes !== undefined
        ? Number(req.body.endMinutes)
        : model.endMinutes;

    model.endSeconds =
      req.body.endSeconds !== undefined
        ? Number(req.body.endSeconds)
        : model.endSeconds;

    await model.save();

    return res.status(200).json({
      status: true,
      message: "Success!",
      data: model,
    });
  } catch (error) {
    console.log(error);

    if (req.files?.imageVideo) {
      req.files.imageVideo.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.destroy = async (req, res) => {
  try {
    const model = await CPReward.findById(req.params.Id);

    if (!model)
      return res
        .status(200)
        .json({ status: false, message: "CPReward does not exist!" });

    // delete all images
    model.images.forEach((img) => {
      if (fs.existsSync(img)) {
        fs.unlinkSync(img);
      }
    });

    if (fs.existsSync(model.thumbnail)) {
      fs.unlinkSync(model.thumbnail);
    }

    model.isDelete = true;
    await model.save();

    return res.status(200).json({
      status: true,
      message: "Success !!",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
