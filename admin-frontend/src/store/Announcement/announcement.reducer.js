import {
  GET_ANNOUNCEMENTS,
  CREATE_NEW_ANNOUNCEMENT,
  OPEN_ANNOUNCEMENT_DIALOG,
  CLOSE_ANNOUNCEMENT_DIALOG,
  EDIT_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  SEND_ANNOUNCEMENT_TOGGLE,
} from "./announcement.type";

const initialState = {
  list: [], // list of announcements
  dialog: false, // dialog open/close
  dialogData: null, // data for editing
};

const announcementReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ANNOUNCEMENTS:
      return {
        ...state,
        list: action.payload,
      };

    case CREATE_NEW_ANNOUNCEMENT:
      return {
        ...state,
        list: [action.payload, ...state.list],
      };

    case EDIT_ANNOUNCEMENT:
      return {
        ...state,
        list: state.list.map((item) =>
          item._id === action.payload.id ? action.payload.data : item,
        ),
      };

    case DELETE_ANNOUNCEMENT:
      return {
        ...state,
        list: state.list.filter((item) => item._id !== action.payload),
      };

    case OPEN_ANNOUNCEMENT_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    case CLOSE_ANNOUNCEMENT_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    case SEND_ANNOUNCEMENT_TOGGLE:
      return {
        ...state,
        list: state.list.map((item) =>
          item._id === action.payload._id
            ? { ...item, sent: action.payload.sent }
            : item,
        ),
      };

    default:
      return state;
  }
};

export default announcementReducer;
