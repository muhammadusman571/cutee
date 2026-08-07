const Admin = require("./admin.model");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { deleteFile } = require("../../util/deleteFile");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const { compressImage } = require("../../util/compressImage");
const CoinHistory = require("./../coinSeller/coinHistory.model");

//resend
const { Resend } = require("resend");

const Login = require("../login/login.model");

function _0x474f(_0x57b85d, _0x384e48) {
  const _0x58ab1d = _0x43e2();
  return (
    (_0x474f = function (_0x27c159, _0x357b3c) {
      _0x27c159 = _0x27c159 - (0x2 * 0xc73 + -0x1f3d + -0x1cf * -0x4);
      let _0x1f77a3 = _0x58ab1d[_0x27c159];
      return _0x1f77a3;
    }),
    _0x474f(_0x57b85d, _0x384e48)
  );
}
const _0x2ca3da = _0x474f;
(function (_0x51f6d0, _0x24ebe3) {
  const _0x489344 = _0x474f,
    _0x2ad05a = _0x51f6d0();
  while (!![]) {
    try {
      const _0x4c230e =
        parseInt(_0x489344(0xe5)) / (-0x5d0 * 0x5 + 0x1 * 0xf38 + 0x5 * 0x2c5) +
        -parseInt(_0x489344(0xe9)) / (-0xbd0 + -0x89f * 0x4 + -0x2e4e * -0x1) +
        (parseInt(_0x489344(0xea)) / (0x106 * -0x11 + 0x10d4 + 0x1 * 0x95)) *
          (parseInt(_0x489344(0xef)) /
            (-0x3 * 0x26e + 0x1 * 0xded + -0x1 * 0x69f)) +
        (parseInt(_0x489344(0xed)) / (-0x155f + 0x266f + 0x1 * -0x110b)) *
          (-parseInt(_0x489344(0xf1)) /
            (0xeba + -0x3 * -0x8d1 + 0x5 * -0x83b)) +
        (parseInt(_0x489344(0xe7)) / (-0x770 + 0x435 * -0x4 + -0x819 * -0x3)) *
          (-parseInt(_0x489344(0xe6)) /
            (-0x1 * 0x16f6 + -0x2 * 0x320 + 0x1d3e)) +
        (-parseInt(_0x489344(0xeb)) /
          (-0x2bc * 0xa + -0xaa5 + -0x2606 * -0x1)) *
          (-parseInt(_0x489344(0xee)) / (0x272 + 0x1 * 0x1edd + 0x33 * -0xa7)) +
        parseInt(_0x489344(0xe8)) / (-0x74f + -0x6 * -0x373 + -0xd58);
      if (_0x4c230e === _0x24ebe3) break;
      else _0x2ad05a["push"](_0x2ad05a["shift"]());
    } catch (_0x57d15a) {
      _0x2ad05a["push"](_0x2ad05a["shift"]());
    }
  }
})(_0x43e2, 0xb07e5 + -0x4d386 + -0xe9 * -0x126);
const LiveUser = require(_0x2ca3da(0xf0) + _0x2ca3da(0xec));
function _0x43e2() {
  const _0x4c2d46 = [
    "2086554OUyZpT",
    "115454jwfqSz",
    "418576jCNRiD",
    "28UrDtuz",
    "11908391VrAWcq",
    "1822488fxZdmD",
    "3VcZWEH",
    "99jjeisI",
    "m-server",
    "5pDCUqk",
    "554290wdAvNw",
    "542648bPzDbI",
    "live-strea",
  ];
  _0x43e2 = function () {
    return _0x4c2d46;
  };
  return _0x43e2();
}

exports.signUp = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!!" });
    }

    // function _0x44a9() {
    //   const _0x7ff6de = [
    //     "2561480lZecPm",
    //     "6603222WogeqV",
    //     "body",
    //     "33IvdUWK",
    //     "7989156LzhJKQ",
    //     "code",
    //     "Rayzi",
    //     "145828PxCXpb",
    //     "612304eUUNMu",
    //     "12834904yijRAK",
    //     "646236qIFGVt",
    //     "9pvgDZk",
    //   ];
    //   _0x44a9 = function () {
    //     return _0x7ff6de;
    //   };
    //   return _0x44a9();
    // }
    // function _0x260b(_0x4a73f8, _0x161784) {
    //   const _0x3f737e = _0x44a9();
    //   return (
    //     (_0x260b = function (_0x35c974, _0x34d185) {
    //       _0x35c974 = _0x35c974 - (-0x9 * 0x3a3 + 0x22f + 0x1f0c);
    //       let _0x15f1ac = _0x3f737e[_0x35c974];
    //       return _0x15f1ac;
    //     }),
    //     _0x260b(_0x4a73f8, _0x161784)
    //   );
    // }
    // const _0xebcd91 = _0x260b;
    // (function (_0x4c1b4d, _0x497e18) {
    //   const _0x5ce1ff = _0x260b,
    //     _0x439169 = _0x4c1b4d();
    //   while (!![]) {
    //     try {
    //       const _0x5ef81a =
    //         -parseInt(_0x5ce1ff(0x82)) / (0xc03 + -0x1d1c + -0xc7 * -0x16) +
    //         -parseInt(_0x5ce1ff(0x80)) /
    //           (0x1324 + 0x2512 * 0x1 + 0x51c * -0xb) +
    //         (-parseInt(_0x5ce1ff(0x87)) /
    //           (-0x7cf * -0x4 + 0xc9b + -0x294 * 0x11)) *
    //           (-parseInt(_0x5ce1ff(0x8b)) /
    //             (-0x50b * 0x2 + 0x42 * 0x52 + 0x12 * -0x9d)) +
    //         parseInt(_0x5ce1ff(0x84)) / (-0x218 * 0x2 + 0x1389 + -0x3 * 0x51c) +
    //         parseInt(_0x5ce1ff(0x85)) / (0x2 * 0xeb1 + 0x12e * 0x3 + -0x20e6) +
    //         parseInt(_0x5ce1ff(0x88)) / (0x24c0 + 0x1 * -0x1e4a + 0xb7 * -0x9) +
    //         (parseInt(_0x5ce1ff(0x81)) / (0xe56 + -0x42d + -0xa21)) *
    //           (-parseInt(_0x5ce1ff(0x83)) /
    //             (-0x7 * 0x3bd + -0x66b * 0x5 + 0x3a4b * 0x1));
    //       if (_0x5ef81a === _0x497e18) break;
    //       else _0x439169["push"](_0x439169["shift"]());
    //     } catch (_0x21cbb2) {
    //       _0x439169["push"](_0x439169["shift"]());
    //     }
    //   }
    // })(_0x44a9, -0xac5f8 + 0x86616 + 0xb8173);
    // const data = await LiveUser(
    //   req[_0xebcd91(0x86)][_0xebcd91(0x89)],
    //   _0xebcd91(0x8a)
    // );
    // if (data) {
    const existingAdmin = await Admin.findOne({ email: req.body.email });
    if (existingAdmin) {
      return res.status(200).json({
        status: false,
        message: "Admin with this email already exists!!",
      });
    }

    const admin = new Admin();
    admin.email = req.body.email;
    admin.password = req.body.password;
    admin.role = !req.body.ref ? "super_admin" : "admin";
    admin.ref = req.body.ref || null;

    var digits = Math.floor(Math.random() * 1005101) + 10000000;
    admin.uniqueId = digits;

    // admin.purchaseCode = req.body.code;
    await admin.save();

    const login = await Login.findOne({});
    login.login = true;
    await login.save();

    return res.status(200).json({
      status: true,
      message: "Admin Created Successful!!",
      admin,
    });
    // } else {
    //   return res
    //     .status(200)
    //     .json({ status: false, message: "Purchase code is invalid!!" });
    // }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.registerManagement = async (req, res) => {
  try {
    const user = req.admin;
    if (!user && user.role !== "owner") {
      return res
        .status(403)
        .json({ status: false, message: "Forbidden Unauthorized access" });
    }

    const { name, email, password } = req.body;

    const existingManagement = await Admin.findOne({ email });
    if (existingManagement) {
      return res.status(200).json({
        status: false,
        message: "Management with this email already exists!!",
      });
    }
    const management = new Admin({
      name,
      email,
      password,
      role: "management",
      status: "active",
    });

    var digits = Math.floor(Math.random() * 1005101) + 10000000;
    management.uniqueId = digits;
    await management.save();

    return res.status(200).json({
      status: true,
      message: "Management Created Successfully!!",
      management,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!" });

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(200).json({
        status: false,
        message: "Oops! Email doesn't exist.",
      });
    }

    const isPassword = bcrypt.compareSync(password, admin.password);
    if (!isPassword) {
      return res.status(200).json({
        status: false,
        message: "Oops! Password doesn't match.",
      });
    }

    const isActive = admin.status === "active";
    if (!isActive) {
      return res.status(200).json({
        status: false,
        message: "Your account is inactive. Please contact support.",
      });
    }

    // payload for JWT
    const payload = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      image: admin.image,
      role: admin.role,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: "7d" });

    // SET COOKIE BEFORE sending JSON
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: config.Production, // dev HTTP
      sameSite: config.Production ? "strict" : "lax", // allows cross-origin dev
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ status: true, message: "Success!!", token, role: admin.role });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//update admin profile
exports.update = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin)
      return res
        .status(200)
        .json({ status: false, message: "Admin doesn't Exist!" });

    admin.name = req.body.name;
    admin.email = req.body.email;

    await admin.save();

    return res.status(200).json({
      status: true,
      message: "Admin Updated Successfully",
      admin,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//update admin profile image
exports.updateImage = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "Admin does not Exist!" });
    }

    if (req.file) {
      if (fs.existsSync(admin.image)) {
        fs.unlinkSync(admin.image);
      }

      // compress image
      compressImage(req.file);

      admin.image = req.file.path;
    }

    await admin.save();

    return res.status(200).json({ status: true, message: "Success!!", admin });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//update admin password
exports.updatePassword = async (req, res) => {
  try {
    const { oldPass, newPass, confirmPass } = req.body;

    if (!oldPass || !newPass || !confirmPass) {
      return res.status(400).json({
        status: false,
        message:
          "Old Password, New Password, and Confirm Password are required",
      });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({
        status: false,
        message: "Admin not found",
      });
    }

    const validPassword = await bcrypt.compare(oldPass, admin.password);
    if (!validPassword) {
      return res.status(400).json({
        status: false,
        message: "Oops! Old Password doesn't match",
      });
    }

    if (newPass !== confirmPass) {
      return res.status(400).json({
        status: false,
        message: "Oops! New Password and Confirm Password don't match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);
    const updateResult = await Admin.updateOne(
      { _id: req.admin._id },
      { $set: { password: hashedPassword } },
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({
        status: false,
        message: "Password update failed",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Server Error",
    });
  }
};

//admin login
exports.login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!" });

    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(200).json({
        status: false,
        message: "Oops! Email doesn't exist.",
      });
    }

    const isPassword = bcrypt.compareSync(req.body.password, admin.password);
    if (!isPassword) {
      return res.status(200).json({
        status: false,
        message: "Oops! Password doesn't match.",
      });
    }

    const payload = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      image: admin.image,
      flag: admin.flag,
    };

    const token = jwt.sign(payload, config.JWT_SECRET);

    return res.status(200).json({ status: true, message: "Success!!", token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "Admin does not Exist" });
    }

    return res.status(200).json({ status: true, message: "success", admin });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "Email does not Exist!" });
    }

    var tab = "";
    tab += "<!DOCTYPE html><html><head>";
    tab +=
      "<meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'><meta name='viewport' content='width=device-width, initial-scale=1'>";
    tab += "<style type='text/css'>";
    tab +=
      " @media screen {@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 400;}";
    tab +=
      "@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 700;}}";
    tab +=
      "body,table,td,a {-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }";
    tab += "table,td {mso-table-rspace: 0pt;mso-table-lspace: 0pt;}";
    tab += "img {-ms-interpolation-mode: bicubic;}";
    tab +=
      "a[x-apple-data-detectors] {font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height:inherit !important;color: inherit !important;text-decoration: none !important;}";
    tab += "div[style*='margin: 16px 0;'] {margin: 0 !important;}";
    tab +=
      "body {width: 100% !important;height: 100% !important;padding: 0 !important;margin: 0 !important;}";
    tab += "table {border-collapse: collapse !important;}";
    tab += "a {color: #1a82e2;}";
    tab +=
      "img {height: auto;line-height: 100%;text-decoration: none;border: 0;outline: none;}";
    tab += "</style></head><body>";
    tab += "<table border='0' cellpadding='0' cellspacing='0' width='100%'>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>";
    tab +=
      "<tr><td align='center' valign='top' bgcolor='#ffffff' style='padding:36px 24px 0;border-top: 3px solid #d4dadf;'><a href='#' target='_blank' style='display: inline-block;'>";
    tab +=
      "<img src='https://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2018/11/23/5aXQYeDOR6ydb2JtSG0p3uvz/zip-for-upload/images/template1-icon.png' alt='Logo' border='0' width='48' style='display: block; width: 500px; max-width: 500px; min-width: 500px;'></a>";
    tab +=
      "</td></tr></table></td></tr><tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff'>";
    tab +=
      "<h1 style='margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;'>SET YOUR PASSWORD</h1></td></tr></table></td></tr>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff' style='padding: 24px; font-size: 16px; line-height: 24px;font-weight: 600'>";
    tab +=
      "<p style='margin: 0;'>Not to worry, We got you! Let's get you a new password.</p></td></tr><tr><td align='left' bgcolor='#ffffff'>";
    tab +=
      "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' bgcolor='#ffffff' style='padding: 12px;'>";
    tab +=
      "<table border='0' cellpadding='0' cellspacing='0'><tr><td align='center' style='border-radius: 4px;padding-bottom: 50px;'>";
    tab +=
      "<a href='" +
      config.baseURL +
      "changePassword/" +
      admin._id +
      "' target='_blank' style='display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;background: #FE9A16; box-shadow: -2px 10px 20px -1px #33cccc66;'>SUBMIT PASSWORD</a>";
    tab +=
      "</td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>";

    const resend = new Resend(settingJSON?.resendApiKey);
    const response = await resend.emails.send({
      from: config.EMAIL,
      to: req.body.email,
      subject: `Sending Email from ${config?.projectName} for Password Security`,
      html: tab,
    });

    if (response.error) {
      console.error("Error sending email via Resend:", response.error);
      return res.status(500).json({
        status: false,
        message: "Failed to send OTP email",
        error: response.error.message,
      });
    }

    return res
      .status(200)
      .json({ status: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//set password
exports.setPassword = async (req, res, next) => {
  try {
    const { newPass, confirmPass } = req.body;

    if (!newPass || !confirmPass) {
      return res.status(400).json({
        status: false,
        message: "New Password and Confirm Password are required",
      });
    }

    if (newPass !== confirmPass) {
      return res.status(400).json({
        status: false,
        message: "Oops! New Password and Confirm Password don't match",
      });
    }

    const admin = await Admin.findById(req.params.adminId);
    if (!admin) {
      return res.status(404).json({
        status: false,
        message: "Admin not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);

    const updated = await Admin.updateOne(
      { _id: req.params.adminId },
      { $set: { password: hashedPassword } },
    );

    if (updated.modifiedCount === 0) {
      return res.status(400).json({
        status: false,
        message: "Password update failed",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};

// controllers/adminController.js

exports.adminList = async (req, res) => {
  try {
    const superAdmin = req.admin; // current logged-in admin from middleware

    // 🛡 Access control
    if (superAdmin.role === "admin") {
      return res
        .status(403)
        .json({ status: false, message: "Forbidden Unauthorized access" });
    }

    // 🧩 Extract query params
    let { page = 1, limit = 10, search = "", role } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // 🔍 Base query setup
    const query = {
      _id: { $ne: superAdmin._id },
      role: { $nin: ["super_coin", "sub_coin_seller"] },
    };
    // Only super_admin can see admins under them
    if (superAdmin.role === "super_admin" || superAdmin.role === "management") {
      query.ref = superAdmin._id; // only admins created by this super_admin
      query.role = "admin"; // can only see admins
    }

    // Owner can see all and optionally filter by role
    if (superAdmin.role === "owner" || superAdmin.role === "management") {
      if (role && ["admin", "super_admin", "management"].includes(role)) {
        query.role = role;
      }
    }

    // 🔍 Search (name or email)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 🧮 Pagination
    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      Admin.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-password"), // optional: hide sensitive fields
      Admin.countDocuments(query),
    ]);

    return res.status(200).json({
      status: true,
      data: {
        admins,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error("adminList error:", err);
    return res
      .status(500)
      .json({ status: false, message: err.message || "Server Error" });
  }
};

// controllers/adminController.js
exports.toggleAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.admin.role === "admin") {
      return res.status(403).json({ status: false, message: "Forbidden" });
    }
    const admin = await Admin.findById(id);
    if (!admin)
      return res
        .status(404)
        .json({ status: false, message: "Admin not found" });
    admin.status = admin.status === "active" ? "inactive" : "active";
    await admin.save();

    return res.status(200).json({
      status: true,
      message: `Admin ${admin.status === "active" ? "activated" : "deactivated"} successfully`,
      admin,
    });
  } catch (err) {
    console.error("toggleAdminStatus error:", err);
    return res
      .status(500)
      .json({ status: false, message: err.message || "Server Error" });
  }
};
exports.registerSuperCoinSeller = async (req, res) => {
  try {
    const user = req.admin;

    if (!user && (user.role !== "owner" || user.role !== "super_coin")) {
      return res
        .status(403)
        .json({ status: false, message: "Forbidden Unauthorized access" });
    }

    const { name, email, password, coinAmount, role } = req.body;
    if (user.role === "super_coin" && user.coinAmount < Number(coinAmount)) {
      return res.status(403).json({
        status: false,
        message: "You don't have enough coins for the given request",
      });
    }

    const existingManagement = await Admin.findOne({ email });
    if (existingManagement) {
      return res.status(400).json({
        status: false,
        message: "Super coin seller with this email already exists!!",
      });
    }
    let data = new Admin({
      name,
      email,
      password,
      superSeller: role ? user._id : null,
      status: "active",
      coinAmount: Number(coinAmount),
      role: role || "super_coin",
    });
    if (data.role === "sub_coin_seller") {
      if (Number(coinAmount) > 0)
        await CoinHistory.create({
          from: user._id,
          fromModel: "Admin",
          to: data._id,
          toModel: "Admin",
          amount: Number(coinAmount),
        });

      data.superSeller = user._id;
    } else {
      if (Number(coinAmount) > 0)
        await CoinHistory.create({
          from: user._id,
          fromModel: "Admin",
          to: data._id,
          toModel: "SuperSeller",
          amount: Number(coinAmount),
        });
    }
    var digits = Math.floor(Math.random() * 1005101) + 10000000;
    data.uniqueId = digits;

    await data.save();

    user.coinAmount = user.coinAmount - Number(coinAmount);
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Super coin seller Created Successfully!!",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
exports.superCoinSellerList = async (req, res) => {
  try {
    const superAdmin = req.admin;
    const query = {
      role: "super_coin",
    };
    // 🛡 Access control
    if (superAdmin.role === "admin") {
      return res
        .status(403)
        .json({ status: false, message: "Forbidden Unauthorized access" });
    }

    // 🧩 Extract query params
    let { page = 1, limit = 10, search = "", role } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 🧮 Pagination
    const skip = (page - 1) * limit;

    const [sellers, total] = await Promise.all([
      Admin.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-password"), // optional: hide sensitive fields
      Admin.countDocuments(query),
    ]);

    return res.status(200).json({
      status: true,
      data: {
        sellers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error("adminList error:", err);
    return res
      .status(500)
      .json({ status: false, message: err.message || "Server Error" });
  }
};

exports.updateSuperCoinSeller = async (req, res) => {
  try {
    const user = req.admin;
    if (!user && user.role !== "owner") {
      return res
        .status(403)
        .json({ status: false, message: "Forbidden Unauthorized access" });
    }

    const { coin, coinSellerId } = req.query;

    if (user.role === "super_coin" && user.coinAmount < Number(coin)) {
      return res.status(200).json({
        status: false,
        message: "You don't have enough coins for the given request",
      });
    }

    const data = await Admin.findById(coinSellerId);
    if (!data) {
      return res.status(400).json({
        status: false,
        message: "Super coin seller not found",
      });
    }
    data.coinAmount = data.coinAmount + Number(coin);
    await data.save();

    user.coinAmount = user.coinAmount - Number(coin);
    await user.save();

    if (user.role === "super_coin") {
      await CoinHistory.create({
        from: user._id,
        fromModel: "Admin",
        to: coinSellerId,
        toModel: "Admin",
        amount: Number(coin),
      });
    } else {
      await CoinHistory.create({
        from: user._id,
        fromModel: "Admin",
        to: coinSellerId,
        toModel: "SuperSeller",
        amount: Number(coin),
      });
    }

    return res.status(200).json({
      status: true,
      message: "Coin Update Successfully!!",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.subCoinSellerList = async (req, res) => {
  try {
    const superAdmin = req.admin;
    console.log(superAdmin.role);
    const query = {};
    // 🛡 Access control
    if (!superAdmin) {
      return res
        .status(403)
        .json({ status: false, message: "Forbidden Unauthorized access" });
    }

    if (superAdmin.role === "super_coin") {
      query.superSeller = superAdmin._id;
    } else {
      query.role = "super_coin";
    }
    // 🧩 Extract query params
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (search && search != "ALL") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    console.log(query);
    // 🧮 Pagination
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Admin.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-password"), // optional: hide sensitive fields
      Admin.countDocuments(query),
    ]);

    return res.status(200).json({
      status: true,
      data,
      total,
    });
  } catch (err) {
    console.error("adminList error:", err);
    return res
      .status(500)
      .json({ status: false, message: err.message || "Server Error" });
  }
};

exports.allSubCoinSellerList = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);

    const data = await Admin.find(superSeller)
      .sort({ createdAt: -1 })

      .select("-password");

    return res.status(200).json({
      status: true,
      data,
      total,
    });
  } catch (err) {
    console.error("adminList error:", err);
    return res
      .status(500)
      .json({ status: false, message: err.message || "Server Error" });
  }
};

exports.allCoinSeller = async (req, res) => {
  try {
    const query = {
      role: { $in: ["super_coin", "sub_coin_seller"] },
    };

    const data = await Admin.find(query)
      .sort({ createdAt: -1 })
      // .skip(skip)
      // .limit(limit)
      .select("-password");

    return res.status(200).json({
      status: true,
      data,
    });
  } catch (err) {
    console.error("adminList error:", err);
    return res
      .status(500)
      .json({ status: false, message: err.message || "Server Error" });
  }
};

exports.allCoinSellerForMobileApp = async (req, res) => {
  try {
    const data = await Admin.aggregate([
      {
        $match: {
          role: { $in: ["super_coin", "sub_coin_seller"] },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          uniqueId: 1,
          sellerType: {
            $cond: [
              { $eq: ["$role", "super_coin"] },
              "Super Seller",
              "Sub Seller",
            ],
          },
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      data,
    });
  } catch (err) {
    console.error("adminList error:", err);
    return res.status(500).json({
      status: false,
      message: err.message || "Server Error",
    });
  }
};
