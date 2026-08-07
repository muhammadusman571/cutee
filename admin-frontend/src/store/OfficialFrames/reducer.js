import * as ActionType from "./type";

const initialState = {
  officialFrames: [],
  Dialogue: false,
  DialogueData: null,
  DialogueGiveFrame: false,
  userId: null,
};

export const officialFrameReducer = (state = initialState, action) => {
  switch (action.type) {
    // 🟢 Fetch all official frames
    case ActionType.GET_OFFICIAL_FRAMES:
      return {
        ...state,
        officialFrames: action.payload,
      };

    // 🟢 Open dialog for create/update
    case ActionType.OPEN_DIALOGUE_OFFICIAL_FRAME:
      return {
        ...state,
        Dialogue: true,
        DialogueData: action.payload || null,
      };

    // 🔴 Close dialog
    case ActionType.CLOSE_DIALOGUE_OFFICIAL_FRAME:
      return {
        ...state,
        Dialogue: false,
        DialogueData: null,
      };
    // 🟢 Open dialog for create/update
    case ActionType.OPEN_GIVE_OFFICIAL_FRAME_DIALOGUE:
      return {
        ...state,
        DialogueGiveFrame: true,
        userId: action.payload || null,
      };

    // 🔴 Close dialog
    case ActionType.CLOSE_GIVE_OFFICIAL_FRAME_DIALOGUE:
      return {
        ...state,
        DialogueGiveFrame: false,
        userId: null,
      };

    // 🟢 Create new official frame
    case ActionType.CREATE_OFFICIAL_FRAME:
      return {
        ...state,
        officialFrames: [action.payload, ...state.officialFrames],
      };

    // 🟢 Update existing official frame
    case ActionType.UPDATE_OFFICIAL_FRAME:
      return {
        ...state,
        officialFrames: state.officialFrames.map((frame) =>
          frame._id === action.payload.id ? action.payload.data : frame
        ),
      };

    // 🔴 Delete official frame
    case ActionType.DELETE_OFFICIAL_FRAME:
      return {
        ...state,
        officialFrames: state.officialFrames.filter(
          (frame) => frame._id !== action.payload
        ),
      };
    default:
      return state;
  }
};
