import React, { useEffect } from "react";

// js
import "../assets/js/main.min.js";

// router
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// css
import "../assets/css/main.min.css";
import "../assets/css/custom.css";

// components
import Navbar from "../component/navbar/Navbar.js";
import Topnav from "../component/navbar/Topnav.js";

import { useCurrentUser } from "../context/CurrentUser.js";
import { ROLES } from "../util/roles.js";
import ProtectedRoute from "../component/ProtactedRoutes.js";

import SubCoinSeller from "./SubCoinSeller.js";
import User from "./User.js";
import SuperSellerCoinHistory from "./SuperSellerCoinHistory.js";
import SellerCoinHistory from "./SellerCoinHistory.js";

const Seller = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname === "/seller" ||
      location.pathname === "/seller/sub-coin-seller"
    ) {
      navigate("/seller/sub-coin-seller");
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
                path="/sub-coin-seller"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.SUPER_COIN_SELLER]}>
                    <SubCoinSeller />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/user"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      ROLES.SUPER_COIN_SELLER,
                      ROLES.SUB_COIN_SELLER,
                    ]}
                  >
                    <User />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coin-history"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      ROLES.SUPER_COIN_SELLER,
                      ROLES.SUB_COIN_SELLER,
                    ]}
                  >
                    <SellerCoinHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sub-history/:id"
                element={<SuperSellerCoinHistory />}
              />
            </Routes>
            SubSellerList
          </div>
        </div>
      </div>
    </>
  );
};

export default Seller;
