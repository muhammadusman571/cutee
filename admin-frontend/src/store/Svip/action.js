import axios from "axios";
import * as ActionType from "./type";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";

// get avatarFrame
export const getSVIPS = (type) => (dispatch) => {
  apiInstanceFetch
    .get(`svip/all`)
    .then((res) => {
      if (res.status) {
        console.log("<>data", res.data);

        dispatch({
          type: ActionType.GET_SVIP_GIF,
          payload: res.data,
        });
      }
    })
    .catch((error) => console.log("error", error));
};

// Create avatarFrame
export const crateSvip = (data) => (dispatch) => {
  return axios
    .post(`svip/createSvip`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CERATE_SVIP_GIF,
          payload: res.data.data,
        });

        Toast("success", "SVIP Created Successfully");
        return true; // ✅ success
      } else {
        Toast("error", res.data.message || "Failed to create SVIP");
        return false;
      }
    })
    .catch((error) => {
      console.log("error", error);
      Toast("error", "Something went wrong!");
      return false;
    });
};

export const updateSvip = (id, data) => (dispatch) => {
  axios
    .patch(`svip/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_SVIP_GIF,
          payload: { data: res.data.data, id },
        });

        Toast("success", "Svip Updated Succesfully");
      }
    })
    .catch((error) => {
      Toast("error", error.message || "Something went wrong!");
      console.log("error", error);
    });
};

export const deleteSvip = (id) => (dispatch) => {
  axios
    .delete(`svip/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_SVIP_GIF, payload: id });
      }
      console.log("success", "Svip Deleted Succesfully");

      Toast("success", "Svip Deleted Succesfully");
    })
    .catch((error) => {
      Toast("error", error.message || "Svip Deleted Succesfully");
      console.log("error", error);
    });
};

export const deleteSvipField = (id, field) => (dispatch) => {
  return axios
    .patch(`svip/delete-field/${id}`, { field })
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_SVIP_FIELD,
          payload: { id, field },
        });

        Toast("success", `${field} deleted successfully`);
      }

      return res; // ✅ also return response
    })
    .catch((error) => {
      console.log("error", error);
      Toast("error", error.message || "Something went wrong!");
      throw error; // optional but good
    });
};
