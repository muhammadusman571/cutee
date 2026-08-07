const User = require("./../user/user.model");
const OrderLog = require("./order.model");
const mongoose = require("mongoose");

exports.getSSToken = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        ret_code: 1,
        ret_msg: "Missing code parameter",
        sdk_error_code: 0,
        data: {},
      });
    }

    const uidResponse = await req.authService.getUidByCode(code);

    if (!uidResponse.isSuccess) {
      return res.status(400).json({
        ret_code: 1,
        ret_msg: uidResponse.errorMessage || "error",
        sdk_error_code: uidResponse.errorCode,
        data: {},
      });
    }

    const sstokenObj = await req.authService.getSSToken(uidResponse.uid);
    const user = await User.findById(uidResponse.uid);

    return res.json({
      ret_code: 0,
      ret_msg: "",
      sdk_error_code: 0,
      data: {
        ss_token: sstokenObj.token,
        expire_date: sstokenObj.expireDate,
        user_info: {
          uid: uidResponse.uid,
          nick_name: user?.name || "",
          avatar_url: user?.image,
          gender: user?.gender || "",
          is_ai: user.is_ai,
          ai_level: user.ai_level,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      ret_code: 1,
      ret_msg: error.message,
      sdk_error_code: 0,
      data: {},
    });
  }
};
exports.updateSSToken = async (req, res) => {
  const { ss_token } = req.body;

  if (!ss_token) {
    return res.status(400).json({
      ret_code: 1,
      ret_msg: "Missing ss_token parameter",
      sdk_error_code: 0,
      data: {},
    });
  }

  try {
    const uidResponse = await req.authService.getUidBySSToken(ss_token);
    if (!uidResponse.isSuccess) {
      return res.status(400).json({
        ret_code: 1,
        ret_msg: "",
        sdk_error_code: uidResponse.errorCode,
        data: {},
      });
    }

    const newSSTokenObj = await req.authService.getSSToken(uidResponse.uid);

    return res.json({
      ret_code: 0,
      ret_msg: "",
      sdk_error_code: 0,
      data: {
        ss_token: newSSTokenObj.token,
        expire_date: newSSTokenObj.expireDate,
      },
    });
  } catch (error) {
    return res.status(400).json({
      ret_code: 1,
      ret_msg: error.message,
      sdk_error_code: 0,
      data: {},
    });
  }
};
exports.getUserInfo = async (req, res) => {
  console.log("infor", req.body);
  const { ss_token } = req.body;

  if (!ss_token) {
    return res.json({
      ret_code: 1,
      ret_msg: "Missing ss_token parameter",
      sdk_error_code: 0,
      data: {
        uid: "",
        nick_name: "",
        avatar_url: "",
        gender: "",
      },
    });
  }

  try {
    const uidResponse = await req.authService.getUidBySSToken(ss_token);

    if (!uidResponse.isSuccess) {
      return res.json({
        ret_code: 1,
        ret_msg: "",
        sdk_error_code: uidResponse.errorCode,
        data: {
          uid: "",
          nick_name: "",
          avatar_url: "",
          gender: "",
        },
      });
    }

    s;
    return res.json({
      ret_code: 0,
      ret_msg: "",
      sdk_error_code: 0,
      data: {
        uid: uidResponse.uid,
        nick_name: uidResponse?.nick_name || "test",
        avatar_url: uidResponse?.avatar_url || "https://icon.png?128*128",
        gender: uidResponse?.gender || "female",
        is_ai: 0,
        ai_level: 0,
      },
    });
  } catch (error) {
    return res.json({
      ret_code: 1,
      ret_msg: error.message,
      sdk_error_code: 0,
      data: {
        uid: "",
        nick_name: "",
        avatar_url: "",
        gender: "",
      },
    });
  }
};

exports.getAccount = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.json({
        ret_code: 1,
        ret_msg: "uid is required",
        data: {},
      });
    }
    const user = await User.findById(uid);

    return res.json({
      ret_code: 0,
      ret_msg: "success",
      data: {
        nickname: user?.name || "",
        avatar_url: user?.image || "",
        score: user?.diamond || 0,
        vip_level: 0,
      },
    });
  } catch (error) {
    return res.json({
      ret_code: 1,
      ret_msg: error.message,
      data: {},
    });
  }
};

exports.getCode = async (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({
      ret_code: 1,
      ret_msg: "Missing uid parameter",
      sdk_error_code: 0,
      data: {},
    });
  }

  try {
    const codeData = await req.authService.getCode(uid);

    return res.json({
      ret_code: 0,
      ret_msg: "",
      sdk_error_code: 0,
      data: {
        code: codeData.code,
        expireDate: codeData.expireDate,
      },
    });
  } catch (error) {
    return res.status(400).json({
      ret_code: 1,
      ret_msg: error.message,
      sdk_error_code: 0,
      data: {},
    });
  }
};

exports.updateUserScore = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { order_id, mg_id, round_id, uid, score, type } = req.body;

    if (!order_id || !mg_id || !round_id || !uid || score == null || !type) {
      return res.json({
        ret_code: 1,
        ret_msg: "missing required parameters",
        data: {},
      });
    }

    const existing = await OrderLog.findOne({ order_id });
    if (existing) {
      return res.json({
        ret_code: 9001,
        ret_msg: "duplicate order id",
        data: {},
      });
    }

    const user = await User.findById(uid).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.json({
        ret_code: 1,
        ret_msg: "user not found",
        data: {},
      });
    }

    let beforeBalance = user.diamond || 0;
    let afterBalance = beforeBalance;

    if (type === 1) {
      if (beforeBalance < score) {
        await session.abortTransaction();
        return res.json({
          ret_code: 9000,
          ret_msg: "insufficient balance",
          data: {},
        });
      }
      afterBalance -= score;
    } else if (type === 2) {
      afterBalance += score;
      const message = `🎉 Congratulations! ${user?.name} has won ${score} Diamonds! 💎`;

      console.log(message);

      // sab connected users ko bhejo
      global.io.emit("winnerAnnouncement", {
        message,
      });
    } else {
      await session.abortTransaction();
      return res.json({
        ret_code: 1,
        ret_msg: "invalid type",
        data: {},
      });
    }

    user.diamond = afterBalance;
    await user.save({ session });

    await OrderLog.create(
      [
        {
          order_id,
          uid,
          mg_id,
          round_id,
          score,
          type,
          before_balance: beforeBalance,
          after_balance: afterBalance,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({
      ret_code: 0,
      ret_msg: "success",
      data: {
        score: afterBalance,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      return res.json({
        ret_code: 9001,
        ret_msg: "duplicate order id",
        data: {},
      });
    }

    return res.json({
      ret_code: 1,
      ret_msg: error.message,
      data: {},
    });
  }
};
