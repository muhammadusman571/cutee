const Gift = require("./gift.model");
const Category = require("../giftCategory/giftCategory.model");
const LuckyGift = require("./lucky-gift.model");
const fs = require("fs");
const { deleteFiles, deleteFile } = require("../../util/deleteFile");
const mongoose = require("mongoose");
const CPReward = require("../cpReward/cpReward.model");
const geoip = require("geoip-lite");

// get all gift
exports.index = async (req, res) => {
  try {
    const gift = await Category.aggregate([
      {
        $lookup: {
          from: "gifts",
          localField: "_id",
          foreignField: "category",
          as: "gift",
        },
      },
    ]);

    return res.status(200).json({ status: true, message: "Success!!", gift });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get category wise gifts
exports.categoryWiseGift = async (req, res) => {
  try {
    const categoryId = req.params?.categoryId;
    console.log(req.params);
    console.log(categoryId);
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(200)
        .json({ status: false, message: "Category does not exist!" });
    }

    let gifts;
    // if (category.name.toLowerCase() === "cp gift") {
    //   gifts = await CPReward.find({ isDelete: false }).sort({
    //     createdAt: -1,
    //   });
    // } else {
    gifts = await Gift.aggregate([
      { $match: { category: new mongoose.Types.ObjectId(categoryId) } },
      { $addFields: { count: 0 } },
      { $sort: { createdAt: -1 } },
    ]);
    // }

    if (!gifts || gifts.length === 0) {
      return res.status(200).json({ status: false, message: "No data found!" });
    }

    return res.status(200).json({ status: true, message: "Success!!", gifts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//store multiple gift
exports.store = async (req, res) => {
  console.log("gif thumbnail uploader", req.files);

  try {
    // 🔹 Validate incoming data
    if (
      !req.body.coin ||
      !req.body.category ||
      !req.files ||
      req.files.length === 0
    ) {
      if (req.files) deleteFiles(req.files);
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    }

    // 🔹 Check if category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      if (req.files) deleteFiles(req.files);
      return res
        .status(200)
        .json({ status: false, message: "Category does not Exist!" });
    }

    // 🔹 Helper to normalize file names (to detect background files)
    const normalize = (str) =>
      str
        .replace(/[-_]/g, " ")
        .replace(/\.[^/.]+$/, "")
        .toLowerCase();

    // 🔹 Prepare gift data array

    const giftData = {
      thumbnail: "",
      backgroundImage: "",
      coin: req.body.coin,
      category: category._id,
      type: 1,
    };
    const files = req.files;
    if (files.thumbnail) {
      giftData.thumbnail = files.thumbnail[0].path;
    }
    if (files.backgroundImage) {
      giftData.backgroundImage = files.backgroundImage[0].path;
    }

    // 🔹 Insert all gifts at once
    const gifts = await Gift.insertMany([giftData]);

    // 🔹 Populate category for response
    const data = await Promise.all(
      gifts.map(async (gift) => {
        const result = await Gift.findById(gift._id).populate(
          "category",
          "name",
        );
        return result;
      }),
    );

    return res
      .status(200)
      .json({ status: true, message: "Success!", gift: data });
  } catch (error) {
    console.log(error);
    if (req.files) deleteFiles(req.files);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.svgaAdd = async (req, res) => {
  try {
    console.log("giftData,thumbnail", req.files);

    if (!req.body?.coin || !req.body?.category || !req.files) {
      if (req.files.thumbnail) {
        req.files.map((file) => {
          if (fs.existsSync(file?.path)) {
            fs.unlinkSync(file?.path);
          }
        });
      }
      if (req.files.image) {
        req.files.map((file) => {
          if (fs.existsSync(file?.path)) {
            fs.unlinkSync(file?.path);
          }
        });
      }
      if (req.files.backgroundImage) {
        req.files.map((file) => {
          if (fs.existsSync(file?.path)) {
            fs.unlinkSync(file?.path);
          }
        });
      }

      return res
        .status(200)
        .json({ status: false, message: "Invalid Details !!" });
    }

    const category = await Category.findById(req.body?.category);
    if (!category) {
      if (req.files.thumbnail) {
        req.files.map((file) => {
          if (fs.existsSync(file?.path)) {
            fs.unlinkSync(file?.path);
          }
        });
      }
      if (req.files.image) {
        req.files.map((file) => {
          if (fs.existsSync(file?.path)) {
            fs.unlinkSync(file?.path);
          }
        });
      }

      return res
        .status(200)
        .json({ status: false, message: "Category does not Exist!" });
    }
    const dataObj = {
      thumbnail: "",
      image: "",
      coin: req.body?.coin,
      category: category?._id,
      backgroundImage: "",
      type: 2,
    };

    // // Helper to normalize and match words in filename
    const normalize = (str) =>
      str
        .replace(/[-_]/g, " ")
        .replace(/\.[^/.]+$/, "")
        .toLowerCase();
    const files = req.files;
    if (files.thumbnail) {
      dataObj.thumbnail = files.thumbnail[0].path;
    }
    if (files.backgroundImage) {
      dataObj.backgroundImage = files.backgroundImage[0].path;
    }
    if (files.image) {
      dataObj.image = files.image[0].path;
    }

    const gift = await new Gift(dataObj).save();

    return res
      .status(200)
      .json({ status: true, message: "success", data: gift });
  } catch (error) {
    console.log(error);
    if (req.files?.thumbnail && fs.existsSync(req.files?.thumbnail[0]?.path)) {
      fs.unlinkSync(req.files?.thumbnail[0]?.path);
    }
    if (req.files?.image && fs.existsSync(req.files?.image[0]?.path)) {
      fs.unlinkSync(req.files?.image[0]?.path);
    }
    if (
      req.files?.backgroundImage &&
      fs.existsSync(req.files?.backgroundImage[0]?.path)
    ) {
      fs.unlinkSync(req.files?.image[0]?.path);
    }
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.update = async (req, res) => {
  try {
    // 🔹 Validate Gift existence
    const gift = await Gift.findById(req.params.giftId);
    if (!gift) {
      if (req.files?.thumbnail) {
        req.files.thumbnail.forEach((file) => {
          if (fs.existsSync(file?.path)) fs.unlinkSync(file?.path);
        });
      }
      if (req.files?.image) {
        req.files.image.forEach((file) => {
          if (fs.existsSync(file?.path)) fs.unlinkSync(file?.path);
        });
      }
      if (req.files?.backgroundImage) {
        req.files.backgroundImage.forEach((file) => {
          if (fs.existsSync(file?.path)) fs.unlinkSync(file?.path);
        });
      }

      return res
        .status(200)
        .json({ status: false, message: "Gift does not Exist!" });
    }

    // 🔹 Validate fields
    if (!req.body?.coin || !req.body?.category) {
      if (req.files?.thumbnail) {
        req.files.thumbnail.forEach((file) => {
          if (fs.existsSync(file?.path)) fs.unlinkSync(file?.path);
        });
      }
      if (req.files?.image) {
        req.files.image.forEach((file) => {
          if (fs.existsSync(file?.path)) fs.unlinkSync(file?.path);
        });
      }
      if (req.files?.backgroundImage) {
        req.files.backgroundImage.forEach((file) => {
          if (fs.existsSync(file?.path)) fs.unlinkSync(file?.path);
        });
      }

      return res
        .status(200)
        .json({ status: false, message: "Invalid Details !!" });
    }

    // 🔹 Check category validity
    const category = await Category.findById(req.body?.category);
    if (!category) {
      if (req.files?.thumbnail) {
        req.files.thumbnail.forEach((file) => {
          if (fs.existsSync(file?.path)) fs.unlinkSync(file?.path);
        });
      }
      if (req.files?.image) {
        req.files.image.forEach((file) => {
          if (fs.existsSync(file?.path)) fs.unlinkSync(file?.path);
        });
      }
      if (req.files?.backgroundImage) {
        req.files.backgroundImage.forEach((file) => {
          if (fs.existsSync(file?.path)) fs.unlinkSync(file?.path);
        });
      }

      return res
        .status(200)
        .json({ status: false, message: "Category does not Exist!" });
    }

    // const mainFile = req.files.thumbnail[0];
    // gift.type =
    //   mainFile && mainFile.mimetype === "thumbnail/gif"
    //     ? 1
    //     : mainFile && mainFile.mimetype === "application/octet-stream"
    //       ? 2
    //       :  0;
    // 🔹 Handle optional image
    if (req.files?.image && Array.isArray(req.files.image)) {
      if (gift.image && fs.existsSync(gift.image)) {
        fs.unlinkSync(gift.image);
      }
      gift.image = req.files.image[0].path;
    }
    if (
      req.files?.backgroundImage &&
      Array.isArray(req.files.backgroundImage)
    ) {
      if (gift.backgroundImage && fs.existsSync(gift.backgroundImage)) {
        fs.unlinkSync(gift.backgroundImage);
      }
      gift.backgroundImage = req.files.backgroundImage[0].path;
    }
    if (req.files?.thumbnail && Array.isArray(req.files.thumbnail)) {
      if (gift.thumbnail && fs.existsSync(gift.thumbnail)) {
        fs.unlinkSync(gift.thumbnail);
      }
      gift.thumbnail = req.files.thumbnail[0].path;
    }

    // 🔹 Update other fields
    gift.coin = req.body?.coin;
    gift.category = category._id;

    await gift.save();

    const data = await Gift.findById(gift._id);

    return res.status(200).json({
      status: true,
      message: "Gift Updated Successfully!",
      gift: data,
    });
  } catch (error) {
    console.log(error);

    if (req.files?.thumbnail) {
      req.files.thumbnail.forEach((file) => {
        if (fs.existsSync(file?.path)) fs.unlinkSync(file?.path);
      });
    }

    if (req.files?.image) {
      req.files.image.forEach((file) => {
        if (fs.existsSync(file?.path)) fs.unlinkSync(file?.path);
      });
    }
    if (req.files?.backgroundImage) {
      req.files.backgroundImage.forEach((file) => {
        if (fs.existsSync(file?.path)) fs.unlinkSync(file?.path);
      });
    }

    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// delete gift
exports.destroy = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.giftId);
    if (!gift)
      return res
        .status(200)
        .json({ status: false, message: "Gift does not Exist!" });

    if (fs.existsSync(gift.thumbnail)) {
      fs.unlinkSync(gift.thumbnail);
    }
    if (fs.existsSync(gift.backgroundImage)) {
      fs.unlinkSync(gift.backgroundImage);
    }
    if (fs.existsSync(gift.image)) {
      fs.unlinkSync(gift.image);
    }

    await gift.deleteOne();

    return res.status(200).json({ status: true, message: "Success!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.createOrUpdateLuckyGift = async (req, res) => {
  try {
    const { percentage } = req.body;

    if (!percentage || percentage < 10 || percentage > 90) {
      return res.status(400).json({
        status: false,
        message: "Percentage must be between 10 and 90",
      });
    }

    // Check if already exists
    let luckyGift = await LuckyGift.findOne();

    if (luckyGift) {
      // Update existing
      luckyGift.percentage = percentage;
      await luckyGift.save();

      return res.status(200).json({
        status: true,
        message: "Lucky Gift updated successfully",
        luckyGift,
      });
    }

    // Create new entry
    luckyGift = new LuckyGift({ percentage });
    await luckyGift.save();

    return res.status(200).json({
      status: true,
      message: "Lucky Gift created successfully",
      luckyGift,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};
exports.getLuckyGift = async (req, res) => {
  try {
    const luckyGift = await LuckyGift.findOne();

    if (!luckyGift) {
      return res.status(200).json({
        status: false,
        message: "Lucky Gift not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Success",
      luckyGift,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};
