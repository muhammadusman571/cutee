import axios from "axios";
import * as ActionType from "./type";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";

// get SVGA
export const getEntryBanner = () => (dispatch) => {
  apiInstanceFetch
    .get(`entry-banner/all`)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.GET_ENTRY_BANNER,
          payload: res.data,
        });
      }
    })
    .catch((error) => console.log("error", error));
};

// Create SVGA
export const crateEntryBanner = (data) => (dispatch) => {
  axios
    .post(`entry-banner/create`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CERATE_ENTRY_BANNER,
          payload: res.data.data,
        });

        Toast("success", "Entry Banner Created Succefully");
      }
    })
    .catch((error) => console.log("error", error));
};

export const updateEntryBanner = (id, data) => (dispatch) => {
  axios
    .patch(`entry-banner/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_ENTRY_BANNER,
          payload: { data: res.data.data, id: id },
        });

        Toast("success", "Entry Banner Updated Succefully");
      }
    })
    .catch((error) => console.log("error", error));
};

export const deleteEntryBanner = (id) => (dispatch) => {
  axios
    .delete(`entry-banner/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_ENTRY_BANNER, payload: id });

        Toast("success", "Entry banner Deleted Succefully");
      }
    })
    .catch((error) => console.log("error", error));
};
