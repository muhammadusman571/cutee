const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const adminSchema = new Schema(
  {
    name: { type: String, default: "Admin" },
    email: String,
    password: String,
    image: { type: String, default: null },
    purchaseCode: { type: String, default: null },
    coinAmount: { type: Number, default: 0 },
    role: {
      type: String,
      enum: [
        "super_admin",
        "admin",
        "owner",
        "management",
        "super_coin",
        "sub_coin_seller",
      ],
      default: "super_admin",
    },
    ref: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    superSeller: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    uniqueId: {
      type: Number,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

//hash password before the admin is saved
adminSchema.pre("save", function (next) {
  const admin = this;
  if (!admin.isModified("password")) return next();
  bcrypt.hash(admin.password, 10, (err, hash) => {
    if (err) return next(err);
    admin.password = hash;
    next();
  });
});

module.exports = mongoose.model("Admin", adminSchema);
