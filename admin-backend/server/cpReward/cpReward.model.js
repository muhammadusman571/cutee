const mongoose = require("mongoose");

const CPRewardSchema = new mongoose.Schema(
  {
    // multiple svga/images
    images: {
      type: [String],
      default: [],
    },

    thumbnail: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      required: true,
    },

    position: {
      type: Number,
      default: 0,
    },

    rules: {
      type: [String],
      default: [],
    },

    isDelete: {
      type: Boolean,
      default: false,
    },

    // ---------- START TIME ----------
    startValidityType: {
      type: String,
      enum: ["days", "hours", "minutes"],
      default: "days",
    },

    startDays: {
      type: Number,
      default: 0,
    },

    startHours: {
      type: Number,
      default: 0,
    },

    startMinutes: {
      type: Number,
      default: 0,
    },

    startSeconds: {
      type: Number,
      default: 0,
    },

    // ---------- END TIME ----------
    endValidityType: {
      type: String,
      enum: ["days", "hours", "minutes"],
      default: "days",
    },

    endDays: {
      type: Number,
      default: 0,
    },

    endHours: {
      type: Number,
      default: 0,
    },

    endMinutes: {
      type: Number,
      default: 0,
    },

    endSeconds: {
      type: Number,
      default: 0,
    },
    validity: { type: Number, default: 0 },
    validityType: {
      type: String,
      enum: ["day", "month", "year"],
      default: "day",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("CPReward", CPRewardSchema);
