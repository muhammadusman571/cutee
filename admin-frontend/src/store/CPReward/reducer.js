import * as ActionType from "./type";

const initialState = {
  cpReward: [],
  Dialogue: false,
  DialogueData: null,
  DialogueType: "",
};

export const cpRewardReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_CP_REWARD:
      console.log("action.type", action.type);
      return {
        ...state,
        cpReward: action.payload,
      };

    case ActionType.OPEN_DIALOGUE_CP_REWARD:
      return {
        ...state,
        Dialogue: true,
        DialogueData: action.payload?.data ? action.payload?.data : null,
        DialogueType: action.payload?.type ? action.payload?.type : "",
      };

    case ActionType.CLOSE_DIALOGUE_CP_REWARD:
      return {
        ...state,
        Dialogue: false,
        DialogueData: null,
        DialogueType: "",
      };
    case ActionType.CERATE_CP_REWARD:
      const data = [...state.cpReward, action.payload];
      return {
        ...state,
        cpReward: data,
      };

    case ActionType.UPDATE_CP_REWARD:
      return {
        ...state,
        cpReward: state.cpReward.map((cpReward) => {
          if (cpReward._id === action.payload.id) return action.payload.data;
          else return cpReward;
        }),
      };

    case ActionType.DELETE_CP_REWARD:
      return {
        ...state,
        cpReward: state.cpReward.filter(
          (data) => data._id !== action.payload && data,
        ),
      };
    default:
      return state;
  }
};
