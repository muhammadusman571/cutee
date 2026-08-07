import axios from "axios";
import { Toast } from "../../util/Toast";
import { GET_WITHDRAWAL, UPDATE_WITHDRAWAL } from "./types";
import { apiInstanceFetch } from "../../util/api";

// ✅ GET WITHDRAWAL LIST
export const getWithdrawal = (start, limit, search) => (dispatch) => {
  apiInstanceFetch
    .get(`withdrawal/getAll?start=${start}&limit=${limit}&search=${search}`)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: GET_WITHDRAWAL,
          payload: {
            withdrawal: res.data,
            total: res.total,
          },
        });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// ✅ FORWARD REQUEST
export const forwardWithdrawal = (id, adminId) => (dispatch) => {
  axios
    .patch(`withdrawal/forward/${id}`, { adminId })
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: UPDATE_WITHDRAWAL,
          payload: res.data.data,
        });
        Toast("success", "Forwarded Successfully");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// ✅ APPROVE / REJECT

export const updateStatus = (id, formData) => (dispatch) => {
  axios
    .patch(`withdrawal/status/${id}`, formData)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: UPDATE_WITHDRAWAL,
          payload: res.data.data,
        });
        Toast("success", `Request updated`);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const getAdmins = () => async (dispatch) => {
  try {
    const res = await apiInstanceFetch.get("admin/all-coin-seller"); // apna endpoint
    dispatch({
      type: "GET_ADMINS",
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
  }
};
