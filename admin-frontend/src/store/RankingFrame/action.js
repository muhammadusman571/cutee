import axios from "axios";
import * as ActionType from "./type";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";

// --------------------------------------------------
// GET all ranking frames
// --------------------------------------------------
export const getRankingFrames = () => (dispatch) => {
  apiInstanceFetch
    .get(`rank-frame/all`)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.GET_RANKING_FRAMES,
          payload: res.data,
        });
      }
    })
    .catch((error) => {
      console.error("Get RankingFrame Error:", error);
      Toast(
        "error",
        error.response.data.message ||
          "Something went wrong while fetching ranking frames!"
      );
    });
};

// --------------------------------------------------
// CREATE ranking frame
// --------------------------------------------------
export const createRankingFrame = (data) => (dispatch) => {
  return axios
    .post(`rank-frame/createRankFrame`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CREATE_RANKING_FRAME,
          payload: res.data.data,
        });
        dispatch({
          type: ActionType.CLOSE_DIALOGUE_RANKING_FRAME,
        });
        Toast("success", "Ranking Frame Created Successfully");
        return true;
      } else {
        Toast("error", res.data.message || "Failed to create ranking frame");
        return false;
      }
    })
    .catch((error) => {
      console.error("Create RankingFrame Error:", error);
      Toast("error", "Something went wrong!");
      return false;
    });
};

// --------------------------------------------------
// UPDATE ranking frame
// --------------------------------------------------
export const updateRankingFrame = (id, data) => (dispatch) => {
  axios
    .put(`rank-frame/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_RANKING_FRAME,
          payload: { data: res.data.data, id },
        });
           dispatch({
          type: ActionType.CLOSE_DIALOGUE_RANKING_FRAME,
        });
        Toast("success", "Ranking Frame Updated Successfully");
      } else {
        Toast("error", res.data.message || "Failed to update ranking frame");
      }
    })
    .catch((error) => {
      console.error("Update RankingFrame Error:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};

// --------------------------------------------------
// DELETE ranking frame
// --------------------------------------------------
export const deleteRankingFrame = (id) => (dispatch) => {
  axios
    .delete(`rank-frame/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_RANKING_FRAME,
          payload: id,
        });
        Toast("success", "Ranking Frame Deleted Successfully");
      } else {
        Toast("error", res.data.message || "Failed to delete ranking frame");
      }
    })
    .catch((error) => {
      console.error("Delete RankingFrame Error:", error);
      Toast("error", error.message || "Something went wrong!");
    });
};
