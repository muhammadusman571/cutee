import axios from "axios";
import { apiInstanceFetch } from "../../util/api";
import { CREATE_NEW_CURRENCY, DELETE_CURRENCY, GET_CURRENCY, UPDATE_CURRENCY, UPDATE_CURRENCY_STATUS } from "./types";
import { Toast } from "../../util/Toast";




export const getCurrency = () => (dispatch) => {
  apiInstanceFetch
    .get(`currency/getAllCurrencies`)
    .then((res) => {
      dispatch({ type: GET_CURRENCY, payload: res });
    })
    .catch((error) => console.log(error));
};

export const createNewCurrency = (data) => (dispatch) => {
  axios
    .post(`currency/createCurrency`, data)
    .then((res) => {
        
        if (res.data.status) {
            Toast("success", "Currency created successfully!");
            dispatch({ type: CREATE_NEW_CURRENCY, payload: res.data.data });
        } else {
        Toast("error", res.data.message);
    }
})
.catch((error) => Toast("error", error.message));
};

export const editCurrency = (id, data) => (dispatch) => {
    axios
    .patch(`currency/updateCurrency?currencyId=${id}`, data)
    .then((res) => {
        if (res.data.status) {
            Toast("success", "Currency updated successfully!");
            dispatch({ type: UPDATE_CURRENCY, payload: res.data.data });
        } else {
        Toast("error", res.data.message);
    }
    })
    .catch((error) => Toast("error", error.message));
};

export const deleteCurrency = (id) => (dispatch) => {
    axios
    .delete(`currency/deleteCurrency?currencyId=${id}`)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Currency deleted successfully!");
        dispatch({ type: DELETE_CURRENCY, payload: id });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const updateCurrencyStatus = (id) => (dispatch) => {
    axios
    .patch(`currency/setDefaultCurrency?currencyId=${id}`)
    .then((res) => {
        console.log("res", res);
      if (res.data.status) {
        Toast("success", "Currency status updated successfully!");
        dispatch({ type: UPDATE_CURRENCY_STATUS, payload: res.data });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};