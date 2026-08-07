import {
  GET_ROOMS,
  TOGGLE_PIN_ROOM,
  TOGGLE_ROOM_ACTIVE,
  DELETE_ROOM,
} from "./types";

const initialState = {
  rooms: [],
  total: 0,
};

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROOMS:
      return {
        ...state,
        rooms: action.payload.rooms,
        total: action.payload.total,
      };

    case TOGGLE_PIN_ROOM:
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room._id === action.payload._id ? action.payload : room,
        ),
      };
    case TOGGLE_ROOM_ACTIVE:
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room._id === action.payload._id ? action.payload : room,
        ),
      };

    case DELETE_ROOM:
      return {
        ...state,
        rooms: state.rooms.filter((room) => room._id !== action.payload),
        total: state.total - 1,
      };

    default:
      return state;
  }
};

export default roomReducer;
