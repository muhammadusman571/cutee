import React from "react";
import { MdNotificationsActive } from "react-icons/md";

// images
import Card1 from "../../assets/images/card.jpeg";
import Card2 from "../../assets/images/card2.jpg";

// routing
import { Link } from "react-router-dom";

// alert
import { warning } from "../../util/Alert";

// jquery
import $ from "jquery";

// redux
import { useDispatch, useSelector } from "react-redux";

// types
import { UNSET_ADMIN } from "../../store/admin/types";

//serverpath
import { baseURL } from "../../util/Config";
import { connect } from "react-redux";

import { getProfile } from "../../store/admin/action";
import { useEffect, useState } from "react";

//modl
import { OPEN_NOTIFICATION_DIALOG } from "../../store/notification/types";
import NotificationDialog from "../dialog/NotificationDialog";


const Topnav = (props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => setModalOpen(false);

  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin.admin);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleDrawer = () => {
    $(".profile-drop-menu").toggleClass("show");
  };

  const closePopup = () => {
    $("body").removeClass("activity-sidebar-show");
  };

  const handleLogout = () => {
    const data = warning();
    data.then((isLogout) => {
      if (isLogout) {
        dispatch({ type: UNSET_ADMIN });
        window.location.href = "/";
      }
    });
  };

  const handleOpen = () => {
   

    dispatch({ type: OPEN_NOTIFICATION_DIALOG });
  };



  return (
    <>
      <div className="page-header">
        <nav className="navbar navbar-expand-lg d-flex justify-content-between">
          <div className="header-title flex-fill">
            <a href={() => false} id="sidebar-toggle">
              <i data-feather="arrow-left"></i>
            </a>
          </div>

          <div className="d-flex align-items-center ">
            <div className="col-xs-12 col-sm-12 mt-3 col-md-6 col-lg-8 float-left">
              <button
                type="button"
                className="btn waves-effect waves-light btn-danger btn-sm float-left"
                onClick={handleOpen}
               
              >
                <span className="icon_margin"><MdNotificationsActive size={20}/></span>
              </button>
              
            </div>
            <div className="flex-fill" id="headerNav">

              <ul className="navbar-nav">

                <li className="nav-item dropdown mb-2" onClick={handleDrawer}>
                  <a
                    className="nav-link profile-dropdown"
                    href={() => false}
                    id="profileDropDown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={admin?.image ? baseURL + admin?.image : Card1}
                      alt="profile"
                      style={{ width: "30px", height: "30px" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = Card1;
                      }}
                    />
                 
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-end profile-drop-menu"
                    aria-labelledby="profileDropDown"
                    style={{ right: 0, left: "auto" }}
                  >
                    <Link
                      className="dropdown-item"
                      to="/admin/adminProfile"
                      onClick={handleDrawer}
                    >
                      <i data-feather="user"></i>Profile
                    </Link>

                    <div className="dropdown-divider"></div>
                    <Link
                      className="dropdown-item"
                      to="/admin/setting"
                      onClick={handleDrawer}
                    >
                      <i data-feather="settings"></i>Settings
                    </Link>

                    <a
                      href={() => false}
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      <i data-feather="log-out"></i>Logout
                    </a>
                  </div>
                </li>
              </ul>
            </div></div>
        </nav>
        <NotificationDialog/>
      </div>

      <div className="activity-sidebar-overlay"></div>

    </>
  );
};

export default connect(null, { getProfile })(Topnav);
