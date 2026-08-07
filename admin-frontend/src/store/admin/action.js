import axios from "axios";
import { Toast } from "../../util/Toast";

import {
  ADMIN_ERROR,
  ACTIVE_INACTIVE_ADMIN,
  SET_ADMIN,
  SET_ADMINS,
  SIGNUP_ADMIN,
  UNSET_ADMIN,
  UPDATE_PROFILE,
  TOGGLE_MANAGEMENT_DIALOG,
} from "./types";
import { apiInstanceFetch } from "../../util/api";
import { projectName } from "../../util/Config";

// Fetch all admins
export const getAdmins =
  (page = 1, limit = 10, search = "", filter) =>
  async (dispatch) => {
    try {
      const res = await axios.get(
        `/admin/list?page=${page}&limit=${limit}&search=${search}&role=${filter}`,
      );
      console.log("admins", res.data);

      if (res.data.status) {
        dispatch({ type: ADMIN_ERROR, payload: null });
        dispatch({
          type: SET_ADMINS,
          payload: {
            admins: res.data.data.admins,
            total: res.data.data.pagination.total,
          },
        });
      } else {
        Toast("error", res.data.message);
        dispatch({ type: ADMIN_ERROR, payload: res.data.message });
      }
    } catch (err) {
      Toast("error", err.response.data.message || "Something went wrong");
      dispatch({
        type: ADMIN_ERROR,
        payload: err.response.data.message || "Something went wrong",
      });
    }
  };

// Approve admin
export const toggleAdminStatus = (id, status) => async (dispatch) => {
  try {
    const res = await axios.patch(`/admin/status/${id}`);
    if (res.data.status) {
      Toast("success", res.data.message || `Admin ${status} successfully!`);
      dispatch({ type: ACTIVE_INACTIVE_ADMIN, payload: res.data.admin });
    } else {
      Toast("error", res.data.message);
    }
  } catch (err) {
    Toast("error", err.message);
  }
};

export const signupAdmin = (signup) => (dispatch) => {
  axios
    .post("/admin/signup", signup)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: SIGNUP_ADMIN });
        Toast("success", "Signup Successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 10);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error);
    });
};

export const registerManagement = (signup) => (dispatch) => {
  axios
    .post("/admin/registerManagement", signup)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: SIGNUP_ADMIN });
        Toast("success", "Management created Successfully!");
        dispatch({ type: TOGGLE_MANAGEMENT_DIALOG });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message || "Something went wrong");
    });
};

export const login = (data) => (dispatch) => {
  axios
    .post("admin/login", data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", `You have successfully logged in ${projectName}`);
        if (res.data.role === "super_coin") {
          setTimeout(() => {
            window.location.href = "/seller/sub-coin-seller";
          }, 10);
        } else if (res.data.role === "sub_coin_seller") {
          setTimeout(() => {
            window.location.href = "/seller/user";
          }, 10);
        } else {
          setTimeout(() => {
            window.location.href = "/admin/dashboard";
          }, 10);
        }
        dispatch({ type: SET_ADMIN, payload: res.data.token });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {});
};

export const sendEmail = (data) => (dispatch) => {
  axios
    .post("admin/sendEmail", data)
    .then((res) => {
      if (res.data.status) {
        Toast(
          "success",
          "Mail has been sent successfully. Sometimes mail has been landed on your spam!",
        );
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const getProfile = () => (dispatch) => {
  apiInstanceFetch
    .get("admin/profile")
    .then((res) => {
      if (res.status) {
        dispatch({ type: UPDATE_PROFILE, payload: res.admin });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => {
      console.log("error", error.message);
    });
};

export const changePassword = (data) => (dispatch) => {
  axios
    .put("admin", data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Password changed successfully.");
        setTimeout(() => {
          dispatch({ type: UNSET_ADMIN });
          window.location.href = "/";
        }, [3000]);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const updateNameEmail = (data) => (dispatch) => {
  axios
    .patch("admin", data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Profile updated successfully.");
        dispatch({ type: UPDATE_PROFILE, payload: res.data.admin });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const updateCode = (signup) => (dispatch) => {
  axios
    .patch("admin/updateCode", signup)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Purchase Code Update Successfully !");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error);
    });
};
