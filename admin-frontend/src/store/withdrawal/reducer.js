import { GET_WITHDRAWAL, UPDATE_WITHDRAWAL } from "./types";

const initialState = {
  withdrawal: [],
  total: 0,
  admins: [],
};

const withdrawalReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WITHDRAWAL:
      return {
        ...state,
        withdrawal: action.payload.withdrawal,
        total: action.payload.total,
      };

    case UPDATE_WITHDRAWAL:
      return {
        ...state,
        withdrawal: state.withdrawal.map((item) => {
          if (item._id === action.payload._id)
            return {
              ...item,
              ...action.payload,
            };
          else return item;
        }),
      };
    case "GET_ADMINS":
      // return {
      //   ...state,
      //   admins: action.payload,
      // };
      return {
        ...state,
        admins: action.payload.data || action.payload,
      };

    default:
      return state;
  }
};

export default withdrawalReducer;
