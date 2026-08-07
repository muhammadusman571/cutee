const mongoose = require("mongoose");
const moment = require("moment");
const GiftLog = require("../giftlogs/gift.model");
const User = require("../user/user.model");
const RankingFrame = require("../rank-frame/rank-frame.model");
const LiveUser = require("../liveUser/liveUser.model");

exports.giftAndCharmRanking = async (req, res) => {
  try {
    const { type, role, userId } = req.query;

    if (!["receiver", "sender"].includes(role))
      return res.status(400).json({ message: "Invalid role" });
    if (!userId) return res.status(400).json({ message: "userId is required" });

    let startDate, endDate;
    const now = moment().utc();

    if (type === "daily") {
      startDate = now.clone().startOf("day");
      endDate = now.clone().endOf("day");
    } else if (type === "weekly") {
      startDate = now.clone().startOf("isoWeek");
      endDate = now.clone().endOf("isoWeek");
    } else if (type === "monthly") {
      startDate = now.clone().startOf("month");
      endDate = now.clone().endOf("month");
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }

    const field = role === "receiver" ? "receiverId" : "senderId";

    // 1️⃣ Aggregate gift totals (sum diamonds)
    const giftData = await GiftLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        },
      },
      {
        $group: {
          _id: `$${field}`,
          total: { $sum: "$diamonds" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // 2️⃣ Get all users
    const allUsers = await User.find({})
      .select("name username image countryFlagImage rCoin level isVIP isOnline")
      .populate("level", "name image")
      .lean();

    // 3️⃣ Fetch frames
    const rankType = role === "receiver" ? "gift" : "charm";
    const frames = await RankingFrame.find({
      rankType,
      isDelete: false,
    }).lean();

    const getFrameForRank = (rank) => {
      if (rank === 1)
        return frames.find((f) => f.rankNumber === "1st")?.frame || null;
      if (rank === 2)
        return frames.find((f) => f.rankNumber === "2nd")?.frame || null;
      if (rank === 3)
        return frames.find((f) => f.rankNumber === "3rd")?.frame || null;
      return null;
    };

    // 4️⃣ Ranked users (with gifts)
    const ranked = giftData.map((d, i) => {
      const user = allUsers.find((u) => u._id.toString() === d._id?.toString());
      return {
        rank: i + 1,
        total: d.total,
        frame: getFrameForRank(i + 1),
        user: user || null,
      };
    });

    // 5️⃣ Unranked users (no gifts)
    const rankedIds = giftData.map((d) => d._id?.toString());
    const unranked = allUsers
      .filter((u) => !rankedIds.includes(u._id.toString()))
      .map((u) => ({
        rank: null,
        total: 0,
        frame: null,
        user: u,
      }));

    // 6️⃣ Merge + sort
    const combined = [...ranked, ...unranked]
      .sort((a, b) => b.total - a.total)
      .map((item, i) => ({ ...item, rank: i + 1 })); // assign actual ranks to everyone

    // 7️⃣ Separate top3 only if they have >0 total
    const topUsers = combined.filter((x) => x.total > 0).slice(0, 3);
    const top1 = topUsers[0] || null;
    const top2 = topUsers[1] || null;
    const top3 = topUsers[2] || null;

    // If fewer than 3 top users, fill with nulls explicitly
    while (topUsers.length < 3) topUsers.push(null);

    // 8️⃣ Others = everyone not in top3
    const topIds = topUsers.filter(Boolean).map((x) => x.user?._id?.toString());
    const others = combined.filter(
      (x) => !topIds.includes(x.user?._id?.toString())
    );

    // 9️⃣ Current user info
    const currentUser =
      combined.find((x) => x.user?._id?.toString() === userId) || null;

    res.json({
      status: true,
      type,
      role,
      top1,
      top2,
      top3,
      others,
      currentUser,
    });
  } catch (err) {
    console.error("giftAndCharmRanking error:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.getRoomRanking = async (req, res) => {
  try {
    const { type } = req.query; // daily | weekly | monthly

    if (!["daily", "weekly", "monthly"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const now = moment().utc();
    let startDate, endDate;

    if (type === "daily") {
      startDate = now.clone().startOf("day");
      endDate = now.clone().endOf("day");
    } else if (type === "weekly") {
      startDate = now.clone().startOf("isoWeek");
      endDate = now.clone().endOf("isoWeek");
    } else {
      startDate = now.clone().startOf("month");
      endDate = now.clone().endOf("month");
    }

    // 1️⃣ Aggregate total diamonds received per room
    const rankingData = await GiftLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
          diamonds: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: "$roomId",
          total: { $sum: "$diamonds" },
        },
      },
      {
        $lookup: {
          from: "liveusers", // ✅ Collection name (must match the actual MongoDB collection)
          localField: "_id", // The grouped _id (roomId)
          foreignField: "_id", // The _id in LiveUser
          as: "roomInfo",
        },
      },
      { $unwind: "$roomInfo" }, // Removes entries with no matching room
      { $sort: { total: -1 } },
      {
        $project: {
          _id: 0,
          roomId: "$roomInfo._id",
          total: 1,
        },
      },
    ]);

    const rankedRoomIds = rankingData.map((r) => r._id?.toString());

    // 2️⃣ Fetch all rooms with owner and level
    const allRooms = await LiveUser.find(
      {},
      "_id rCoin roomName roomImage country diamond isVIP uniqueId liveStreamingId"
    )
      .populate({
        path: "liveUserId",
        select: "name username image countryFlagImage isVIP level",
        populate: { path: "level", select: "name image" },
      })
      .lean();

    // // 3️⃣ Fetch frames
    const frames = await RankingFrame.find({
      rankType: "room",
      isDelete: false,
    }).lean();

    const getFrameForRank = (rank) => {
      if (rank === 1)
        return frames.find((f) => f.rankNumber === "1st")?.frame || null;
      if (rank === 2)
        return frames.find((f) => f.rankNumber === "2nd")?.frame || null;
      if (rank === 3)
        return frames.find((f) => f.rankNumber === "3rd")?.frame || null;
      return null;
    };

    // // 4️⃣ Ranked rooms (based on GiftLog totals)
    const ranked = rankingData.map((d, i) => {
      const room = allRooms.find(
        (r) => r._id.toString() === d.roomId.toString()
      );
      const owner = room?.liveUserId;

      return {
        rank: i + 1,
        total: d.total,
        frame: getFrameForRank(i + 1),
        room: {
          _id: room?._id,
          name: room?.roomName || "Untitled Room",
          image: room?.roomImage || owner?.image || null,
          rCoin: room?.rCoin || 0,
          liveStreamingId: room?.liveStreamingId || null,
          audio: room?.audio || false,
        },
        owner: owner
          ? {
              _id: owner._id,
              username: owner.username,
              name: owner.name,
              image: owner.image,
              countryFlagImage: owner.countryFlagImage,
              isVIP: owner.isVIP,
              level: owner.level,
            }
          : null,
      };
    });

    // // 5️⃣ Rooms without ranking
    const unranked = allRooms
      .filter((r) => !rankedRoomIds.includes(r._id.toString()))
      .map((room) => {
        const owner = room?.liveUserId;
        return {
          rank: null,
          total: 0,
          frame: null,
          room: {
            _id: room?._id,
            name: room?.roomName || "Untitled Room",
            image: room?.roomImage || owner?.image || null,
            rCoin: room?.rCoin || 0,
            liveStreamingId: room?.liveStreamingId || null,
            audio: room?.audio || false,
          },
          owner: owner
            ? {
                _id: owner._id,
                username: owner.username,
                name: owner.name,
                image: owner.image,
                countryFlagImage: owner.countryFlagImage,
                isVIP: owner.isVIP,
                level: owner.level,
              }
            : null,
        };
      });

    // 6️⃣ Merge ranked + unranked
    const combined = [...ranked, ...unranked].sort((a, b) => b.total - a.total);

    // 7️⃣ Filter only rooms that actually have > 0 total for top 3
    const validRanked = combined.filter((r) => r.total > 0);

    const top1 = validRanked[0] || null;
    const top2 = validRanked[1] || null;
    const top3 = validRanked[2] || null;

    // 8️⃣ Remove top 1–3 from “others” and assign sequential ranks
    const others = combined
      .filter(
        (r) =>
          ![
            top1?.room?._id?.toString(),
            top2?.room?._id?.toString(),
            top3?.room?._id?.toString(),
          ].includes(r.room?._id?.toString())
      )
      .map((r, i) => ({
        ...r,
        rank: i + (validRanked.length ? validRanked.length + 1 : 1),
        frame: null,
      }));

    res.json({
      status: true,
      type,
      top1,
      top2,
      top3,
      others,
    });
  } catch (err) {
    console.error("getRoomRanking error:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
