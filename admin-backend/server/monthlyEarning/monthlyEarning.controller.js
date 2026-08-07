const User = require("../user/user.model");
const SalarySetting = require("../salarySettings/salarySetting.modle");
const LiveStreamingHistory = require("../liveStreamingHistory/liveStreamingHistory.model");
const Wallet = require("../wallet/wallet.model");

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MIN_VALID_DAY_MINUTES = 60; // a live day counts as "valid" once 60+ minutes are streamed

// how much of the achieved target's payout the host actually qualifies for,
// factoring in the minimum valid-days requirement (mirrors services/salary.service.js)
function resolveFinalSetting(settings, rCoin, completedDays) {
  let achievedSetting = null; // tier reached by rCoin alone -> "expected" payout
  let dayAchievedSetting = null;

  settings.forEach((s) => {
    if (rCoin >= s.target) achievedSetting = s;
  });

  settings.forEach((s) => {
    if (s.applyDays) {
      if (completedDays >= s.days) dayAchievedSetting = s;
    } else {
      dayAchievedSetting = s;
    }
  });

  let finalSetting = { basic_salary: 0, diamond_share: 0 };

  if (achievedSetting && dayAchievedSetting) {
    finalSetting =
      achievedSetting.target > dayAchievedSetting.target
        ? achievedSetting
        : dayAchievedSetting;
  } else if (achievedSetting) {
    finalSetting = achievedSetting.applyDays
      ? { basic_salary: achievedSetting.basic_salary, diamond_share: 0 }
      : achievedSetting;
  } else if (dayAchievedSetting) {
    finalSetting = {
      basic_salary: dayAchievedSetting.basic_salary,
      diamond_share: 0,
    };
  }

  return { achievedSetting, finalSetting };
}

async function computeLiveStats(userId, startOfMonth, endOfMonth) {
  const sessions = await LiveStreamingHistory.find({
    userId,
    audio: false, // video sessions only
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  });

  const dailyMinutes = {};
  let totalMinutes = 0;

  sessions.forEach((rec) => {
    if (!rec.startTime || !rec.endTime) return;

    const start = new Date(rec.startTime);
    const end = new Date(rec.endTime);
    if (isNaN(start) || isNaN(end) || end <= start) return;

    const minutes = (end - start) / 1000 / 60;
    totalMinutes += minutes;

    const dayKey = start.toISOString().split("T")[0];
    dailyMinutes[dayKey] = (dailyMinutes[dayKey] || 0) + minutes;
  });

  const completedDays = Object.values(dailyMinutes).filter(
    (mins) => mins >= MIN_VALID_DAY_MINUTES,
  ).length;

  return {
    sessionCount: sessions.length,
    totalMinutes,
    completedDays,
  };
}

async function computeRCoinEarned(userId, startOfMonth, endOfMonth) {
  const result = await Wallet.aggregate([
    {
      $match: {
        userId,
        isIncome: true,
        isAudio: false,
        type: { $in: [0, 13] },
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, totalRCoin: { $sum: "$rCoin" } } },
  ]);

  return result[0]?.totalRCoin || 0;
}

exports.getMonthlyEarnings = async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
    const year = parseInt(req.query.year, 10) || now.getFullYear();
    const userId = req.query.userId;

    if (month < 1 || month > 12)
      return res
        .status(200)
        .json({ status: false, message: "month must be between 1 and 12" });

    const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;
    console.log(await User.findById(userId));

    const [users, settings] = await Promise.all([
      userId
        ? User.findById(userId)
            .select("_id name username image")
            .then((user) => (user ? [user] : []))
        : User.find().select("_id name username image"),
      SalarySetting.find().sort({ target: 1 }),
    ]);
    console.log(settings, users);

    const rows = [];

    for (const user of users) {
      const [{ totalMinutes, completedDays }, rCoinEarned] = await Promise.all([
        computeLiveStats(user._id, startOfMonth, endOfMonth),
        computeRCoinEarned(user._id, startOfMonth, endOfMonth),
      ]);

      const { achievedSetting, finalSetting } = resolveFinalSetting(
        settings,
        rCoinEarned,
        completedDays,
      );

      const expectedEarnings = achievedSetting?.diamond_share || 0;
      const actualEarnings = finalSetting?.diamond_share || 0;
      const basicSalary = finalSetting?.basic_salary || 0;

      const bonuses = {
        hostBonus: 0,
        eventBonus: 0,
        campaignBonus: 0,
        otherBonus: 0,
        totalBonus: 0,
      };

      const exchangedAmount = 0;
      const gemsRefunding = 0;
      const otherDeductions = 0;

      const finalMonthlyEarnings =
        actualEarnings +
        basicSalary +
        bonuses.totalBonus -
        exchangedAmount -
        gemsRefunding -
        otherDeductions;

      rows.push({
        userId: user._id,
        name: user.name,
        username: user.username,
        image: user.image,
        month: monthLabel,
        expectedEarnings,
        actualEarnings,
        totalLiveDuration: {
          hours: Math.floor(totalMinutes / 60),
          minutes: Math.round(totalMinutes % 60),
        },
        totalValidLiveDays: completedDays,
        estimatedBasicSalary: basicSalary,
        bonuses,
        exchangedAmount,
        gemsRefunding,
        otherDeductions,
        finalMonthlyEarnings,
      });
    }

    if (userId) {
      return res.status(200).json({
        status: true,
        message: "Success",
        data: rows[0] || null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Success",
      data: rows,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
