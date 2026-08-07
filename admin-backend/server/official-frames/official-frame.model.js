const mongoose = require("mongoose");

const officialFrameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // rankType: {
    //   type: String,
    //   enum: ["room", "gift", "charm"],
    //   required: true,
    // },
    // rankNumber: {
    //   type: String,
    //   enum: ["1st", "2nd", "3rd"],
    //   required: true,
    // },
    frame: {
      type: String, // file path or URL to the SVGA file
      required: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("OfficialFrame", officialFrameSchema);
