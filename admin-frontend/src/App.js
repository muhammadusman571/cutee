import React, { Suspense, useEffect, useState } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Redux
import { useDispatch, useSelector } from "react-redux";
// Types
import { SET_ADMIN, UNSET_ADMIN } from "./store/admin/types";

import { IdleTimeoutManager } from "idle-timer-manager";

// Components
import Login from "./pages/LoginPage";
import UnlockScreenPage from "./pages/UnlockScreenPage";
import Page404 from "./pages/Page404";
import Admin from "./pages/Admin";
import AuthRouter from "./util/AuthRouter";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import Registration from "./pages/Registration";
import UpdateCode from "./pages/UpdateCode";
import Spinner from "./pages/Spinner";
import DeleteAccountPage from "./pages/DeleteAccount";
import axios from "axios";
import socket from "./util/socket";
import { toast } from "react-toastify";
import AgencyRegistrationPage from "./pages/AgencyRegistration";
import Seller from "./pages/Seller";

function App() {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.admin);
  // const isAuth = sessionStorage.getItem("isAuth");
  const token = localStorage.getItem("TOKEN");
  const key = localStorage.getItem("KEY");
  const [login, setLogin] = useState(true);

  useEffect(() => {
    axios
      .get("/login")
      .then((res) => {
        setLogin(res.data.login);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log(token, key, isAuth);
    if (token && key && isAuth) {
      dispatch({ type: SET_ADMIN, payload: token });
    }
  }, [dispatch, isAuth, token, key]);

  useEffect(() => {
    const manager = new IdleTimeoutManager({
      timeout: 1800, // 30 minutes
      onExpired: () => {
        dispatch({ type: UNSET_ADMIN });
        window.location.href = "/";
      },
    });

    return () => {
      manager.clear();
    };
  }, [dispatch]);

  // useEffect(() => {
  //   // connect event
  //   socket.on("connect", () => {
  //     console.log("✅ Connected to socket:", socket.id);
  //   });
  //   socket.on("updateReceiverCoins", (data) => {
  //     toast.info(`receiver coins update: ${data.id} → ${data.coins}`);
  //   });
  //   // listen for your backend events
  //   socket.on("globalGift", (data) => {
  //     console.log("🎁 Global Gift:", data);
  //     toast.info(`Global Gift: ${data.senderName} → ${data.receiverName}`);
  //     // setMessages((prev) => [...prev, `Global Gift: ${data.senderName} → ${data.receiverName}`]);
  //   });
  //   socket.on("debugSockets", (data) => {
  //     console.log("🎁 debugSockets:", data);
  //     toast.info(`debugSockets: ${data}`);
  //     // setMessages((prev) => [...prev, `Global Gift: ${data.senderName} → ${data.receiverName}`]);
  //   });
  //   socket.on("userLeftTheRoom", (data) => {
  //     console.log("🚪 User Left The Room:", data);
  //     toast.info(`User Left The Room: ${data.userId}`);
  //     // setMessages((prev) => [...prev, `User Left The Room: ${data.userId}`]);
  //   });
  //   socket.on("gift", (data, sender, receiver, senderName) => {
  //     console.log("💎 Gift Event:", { data, sender, receiver, senderName });
  //     // setMessages((prev) => [...prev, `Gift from ${senderName}`]);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("❌ Disconnected from socket");
  //   });

  //   return () => {
  //     socket.off("globalGift");
  //     socket.off("gift");
  //     socket.off("connect");
  //     socket.off("disconnect");
  //   };
  // }, []);

  return (
    <div className="App">
      <Suspense fallback={null}>
        <BrowserRouter>
          <Routes>
            {login === true ? (
              <Route path="/" element={<Login />} />
            ) : (
              <Route path="/" element={<Registration />} />
            )}
            {login && <Route path="/login" element={<Login />} />}

            {login === false && (
              <Route path="/registration" element={<Registration />} />
            )}
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/changePassword/:id" element={<ChangePassword />} />

            <Route path="/unlock" element={<UnlockScreenPage />} />

            {/* Registration and Code Update (if needed) */}
            <Route path="/registration" element={<Registration />} />
            <Route
              path="/agency-registration"
              element={<AgencyRegistrationPage />}
            />
            <Route path="/code" element={<UpdateCode />} />
            <Route path="/delete-account" element={<DeleteAccountPage />} />

            <Route element={<AuthRouter />}>
              <Route path="/admin/*" element={<Admin />} />
            </Route>
            <Route element={<AuthRouter />}>
              <Route path="/seller/*" element={<Seller />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Page404 />} />
          </Routes>
          <Spinner />
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
