import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  GET_ROOMS,
  TOGGLE_PIN_ROOM,
  TOGGLE_ROOM_ACTIVE,
  DELETE_ROOM,
} from "./types";
import { apiInstanceFetch } from "../../util/api";

// Get all rooms
export const getRooms =
  ({ type, limit, start }) =>
  (dispatch) => {
    apiInstanceFetch
      .get(`liveUser/rooms?type=${type}&limit=${limit}&start=${start}`)
      .then((res) => {
        if (res.status) {
          dispatch({
            type: GET_ROOMS,
            payload: { rooms: res.users, total: res.total },
          });
        } else {
          Toast("error", res.message);
        }
      })
      .catch((error) => Toast("error", error.message));
  };

// Pin / Unpin room
export const togglePinRoom = (roomId) => (dispatch) => {
  axios
    .patch(`liveUser/pin-room/${roomId}`)
    .then((res) => {
      if (res.data.status) {
        Toast("success", res.data.message);
        dispatch({
          type: TOGGLE_PIN_ROOM,
          payload: res.data.room,
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// Delete room
export const deleteRoom = (roomId) => (dispatch) => {
  axios
    .delete(`liveUser/room/${roomId}`)
    .then((res) => {
      if (res.data.status) {
        Toast("success", res.data.message);
        dispatch({
          type: DELETE_ROOM,
          payload: roomId,
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const toggleRoomActive = (roomId) => (dispatch) => {
  axios
    .patch(`liveUser/active-room/${roomId}`)
    .then((res) => {
      if (res.data.status) {
        Toast("success", res.data.message);
        dispatch({
          type: TOGGLE_ROOM_ACTIVE,
          payload: res.data.room,
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
