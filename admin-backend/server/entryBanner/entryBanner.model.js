const mongoose = require("mongoose");

const entryBannerSchema = new mongoose.Schema(
  {
    image: String,
    thumbnail: { type: String, default: "" },
    diamond: Number,
    name: String,
    isDelete: { type: Boolean, default: false },
    validity: Number,
    validityType: String,
    validationTag: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("EntryBanner", entryBannerSchema);
