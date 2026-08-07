const mongoose = require("mongoose");

const salarySettingSchema = new mongoose.Schema(
  {
    target: { type: Number, default: 0, required: true },
    diamond_share: { type: Number, default: 0, required: true },
    basic_salary: { type: Number, default: 0, required: true },
    agency_share: { type: Number, default: 0, required: true },
    days: { type: Number, default: 0, required: false },
    // hours: { type: Number, default: 0, required: false },
    applyDays: {
      type: Boolean,
      default: false,
      required: false,
      default: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports =
  mongoose.models.SalarySetting ||
  mongoose.model("SalarySetting", salarySettingSchema);
