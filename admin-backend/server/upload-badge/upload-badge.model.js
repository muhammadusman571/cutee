const mongoose = require("mongoose");

const uploadBadgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    frame: {
      type: String,
      required: false,
    },

    type: {
      type: String,
      enum: ["image", "svga"],
      required: true,
      default: "image",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("UploadBadge", uploadBadgeSchema);
