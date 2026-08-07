const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    bankDetails: { type: String, default: "" },
    name: String,
    image: String,

    agencyCode: { type: Number, unique: true },

    uniqueId: { type: Number },   // FIXED: removed unique:true

    mobile: { type: String },

    withdrawableCoin: { type: Number, default: 0 },
    pendingWithdrawableRequestCoin: { type: Number, default: 0 },
    redeemEnable: { type: Boolean, default: true },

    rCoin: { type: Number, default: 0 },
    currentCoin: { type: Number, default: 0 },
    currentHostCoin: { type: Number, default: 0 },

    totalCoin: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    loginString: { type: String, default: "", unique: true },
    isDemo: { type: Boolean, default: false },
    ref: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index definitions
agencySchema.index({ isActive: 1 });
agencySchema.index({ uniqueId: 1 });  // MAKE UNIQUE HERE
agencySchema.index({ user: 1 });
agencySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Agency", agencySchema);
