import * as ActionType from "./type";

const initialState = {
  rankingFrames: [],
  Dialogue: false,
  DialogueData: null,
};

export const rankingFrameReducer = (state = initialState, action) => {
  switch (action.type) {
    // 🟢 Fetch all ranking frames
    case ActionType.GET_RANKING_FRAMES:
      return {
        ...state,
        rankingFrames: action.payload,
      };

    // 🟢 Open dialog for create/update
    case ActionType.OPEN_DIALOGUE_RANKING_FRAME:
      return {
        ...state,
        Dialogue: true,
        DialogueData: action.payload || null,
      };

    // 🔴 Close dialog
    case ActionType.CLOSE_DIALOGUE_RANKING_FRAME:
      return {
        ...state,
        Dialogue: false,
        DialogueData: null,
      };

    // 🟢 Create new ranking frame
    case ActionType.CREATE_RANKING_FRAME:
      return {
        ...state,
        rankingFrames: [action.payload, ...state.rankingFrames],
      };

    // 🟢 Update existing ranking frame
    case ActionType.UPDATE_RANKING_FRAME:
      return {
        ...state,
        rankingFrames: state.rankingFrames.map((frame) =>
          frame._id === action.payload.id ? action.payload.data : frame
        ),
      };

    // 🔴 Delete ranking frame
    case ActionType.DELETE_RANKING_FRAME:
      return {
        ...state,
        rankingFrames: state.rankingFrames.filter(
          (frame) => frame._id !== action.payload
        ),
      };

    default:
      return state;
  }
};
