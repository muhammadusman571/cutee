const express = require("express");
const route = express.Router();
const Setting = require("./server/setting/setting.model");

//user route
const UserRoute = require("./server/user/user.route");
route.use("/user", UserRoute);

//live user route
const LiveUserRoute = require("./server/liveUser/liveUser.route");
route.use("/liveUser", LiveUserRoute);

const AdminRoute = require("./server/admin/admin.route");
route.use("/admin", AdminRoute);

//wallet route
const WalletRoute = require("./server/wallet/wallet.route");
route.use("/history", WalletRoute);

//dashboard route
const DashboardRoute = require("./server/dashboard/dashboard.route");
route.use("/dashboard", DashboardRoute);

//chat topic route
const ChatTopicRoute = require("./server/chatTopic/chatTopic.route");
route.use("/chatTopic", ChatTopicRoute);

//chat route
const ChatRoute = require("./server/chat/chat.route");
route.use("/chat", ChatRoute);

//post route
const PostRoute = require("./server/post/post.route");
route.use("/post", PostRoute);

//video route
const VideoRoute = require("./server/video/video.route");
route.use("/video", VideoRoute);

//favorite route
const FavoriteRoute = require("./server/favorite/favorite.route");
route.use("/favorite", FavoriteRoute);

//comment route
const CommentRoute = require("./server/comment/comment.route");
route.use("/comment", CommentRoute);

//svga
const SvgaRoute = require("./server/svga/svga.route");
route.use("/svga", SvgaRoute);

//svga
const SvipRoute = require("./server/svip/svip.route");
route.use("/svip", SvipRoute);

//ranking frames
const RankingFramesRoute = require("./server/rank-frame/rank-frame.route");
route.use("/rank-frame", RankingFramesRoute);

//Official frames
const OfficialFramesRoute = require("./server/official-frames/official-frame.route");
route.use("/official-frame", OfficialFramesRoute);

//ranking frames
const RankingRoute = require("./server/Ranking/ranking.route");
route.use("/ranking", RankingRoute);

//gift route
const GiftRoute = require("./server/gift/gift.route");
route.use("/gift", GiftRoute);

//setting route
const SettingRoute = require("./server/setting/setting.route");
route.use("/setting", SettingRoute);

//live streaming history route
const LiveStreamingHistoryRoute = require("./server/liveStreamingHistory/liveStreamingHistory.route");
route.use("/getStreamingSummary", LiveStreamingHistoryRoute);

//banner route
const BannerRoute = require("./server/banner/banner.route");
route.use("/banner", BannerRoute);

//reaction route
const reactionRoute = require("./server/reaction/reaction.route");
route.use("/reaction", reactionRoute);

//coinPlan route
const CoinPlanRoute = require("./server/coinPlan/coinPlan.route");
route.use("/coinPlan", CoinPlanRoute);

//vipPlan route
const VIPPlanRoute = require("./server/vipPlan/vipPlan.route");
route.use("/vipPlan", VIPPlanRoute);

//gift category route
const GiftCategoryRoute = require("./server/giftCategory/giftCategory.route");
route.use("/giftCategory", GiftCategoryRoute);

//fake comment route
const FakeCommentRoute = require("./server/fakeComment/fakeComment.route");
route.use("/fakeComment", FakeCommentRoute);

//location route
const LocationRoute = require("./server/location/location.route");
route.use("/location", LocationRoute);

//song route
const SongRoute = require("./server/song/song.route");
route.use("/song", SongRoute);

//hashtag route
const HashtagRoute = require("./server/hashtag/hashtag.route");
route.use("/hashtag", HashtagRoute);

//level route
const LevelRoute = require("./server/level/level.route");
route.use("/level", LevelRoute);

//complain route
const ComplainRoute = require("./server/complain/complain.route");
route.use("/complain", ComplainRoute);

//advertisement route
const AdvertisementRoute = require("./server/advertisement/advertisement.route");
route.use("/advertisement", AdvertisementRoute);

//theme route
const ThemeRoute = require("./server/theme/theme.route");
route.use("/theme", ThemeRoute);

//redeem route
const RedeemRoute = require("./server/redeem/redeem.route");
route.use("/redeem", RedeemRoute);

//report route
const ReportRoute = require("./server/report/report.route");
route.use("/report", ReportRoute);

//gameAdminCoin route
const gameAdminCoinRoute = require("./server/gameAdminCoin/gameAdminCoin.route");
route.use("/gameAdminCoin", gameAdminCoinRoute);

//sticker route
const StickerRoute = require("./server/sticker/sticker.route");
route.use("/sticker", StickerRoute);

//pkGiftHistory route
const PkGiftHistoryRoute = require("./server/pkGiftHistory/pkGiftHistory.route");
route.use("/pkGiftHistory", PkGiftHistoryRoute);

//follower route
const FollowerRoute = require("./server/follower/follower.route");
route.use("/follower", FollowerRoute);

//notification route
const NotificationRoute = require("./server/notification/notification.route");
route.use("/notification", NotificationRoute);

const agencyRoute = require("./server/agency/agency.route");
route.use("/agency", agencyRoute);

const coinSellerRoute = require("./server/coinSeller/coinSeller.route");
route.use("/coinSeller", coinSellerRoute);

const coinSellerHistoryRoute = require("./server/coinSellerHistory/coinSellerHistory.route");
route.use("/coinSellerHistory", coinSellerHistoryRoute);

const hostRequestRoute = require("./server/hostRequest/hostRequest.route");
route.use("/hostRequest", hostRequestRoute);

const hostRoute = require("./server/host/host.route");
route.use("/host", hostRoute);

const agencyRedeemRoute = require("./server/agencyRedeem/agencyRedeem.route");
route.use("/agencyRedeem", agencyRedeemRoute);

const paymentMethodRoute = require("./server/paymentMethod/paymentMethod.route");
route.use("/paymentMethod", paymentMethodRoute);

const blockRoute = require("./server/block/block.route");
route.use("/block", blockRoute);

const currencyRoute = require("./server/currency/currency.route");
route.use("/currency", currencyRoute);

//login route
const LoginRoute = require("./server/login/login.route");
route.use("/", LoginRoute);

//salary setting route
const SalarySettingRoute = require("./server/salarySettings/salarySetting.route");
route.use("/salarySetting", SalarySettingRoute);

//salary setting route
const SalarySheetRoute = require("./server/salarySheet/salarySheet.route");
route.use("/salarySheet", SalarySheetRoute);

const ProfileBgRoute = require("./server/profileBg/profileBg.route");
route.use("/profile-bg", ProfileBgRoute);

const EntryBannerRoute = require("./server/entryBanner/entryBanner.route");
route.use("/entry-banner", EntryBannerRoute);

const RewardRoute = require("./server/reward/reward.route");
route.use("/reward", RewardRoute);

const CPRewardRoute = require("./server/cpReward/cpReward.route");
route.use("/cp-reward", CPRewardRoute);

const UploadTagRoute = require("./server/upload-tag/upload-tag.route");
route.use("/upload-tag", UploadTagRoute);

const UploadBadgeRoute = require("./server/upload-badge/upload-badge.route");
route.use("/upload-badge", UploadBadgeRoute);

const SudRoute = require("./server/sud/sud.route");
route.use("/sud", SudRoute);

const AnnouncementRoute = require("./server/announcements/announcements.route");
route.use("/announcement", AnnouncementRoute);

const SignRewardRoute = require("./server/signReward/signReward.route");
route.use("/sign-reward", SignRewardRoute);

const withdrawalRoute = require("./server/withdrawal/withdrawal.route");
route.use("/withdrawal", withdrawalRoute);
route.use("/withdrawl", withdrawalRoute);

const FansRankingRoute = require("./server/fansRanking/fansRanking.route");
route.use("/fansRanking", FansRankingRoute);

const MonthlyEarningRoute = require("./server/monthlyEarning/monthlyEarning.route");
route.use("/monthlyEarning", MonthlyEarningRoute);
module.exports = route;
