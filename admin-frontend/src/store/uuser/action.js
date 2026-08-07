import { apiInstanceFetch } from "../../util/api";
import { GET_USERS, UPDATE_USER } from "./type";
import axios from "axios";
import { Toast } from "../../util/Toast";

export const getUsers = (start, limit, search) => (dispatch) => {
  apiInstanceFetch
    .get(`user/get-one-user?search=${search ? search : "ALL"}`)
    .then((res) => {
      console.log("API RESPONSE:", res);
      dispatch({
        type: GET_USERS,
        payload: res,
      });
    })
    .catch((error) => console.log(error));
};

export const AddMoneyToUser = (data, id) => (dispatch) => {
  axios
    .patch(`user/coin?coinSellerId=${id}&coin=${data?.coin}`)
    .then((res) => {
      if (res.data.status === true) {
        dispatch({
          type: UPDATE_USER,
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
