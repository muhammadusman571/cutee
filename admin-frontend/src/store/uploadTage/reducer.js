import * as ActionType from "./type";

const initialState = {
  uploadTag: [],
  Dialogue: false,
  DialogueData: null,
  DialogueGiveFrame: false,
  userId: null,
};

export const uploadTagReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_UPLOAD_TAG:
      return {
        ...state,
        uploadTag: action.payload,
      };

    case ActionType.OPEN_DIALOGUE_UPLOAD_TAG:
      return {
        ...state,
        Dialogue: true,
        DialogueData: action.payload || null,
      };

    case ActionType.CLOSE_DIALOGUE_UPLOAD_TAG:
      return {
        ...state,
        Dialogue: false,
        DialogueData: null,
      };

    case ActionType.OPEN_GIVE_UPLOAD_TAG_DIALOGUE:
      return {
        ...state,
        DialogueUploadTag: true,
        userId: action.payload || null,
        selectedTages: action.selectedTages || [],
      };

    case ActionType.CLOSE_GIVE_UPLOAD_TAG_DIALOGUE:
      return {
        ...state,
        DialogueUploadTag: false,
        userId: null,
      };

    case ActionType.CREATE_UPLOAD_TAG:
      return {
        ...state,
        uploadTag: [action.payload, ...state.uploadTag],
      };

    case ActionType.UPDATE_UPLOAD_TAG:
      return {
        ...state,
        uploadTag: state.uploadTag.map((frame) =>
          frame._id === action.payload.id ? action.payload.data : frame,
        ),
      };

    case ActionType.DELETE_UPLOAD_TAG:
      return {
        ...state,
        uploadTag: state.uploadTag.filter(
          (frame) => frame._id !== action.payload,
        ),
      };
    default:
      return state;
  }
};
