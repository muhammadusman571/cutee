const liveUserModel = require("../liveUser/liveUser.model");
const Reward = require("./reward.model");
const LiveStreamingHistory = require("../liveStreamingHistory/liveStreamingHistory.model");
exports.createOrUpdateReward = async (req, res) => {
  try {
    const body = req.body;
    let reward = await Reward.findOne();

    if (reward) {
      reward.set(body);
      await reward.save();
      return res.status(200).json({
        status: true,
        message: "Reward updated successfully",
        data: reward,
      });
    } else {
      reward = await Reward.create(body);
      return res.status(200).json({
        status: true,
        message: "Reward created successfully",
        data: reward,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

exports.getRewardConfig = async (req, res) => {
  try {
    const reward = await Reward.findOne().sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      reward,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getAllRewardForAdmin = async (req, res) => {
  try {
    const { start = 0, limit = 20 } = req.query;

    const countPipeline = [
      {
        $match: {
          rewardGiven: true,
        },
      },

      { $count: "total" },
    ];

    const totalResult = await LiveStreamingHistory.aggregate(countPipeline);
    console.log(totalResult);
    const total = totalResult[0]?.total || 0;

    const pipeline = [
      { $match: { rewardGiven: true } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },

      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          rewardGiven: 1,
          createdAt: 1,
          _id: 1,
          rewardAmount: 1,
          rewardDate: 1,

          userDetails: {
            name: 1,
            coverImage: 1,
            image: 1,
          },
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
      { $skip: parseInt(start, 10) },
      { $limit: parseInt(limit, 10) },
    ];

    const data = await LiveStreamingHistory.aggregate(pipeline);

    return res.status(200).json({
      status: true,
      message: "Success",
      reward: data,
      total,
    });
  } catch (error) {
    console.error("Error fetching live users:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

exports.getAllRewardForMobileApp = async (req, res) => {
  try {
    const { start = 0, limit = 20 } = req.query;

    const countPipeline = [
      {
        $match: {
          rewardGiven: true,
        },
      },

      { $count: "total" },
    ];

    const totalResult = await LiveStreamingHistory.aggregate(countPipeline);
    console.log(totalResult);
    const total = totalResult[0]?.total || 0;

    const pipeline = [
      { $match: { rewardGiven: true } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },

      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          rewardGiven: 1,
          createdAt: 1,
          _id: 1,
          rewardAmount: 1,
          rewardDate: 1,

          userDetails: {
            name: 1,
            coverImage: 1,
            image: 1,
          },
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
      { $skip: parseInt(start, 10) },
      { $limit: parseInt(limit, 10) },
    ];

    const data = await LiveStreamingHistory.aggregate(pipeline);

    return res.status(200).json({
      status: true,
      message: "Success",
      reward: data,
      total,
    });
  } catch (error) {
    console.error("Error fetching live users:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
