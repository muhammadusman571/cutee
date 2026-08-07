import axios from "axios";
import { Toast } from "../../../src/util/Toast";
import * as SubCoinType from "./type";
import { apiInstanceFetch } from "../../util/api";

// GET SUB COIN SELLER
export const getSubCoinSeller = (start, limit, search) => (dispatch) => {
  apiInstanceFetch
    .get(
      `admin/sub-coin-seller?start=${start}&limit=${limit}&search=${
        search ? search : "ALL"
      }`,
    )
    .then((res) => {
      console.log("API RESPONSE:", res);
      dispatch({
        type: SubCoinType.GET_SUBCOINSELLER,
        payload: res,
      });
    })
    .catch((error) => console.log(error));
};

export const getSubCoinSellerUniqueId = () => {
  return apiInstanceFetch.get(`user/coin-seller`);
};

// CREATE SUB COIN SELLER
export const addSubCoinSeller = (data) => (dispatch) => {
  axios
    .post(
      `subCoinSeller/create?uniqueId=${data?.uniqueId}&coin=${data?.coin}&parentSellerId=${data?.parentSellerId}`,
    )
    .then((res) => {
      if (res.data.status === true) {
        dispatch({
          type: SubCoinType.ADD_SUBCOINSELLER,
          payload: res.data,
        });
        Toast("success", "Sub Coin Seller Added Successfully");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

// EDIT COIN
export const editSubCoinSeller = (id, coin) => (dispatch) => {
  axios
    .patch(`subCoinSeller/coinByadmin?subCoinSellerId=${id}&coin=${coin}`)
    .then((res) => {
      if (res.data.status === true) {
        dispatch({
          type: SubCoinType.EDIT_SUBCOINSELLER,
          payload: { data: res.data.data, id },
        });
        Toast("success", "Coin Updated Successfully");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

// ENABLE / DISABLE
export const deleteSubCoinSeller = (id) => (dispatch) => {
  axios
    .patch(`subCoinSeller/activeOrNot?subCoinSellerId=${id}`)
    .then((res) => {
      dispatch({
        type: SubCoinType.DELETE_SUBCOINSELLER,
        payload: { data: res.data.data, id },
      });

      Toast(
        "success",
        res.data.data?.isActive
          ? "Enabled Successfully"
          : "Disabled Successfully",
      );
    })
    .catch((error) => console.log(error));
};

// SHOW SINGLE
export const showSubCoinSeller = (id) => (dispatch) => {
  axios
    .patch(`subCoinSeller/show/${id}`)
    .then((res) => {
      dispatch({
        type: SubCoinType.SHOW_SUBCOINSELLER,
        payload: { data: res.data.data, id },
      });
    })
    .catch((error) => console.log(error));
};

// ADD COIN BY ADMIN
export const addCoinByAdmin = (data, id) => (dispatch) => {
  axios
    .patch(`subCoinSeller/coinByadmin?subCoinSellerId=${id}&coin=${data?.coin}`)
    .then((res) => {
      if (res.data.status === true) {
        dispatch({
          type: SubCoinType.ADD_SUBCOIN_BY_ADMIN,
          payload: { data: res.data.data, id },
        });
        Toast("success", "Coin Added Successfully");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

// LESS COIN BY ADMIN
export const lessCoinByAdmin = (data, id) => (dispatch) => {
  axios
    .patch(
      `subCoinSeller/coinLessByAdmin?subCoinSellerId=${id}&coin=${data?.coin}`,
    )
    .then((res) => {
      if (res.data.status === true) {
        dispatch({
          type: SubCoinType.LESS_SUBCOIN_BY_ADMIN,
          payload: { data: res.data.data, id },
        });
        Toast("success", "Coin Updated Successfully");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

// HISTORY
export const getSubCoinSellerHistory = (id, start, limit) => (dispatch) => {
  axios
    .get(
      `subCoinSellerHistory/get?subCoinSellerId=${id}&start=${start}&limit=${limit}`,
    )
    .then((res) => {
      dispatch({
        type: SubCoinType.GET_SUBCOINSELLER_HISTORY,
        payload: res.data,
      });
    })
    .catch((error) => console.log(error));
};
