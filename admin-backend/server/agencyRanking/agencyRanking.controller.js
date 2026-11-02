const mongoose = require("mongoose");
const GiftLog = require("../giftlogs/gift.model");
const FansRanking = require("../fansRanking/fansRanking.model");
const Agency = require("../agency/agency.model");
const User = require("../user/user.model");

const USER_FIELDS =
  "name username image avatarFrameImage gender bio uniqueId level isHost isAgency";

// Day/week/month boundaries follow India time (same zone as wallet/history dates); weeks start Monday
const IST_OFFSET_MS = 330 * 60 * 1000;
const periodStart = (type) => {
  if (type === "total") return null;
  const ist = new Date(Date.now() + IST_OFFSET_MS);
  let day = ist.getUTCDate();
  if (type === "weekly") day -= (ist.getUTCDay() + 6) % 7;
  if (type === "monthly") day = 1;
  return new Date(
    Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), day) - IST_OFFSET_MS
  );
};

const PERIODS = ["daily", "weekly", "monthly", "total"];
const isId = (id) => mongoose.Types.ObjectId.isValid(id);

// Split a sorted list into the podium + paginated rest, same shape as gift_charm_ranking
const podium = (list, start, limit) => {
  const ranked = list.map((item, i) => ({ rank: i + 1, ...item }));
  const s = Math.max(parseInt(start) || 1, 1);
  const l = Math.max(parseInt(limit) || 20, 1);
  const rest = ranked.slice(3);
  return {
    top1: ranked[0] || null,
    top2: ranked[1] || null,
    top3: ranked[2] || null,
    others: rest.slice((s - 1) * l, s * l),
    totalCount: ranked.length,
  };
};

// The agency a user belongs to: the one they own, else the one they host for
const agencyOfUser = (user) =>
  (user?.isAgency && user.agency) || (user?.isHost && user.hostAgency) || null;

// Diamonds received per agency in the period, highest first
const agencyTotals = async (type) => {
  const from = periodStart(type);
  const match = { agencyId: { $ne: null } };
  if (from) match.createdAt = { $gte: from };
  return GiftLog.aggregate([
    { $match: match },
    { $group: { _id: "$agencyId", total: { $sum: "$diamonds" } } },
    { $sort: { total: -1 } },
  ]);
};

//agency contribution list: members ranked by diamonds received for this agency
exports.contribution = async (req, res) => {
  try {
    const { agencyId, userId } = req.query;
    const type = req.query.type || "total";
    if (!isId(agencyId) || !PERIODS.includes(type)) {
      return res
        .status(200)
        .json({ status: false, message: "Oops ! Invalid details." });
    }

    const from = periodStart(type);
    const match = { agencyId: new mongoose.Types.ObjectId(agencyId) };
    if (from) match.createdAt = { $gte: from };

    const totals = await GiftLog.aggregate([
      { $match: match },
      { $group: { _id: "$receiverId", total: { $sum: "$diamonds" } } },
      { $sort: { total: -1 } },
    ]);

    const users = await User.find({ _id: { $in: totals.map((t) => t._id) } })
      .select(USER_FIELDS)
      .populate("level", "name image")
      .lean();
    const byId = new Map(users.map((u) => [u._id.toString(), u]));
    const list = totals
      .filter((t) => byId.has(t._id.toString()))
      .map((t) => ({ total: t.total, user: byId.get(t._id.toString()) }));

    const result = podium(list, req.query.start, req.query.limit);
    const mine = userId
      ? list.findIndex((x) => x.user._id.toString() === userId)
      : -1;

    return res.status(200).json({
      status: true,
      message: "Success",
      type,
      ...result,
      myRank: mine === -1 ? null : { rank: mine + 1, total: list[mine].total },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal server error" });
  }
};

//agency members: owner first, then hosts by level
exports.members = async (req, res) => {
  try {
    const { agencyId } = req.query;
    if (!isId(agencyId)) {
      return res
        .status(200)
        .json({ status: false, message: "Oops ! Invalid details." });
    }

    const agency = await Agency.findById(agencyId).select("user name image");
    if (!agency) {
      return res
        .status(200)
        .json({ status: false, message: "Agency not Found." });
    }

    const start = Math.max(parseInt(req.query.start) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 20, 1);
    const query = {
      $or: [{ isHost: true, hostAgency: agency._id }, { _id: agency.user }],
    };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .select(USER_FIELDS)
        .populate("level", "name image coin")
        .lean(),
    ]);

    const ownerId = agency.user?.toString();
    const sorted = users
      .map((u) => ({ ...u, role: u._id.toString() === ownerId ? "owner" : "host" }))
      .sort(
        (a, b) =>
          (b.role === "owner") - (a.role === "owner") ||
          (b.level?.coin || 0) - (a.level?.coin || 0)
      );

    return res.status(200).json({
      status: true,
      message: "Success",
      total,
      data: sorted.slice((start - 1) * limit, start * limit),
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal server error" });
  }
};

//agency ranking (Record tab): agencies ranked by diamonds received
exports.ranking = async (req, res) => {
  try {
    const type = req.query.type || "daily";
    if (!PERIODS.includes(type)) {
      return res
        .status(200)
        .json({ status: false, message: "Oops ! Invalid details." });
    }

    const totals = await agencyTotals(type);
    const agencies = await Agency.find({ _id: { $in: totals.map((t) => t._id) } })
      .select("name image agencyCode uniqueId isActive")
      .lean();
    const byId = new Map(agencies.map((a) => [a._id.toString(), a]));
    const list = totals
      .filter((t) => byId.get(t._id.toString())?.isActive)
      .map((t) => ({ total: t.total, agency: byId.get(t._id.toString()) }));

    return res.status(200).json({
      status: true,
      message: "Success",
      type,
      ...podium(list, req.query.start, req.query.limit),
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal server error" });
  }
};

//my agency tab: the user's agency with its total and rank for the period
exports.myAgency = async (req, res) => {
  try {
    const { userId } = req.query;
    const type = req.query.type || "daily";
    if (!isId(userId) || !PERIODS.includes(type)) {
      return res
        .status(200)
        .json({ status: false, message: "Oops ! Invalid details." });
    }

    const user = await User.findById(userId)
      .select("isHost hostAgency isAgency agency")
      .lean();
    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User does not found." });
    }

    const agencyId = agencyOfUser(user);
    const agency = agencyId
      ? await Agency.findById(agencyId)
          .select("name image agencyCode uniqueId user isActive")
          .lean()
      : null;
    if (!agency) {
      return res
        .status(200)
        .json({ status: false, message: "Not in an agency." });
    }

    const [totals, memberCount] = await Promise.all([
      agencyTotals(type),
      User.countDocuments({
        $or: [{ isHost: true, hostAgency: agency._id }, { _id: agency.user }],
      }),
    ]);
    const index = totals.findIndex(
      (t) => t._id.toString() === agency._id.toString()
    );

    return res.status(200).json({
      status: true,
      message: "Success",
      type,
      agency,
      memberCount,
      isOwner: agency.user?.toString() === userId,
      total: index === -1 ? 0 : totals[index].total,
      rank: index === -1 ? null : index + 1,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal server error" });
  }
};

//profile stats: diamonds sent, follow/fans counts, top 3 contributors
exports.profileStats = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!isId(userId)) {
      return res
        .status(200)
        .json({ status: false, message: "Oops ! Invalid details." });
    }

    const id = new mongoose.Types.ObjectId(userId);
    const [user, sent, top] = await Promise.all([
      User.findById(id).select("followers following").lean(),
      GiftLog.aggregate([
        { $match: { senderId: id } },
        { $group: { _id: null, total: { $sum: "$diamonds" } } },
      ]),
      // same source as /fansRanking/userRanking so the avatars match the full list
      FansRanking.aggregate([
        { $match: { roomId: id } },
        { $group: { _id: "$userId", total: { $sum: "$diamond" } } },
        { $sort: { total: -1 } },
        { $limit: 3 },
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
          $project: {
            _id: 0,
            userId: "$user._id",
            name: "$user.name",
            image: "$user.image",
            avatarFrameImage: "$user.avatarFrameImage",
            total: 1,
          },
        },
      ]),
    ]);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User does not found." });
    }

    return res.status(200).json({
      status: true,
      message: "Success",
      send: sent[0]?.total || 0,
      follow: user.following || 0,
      fans: user.followers || 0,
      topContributors: top,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal server error" });
  }
};
