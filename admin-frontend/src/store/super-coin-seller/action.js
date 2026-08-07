import axios from "axios";
import { Toast } from "../../util/Toast";

import {
  COIN_SELLER_ERROR,
  SET_COIN_SELLERS,
  ACTIVE_INACTIVE_COIN_SELLER,
  CREATE_COIN_SELLER,
} from "./types";

// ✅ GET ALL COIN SELLERS
export const getCoinSellers =
  (page = 1, limit = 10, search = "") =>
  async (dispatch) => {
    try {
      const res = await axios.get(
        `/admin/super-coin-seller?page=${page}&limit=${limit}&search=${search}`,
      );

      if (res.data.status) {
        dispatch({
          type: SET_COIN_SELLERS,
          payload: {
            sellers: res.data.data.sellers,
            total: res.data.data.pagination.total,
          },
        });
      } else {
        Toast("error", res.data.message);
        dispatch({
          type: COIN_SELLER_ERROR,
          payload: res.data.message,
        });
      }
    } catch (err) {
      Toast("error", err.response?.data?.message || "Something went wrong");

      dispatch({
        type: COIN_SELLER_ERROR,
        payload: err.response?.data?.message || "Error",
      });
    }
  };

// ✅ CREATE SELLER
export const createCoinSeller = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`/admin/super-coin-seller`, data);
    console.log(res.data.datas);
    if (res.data.status) {
      Toast("success", "Coin Seller Created!");
      dispatch({
        type: CREATE_COIN_SELLER,
        payload: res.data.data, // new seller object
      });
    } else {
      Toast("error", res.data.message);
    }
  } catch (err) {
    Toast("error", err.response?.data?.message || "Error");
  }
};

export const AddMoneyToSuperSellerByAdmin = (data, id) => (dispatch) => {
  axios
    .patch(`admin/super-coin-seller?coinSellerId=${id}&coin=${data?.coin}`)
    .then((res) => {
      if (res.data.status === true) {
        dispatch({
          type: ACTIVE_INACTIVE_COIN_SELLER,
          payload: res.data.data,
        });
        Toast("success", "Add coin Successfully");
      } else {
        console.log(res.data.message);
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log("111", error));
};

// ✅ TOGGLE STATUS
export const toggleCoinSellerStatus = (id, status) => async (dispatch) => {
  try {
    const res = await axios.patch(`/admin/status/${id}`);

    if (res.data.status) {
      Toast("success", res.data.message || "Status Updated!");

      dispatch({
        type: ACTIVE_INACTIVE_COIN_SELLER,
        payload: res.data.admin,
      });
    } else {
      Toast("error", res.data.message);
    }
  } catch (err) {
    Toast("error", err.message);
  }
};
