import { combineReducers } from "redux";

import adminReducer from "./admin/reducer";
import coinPlanReducer from "./coinPlan/reducer";
import vipPlanReducer from "./vipPlan/reducer";
import giftCategoryReducer from "./giftCategory/reducer";
import spinnerReducer from "./spinner/reducer";
import giftReducer from "./gift/reducer";
import songReducer from "./song/reducer";
import hashtagReducer from "./hashtag/reducer";
import hostReducer from "./host/reducer";
import levelReducer from "./level/reducer";
import redeemOptReducer from "./redeemOptions/reducer";
import userReducer from "./user/reducer";
import postReducer from "./post/reducer";
import videoReducer from "./video/reducer";
import followerReducer from "./follower/reducer";
import settingReducer from "./setting/reducer";
import advertisementReducer from "./advertisement/reducer";
import complainReducer from "./complain/reducer";
import redeemReducer from "./redeem/reducer";
import dashboardReducer from "./dashboard/reducer";
import reportedUserReducer from "./reportedUser/reducer";
import stickerReducer from "./sticker/reducer";
import themeReducer from "./Theme/theme.reducer";
import fakeUserReducer from "./FakeUser/Reducer";
import fakeCommentReducer from "./fakeComment/reducer";
import { gameHistoryReducer } from "./GameHistory/reducer";
import { admissionSVGAReducer } from "./AdmissionCar/reducer";
import { avatarFrameReducer } from "./AvatarFrame/reducer";
import gameReducer from "./game/reducer";
import agencyReducer from "./agency/reducer";
import hostRequestReducer from "./hostRequest/reducer";
import commissionReducer from "./commision/reducer";
import hostCommissionReducer from "./hostCommision/reducer";
import { coinSellerReducer } from "./coinSeller/reducer";
import bannerReducer from "./banner/reducer";
import reactionReducer from "./reaction/reducer";
import agencyRedeemReducer from "./agenyRedeem/reducer";
import notificationReducer from "./notification/reducer";
import currencyReducer from "./currency/reducer";
import { svipReducer } from "./Svip/reducer";
import { rankingFrameReducer } from "./RankingFrame/reducer";
import { salarySettingReducer } from "./salarySettings/reducer";
import { officialFrameReducer } from "./OfficialFrames/reducer";
import roomReducer from "./rooms/reducer";
import { rewardReducer } from "./RewardDistribution/reducer";
import { entryBannerReducer } from "./EntryBanner/reducer";
import { profileBgReducer } from "./ProfileBG/reducer";
import { cpRewardReducer } from "./CPReward/reducer";
import { uploadTagReducer } from "./uploadTage/reducer";
import { uploadBadgeReducer } from "./uploadBadge/reducer";
import announcementReducer from "./Announcement/announcement.reducer";
import { signRewardReducer } from "./SignReward/reducer";
import superCoinSellerReducer from "./super-coin-seller/reducer";
import subCoinSellerReducer from "./seller/reducer";
import usersReducer from "./uuser/reducer";
import withdrawalReducer from "./withdrawal/reducer";

export default combineReducers({
  admin: adminReducer,
  superCoinSeller: superCoinSellerReducer,
  user: userReducer,
  post: postReducer,
  song: songReducer,
  gift: giftReducer,
  host: hostReducer,
  banner: bannerReducer,
  game: gameReducer,
  video: videoReducer,
  level: levelReducer,
  redeemOption: redeemOptReducer,
  sticker: stickerReducer,
  reaction: reactionReducer,
  complain: complainReducer,
  gameHistory: gameHistoryReducer,
  redeem: redeemReducer,
  report: reportedUserReducer,
  dashboard: dashboardReducer,
  hostRequest: hostRequestReducer,
  hashtag: hashtagReducer,
  followersFollowing: followerReducer,
  giftCategory: giftCategoryReducer,
  vipPlan: vipPlanReducer,
  coinPlan: coinPlanReducer,
  setting: settingReducer,
  advertisement: advertisementReducer,
  spinner: spinnerReducer,
  fakeUser: fakeUserReducer,
  Comment: fakeCommentReducer,
  theme: themeReducer,
  admissionSVGA: admissionSVGAReducer,
  cpReward: cpRewardReducer,
  entryBanner: entryBannerReducer,
  profileBG: profileBgReducer,
  signReward: signRewardReducer,
  avatarFrame: avatarFrameReducer,
  agency: agencyReducer,
  commision: commissionReducer,
  hostCommision: hostCommissionReducer,
  coinSeller: coinSellerReducer,
  subCoinSeller: subCoinSellerReducer,
  users: usersReducer,
  agencyRedeem: agencyRedeemReducer,
  notification: notificationReducer,
  currency: currencyReducer,
  svip: svipReducer,
  rankingFrame: rankingFrameReducer,
  salarySetting: salarySettingReducer,
  officialFrames: officialFrameReducer,
  uploadTag: uploadTagReducer,
  uploadBadge: uploadBadgeReducer,
  roomReducer: roomReducer,
  rewardReducer: rewardReducer,
  announcement: announcementReducer,
  withdrawal: withdrawalReducer,
});
