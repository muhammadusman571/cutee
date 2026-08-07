const ProfileBg = require("./profileBg.model");
const User = require("../user/user.model");
const fs = require("fs");
const { deleteFiles, deleteFile } = require("../../util/deleteFile");

exports.createProfileBg = async (req, res) => {
  try {
    if (!req.body.diamond || !req.files) {
      if (req.files) {
        if (
          req.files?.imageVideo &&
          fs.existsSync(req.files?.imageVideo[0]?.path)
        ) {
          fs.unlinkSync(req.files?.imageVideo[0]?.path);
        }
        if (
          req.files?.thumbnail &&
          fs.existsSync(req.files?.thumbnail[0]?.path)
        ) {
          fs.unlinkSync(req.files?.thumbnail[0]?.path);
        }
      }
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    }
    let dataObj = {
      image: req.files?.imageVideo[0]?.path,
      thumbnail: req.files?.thumbnail && req.files?.thumbnail[0]?.path,
      diamond: req.body?.diamond,
      name: req.body?.name,
      validity: req.body?.validity,
      validityType: req.body?.validityType,
      validationTag: `${req.body?.validity} ${req.body?.validityType}`,
    };

    let data = await new ProfileBg(dataObj).save();

    return res.status(200).json({
      status: true,
      message: "Success!",
      data: { ...data._doc, type: "banner" },
    });
  } catch (error) {
    console.log(error);
    if (req.files) {
      if (
        req.files?.imageVideo &&
        fs.existsSync(req.files?.imageVideo[0]?.path)
      ) {
        fs.unlinkSync(req.files?.imageVideo[0]?.path);
      }
      if (
        req.files?.thumbnail &&
        fs.existsSync(req.files?.thumbnail[0]?.path)
      ) {
        fs.unlinkSync(req.files?.thumbnail[0]?.path);
      }
    }
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.index = async (req, res) => {
  try {
    let data = await ProfileBg.find({ isDelete: false }).sort({
      createdAt: -1,
    });

    data = data.map((item) => ({
      ...item.toObject(),
      type: "banner",
    }));
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

exports.update = async (req, res) => {
  try {
    const model = await ProfileBg.findById(req.params.Id);

    if (!model) {
      deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: `${message} does not Exist!` });
    }
    if (req.files && req.files?.imageVideo) {
      console.log("req.inner : ");

      if (fs.existsSync(model.image)) {
        fs.unlinkSync(model.image);
      }
      model.image = req.files?.imageVideo[0]?.path;
      if (req.query?.type !== "svga") {
        await User.updateMany(
          { avatarFrame: model._id },
          {
            avatarFrameImage: model?.image,
          },
        );
      } else {
        if (req.files?.thumbnail) {
          if (fs.existsSync(model?.thumbnail)) {
            fs.unlinkSync(model?.thumbnail);
          }
          model.thumbnail = req.files?.thumbnail[0]?.path;
        }
      }
    }
    model.diamond = req.body.diamond ? req.body.diamond : model.diamond;
    model.name = req.body.name ? req.body.name : model.name;
    model.validity = req.body.validity ? req.body.validity : model.validity;
    model.validityType = req.body.validityType
      ? req.body.validityType
      : model.validityType;
    if (req.body.validity || req.body.validityType) {
      model.validationTag = `${req.body?.validity} ${req.body?.validityType}`;
    }
    await model.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!", data: model });
  } catch (error) {
    console.log(error);
    if (req.files) {
      if (
        req.files?.imageVideo &&
        fs.existsSync(req.files?.imageVideo[0]?.path)
      ) {
        fs.unlinkSync(req.files?.imageVideo[0]?.path);
      }
      if (
        req.files?.thumbnail &&
        fs.existsSync(req.files?.thumbnail[0]?.path)
      ) {
        fs.unlinkSync(req.files?.thumbnail[0]?.path);
      }
    }
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// delete svga
exports.destroy = async (req, res) => {
  try {
    const model = await ProfileBg.findById(req.params.Id);

    if (!model)
      return res
        .status(200)
        .json({ status: false, message: `Entry Banner does not Exist!` });

    if (fs.existsSync(model.image)) {
      fs.unlinkSync(model.image);
    }
    if (fs.existsSync(model?.thumbnail)) {
      fs.unlinkSync(model.thumbnail);
    }

    model.isDelete = true;
    await model.save();

    return res.status(200).json({ status: true, message: "Success !!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
