import axios from "axios";
import * as ActionType from "./type";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";

export const getCPReward = () => (dispatch) => {
  apiInstanceFetch
    .get(`cp-reward`)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.GET_CP_REWARD,
          payload: res.data,
        });
      }
    })
    .catch((error) => console.log("error", error));
};

// Create SVGA
export const createCPReward = (data) => (dispatch) => {
  axios
    .post(`cp-reward`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CERATE_CP_REWARD,
          payload: res.data.data,
        });

        Toast("success", "CP Reward Created Succefully");
      }
    })
    .catch((error) => console.log("error", error));
};

export const updateCPReward = (id, data) => (dispatch) => {
  axios
    .patch(`cp-reward/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_CP_REWARD,
          payload: { data: res.data.data, id: id },
        });

        Toast("success", "CP Reward Updated Succefully");
      }
    })
    .catch((error) => console.log("error", error));
};

export const deleteCpReward = (id) => (dispatch) => {
  axios
    .delete(`cp-reward/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_CP_REWARD, payload: id });

        Toast("success", "CP Reward Deleted Succefully");
      }
    })
    .catch((error) => console.log("error", error));
};
