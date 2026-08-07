const Agenda = require("agenda");
const Purchase = require("../server/purchase/purchase.model");
const { MongoDb_Connection_String } = require("../config");
const User = require("../server/user/user.model");
const { generateMonthlySalarySheets } = require("../services/salary.service");

const agenda = new Agenda({
  db: { address: MongoDb_Connection_String, collection: "jobs" },
  processEvery: "20 seconds",
});

// Define the job — expire SVIP
agenda.define("expire svip", async (job) => {
  const { PurchaseId } = job.attrs.data;

  const PurchasedItem = await Purchase.findById(PurchaseId);
  if (!PurchasedItem) return;

  PurchasedItem.svip = null;
  await PurchasedItem.save();

  console.log(`SVIP expired for: ${PurchasedItem._id}`);
});

agenda.define("expire theme", async (job) => {
  const { PurchaseId } = job.attrs.data;

  const PurchasedItem = await Purchase.findById(PurchaseId);
  if (!PurchasedItem) return;

  PurchasedItem.theme = null;
  await PurchasedItem.save();

  console.log(`SVIP expired for: ${PurchasedItem._id}`);
});

// ------------------------------
// SALARY GENERATION JOB
// ------------------------------
// agenda.define("generate-salary-and-reset", async () => {
//   const now = new Date();
//   const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

//   if (now.getDate() !== lastDay) {
//     console.log("Not the last day, skipping salary generation.");
//     return;
//   }

//   console.log("Starting Salary Sheet Generation...");

//   try {
//     await generateMonthlySalarySheets();

//     console.log("Salary sheets created. Resetting rCoin...");

//     await User.updateMany({ isHost: true }, { $set: { rCoin: 0 } });

//     console.log("rCoin reset successful.");
//   } catch (err) {
//     console.error("Error in salary + reset flow:", err);
//   }
// });

// ------------------------------
// Scheduler
// ------------------------------
(async function () {
  await agenda.start();

  // Run every month at 11:30 PM on days 28-31
  await agenda.every(
    "30 23 28-31 * *",
    "generate-salary-and-reset",
    {},
    {
      skipImmediate: true,
      unique: { name: "generate-salary-and-reset" },
    },
  );

  console.log("Agenda Salary Job Scheduled.");
})();

module.exports = agenda;
