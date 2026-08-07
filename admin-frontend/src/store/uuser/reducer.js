import {
  ADD_COIN_TO_USERS_CLOSE_DIALOGUE,
  ADD_COIN_TO_USERS_OPEN_DIALOGUE,
  GET_USERS,
  UPDATE_USER,
} from "./type";

const initialState = {
  users: [],
  total: 0,
  error: null,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload?.user || [],
        total: action.payload?.total || 0,
      };

    case ADD_COIN_TO_USERS_OPEN_DIALOGUE:
      return {
        ...state,
        moneyDialogOpen: true,
        moneyDialogData: action.payload,
      };

    case ADD_COIN_TO_USERS_CLOSE_DIALOGUE:
      return {
        ...state,
        moneyDialogOpen: false,
        moneyDialogData: action.payload,
      };

    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user,
        ),
      };
    default:
      return state;
  }
};

export default usersReducer;
