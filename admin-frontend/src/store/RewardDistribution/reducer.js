import * as ActionType from "./type";

const initialState = {
  reward: [],
  total: 0,
  rewardConfig: null,
};

export const rewardReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_REWARD:
      return {
        ...state,
        reward: action.payload.reward,
        total: action.payload.total,
      };
    case ActionType.GET_REWARD_CONFIG:
      return {
        ...state,
        rewardConfig: action.payload,
      };

    default:
      return state;
  }
};
