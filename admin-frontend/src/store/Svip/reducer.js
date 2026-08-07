import * as ActionType from "./type";

const initialState = {
  svips: [],
  Dialogue: false,
  DialogueData: null,
};

export const svipReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_SVIP_GIF:
      return {
        ...state,
        svips: action.payload,
      };

    case ActionType.OPEN_DIALOGUE_SVIP:
      return {
        ...state,
        Dialogue: true,
        DialogueData: action.payload || null,
      };

    case ActionType.CLOSE_DIALOGUE_SVIP:
      return {
        ...state,
        Dialogue: false,
        DialogueData: null,
      };
    case ActionType.CERATE_SVIP_GIF:
      const data = [action.payload, ...state.svips];
      return {
        ...state,
        svips: data,
      };

    case ActionType.UPDATE_SVIP_GIF:
      return {
        ...state,
        svips: state.svips.map((svip) => {
          if (svip._id === action.payload.id) return action.payload.data;
          else return svip;
        }),
      };

    case ActionType.DELETE_SVIP_GIF:
      return {
        ...state,
        svips: state.svips.filter(
          (data) => data._id !== action.payload && data,
        ),
      };
    case ActionType.DELETE_SVIP_FIELD:
      return {
        ...state,
        svips: state.svips.map((item) => {
          if (item._id === action.payload.id) {
            return {
              ...item,
              [action.payload.field]: "", // 👈 remove field
            };
          }
          return item;
        }),
      };

    default:
      return state;
  }
};
