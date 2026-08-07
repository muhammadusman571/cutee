import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  GET_ANNOUNCEMENTS,
  CREATE_NEW_ANNOUNCEMENT,
  EDIT_ANNOUNCEMENT,
  CLOSE_ANNOUNCEMENT_DIALOG,
  DELETE_ANNOUNCEMENT,
  SEND_ANNOUNCEMENT_TOGGLE,
} from "./announcement.type";
import { apiInstanceFetch } from "../../util/api";

// Fetch all announcements
export const getAnnouncements = () => (dispatch) => {
  apiInstanceFetch
    .get(`announcement`)
    .then((res) => {
      console.log("res.announcements", res.data[0]);
      if (res.status) {
        dispatch({ type: GET_ANNOUNCEMENTS, payload: res.data });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// Create new announcement
export const createAnnouncement = (data) => (dispatch) => {
  axios
    .post(`announcement`, data)
    .then((res) => {
      if (res.data.status) {
        console.log(res.data.announcement);
        dispatch({
          type: CREATE_NEW_ANNOUNCEMENT,
          payload: res.data.announcement,
        });
        dispatch({ type: CLOSE_ANNOUNCEMENT_DIALOG });
        Toast("success", "Announcement created successfully!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// Edit existing announcement
export const editAnnouncement = (data, id) => (dispatch) => {
  axios
    .patch(`announcement/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: CLOSE_ANNOUNCEMENT_DIALOG });
        dispatch({
          type: EDIT_ANNOUNCEMENT,
          payload: { data: res.data.announcement, id: id },
        });
        Toast("success", "Announcement updated successfully!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// Delete announcement
export const deleteAnnouncement = (id) => (dispatch) => {
  axios
    .delete(`announcement/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_ANNOUNCEMENT, payload: id });
        Toast("success", "Announcement deleted successfully!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

// Toggle announcement sent status (if needed)
export const toggleSentStatus = (id) => (dispatch) => {
  axios
    .patch(`announcement/toggleSent?id=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: SEND_ANNOUNCEMENT_TOGGLE,
          payload: res.data.announcement,
        });
        Toast("success", "Announcement status updated!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
