import {
  SET_COIN_SELLERS,
  ACTIVE_INACTIVE_COIN_SELLER,
  COIN_SELLER_ERROR,
  CREATE_COIN_SELLER,
  CLOSE_COIN_SELLER_DIALOG,
  OPEN_COIN_SELLER_DIALOG,
} from "./types";

const initialState = {
  sellers: [],
  total: 0,
  error: null,
  coinSellerDialog: false,
};

const superCoinSellerReducer = (state = initialState, action) => {
  switch (action.type) {
    // ✅ SET SELLERS
    case SET_COIN_SELLERS:
      return {
        ...state,
        sellers: action.payload.sellers,
        total: action.payload.total,
        error: null,
      };

    // ✅ TOGGLE ACTIVE / INACTIVE
    case ACTIVE_INACTIVE_COIN_SELLER:
      return {
        ...state,
        sellers: state.sellers.map((seller) =>
          seller._id === action.payload._id ? action.payload : seller,
        ),
      };

    // ✅ ERROR
    case COIN_SELLER_ERROR:
      return {
        ...state,
        sellers: [],
        error: action.payload,
      };
    case OPEN_COIN_SELLER_DIALOG:
      return {
        ...state,
        coinSellerDialog: true,
      };

    case CLOSE_COIN_SELLER_DIALOG:
      return {
        ...state,
        coinSellerDialog: false,
      };

    case CREATE_COIN_SELLER:
      return {
        ...state,
        sellers: [action.payload, ...state.sellers],
      };
    default:
      return state;
  }
};

export default superCoinSellerReducer;
