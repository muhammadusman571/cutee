import axios from "axios";
import * as ActionType from "./type";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";
import { GET_USER, UPDATE_USER } from "../user/types";

export const getUploadBadge = () => (dispatch) => {
  apiInstanceFetch
    .get(`upload-badge`)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.GET_UPLOAD_BADGE,
          payload: res.data,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      Toast("error", "Something went wrong while fetching Upload Badge!");
    });
};

export const createUploadBadge = (data) => (dispatch) => {
  return axios
    .post(`upload-badge`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CREATE_UPLOAD_BADGE,
          payload: res.data.data,
        });
        dispatch({
          type: ActionType.CLOSE_DIALOGUE_UPLOAD_BADGE,
        });

        Toast("success", "Upload Badge Created Successfully");

        return true;
      } else {
        Toast("error", res.data.message || "Failed to create Upload Badge");
        return false;
      }
    })
    .catch((error) => {
      console.error("Create Upload Badge Error:", error);
      Toast("error", "Something went wrong!");
      return false;
    });
};

export const updateUploadBadge = (id, data) => (dispatch) => {
  axios
    .put(`upload-badge/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_UPLOAD_BADGE,
          payload: { data: res.data.data, id },
        });

        dispatch({
          type: ActionType.CLOSE_DIALOGUE_UPLOAD_BADGE,
        });

        Toast("success", "Upload Badge Updated Successfully");
      } else {
        Toast("error", res.data.message || "Failed to update Upload Badge");
      }
    })
    .catch((error) => {
      console.error("Update  Upload Badge:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};

export const giveUploadBadge = (id, frameIds, close) => (dispatch) => {
  axios
    .post(`upload-badge/give/${id}`, {
      frameIds: frameIds,
    })
    .then((res) => {
      if (res.data.status) {
        if (close === true)
          dispatch({
            type: ActionType.CLOSE_GIVE_UPLOAD_BADGE_DIALOGUE,
          });

        if (close === true)
          Toast("success", "Upload Badge Remove Successfully");
        else Toast("success", "Upload Badge Given Successfully");
      } else {
        Toast("error", res.data.message || "Failed to give Upload Badge");
      }
    })
    .catch((error) => {
      console.error("Update Upload Badge Error:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};
export const removeUploadBadge = (id) => (dispatch) => {
  axios
    .post(`upload-badge/${id}`)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Upload Badge removed from user Successfully");
        dispatch({
          type: UPDATE_USER,
          payload: {
            userId: id,
            isOfficialFrame: false,
            avatarFrameImage: null,
          },
        });
      } else {
        Toast("error", res.data.message || "Failed to remove Upload Badge");
      }
    })
    .catch((error) => {
      console.error("Update Upload Badge Error:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};

export const deleteUploadBadge = (id) => (dispatch) => {
  axios
    .delete(`upload-badge/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_UPLOAD_BADGE,
          payload: id,
        });
        Toast("success", "Upload Badge Deleted Successfully");
      } else {
        Toast("error", res.data.message || "Failed to delete Upload Badge");
      }
    })
    .catch((error) => {
      console.error("Delete Upload Badge Error:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};
