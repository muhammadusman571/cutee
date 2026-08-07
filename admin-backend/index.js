const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
require("./util/agendaWorker");
const cookieParser = require("cookie-parser");
const Reward = require("./server/reward/reward.model");
const LiveStreamingHistory = require("./server/liveStreamingHistory/liveStreamingHistory.model");
const SudGIPAuth = require("sud-gip-auth-nodejs");
const SudRoute = require("./server/sud/sud.route");

const authService = new SudGIPAuth(
  process.env.SUD_APP_ID,
  process.env.SUD_APP_SECRET,
);
app.use((req, res, next) => {
  req.authService = authService;
  next();
});

// const allowedOrigins = [

//   "http://localhost:3000",
//   "https://admin.fittolive.eagle-live.com",
//   "https://agency.fittolive.eagle-live.com",
//   "https://ferrywheel.fittolive.eagle-live.com",
//   "https://host.fittolive.eagle-live.com",
//   "https://roulettecasino.fittolive.eagle-live.com",
//   "https://teenpatti.fittolive.eagle-live.com",
// ];
//test
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin || true); // allow all origins
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
const config = require("./config");

var logger = require("morgan");
app.use(logger("dev"));

app.use((req, res, next) => {
  req.authService = authService;
  next();
});

//socket io
const http = require("http");
const server = http.createServer(app);
global.io = require("socket.io")(server);
app.set("trust proxy", true);

//import model
const Setting = require("./server/setting/setting.model");
const GameWinnerAnnouncement = require("./server/gameWinner/gameWinner.model");

//settingJson
const settingJson = require("./setting");

//Declare global variable
global.settingJSON = {};

//handle global.settingJSON when pm2 restart
async function initializeSettings() {
  try {
    const setting = await Setting.findOne().sort({ createdAt: -1 });
    if (setting) {
      console.log("In setting initialize Settings");
      global.settingJSON = setting;
    } else {
      global.settingJSON = settingJson;
    }
  } catch (error) {
    console.error("Failed to initialize settings:", error);
  }
}

module.exports = { initializeSettings };

//Declare the function as a global variable to update the setting.js file
global.updateSettingFile = (settingData) => {
  const settingJSON = JSON.stringify(settingData, null, 2);
  fs.writeFileSync("setting.js", `module.exports = ${settingJSON};`, "utf8");

  global.settingJSON = settingData; // Update global variable
  console.log("Settings file updated.");
};

//route.js
const Route = require("./route");
app.get("/share", (req, res) => {
  res.sendFile(path.join(__dirname, "share.html"));
});

app.use("/sud", SudRoute);
if (process.env.BASE_URL === "https://admin.cutelive.site/")
  app.use("/v1", Route);
else app.use("/", Route);

//socket.js
require("./socket");

app.use(express.static(path.join(__dirname, "public")));
app.use("/storage", express.static(path.join(__dirname, "storage")));
app.use("/svga", express.static(path.join(__dirname, "svga")));

app.use("/v1/storage", express.static(path.join(__dirname, "storage")));
app.use("/v1/svga", express.static(path.join(__dirname, "svga")));
app.get("/*", function (req, res) {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/v1/*", function (req, res) {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});
//mongodb connection
mongoose.connect(config?.MongoDb_Connection_String);
console.log(
  "mongouri",
  config.MongoDb_Connection_String,
  process.env.MONGO_URI,
);

const db = mongoose.connection;
db.on("error", (err) => {
  console.log("error............", err);
});

db.once("open", async () => {
  console.log("MONGO: successfully connected to db....");

  await initializeSettings();

  const isReplicaSet = await db.db.admin().command({ isMaster: 1 });
  if (isReplicaSet.setName) {
    const gameWinnerChangeStream = db
      .collection("gamewinnerannouncements")
      .watch();
    gameWinnerChangeStream.on("change", (change) => {
      if (change.operationType === "insert") {
        const { gameType, winnerUserArray, winnerNumber } = change.fullDocument;
        global.io.emit("winnerAnnouncement", {
          gameType,
          winnerUserArray,
          winnerNumber,
        });
      }
    });
  } else {
    console.log(
      "Change streams are not supported (MongoDB is not in a replica set) - gameWinner announcements disabled.",
    );
  }

  server.listen(config.PORT, () => {
    console.log("Magic happens on port: " + config.PORT);
  });
});

//node-cron
const cron = require("node-cron");

//import model
const User = require("./server/user/user.model");
const { generateMonthlySalarySheets } = require("./services/salary.service");
// const cookieParser = require("cookie-parser");
// generateMonthlySalarySheets()
//Schedule a task to update user's daily watch Ads
cron.schedule("0 0 * * *", async () => {
  await User.updateMany(
    {
      "ad.count": { $gt: 0 },
      "ad.date": { $ne: null },
    },
    {
      $set: {
        "ad.count": 0,
        "ad.date": null,
      },
    },
  );
});

cron.schedule("0 */5 * * * *", async () => {
  console.log("Reward cron running...");

  // Get reward configuration
  const rewardConfig = await Reward.findOne();

  if (!rewardConfig) return;

  let rewardSeconds = 0;
  if (rewardConfig.timeType === "days") {
    rewardSeconds =
      rewardConfig.days * 24 * 3600 +
      rewardConfig.minutes * 60 +
      rewardConfig.seconds;
  } else {
    rewardSeconds =
      rewardConfig.hours * 3600 +
      rewardConfig.minutes * 60 +
      rewardConfig.seconds;
  }

  // Today's start and end for per-user daily check
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Find all live streams without audio and not yet rewarded
  const liveStreams = await LiveStreamingHistory.find({
    audio: false,
    rewardGiven: false,
  });
  console.log(liveStreams.length);
  for (const liveHistory of liveStreams) {
    // 1️⃣ Check if user already got a reward today
    const alreadyRewardedToday = await LiveStreamingHistory.findOne({
      userId: liveHistory.userId,
      rewardGiven: true,
      rewardDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (alreadyRewardedToday) {
      continue; // skip to next live stream
    }

    // 2️⃣ Calculate live duration
    const startDate = new Date(liveHistory.startTime);
    const endDate = new Date(liveHistory.endTime);
    const durationSeconds = (endDate - startDate) / 1000;

    if (durationSeconds >= rewardSeconds) {
      const rewardAmount = rewardConfig.reward;

      // 3️⃣ Mark reward given
      liveHistory.rewardGiven = true;
      liveHistory.rewardAmount = rewardAmount;
      liveHistory.rewardDate = new Date();
      await liveHistory.save();

      // 4️⃣ Update user rCoin
      if (liveHistory.userId) {
        await User.findByIdAndUpdate(liveHistory.userId, {
          $inc: { rCoin: rewardAmount },
        });
      }
    } else {
    }
  }
});
