import * as ActionType from "./type";

const initialState = {
  profileBG: [],
  Dialogue: false,
  DialogueData: null,
  DialogueType: "",
};

export const profileBgReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_PROFILE_BG:
      return {
        ...state,
        profileBG: action.payload,
      };

    case ActionType.OPEN_DIALOGUE_PROFILE_BG:
      return {
        ...state,
        Dialogue: true,
        DialogueData: action.payload?.data ? action.payload?.data : null,
        DialogueType: action.payload?.type ? action.payload?.type : "",
      };

    case ActionType.CLOSE_DIALOGUE_PROFILE_BG:
      return {
        ...state,
        Dialogue: false,
        DialogueData: null,
        DialogueType: "",
      };
    case ActionType.CERATE_PROFILE_BG:
      const data = [...state.profileBG, action.payload];
      return {
        ...state,
        profileBG: data,
      };

    case ActionType.UPDATE_PROFILE_BG:
      return {
        ...state,
        profileBG: state.profileBG.map((profile) => {
          if (profile._id === action.payload.id) return action.payload.data;
          return profile;
        }),
      };

    case ActionType.DELETE_PROFILE_BG:
      return {
        ...state,
        profileBG: state.profileBG.filter(
          (data) => data._id !== action.payload,
        ),
      };

    default:
      return state;
  }
};
