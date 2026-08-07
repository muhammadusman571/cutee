const mongoose = require("mongoose");

const uploadTagSchema = new mongoose.Schema(
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
    text: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ["image", "svga", "text"],
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

module.exports = mongoose.model("UploadTag", uploadTagSchema);
