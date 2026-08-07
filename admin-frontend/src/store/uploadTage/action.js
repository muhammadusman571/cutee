import axios from "axios";
import * as ActionType from "./type";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";
import { UPDATE_USER } from "../user/types";
import { getUser } from "../user/action";

export const getUploadTag = () => (dispatch) => {
  apiInstanceFetch
    .get(`upload-tag`)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.GET_UPLOAD_TAG,
          payload: res.data,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      Toast("error", "Something went wrong while fetching upload tag!");
    });
};

export const createUploadTag = (data) => (dispatch) => {
  return axios
    .post(`upload-tag`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CREATE_UPLOAD_TAG,
          payload: res.data.data,
        });
        dispatch({
          type: ActionType.CLOSE_DIALOGUE_UPLOAD_TAG,
        });

        Toast("success", "Upload Tag Created Successfully");

        return true;
      } else {
        Toast("error", res.data.message || "Failed to create Upload Tag");
        return false;
      }
    })
    .catch((error) => {
      console.error("Create Upload Tag Error:", error);
      Toast("error", "Something went wrong!");
      return false;
    });
};

export const updateUploadTag = (id, data) => (dispatch) => {
  axios
    .put(`upload-tag/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_UPLOAD_TAG,
          payload: { data: res.data.data, id },
        });
        dispatch({
          type: ActionType.CLOSE_DIALOGUE_UPLOAD_TAG,
        });
        Toast("success", "Upload Tag Updated Successfully");
      } else {
        Toast("error", res.data.message || "Failed to update Upload Tag");
      }
      dispatch({ type: ActionType.GET_UPLOAD_TAG });
    })
    .catch((error) => {
      console.error("Update  Upload Tag:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};

export const giveUploadTag = (id, frameIds, close) => (dispatch) => {
  axios
    .post(`upload-tag/give/${id}`, {
      frameIds: frameIds,
    })
    .then((res) => {
      if (res.data.status) {
        if (close === true)
          dispatch({
            type: ActionType.CLOSE_GIVE_UPLOAD_TAG_DIALOGUE,
          });

        dispatch({
          type: "UPLOAD_BADGE_UPDATED",
          payload: { id, frameIds, timestamp: Date.now() },
        });

        if (close === true) Toast("success", "Upload Tag Given Successfully");
        else Toast("success", "Upload Tag Remove Successfully");
      } else {
        Toast("error", res.data.message || "Failed to give Upload Tag");
      }
    })
    .catch((error) => {
      console.error("Update Upload Tag Error:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};
export const removeUploadTag = (id) => (dispatch) => {
  axios
    .post(`upload-tag/${id}`)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Upload Tag removed from user Successfully");
        dispatch({
          type: UPDATE_USER,
          payload: {
            userId: id,
            isOfficialFrame: false,
            avatarFrameImage: null,
          },
        });
      } else {
        Toast("error", res.data.message || "Failed to remove Upload Tag");
      }
    })
    .catch((error) => {
      console.error("Update Upload Tag Error:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};

export const deleteUploadTag = (id) => (dispatch) => {
  axios
    .delete(`upload-tag/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_UPLOAD_TAG,
          payload: id,
        });
        Toast("success", "Upload Tag Deleted Successfully");
      } else {
        Toast("error", res.data.message || "Failed to delete Upload Tag");
      }
    })
    .catch((error) => {
      console.error("Delete Upload Tag Error:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};
