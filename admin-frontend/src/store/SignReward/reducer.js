import * as ActionType from "./type";

const initialState = {
  signReward: [],
  Dialogue: false,
  DialogueData: null,
  DialogueType: "",
};

export const signRewardReducer = (state = initialState, action) => {
  switch (action.type) {
    // ✅ GET
    case ActionType.GET_SIGN_REWARD:
      return {
        ...state,
        signReward: action.payload,
      };

    // ✅ OPEN DIALOGUE
    case ActionType.OPEN_DIALOGUE_SIGN_REWARD:
      return {
        ...state,
        Dialogue: true,
        DialogueData: action.payload?.data || null,
        DialogueType: action.payload?.type || "",
      };

    // ✅ CLOSE DIALOGUE
    case ActionType.CLOSE_DIALOGUE_SIGN_REWARD:
      return {
        ...state,
        Dialogue: false,
        DialogueData: null,
        DialogueType: "",
      };

    // ✅ CREATE
    case ActionType.CREATE_SIGN_REWARD:
      return {
        ...state,
        signReward: [...state.signReward, action.payload],
      };

    // ✅ UPDATE
    case ActionType.UPDATE_SIGN_REWARD:
      return {
        ...state,
        signReward: state.signReward.map((item) =>
          item._id === action.payload.id ? action.payload.data : item,
        ),
      };

    // ✅ DELETE
    case ActionType.DELETE_SIGN_REWARD:
      return {
        ...state,
        signReward: state.signReward.filter(
          (item) => item._id !== action.payload,
        ),
      };

    default:
      return state;
  }
};
