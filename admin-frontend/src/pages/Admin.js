import React, { useEffect } from "react";

// js
import "../assets/js/main.min.js";

// router
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// css
import "../assets/css/main.min.css";
import "../assets/css/custom.css";

// components
import Navbar from "../component/navbar/Navbar";
import Topnav from "../component/navbar/Topnav";
import CoinPlanTable from "../component/table/CoinPlan";
import PurchaseCoinPlanHistoryTable from "../component/table/PurchaseCoinPlanHistory";
import VIPPlanTable from "../component/table/VIPPlan";
import PurchaseVIPPlanTable from "../component/table/PurchaseVipPlanHistory";
import GiftCategoryTable from "../component/table/GiftCategory";
import GiftTable from "../component/table/Gift";
import SongTable from "../component/table/Song";
import SongDialog from "../component/dialog/Song";
import GameTable from "../component/table/Game";
import GiftDialog from "../component/dialog/Gift/Add";
import HashtagTable from "../component/table/Hashtag";
import LevelTable from "../component/table/Level";
import UserTable from "../component/table/User";
import BlockedUserTable from "../component/table/BlockedUser";
import PostTable from "../component/table/Post";
import VideoTable from "../component/table/Video";
import UserDetail from "./UserDetail";
import UserHistory from "./UserHistory";
import PostDetail from "./PostDetail";
import VideoDetail from "./VideoDetail";
import Dashboard from "./Dashboard";
import Setting from "./Settings";
import ThemeTable from "../component/table/Theme";
import Advertisement from "../component/table/Advertisement";
import ReportedUserTable from "../component/table/ReportedUser";
import AnnouncementTable from "../component/table/Announcement.js";
import StickerTable from "../component/table/Sticker";
import FakeUser from "../component/table/FakeUser";
import FakeUserPage from "../component/dialog/FakeUserPage";
import Banner from "../component/table/Banner";
import Reaction from "../component/table/Reaction";
import Profile from "./Profile";
import GameHistory from "../component/table/GameHistory";
import Avatar from "../component/table/Avatar";
import AdmissionCar from "../component/table/AdmissionCar";
import UserRedeemRequest from "../component/table/userRedeem/UserRedeemRequest";
import HostRequest from "../component/table/hostRequest/HostRequest";
import CoinSeller from "./CoinSeller";
import CoinSellerHistory from "../component/table/CoinSellerHistory";

import FakePost from "../component/table/FakePost.js";
import FakeComment from "../component/table/FakeComment.js";
import FakeVideo from "../component/table/FakeVideo.js";
import Agency from "./Agency";
import AgencyWiseHost from "./AgencyWiseHost";
import AgencyRedeemRequest from "../component/table/agencyRedeem/AgencyRedeemRequest";
import AgencyHistory from "./AgencyHistory.js";
import ComplainRequest from "../component/table/complain/ComplainRequest";
import FakePkUserPage from "../component/dialog/FakePkUserPage.js";
import FakeAudioUserPage from "../component/dialog/FakeAudioUserPage.js";
import FakePostPage from "../component/dialog/FakePostPage.js";
import FakeVideoPage from "../component/dialog/FakeVideoPage.js";
import MainPost from "./MainPost.js";
import MainVideo from "./MainVideo.js";
import MainPlan from "./MainPlan.js";
import PlanHistory from "./PlanHistory.js";
import Host from "../component/table/Host.js";
import Svip from "../component/table/Svip.js";
import RankingFrames from "../component/table/RankingFrames.js";
import AdminList from "./AdminList.js";
import SalarySettings from "./SalarySetting.js";
import OfficialFrames from "./OfficialFrames.js";
import Rooms from "./Rooms.js";
import { useCurrentUser } from "../context/CurrentUser.js";
import { ROLES } from "../util/roles.js";
import ProtectedRoute from "../component/ProtactedRoutes.js";
import RewardDistribution from "./RewardDistribution.js";
import EntryBanner from "../component/table/EntryBanner.js";
import ProfileBG from "../component/table/ProfileBG.js";
import CPReward from "../component/table/CPReward.js";
import { Upload } from "antd";
import UploadTag from "./UploadTag.js";
import UploadBadge from "./UploadBadge.js";
import SignReward from "../component/table/SignReward.js";
import CoinSellerList from "./SuperCoinSeller.js";
import WithdrawalRequest from "./WithdrawalRequestAdmin.js";

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile: user } = useCurrentUser();

  const hasAccess = (allowedRoles = []) => {
    if (!user?.role) return false;
    if (user.role === "owner") return true; // owner can see everything
    return allowedRoles.includes(user.role);
  };

  useEffect(() => {
    if (
      location.pathname === "/admin" ||
      location.pathname === "/admin/dashboard"
    ) {
      navigate("/admin/dashboard");
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <div className="page-container">
        <Navbar />
        <div className="page-content">
          <Topnav />
          <div className="main-wrapper">
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/rooms"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <Rooms />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rewardDistribution"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <RewardDistribution />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admins-list"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                    <AdminList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coin-seller"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                    <CoinSellerList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/withdrawal-request"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.OWNER]}>
                    <WithdrawalRequest />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/banner"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <Banner />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/adminProfile"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/mainPlan"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <MainPlan />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/coinplan"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <CoinPlanTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/vipplan"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <VIPPlanTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/planHistory"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <PlanHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/coinplan/history"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <PurchaseCoinPlanHistoryTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/vipplan/history"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <PurchaseVIPPlanTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/giftCategory"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <GiftCategoryTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/gameHistory"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <GameHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reaction"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <Reaction />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/comment"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <FakeComment />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/agency"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <Agency />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/agencyHistory"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <AgencyHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/agencyRedeemRequest"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <AgencyRedeemRequest />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/agency/agencyWiseHost"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <AgencyWiseHost />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/theme"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <ThemeTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/fake/fakeUserdialog"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <FakeUserPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/fake/fakePkUserdialog"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <FakePkUserPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/fake/fakeAudioUserdialog"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <FakeAudioUserPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/gift"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <GiftTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/gift/dialog"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <GiftDialog />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/song"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <SongTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/song/dialog"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <SongDialog />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hashtag"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <HashtagTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/level"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <LevelTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <UserTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/blockedUser"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <BlockedUserTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/fakeUser"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <FakeUser />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/user/detail"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <UserDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/user/history"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <UserHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/mainPost"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <MainPost />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/post"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <PostTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/post/fake"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <FakePost />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/post/detail"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <PostDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/post/dialog"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <FakePostPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/mainVideo"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <MainVideo />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/video"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <VideoTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/video/fake"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <FakeVideo />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/video/detail"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <VideoDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/video/dialog"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <FakeVideoPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/setting"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <Setting />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/salary-settings"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <SalarySettings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reportedUser"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <ReportedUserTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/announcement"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <AnnouncementTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/advertisement"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <Advertisement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/coinSeller"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <CoinSeller />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/coinSeller/history"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <CoinSellerHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/userRedeemRequest"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <UserRedeemRequest />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hostRequest"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <HostRequest />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/host"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <Host />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sticker"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <StickerTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/svip"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <Svip />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ranking-frames"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <RankingFrames />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cp-reward"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <CPReward />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/official-frames"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <OfficialFrames />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload-tag"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <UploadTag />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload-badge"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <UploadBadge />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/avatarFrame"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <Avatar />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/entryEffect"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <AdmissionCar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entryBanner"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <EntryBanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profileBG"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <ProfileBG />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sign-reward"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <SignReward />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/game"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <GameTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/complainRequest"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <ComplainRequest />
                  </ProtectedRoute>
                }
              />

              <Route
                path="*"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
