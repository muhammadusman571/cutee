const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const superadminSchema = new Schema(
  {
    name: { type: String, default: "Admin" },
    email: String,
    password: String,
    image: { type: String, default: null },
    purchaseCode: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//hash password before the admin is saved
superadminSchema.pre("save", function (next) {
  const superadmin = this;
  if (!superadmin.isModified("password")) return next();
  bcrypt.hash(superadmin.password, 10, (err, hash) => {
    if (err) return next(err);
    superadmin.password = hash;
    next();
  });
});

module.exports = mongoose.model("SuperAdmin", superadminSchema);
