import axios from "axios";
import * as ActionType from "./type";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";

export const getProfileBG = () => (dispatch) => {
  apiInstanceFetch
    .get(`profile-bg/all`)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.GET_PROFILE_BG,
          payload: res.data,
        });
      }
    })
    .catch((error) => console.log("error", error));
};

export const createProfileBG = (data) => (dispatch) => {
  axios
    .post(`profile-bg/create`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CERATE_PROFILE_BG,
          payload: res.data.data,
        });

        Toast("success", "Profile Bg Created Succefully");
      }
    })
    .catch((error) => console.log("error", error));
};

export const updateProfileBG = (id, data) => (dispatch) => {
  axios
    .patch(`profile-bg/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_PROFILE_BG,
          payload: { data: res.data.data, id: id },
        });

        Toast("success", "Profile bg Updated Succefully");
      }
    })
    .catch((error) => console.log("error", error));
};

export const deleteProfileBG = (id) => (dispatch) => {
  axios
    .delete(`profile-bg/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_PROFILE_BG, payload: id });

        Toast("success", "Profile bg Deleted Succefully");
      }
    })
    .catch((error) => console.log("error", error));
};
