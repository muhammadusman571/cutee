const mongoose = require("mongoose");

const salarySheetSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    target: { type: Number, default: 0 },
    diamond_share: { type: Number, default: 0 },
    basic_salary: { type: Number, default: 0 },
    total_salary: { type: Number, default: 0 },
    agency_share: { type: Number, default: 0 },

    rcoin: { type: Number, default: 0 }, // user's achieved coins
    rank: { type: Number, default: 0 }, // which target achieved
    day_time: { type: String, default: 0 }, // calculated days (your logic)
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports =
  mongoose.models.SalarySheet ||
  mongoose.model("SalarySheet", salarySheetSchema);
