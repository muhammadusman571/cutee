var express = require("express");
var path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const config = require("./config");
var app = express();
const port = config.PORT;
const http = require("http");
const { Server } = require("socket.io");
const User = require("./model/user.model");
const GameAdminCoin = require("./model/gameAdminCoin");
const RouletteLastHistory = require("./model/rouletteLastHistory.model");
const GameWinnerAnnouncement = require("./model/gameWinnerAnnouncement.model");

const {
  selectFrame,
  RandomResult,
  addGameHistory,
  allUserHistory,
  createrouletteLastHistory,
  addBet,
  updateUser,
  coin,
  historyRecord,
} = require("./service");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/*", function (req, res) {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});

const url = config.mongoDbConnectionString;

const refreshSettings = async () => {
  try {
    const settings = await mongoose.connection.db
      .collection("settings")
      .findOne({});
    global.setting = settings || {};
  } catch (error) {
    console.error("Error fetching the settings:", error);
  }
};

global.bet = [];
let time = 21;
let randomWinnerNumber;
global.highOrLowWinResult = [];
global.resultObj;
global.settinData = {};
global.winnerUserArrayG = [];
global.currentGame = {
  Combinations: 9,
  UsersBits: [],
  cardBitCoin: [
    { selectFrame: 1, bit: 0, winner: false },
    { selectFrame: 2, bit: 0, winner: false },
    { selectFrame: 3, bit: 0, winner: false },
    { selectFrame: 4, bit: 0, winner: false },
    { selectFrame: 5, bit: 0, winner: false },
    { selectFrame: 6, bit: 0, winner: false },
    { selectFrame: 7, bit: 0, winner: false },
    { selectFrame: 8, bit: 0, winner: false },
  ],
  resultObj: { no: 34, color: "red", oddAndEven: "even" },
};

io.on("connection", async (socket) => {
  console.log("connection...............................connection", socket.id);

  const { globalRoom } = socket?.handshake?.query;
  let user;
  if (globalRoom !== "null") {
    user = await User.findById(globalRoom);
  }

  socket.on("startGame", async () => {
    if (user) {
      socket.emit("start", user);
      io.emit("game", currentGame);
      const rouletteLastHistory = await RouletteLastHistory.findOne();
      socket.emit("gameNumberHistory", rouletteLastHistory?.winnerNumber || []);
    } else {
      socket.emit("start", null);
    }
  });

  socket.on("bit", async (obj) => {
    const userDb = await updateUser(obj);
    if (userDb.diamond < 0) {
      userDb.diamond = 0;
      await userDb.save();
      io.emit("start", userDb);
    }

    var objToModify = currentGame.cardBitCoin.find(
      (val) => val.selectFrame === obj.SelectedFrame,
    );

    if (objToModify) {
      objToModify.bit += obj.Bit;
    }

    let bitData = {
      UserId: obj.User._id,
      Bit: obj.Bit,
      SelectedFrame: obj.SelectedFrame,
      position: obj.position,
    };

    currentGame.UsersBits.push(bitData);
    addBet(obj.Bit, obj.User._id);

    await GameAdminCoin.updateOne({}, { $inc: { coin: obj.Bit } });

    io.emit("bit", bitData);
  });

  socket.on("historyRecord", async () => {
    let historyRecordResult = await historyRecord(globalRoom);
    socket.emit("historyRecord", historyRecordResult);
  });

  socket.on("user", async (obj) => {
    if (obj.User?._id) {
      const userDb = await User.findById(obj.User._id);
      if (userDb?.diamond !== obj.User?.diamond) {
        socket.emit("start", userDb);
      }
    }
  });

  socket.on("disconnect", () => {});
});

const updateTime = async () => {
  io.emit("time", time);
  time--;

  if (time === -1) {
    randomWinnerNumber = await RandomResult();
    resultObj = await selectFrame(randomWinnerNumber);
    await addGameHistory(resultObj);
  }

  if (time === -2) {
    currentGame.Combinations = randomWinnerNumber;
    io.emit("randomWinnerNumber", randomWinnerNumber);
  }

  if (time === -5) {
    allUserHistory(currentGame, resultObj);
  }

  if (time === -7) {
    currentGame.resultObj = resultObj.resultObj;
    io.emit("game", currentGame);

    const rouletteLastHistory = await RouletteLastHistory.findOne();

    if (rouletteLastHistory) {
      rouletteLastHistory.winnerNumber.unshift(resultObj.resultObj);
      if (rouletteLastHistory.winnerNumber.length > 20) {
        rouletteLastHistory.winnerNumber.pop();
      }
      await rouletteLastHistory.save();
      io.emit("gameNumberHistory", rouletteLastHistory.winnerNumber);
    }

    const sortedArray = winnerUserArrayG.sort(
      (a, b) => b.userWinCoin - a.userWinCoin
    );
    const resultTopUserArray = sortedArray.map((element, index) => ({
      ...element,
      number: index + 1,
    }));
    io.emit("winnerUserArray", {
      winnerUserArray: resultTopUserArray,
      winnerNumber: resultObj?.resultObj,
    });

    if (resultTopUserArray.length > 0) {
      await new GameWinnerAnnouncement({
        gameType: "roulette",
        winnerUserArray: resultTopUserArray,
        winnerNumber: resultObj?.resultObj,
      }).save();
    }
  }

  if (time === -13) {
    currentGame.UsersBits = [];
    winnerUserArrayG = [];
    currentGame.cardBitCoin = [
      { selectFrame: 1, bit: 0, winner: false },
      { selectFrame: 2, bit: 0, winner: false },
      { selectFrame: 3, bit: 0, winner: false },
      { selectFrame: 4, bit: 0, winner: false },
      { selectFrame: 5, bit: 0, winner: false },
      { selectFrame: 6, bit: 0, winner: false },
      { selectFrame: 7, bit: 0, winner: false },
      { selectFrame: 8, bit: 0, winner: false },
    ];
    io.emit("game", currentGame);
  }

  if (time === -16) {
    time = 21;
    bet.splice(0, bet.length);
    console.log("New game starting.");
  }
};

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected successfully");

    await refreshSettings();

    const db = mongoose.connection.db;
    const isReplicaSet = await db.admin().command({ isMaster: 1 });

    if (isReplicaSet.setName) {
      const changeStream = db.collection("settings").watch();
      changeStream.on("change", async () => {
        await refreshSettings();
      });
    }

    await coin();
    await createrouletteLastHistory();

    setInterval(() => {
      updateTime();
    }, 1000);

    server.listen(port, () => {
      console.log(`magic happen on ${port}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));
