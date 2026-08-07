const mongoose = require("mongoose");

const coinHistorySchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "fromModel",
    },
    fromModel: {
      type: String,
      enum: ["Admin", "SuperSeller", "SubSeller", "User"],
      required: true,
    },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "toModel",
    },
    toModel: {
      type: String,
      enum: ["Admin", "SuperSeller", "SubSeller", "User"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    reason: {
      type: String,
      default: "transfer",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("CoinHistory", coinHistorySchema);
