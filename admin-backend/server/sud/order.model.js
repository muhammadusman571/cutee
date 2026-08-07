const mongoose = require("mongoose");

const orderLogSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true, unique: true, index: true },

    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    mg_id: { type: String, required: true },
    round_id: { type: String, required: true },

    score: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: Number,
      required: true,
      enum: [1, 2],
    },

    before_balance: { type: Number },
    after_balance: { type: Number },
  },
  { timestamps: true },
);

orderLogSchema.index({ uid: 1, createdAt: -1 });

module.exports = mongoose.model("OrderLog", orderLogSchema);
