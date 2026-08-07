import axios from "axios";
import * as ActionType from "./type";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";

// ✅ GET ALL
export const getSignReward = () => (dispatch) => {
  apiInstanceFetch
    .get(`sign-reward/all`)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.GET_SIGN_REWARD,
          payload: res.data,
        });
      }
    })
    .catch((error) => console.log("error", error));
};

// ✅ CREATE
export const createSignReward = (data) => (dispatch) => {
  axios
    .post(`sign-reward/create`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CREATE_SIGN_REWARD,
          payload: res.data.data,
        });

        Toast("success", "Sign Reward Created Successfully");
      }
    })
    .catch((error) => console.log("error", error));
};

// ✅ UPDATE
export const updateSignReward = (id, data) => (dispatch) => {
  axios
    .patch(`sign-reward/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_SIGN_REWARD,
          payload: { data: res.data.data, id },
        });

        Toast("success", "Sign Reward Updated Successfully");
      }
    })
    .catch((error) => console.log("error", error));
};

// ✅ DELETE
export const deleteSignReward = (id) => (dispatch) => {
  axios
    .delete(`sign-reward/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_SIGN_REWARD,
          payload: id,
        });

        Toast("success", "Sign Reward Deleted Successfully");
      }
    })
    .catch((error) => console.log("error", error));
};
