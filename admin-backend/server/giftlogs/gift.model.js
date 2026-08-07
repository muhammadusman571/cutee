const mongoose = require("mongoose");

const giftLogSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // value of diamonds received
    diamonds: {
      type: Number,
      required: true,
      default: 0,
    },

    // optional: room or live session ID
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },

    // optional: so you know where this came from
    source: {
      type: String,
      enum: ["room", "pk", "audio", "private"],
      default: "room",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// helpful indexes for leaderboard aggregation
giftLogSchema.index({ createdAt: -1 });
giftLogSchema.index({ senderId: 1 });
giftLogSchema.index({ receiverId: 1 });

module.exports = mongoose.model("GiftLog", giftLogSchema);
