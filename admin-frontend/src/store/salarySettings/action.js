import axios from "axios";
import * as ActionType from "./type";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";

// =========================
// GET SALARY SETTINGS
// =========================
export const getSalarySettings = () => (dispatch) => {
  apiInstanceFetch
    .get("salarySetting/")
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.GET_SALARY_SETTINGS,
          payload: res.salarySetting,
        });
      }
    })
    .catch((err) => {
      console.log("ERROR GET SALARY SETTINGS:", err);
    });
};

// =========================
// CREATE SALARY SETTING
// =========================
export const createSalarySetting = (data) => (dispatch) => {
  return axios
    .post("salarySetting/", data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CREATE_SALARY_SETTING,
          payload: res.data.salarySetting,
        });

        Toast("success", "Salary Setting created successfully");
        return true;
      } else {
        Toast("error", res.data.message || "Failed to Create");
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      Toast("error", "Something went wrong!");
      return false;
    });
};

// =========================
// UPDATE SALARY SETTING
// =========================
export const updateSalarySetting = (id, data) => (dispatch) => {
  axios
    .patch(`salarySetting/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_SALARY_SETTING,
          payload: { id, data: res.data.salarySetting },
        });

        Toast("success", "Salary Setting updated");
      }
    })
    .catch((err) => {
      console.log(err);
      Toast("error", "Update failed");
    });
};

// =========================
// DELETE SALARY SETTING
// =========================
export const deleteSalarySetting = (id) => (dispatch) => {
  axios
    .delete(`salarySetting/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_SALARY_SETTING,
          payload: id,
        });

        Toast("success", "Salary Setting deleted");
      }
    })
    .catch((err) => {
      console.log(err);
      Toast("error", "Delete failed");
    });
};
