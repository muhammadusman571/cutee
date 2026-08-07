import * as ActionType from "./type";

const initialState = {
  entryBanner: [],
  Dialogue: false,
  DialogueData: null,
  DialogueType: "",
};

export const entryBannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_ENTRY_BANNER:
      return {
        ...state,
        entryBanner: action.payload,
      };

    case ActionType.OPEN_DIALOGUE_ENTRY_BANNER:
      return {
        ...state,
        Dialogue: true,
        DialogueData: action.payload?.data ? action.payload?.data : null,
        DialogueType: action.payload?.type ? action.payload?.type : "",
      };

    case ActionType.CLOSE_DIALOGUE_ENTRY_BANNER:
      return {
        ...state,
        Dialogue: false,
        DialogueData: null,
        DialogueType: "",
      };
    case ActionType.CERATE_ENTRY_BANNER:
      const data = [...state.entryBanner, action.payload];
      return {
        ...state,
        entryBanner: data,
      };

    case ActionType.UPDATE_ENTRY_BANNER:
      return {
        ...state,
        entryBanner: state.entryBanner.map((entryBanner) => {
          if (entryBanner._id === action.payload.id) return action.payload.data;
          else return entryBanner;
        }),
      };

    case ActionType.DELETE_ENTRY_BANNER:
      return {
        ...state,
        entryBanner: state.entryBanner.filter(
          (data) => data._id !== action.payload && data,
        ),
      };
    default:
      return state;
  }
};
