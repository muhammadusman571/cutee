import * as SubCoinType from "./type";

const initialState = {
  subCoinSeller: [],
  total: 0,
  uniqueIdList: [],
  selectedSubCoinSeller: null,
  history: [],
  loading: false,
  error: null,
};

const subCoinSellerReducer = (state = initialState, action) => {
  switch (action.type) {
    // GET ALL
    case SubCoinType.GET_SUBCOINSELLER:
      return {
        ...state,
        subCoinSeller: action.payload?.data || [],
        total: action.payload?.total || 0,
      };

    // UNIQUE ID LIST
    case SubCoinType.GET_SUBCOINSELLER_UNIQUEID:
      return {
        ...state,
        uniqueIdList: action.payload || [],
      };

    // ADD
    // case SubCoinType.ADD_SUBCOINSELLER:
    //   return {
    //     ...state,
    //     subCoinSeller: [action.payload, ...state.subCoinSeller],
    //   };

    // EDIT
    case SubCoinType.EDIT_SUBCOINSELLER:
      return {
        ...state,
        subCoinSeller: state.subCoinSeller.map((item) =>
          item._id === action.payload.id
            ? { ...item, ...action.payload.data }
            : item,
        ),
      };

    // DELETE (toggle active)
    case SubCoinType.DELETE_SUBCOINSELLER:
      return {
        ...state,
        subCoinSeller: state.subCoinSeller.map((item) =>
          item._id === action.payload.id
            ? { ...item, ...action.payload.data }
            : item,
        ),
      };

    // SHOW SINGLE
    case SubCoinType.SHOW_SUBCOINSELLER:
      return {
        ...state,
        selectedSubCoinSeller: action.payload.data,
      };

    // ADD COIN BY ADMIN
    case SubCoinType.ADD_SUBCOIN_BY_ADMIN:
      return {
        ...state,
        subCoinSeller: state.subCoinSeller.map((item) =>
          item._id === action.payload.id
            ? { ...item, ...action.payload.data }
            : item,
        ),
      };

    // LESS COIN BY ADMIN
    case SubCoinType.LESS_SUBCOIN_BY_ADMIN:
      return {
        ...state,
        subCoinSeller: state.subCoinSeller.map((item) =>
          item._id === action.payload.id
            ? { ...item, ...action.payload.data }
            : item,
        ),
      };

    case SubCoinType.OPEN_SUBCOINSELLER_DIALOGUE:
      return {
        ...state,
        dialogOpen: true,
      };

    case SubCoinType.ADD_SUBCOIN_OPEN_DIALOGUE:
      return {
        ...state,
        dialogOpen: true,
      };

    case SubCoinType.CLOSE_SUBCOINSELLER_DIALOGUE:
      return {
        ...state,
        dialogOpen: false,
      };

    case SubCoinType.ADD_COIN_TO_SUPPER_DIALOGUE:
      return {
        ...state,
        monyDialogOpen: true,
        moneyDialogData: action.payload || null,
      };
    case SubCoinType.ADD_SUBCOINSELLER:
      return {
        ...state,
        subCoinSeller: [action.payload.data, ...state.subCoinSeller],
      };

    case SubCoinType.ADD_COIN_TO_SUPPE_CLOSE_DIALOGUE:
      return {
        ...state,
        monyDialogOpen: false,
        moneyDialogData: null,
      };

    case SubCoinType.ADD_COIN_TO_SUB_SELLER_DIALOGUE:
      return {
        ...state,
        moneyDialogOpen: true,
        moneyDialogData: action.payload || null,
      };

    case SubCoinType.ADD_COIN_TO_SUB_SELLER_CLOSE_DIALOGUE:
      return {
        ...state,
        moneyDialogOpen: false,
      };
    default:
      return state;
  }
};

export default subCoinSellerReducer;
