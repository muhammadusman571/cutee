const mongoose = require("mongoose");

const sudUserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    nick_name: { type: String, required: true },
    avatar_url: { type: String, default: "" },
    gender: { type: String, enum: ["female", "male", ""], default: "" },
    is_ai: { type: Number, default: 0 },
    ai_level: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    vip_level: { type: Number, default: 0 },
    ss_token: String,
    ss_token_expiry: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("SudUser", sudUserSchema);
