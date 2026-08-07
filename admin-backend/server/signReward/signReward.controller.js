const SignReward = require("./signReward.model");
const User = require("../user/user.model");
const fs = require("fs");
const { deleteFile } = require("../../util/deleteFile");

exports.createSignReward = async (req, res) => {
  try {
    if (!req.files) {
      if (req.files) {
        if (
          req.files?.imageVideo &&
          fs.existsSync(req.files.imageVideo[0].path)
        ) {
          fs.unlinkSync(req.files.imageVideo[0].path);
        }
        if (
          req.files?.thumbnail &&
          fs.existsSync(req.files.thumbnail[0].path)
        ) {
          fs.unlinkSync(req.files.thumbnail[0].path);
        }
      }
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    }

    let dataObj = {
      image: req.files?.imageVideo[0]?.path,
      thumbnail: req.files?.thumbnail && req.files.thumbnail[0]?.path,

      name: req.body.name,
      rewardDay: req.body.rewardDay,
      validity: req.body.validity,
      validityType: req.body.validityType,
      validationTag: `${req.body.validity} ${req.body.validityType}`,
    };
    if (req.body.diamond && req.body.diamond != null) {
      console.log(req.body.diamond != null, req.body.diamond);
      dataObj.diamond = req.body.diamond;
    }

    let data = await new SignReward(dataObj).save();

    return res.status(200).json({ status: true, message: "Success!", data });
  } catch (error) {
    if (req.files) {
      if (
        req.files?.imageVideo &&
        fs.existsSync(req.files.imageVideo[0].path)
      ) {
        fs.unlinkSync(req.files.imageVideo[0].path);
      }
      if (req.files?.thumbnail && fs.existsSync(req.files.thumbnail[0].path)) {
        fs.unlinkSync(req.files.thumbnail[0].path);
      }
    }
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.index = async (req, res) => {
  try {
    let data = await SignReward.find({ isDelete: false }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ status: true, message: "Success!", data });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.update = async (req, res) => {
  try {
    const model = await SignReward.findById(req.params.Id);

    if (!model) {
      deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: `Entry does not Exist!` });
    }

    if (req.files?.imageVideo) {
      if (fs.existsSync(model.image)) fs.unlinkSync(model.image);
      model.image = req.files.imageVideo[0].path;
    }
    if (req.files?.thumbnail) {
      if (fs.existsSync(model.thumbnail)) fs.unlinkSync(model.thumbnail);
      model.thumbnail = req.files.thumbnail[0].path;
    }

    if (
      req.body.diamond &&
      req.body.diamond != undefined &&
      req.body.diamond != null
    ) {
      model.diamond = req.body.diamond;
    }
    model.name = req.body.name || model.name;
    model.rewardDay = req.body.rewardDay || model.rewardDay;
    model.validity = req.body.validity || model.validity;
    model.validityType = req.body.validityType || model.validityType;
    if (req.body.validity || req.body.validityType) {
      model.validationTag = `${req.body.validity} ${req.body.validityType}`;
    }

    await model.save();
    return res
      .status(200)
      .json({ status: true, message: "Success!", data: model });
  } catch (error) {
    if (req.files) {
      if (
        req.files?.imageVideo &&
        fs.existsSync(req.files.imageVideo[0].path)
      ) {
        fs.unlinkSync(req.files.imageVideo[0].path);
      }
      if (req.files?.thumbnail && fs.existsSync(req.files.thumbnail[0].path)) {
        fs.unlinkSync(req.files.thumbnail[0].path);
      }
    }
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.destroy = async (req, res) => {
  try {
    const model = await SignReward.findById(req.params.Id);
    if (!model)
      return res
        .status(200)
        .json({ status: false, message: "Entry does not Exist!" });

    if (fs.existsSync(model.image)) fs.unlinkSync(model.image);
    if (fs.existsSync(model.thumbnail)) fs.unlinkSync(model.thumbnail);

    model.isDelete = true;
    await model.save();
    return res.status(200).json({ status: true, message: "Success!" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.getSignRewardsByDay = async (req, res) => {
  try {
    const rewards = await SignReward.find().sort({ rewardDay: 1 });

    const grouped = {};

    for (let i = 1; i <= 7; i++) {
      grouped[i] = rewards.filter((r) => r.rewardDay === i);
    }

    return res.status(200).json({
      status: true,
      message: "Sign rewards fetched by day successfully",
      data: grouped,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};
