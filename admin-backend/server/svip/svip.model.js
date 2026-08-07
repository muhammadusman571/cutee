const mongoose = require("mongoose");

const svipSchema = new mongoose.Schema(
  {
    frame: String,
    // thumbnail: { type: String, default: "" },
    badge: String,
    borderFinal: String,
    msgBox: String,
    vipNamePlate: String,
    profileCard: String,
    roomBg: String,
    entryEffect: String,
    name: String,
    diamond: Number,
    validity: Number,
    validityType: String,
    validationTag: String,
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Svip", svipSchema);
