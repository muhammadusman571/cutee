import * as ActionType from "./type";

const initialState = {
  uploadBadge: [],
  Dialogue: false,
  DialogueData: null,
  DialogueGiveFrame: false,
  userId: null,
};

export const uploadBadgeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_UPLOAD_BADGE:
      return {
        ...state,
        uploadBadge: action.payload,
      };

    case ActionType.OPEN_DIALOGUE_UPLOAD_BADGE:
      return {
        ...state,
        Dialogue: true,
        DialogueData: action.payload || null,
      };

    case ActionType.CLOSE_DIALOGUE_UPLOAD_BADGE:
      return {
        ...state,
        Dialogue: false,
        DialogueData: null,
      };

    case ActionType.OPEN_GIVE_UPLOAD_BADGE_DIALOGUE:
      return {
        ...state,
        DialogueUploadBadge: true,
        userId: action.payload || null,
        selectedBadges: action.selectedBadges || [],
      };

    case ActionType.CLOSE_GIVE_UPLOAD_BADGE_DIALOGUE:
      return {
        ...state,
        DialogueUploadBadge: false,
        userId: null,
      };

    case ActionType.CREATE_UPLOAD_BADGE:
      return {
        ...state,
        uploadBadge: [action.payload, ...state.uploadBadge],
      };

    case ActionType.UPDATE_UPLOAD_BADGE:
      return {
        ...state,
        uploadBadge: state.uploadBadge.map((frame) =>
          frame._id === action.payload.id ? action.payload.data : frame,
        ),
      };

    case ActionType.DELETE_UPLOAD_BADGE:
      return {
        ...state,
        uploadBadge: state.uploadBadge.filter(
          (frame) => frame._id !== action.payload,
        ),
      };
    default:
      return state;
  }
};
