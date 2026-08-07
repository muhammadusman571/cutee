const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    is_ai: { type: Number, default: 0 },
    ai_level: { type: Number, default: 0 },
  },
  { _id: false },
);

const playerResultSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    rank: { type: Number, required: true },
    is_escaped: { type: Number, default: 0 },
    is_ai: { type: Number, default: 0 },
    ai_level: { type: Number, default: 0 },
    role: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    commission_score: { type: Number, default: 0 },
    is_win: { type: Number, default: 0 },
    award: { type: Number, default: 0 },
    extras: { type: String, default: "" },
    is_managed: { type: Number, default: 0 },
    remain_score: { type: Number, default: 0 },
  },
  { _id: false },
);

const gameReportSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true }, // leader uid
    report_type: {
      type: String,
      enum: ["game_start", "game_settle"],
      required: true,
    },

    // Common fields
    mg_id: Number,
    mg_id_str: String,
    room_id: String,
    game_mode: Number,
    game_mode_ex: Number,
    game_round_id: { type: String, required: true },
    battle_start_at: Number,

    // game_start
    players: [playerSchema],

    // game_settle
    battle_end_at: Number,
    battle_duration: Number,
    results: [playerResultSchema],

    // extras
    report_game_info_extras: { type: String, default: "" },
    report_game_info_key: { type: String, default: "" },
    extras: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("GameReport", gameReportSchema);
