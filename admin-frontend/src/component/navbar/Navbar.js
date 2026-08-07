import React, { useEffect } from "react";
import { NavLink as Link, useNavigate } from "react-router-dom";
import { warning } from "../../util/Alert";
import { useDispatch } from "react-redux";
import { UNSET_ADMIN } from "../../store/admin/types";
import $ from "jquery";
import { projectName } from "../../util/Config";
import { useCurrentUser } from "../../context/CurrentUser";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile: user } = useCurrentUser();

  const handleLogout = () => {
    const data = warning();
    data.then((isLogout) => {
      if (isLogout) {
        dispatch({ type: UNSET_ADMIN });
        navigate("/");
      }
    });
  };

  useEffect(() => {
    $("").addClass("submenu-margin");
  }, []);

  const hasAccess = (allowedRoles = []) => {
    if (!user?.role) return false;
    if (user.role === "owner") return true; // owner can see everything
    return allowedRoles.includes(user.role);
  };

  const hasAccessForSeller = (allowedRoles = []) => {
    if (!user?.role) return false;

    return allowedRoles.includes(user.role);
  };
  return (
    <>
      <div className="page-sidebar">
        <Link to="/admin/dashboard">
          <span className="logo text-danger text-capitalize">
            {projectName}
          </span>
        </Link>

        <ul className="list-unstyled accordion-menu">
          {/* Dashboard */}
          {hasAccess(["owner", "management"]) && (
            <li
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Dashboard"
            >
              <Link to="/admin/dashboard" className="nav-link">
                <span className="sidenav__icon">
                  <i data-feather="activity"></i>
                </span>
                Dashboard
              </Link>
            </li>
          )}

          {/* Banner */}
          {hasAccess(["owner"]) && (
            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Banner">
              <Link to="/admin/banner" className="nav-link">
                <span className="sidenav__icon">
                  <i data-feather="image"></i>
                </span>
                Banner
              </Link>
            </li>
          )}

          {hasAccess(["owner", "management"]) && (
            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Theme">
              <Link to="/admin/theme" className="nav-link">
                <span className="sidenav__icon">
                  <i data-feather="image"></i>
                </span>
                Theme
              </Link>
            </li>
          )}
          {/* Admins - only super_admin and owner */}
          {hasAccess(["super_admin"]) && (
            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Admins">
              <Link to="/admin/admins-list" className="nav-link">
                <span className="sidenav__icon">
                  <i className="fas fa-user-shield"></i>
                </span>
                Admins
              </Link>
            </li>
          )}

          {hasAccessForSeller(["super_coin"]) && (
            <li
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Coin Seller"
            >
              <Link to="/seller/sub-coin-seller" className="nav-link">
                <span className="sidenav__icon">
                  <i className="fas fa-user-shield"></i>
                </span>
                Sub Coin Seller
              </Link>
            </li>
          )}

          {hasAccessForSeller(["super_coin", "sub_coin_seller"]) && (
            <li data-bs-toggle="tooltip" data-bs-placement="top" title="User">
              <Link to="/seller/user" className="nav-link">
                <span className="sidenav__icon">
                  <i className="fas fa-user-shield"></i>
                </span>
                User
              </Link>
            </li>
          )}

          {hasAccessForSeller(["super_coin", "sub_coin_seller"]) && (
            <li title="Coin History">
              <Link to="/seller/coin-history" className="nav-link">
                <span className="sidenav__icon"></span>
                Coin History
              </Link>
            </li>
          )}

          {hasAccess(["owner"]) && (
            <li
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Coin Seller"
            >
              <Link to="/admin/coin-seller" className="nav-link">
                <span className="sidenav__icon">
                  <i className="fas fa-user-shield"></i>
                </span>
                Coin Seller
              </Link>
            </li>
          )}

          {/* {hasAccessForSeller(["super_coin", "sub_coin_seller"]) && (
            <li
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Withdrawal Request"
            >
              <Link to="/seller/withdrawal-request" className="nav-link">
                <span className="sidenav__icon">
                  <i className="fas fa-wallet"></i>
                </span>
                Withdrawal Request
              </Link>
            </li>
          )} */}

          {/* {hasAccess(["owner"]) && (
            <li
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Withdrawal Request"
            >
              <Link to="/admin/withdrawal-request" className="nav-link">
                <span className="sidenav__icon">
                  <i className="fas fa-wallet"></i>
                </span>
                Withdrawal Request
              </Link>
            </li>
          )} */}

          {hasAccess(["owner"]) && (
            <li
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Withdrawal Request"
              className="pointer-cursor"
            >
              <a
                href={() => false}
                className="add-collapse-margin"
                style={{ marginLeft: 0 }}
              >
                <span className="sidenav__icon">
                  <i data-feather="image"></i>
                </span>
                Withdrawal Request
                <i className="fas fa-chevron-right dropdown-icon"></i>
              </a>
              <ul>
                <li>
                  <Link to="/admin/withdrawal-request" className="nav-link">
                    <i className="fas fa-wallet"></i>User Withdrawal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/seller-withdrawal-request"
                    className="nav-link"
                  >
                    <i className="fas fa-wallet"></i>Seller Withdrawal
                  </Link>
                </li>
              </ul>
            </li>
          )}
          {/* User */}
          {hasAccess(["owner", "management"]) && (
            <li
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="User"
              className="pointer-cursor"
            >
              <a
                href={() => false}
                className="add-collapse-margin"
                style={{ marginLeft: 0 }}
              >
                <span className="sidenav__icon">
                  <i data-feather="users"></i>
                </span>
                User
                <i className="fas fa-chevron-right dropdown-icon"></i>
              </a>
              <ul>
                <li>
                  <Link to="/admin/user" className="nav-link">
                    <i className="far fa-circle"></i>Real
                  </Link>
                </li>
                <li>
                  <Link to="/admin/blockedUser" className="nav-link">
                    <i className="far fa-circle"></i>Blocked
                  </Link>
                </li>
                <li>
                  <Link to="/admin/fakeUser" className="nav-link">
                    <i className="far fa-circle"></i>Fake
                  </Link>
                </li>
              </ul>
            </li>
          )}

          {/* Host */}
          {hasAccess(["admin", "super_admin"]) && (
            <li
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Host"
              className="pointer-cursor"
            >
              <a
                href={() => false}
                className="add-collapse-margin"
                style={{ marginLeft: 0 }}
              >
                <span className="sidenav__icon">
                  <i data-feather="user-check"></i>
                </span>
                Host
                <i className="fas fa-chevron-right dropdown-icon"></i>
              </a>
              <ul>
                <li>
                  <Link to="/admin/host" className="nav-link">
                    <i className="far fa-circle"></i>Host
                  </Link>
                </li>
                <li>
                  <Link to="/admin/hostRequest" className="nav-link">
                    <i className="far fa-circle"></i>Host Request
                  </Link>
                </li>
              </ul>
            </li>
          )}

          {/* Agency */}
          {hasAccess(["admin", "super_admin"]) && (
            <li
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Agency"
              className="pointer-cursor"
            >
              <a
                href={() => false}
                className="add-collapse-margin"
                style={{ marginLeft: 0 }}
              >
                <span className="sidenav__icon">
                  <i data-feather="image"></i>
                </span>
                Agency
                <i className="fas fa-chevron-right dropdown-icon"></i>
              </a>
              <ul>
                <li>
                  <Link to="/admin/agency" className="nav-link">
                    <i className="far fa-circle"></i>Agency
                  </Link>
                </li>
                <li>
                  <Link to="/admin/agencyHistory" className="nav-link">
                    <i className="far fa-circle"></i>Agency History
                  </Link>
                </li>
                <li>
                  <Link to="/admin/agencyRedeemRequest" className="nav-link">
                    <i className="far fa-circle"></i>Agency Redeem
                  </Link>
                </li>
              </ul>
            </li>
          )}

          {/* Rest of the links — owner sees all */}
          {hasAccess(["owner", "management"]) && (
            <>
              {hasAccess(["owner"]) && (
                <li
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Coin Seller"
                >
                  <Link to="/admin/coinSeller" className="nav-link">
                    <span className="sidenav__icon">
                      <i data-feather="dollar-sign"></i>
                    </span>
                    Coin Seller
                  </Link>
                </li>
              )}
              <li>
                <Link to="/admin/userRedeemRequest" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="key"></i>
                  </span>
                  User Redeem
                </Link>
              </li>
              <li>
                <Link to="/admin/rooms" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="key" className="fa fa-stream"></i>
                  </span>
                  Live Rooms
                </Link>
              </li>
              <li>
                <Link to="/admin/rewardDistribution" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="key"></i>
                  </span>
                  Reward Distribution
                </Link>
              </li>

              <li>
                <Link to="/admin/mainPlan" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="layout"></i>
                  </span>
                  Plan
                </Link>
              </li>
              <li>
                <Link to="/admin/planHistory" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="clock"></i>
                  </span>
                  Plan History
                </Link>
              </li>
              {hasAccess(["owner"]) && (
                <li
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Game History"
                >
                  <Link
                    to="/admin/game"
                    className="nav-link"
                    style={{ display: "flex" }}
                  >
                    <span
                      className="sidenav__icon"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <i
                        className="far fa-gamepad"
                        style={{ fontSize: "23px" }}
                      ></i>
                    </span>
                    <span> Game</span>
                  </Link>
                </li>
              )}
              <li>
                <Link to="/admin/gameHistory" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="hash"></i>
                  </span>
                  Game History
                </Link>
              </li>
              <li className="pointer-cursor">
                <a
                  href={() => false}
                  className="add-collapse-margin"
                  style={{ marginLeft: 0 }}
                >
                  <span className="sidenav__icon">
                    <i data-feather="gift"></i>
                  </span>
                  Gift <i className="fas fa-chevron-right dropdown-icon"></i>
                </a>
                <ul>
                  <li>
                    <Link
                      to="/admin/giftCategory"
                      className="nav-link"
                      onClick={() => sessionStorage.removeItem("GiftClick")}
                    >
                      <i className="far fa-circle"></i>Category
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/gift"
                      className="nav-link"
                      onClick={() => sessionStorage.setItem("GiftClick", true)}
                    >
                      <i className="far fa-circle"></i>Gift
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/admin/reaction" className="nav-link">
                  <span className="sidenav__icon">
                    <i className="far fa-smile-wink"></i>
                  </span>
                  Reaction
                </Link>
              </li>
              <li>
                <Link to="/admin/svip" className="nav-link">
                  <span className="sidenav__icon">
                    <i className="far fa-user-crown"></i>
                  </span>
                  SVIP
                </Link>
              </li>
              <li>
                <Link to="/admin/ranking-frames" className="nav-link">
                  <span className="sidenav__icon">
                    <i className="far fa-medal"></i>
                  </span>
                  Ranking Frame's
                </Link>
              </li>

              <li>
                <Link to="/admin/sign-reward" className="nav-link">
                  <span className="sidenav__icon">
                    <i className="far fa-medal"></i>
                  </span>
                  Sign Reward
                </Link>
              </li>
              <li className="pointer-cursor">
                <a
                  href={() => false}
                  className="add-collapse-margin"
                  style={{ marginLeft: 0 }}
                >
                  <span className="sidenav__icon">
                    <i data-feather="loader"></i>
                  </span>
                  Store <i className="fas fa-chevron-right dropdown-icon"></i>
                </a>
                <ul>
                  <li>
                    <Link to="/admin/entryEffect" className="nav-link">
                      <i className="far fa-circle"></i>Entry Effect
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/avatarFrame" className="nav-link">
                      <i className="far fa-circle"></i>Avatar Frame
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/entryBanner" className="nav-link">
                      <i className="far fa-circle"></i>Entry Banner
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/profileBG" className="nav-link">
                      <i className="far fa-circle"></i>Profile BG
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/admin/cp-reward" className="nav-link">
                  <span className="sidenav__icon"></span>
                  CP Reward
                </Link>
              </li>
              <li>
                <Link to="/admin/official-frames" className="nav-link">
                  <span className="sidenav__icon">
                    <i className="far fa-gift"></i>
                  </span>
                  Official Frames
                </Link>
              </li>
              <li>
                <Link to="/admin/upload-tag" className="nav-link">
                  <span className="sidenav__icon">
                    <i className="far fa-gift"></i>
                  </span>
                  Upload Tag
                </Link>
              </li>
              <li>
                <Link to="/admin/upload-badge" className="nav-link">
                  <span className="sidenav__icon">
                    <i className="far fa-gift"></i>
                  </span>
                  Upload Badge
                </Link>
              </li>
              <li>
                <Link to="/admin/announcement" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="image"></i>
                  </span>
                  Announcement
                </Link>
              </li>
              <li>
                <Link to="/admin/song" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="music"></i>
                  </span>
                  Song
                </Link>
              </li>
              <li>
                <Link to="/admin/hashtag" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="hash"></i>
                  </span>
                  Hashtag
                </Link>
              </li>
              <li>
                <Link to="/admin/comment" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="message-circle"></i>
                  </span>
                  Fake Comment
                </Link>
              </li>
              <li>
                <Link to="/admin/level" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="bar-chart"></i>
                  </span>
                  Level
                </Link>
              </li>
              <li>
                <Link to="/admin/mainPost" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="maximize"></i>
                  </span>
                  Post
                </Link>
              </li>
              <li>
                <Link to="/admin/mainVideo" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="film"></i>
                  </span>
                  Video
                </Link>
              </li>
              <li>
                <Link to="/admin/reportedUser" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="flag"></i>
                  </span>
                  Reported User
                </Link>
              </li>
              <li>
                <Link to="/admin/complainRequest" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="help-circle"></i>
                  </span>
                  Complain Request
                </Link>
              </li>
              <li>
                <Link to="/admin/advertisement" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="book"></i>
                  </span>
                  Google Ad
                </Link>
              </li>
              <li>
                <Link to="/admin/Setting" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="settings"></i>
                  </span>
                  Setting
                </Link>
              </li>
              <li
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Salary Settings"
              >
                <Link to="/admin/salary-settings" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="dollar-sign"></i>
                  </span>
                  Salary Settings
                </Link>
              </li>
              <li>
                <Link to="/admin/announcement" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="flag"></i>
                  </span>
                  Announcement
                </Link>
              </li>
              <li>
                <Link to="/admin/adminProfile" className="nav-link">
                  <span className="sidenav__icon">
                    <i data-feather="user"></i>
                  </span>
                  Profile
                </Link>
              </li>
            </>
          )}

          {/* Logout */}
          <li data-bs-toggle="tooltip" data-bs-placement="top" title="Logout">
            <a
              href={() => false}
              onClick={handleLogout}
              className="add-collapse-margin cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <span className="sidenav__icon">
                <i data-feather="log-out"></i>
              </span>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
