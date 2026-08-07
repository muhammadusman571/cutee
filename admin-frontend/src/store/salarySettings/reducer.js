import * as ActionType from "./type";

const initialState = {
  salarySettings: [],
  dialogOpen: false,
  dialogData: null,
};

export const salarySettingReducer = (state = initialState, action) => {
  switch (action.type) {
    // GET
    case ActionType.GET_SALARY_SETTINGS:
      return {
        ...state,
        salarySettings: action.payload,
      };

    // OPEN DIALOG
    case ActionType.OPEN_SALARY_DIALOG:
      return {
        ...state,
        dialogOpen: true,
        dialogData: action.payload || null,
      };

    // CLOSE DIALOG
    case ActionType.CLOSE_SALARY_DIALOG:
      return {
        ...state,
        dialogOpen: false,
        dialogData: null,
      };

    // CREATE
    case ActionType.CREATE_SALARY_SETTING:
      return {
        ...state,
        salarySettings: [...state.salarySettings, action.payload].sort(
          (a, b) => a.target - b.target
        ),
      };

    // UPDATE
    case ActionType.UPDATE_SALARY_SETTING:
      return {
        ...state,
        salarySettings: state.salarySettings.map((item) =>
          item._id === action.payload.id ? action.payload.data : item
        ),
      };

    // DELETE
    case ActionType.DELETE_SALARY_SETTING:
      return {
        ...state,
        salarySettings: state.salarySettings.filter(
          (item) => item._id !== action.payload
        ),
      };

    default:
      return state;
  }
};
