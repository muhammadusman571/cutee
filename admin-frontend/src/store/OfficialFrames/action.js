import axios from "axios";
import * as ActionType from "./type";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";
import { UPDATE_USER } from "../user/types";

// --------------------------------------------------
// GET all official frames
// --------------------------------------------------
export const getOfficialFrames = () => (dispatch) => {
  apiInstanceFetch
    .get(`official-frame/all`)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.GET_OFFICIAL_FRAMES,
          payload: res.data,
        });
      }
    })
    .catch((error) => {
      console.error("Get OfficialFrame Error:", error);
      Toast(
        "error",
        error.response.data.message ||
          "Something went wrong while fetching official frames!"
      );
    });
};

// --------------------------------------------------
// CREATE official frame
// --------------------------------------------------
export const createOfficialFrame = (data) => (dispatch) => {
  return axios
    .post(`official-frame/createOfficialFrame`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CREATE_OFFICIAL_FRAME,
          payload: res.data.data,
        });
        dispatch({
          type: ActionType.CLOSE_DIALOGUE_OFFICIAL_FRAME,
        });
        Toast("success", "Official Frame Created Successfully");
        return true;
      } else {
        Toast("error", res.data.message || "Failed to create official frame");
        return false;
      }
    })
    .catch((error) => {
      console.error("Create OfficialFrame Error:", error);
      Toast("error", "Something went wrong!");
      return false;
    });
};

// --------------------------------------------------
// UPDATE official frame
// --------------------------------------------------
export const updateOfficialFrame = (id, data) => (dispatch) => {
  axios
    .put(`official-frame/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_OFFICIAL_FRAME,
          payload: { data: res.data.data, id },
        });
        dispatch({
          type: ActionType.CLOSE_DIALOGUE_OFFICIAL_FRAME,
        });
        Toast("success", "Official Frame Updated Successfully");
      } else {
        Toast("error", res.data.message || "Failed to update official frame");
      }
    })
    .catch((error) => {
      console.error("Update Official Frame Error:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};

// --------------------------------------------------
// Give official frame
// --------------------------------------------------
export const giveOfficialFrame = (id, frameId) => (dispatch) => {
  axios
    .post(`official-frame/give/${id}/${frameId}`)
    .then((res) => {
      if (res.data.status) {
        const { isOfficialFrame, avatarFrameImage } = res.data.data;
        dispatch({
          type: ActionType.CLOSE_GIVE_OFFICIAL_FRAME_DIALOGUE,
        });
        dispatch({
          type: UPDATE_USER,
          payload: {
            userId: id,
            isOfficialFrame,
            avatarFrameImage,
          },
        });
        Toast("success", "Official Frame Given Successfully");
      } else {
        Toast("error", res.data.message || "Failed to give official frame");
      }
    })
    .catch((error) => {
      console.error("Update Official Frame Error:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};

// --------------------------------------------------
// remove official frame
// --------------------------------------------------
export const removeOfficialFrame = (id) => (dispatch) => {
  axios
    .post(`official-frame/remove/${id}`)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Official Frame removed from user Successfully");
        dispatch({
          type: UPDATE_USER,
          payload: {
            userId: id,
            isOfficialFrame: false,
            avatarFrameImage: null,
          },
        });
      } else {
        Toast("error", res.data.message || "Failed to remove official frame");
      }
    })
    .catch((error) => {
      console.error("Update Official Frame Error:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};
// --------------------------------------------------
// DELETE official frame
// --------------------------------------------------
export const deleteOfficialFrame = (id) => (dispatch) => {
  axios
    .delete(`official-frame/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_OFFICIAL_FRAME,
          payload: id,
        });
        Toast("success", "Official Frame Deleted Successfully");
      } else {
        Toast("error", res.data.message || "Failed to delete official frame");
      }
    })
    .catch((error) => {
      console.error("Delete Official Frame Error:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};
