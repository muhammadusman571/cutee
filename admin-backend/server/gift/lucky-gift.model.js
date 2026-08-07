const mongoose = require("mongoose");

const luckyGiftSchema = new mongoose.Schema(
  {
    percentage: { type: Number, required: true, min: 10, max: 90 },
    totalSent: { type: Number, default: 0 },
    totalReturned: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("LuckyGift", luckyGiftSchema);
