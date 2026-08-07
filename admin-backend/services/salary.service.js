// services/salary.service.js
const User = require("../server/user/user.model");
const SalarySetting = require("../server/salarySettings/salarySetting.modle");
const SalarySheet = require("../server/salarySheet/salarySheet.model");
const LiveStreamingHistory = require("../server/liveStreamingHistory/liveStreamingHistory.model");

exports.generateMonthlySalarySheets = async () => {
  try {
    // GET ALL HOSTS
    const hosts = await User.find({ isHost: true }).populate("hostAgency");

    if (!hosts.length) return;

    // GET SORTED SALARY SETTINGS
    const settings = await SalarySetting.find().sort({ target: 1 });

    let salarySheets = [];

    // LOOP ALL HOSTS
    for (let host of hosts) {
      const rCoin = host.rCoin;
      const dayTime = await calculateHostDays(host._id);

      let achievedSetting = null;
      let dayAchievedSetting = null;
      let rank = 0;

      // -----------------------------------------
      // 1️⃣ TARGET ACHIEVED BY rCoin
      // -----------------------------------------
      settings.forEach((s, i) => {
        if (rCoin >= s.target) {
          achievedSetting = s;
          rank = i + 1;
        }
      });

      // -----------------------------------------
      // 2️⃣ DAYS ACHIEVED ONLY IF applyDays = true
      // -----------------------------------------
      settings.forEach((s) => {
        if (s.applyDays) {
          // Days must be achieved if applyDays = true
          if (dayTime.completedDays >= s.days) {
            dayAchievedSetting = s;
          }
        } else {
          // applyDays = false → automatically considered as achieved
          dayAchievedSetting = s;
        }
      });

      // -----------------------------------------
      // 3️⃣ Determine final salary setting
      // -----------------------------------------
      let finalSetting = null;

      // Case A: Both target & days requirement satisfied
      if (achievedSetting && dayAchievedSetting) {
        // Pick the higher target between achievedSetting & dayAchievedSetting
        finalSetting =
          achievedSetting.target > dayAchievedSetting.target
            ? achievedSetting
            : dayAchievedSetting;
      }
      // Case B: Only target achieved
      else if (achievedSetting) {
        // If applyDays = false → still full salary
        if (!achievedSetting.applyDays) {
          finalSetting = achievedSetting;
        } else {
          // applyDays = true but user didn't complete days → basic only
          finalSetting = { basic_salary: achievedSetting.basic_salary };
        }
      }
      // Case C: Only days achieved (applyDays only)
      else if (dayAchievedSetting) {
        finalSetting = {
          basic_salary: dayAchievedSetting.basic_salary,
        };
      }
      // Case D: Nothing achieved
      else {
        finalSetting = { basic_salary: 0 };
      }

      let sheetData = {
        user_id: host._id,
        rank,
        rcoin: rCoin,
        day_time: `${dayTime.completedDays} days, extra ${dayTime.extraHours} hrs`,

        target: finalSetting.target || 0,
        diamond_share: finalSetting.diamond_share || 0,
        basic_salary: finalSetting.basic_salary || 0,
        agency_share: finalSetting.agency_share || 0,
      };

      sheetData.total_salary =
        (finalSetting.basic_salary || 0) + (finalSetting.diamond_share || 0);

      const newSheet = await SalarySheet.create(sheetData);
      salarySheets.push(newSheet);
    }

    return salarySheets;
  } catch (err) {
    console.error("Salary generation failed:", err);
    throw err;
  }
};

// -----------------------------------------------------------
// DAY CALCULATION (check 1+ hr per day)
// -----------------------------------------------------------
async function calculateHostDays(userId) {
  const history = await LiveStreamingHistory.find({ userId });

  let dailyMinutes = {};

  history.forEach((rec) => {
    if (!rec.startTime || !rec.endTime) return;

    const start = new Date(rec.startTime);
    const end = new Date(rec.endTime);

    const dayKey = start.toISOString().split("T")[0];
    const minutes = (end - start) / 1000 / 60;

    if (!dailyMinutes[dayKey]) dailyMinutes[dayKey] = 0;
    dailyMinutes[dayKey] += minutes;
  });

  let completedDays = 0;
  let extraHours = 0;

  Object.values(dailyMinutes).forEach((mins) => {
    if (mins >= 60) {
      completedDays++;
      extraHours += (mins - 60) / 60; // leftover hours
    }
  });

  return {
    completedDays,
    extraHours: parseFloat(extraHours.toFixed(2)),
  };
}
