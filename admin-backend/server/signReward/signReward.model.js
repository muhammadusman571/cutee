const mongoose = require("mongoose");

const signRewardSchema = new mongoose.Schema(
  {
    image: String,
    thumbnail: { type: String, default: "" },
    diamond: { type: Number, default: 0 },
    name: { type: String, required: true },
    rewardDay: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7], required: true },
    isDelete: { type: Boolean, default: false },
    validity: { type: Number, default: 0 },
    validityType: {
      type: String,
      enum: ["day", "month", "year"],
      default: "day",
    },
    validationTag: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("SignReward", signRewardSchema);
