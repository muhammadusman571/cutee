const mongoose = require("mongoose");

const GameWinnerAnnouncementSchema = new mongoose.Schema(
  {
    gameType: { type: String },
    winnerUserArray: { type: Array, default: [] },
    winnerNumber: {},
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model(
  "GameWinnerAnnouncement",
  GameWinnerAnnouncementSchema,
);
