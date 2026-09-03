const FansRanking = require("./fansRanking.model");
const LiveUser = require("../liveUser/liveUser.model");
const mongoose = require("mongoose");

const buildPipeline = (matchCondition) => [
  { $match: matchCondition },
  {
    $group: {
      _id: "$userId",
      totalDiamonds: { $sum: "$diamond" },
    },
  },
  { $sort: { totalDiamonds: -1 } },
  {
    $setWindowFields: {
      sortBy: { totalDiamonds: -1 },
      output: { rank: { $rank: {} } },
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user",
    },
  },
  { $unwind: "$user" },
  {
    $lookup: {
      from: "levels",
      localField: "user.level",
      foreignField: "_id",
      as: "level",
    },
  },
  {
    $unwind: { path: "$level", preserveNullAndEmptyArrays: true },
  },
  {
    $project: {
      _id: 0,
      userId: "$user._id",
      name: "$user.name",
      username: "$user.username",
      image: "$user.image",
      coverImage: "$user.coverImage",
      avatarFrameImage: "$user.avatarFrameImage",
      totalDiamonds: 1,
      rank: 1,
      level: {
        _id: "$level._id",
        name: "$level.name",
        image: "$level.image",
      },
    },
  },
];

// run the daily/weekly/monthly/total ranking facet for a given roomId (= receiver's userId)
const getRankingForReceiver = async (roomObjectId) => {
  const now = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const startOfMonth = new Date();
  startOfMonth.setDate(startOfMonth.getDate() - 30);

  const result = await FansRanking.aggregate([
    {
      $facet: {
        daily: buildPipeline({
          roomId: roomObjectId,
          createdAt: { $gte: startOfToday, $lte: now },
        }),
        weekly: buildPipeline({
          roomId: roomObjectId,
          createdAt: { $gte: startOfWeek, $lte: now },
        }),
        monthly: buildPipeline({
          roomId: roomObjectId,
          createdAt: { $gte: startOfMonth, $lte: now },
        }),
        total: buildPipeline({
          roomId: roomObjectId,
        }),
      },
    },
  ]);

  const dailyList = result[0]?.daily || [];
  const weeklyList = result[0]?.weekly || [];
  const monthlyList = result[0]?.monthly || [];
  const totalList = result[0]?.total || [];

  const sumDiamonds = (list) =>
    list.reduce((sum, user) => sum + (user.totalDiamonds || 0), 0);

  return {
    daily: dailyList,
    weekly: weeklyList,
    monthly: monthlyList,
    total: totalList,
    dailyDiamonds: sumDiamonds(dailyList),
    weeklyDiamonds: sumDiamonds(weeklyList),
    monthlyDiamonds: sumDiamonds(monthlyList),
    totalDiamonds: sumDiamonds(totalList),
  };
};

// get room's fans ranking (who sent most diamonds) - daily, weekly, monthly and total
exports.getRoomRanking = async (req, res) => {
  try {
    const roomId = req.query.roomId;

    if (!roomId)
      return res
        .status(200)
        .json({ status: false, message: "roomId is required!" });

    const liveUser = await LiveUser.findOne({ liveStreamingId: roomId });

    if (!liveUser || !liveUser.liveUserId)
      return res
        .status(200)
        .json({ status: false, message: "Room not found!" });

    const ranking = await getRankingForReceiver(liveUser.liveUserId);

    return res.status(200).json({ status: true, message: "Success", ...ranking });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get a user's fans ranking directly by their own userId (no live session/room lookup needed) -
// simple flat array of who sent them the most diamonds overall, rank 1 = highest sender
exports.getUserRanking = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId)
      return res
        .status(200)
        .json({ status: false, message: "userId is required!" });

    const list = await FansRanking.aggregate(
      buildPipeline({ roomId: new mongoose.Types.ObjectId(userId) }),
    );

    return res.status(200).json({ status: true, message: "Success", data: list });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
