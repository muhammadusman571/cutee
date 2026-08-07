const mongoose = require("mongoose");
const seat = require("../../util/defaultSeat");

const rewardSchema = new mongoose.Schema(
  {
    timeType: {
      type: String,
      enum: ["hours", "days"],
      default: "hours",
    },
    days: { type: Number, default: 0 },
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    seconds: { type: Number, default: 0 },
    reward: { type: Number, default: 0 },
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Reward", rewardSchema);
