import axios from "axios";
import { Toast } from "../../../src/util/Toast";
import { ADD_REWARD_DISTRIBUTION, GET_REWARD_CONFIG, GET_REWARD } from "./type";
import { baseURL, key } from "../../util/Config";

export const addRewardDistribution = (data, callback) => (dispatch) => {
  axios
    .post(`${baseURL}reward/create`, data)
    .then((res) => {
      if (res.data.status === true) {
        dispatch({
          type: ADD_REWARD_DISTRIBUTION,
          payload: res.data.data,
        });
        Toast("success", "Reward Distribution Added Successfully");

        if (callback) callback();
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

export const getRewardConfig = () => (dispatch) => {
  axios
    .get(`${baseURL}reward/config`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: GET_REWARD_CONFIG,
          payload: res.data.reward,
        });
      }
    })
    .catch((error) => console.log(error));
};

export const getRewards = (start, limit) => (dispatch) => {
  axios
    .get(`${baseURL}reward/all?limit=${limit}&start=${start}`)
    .then((res) => {
      console.log("AXIOS RESPONSE:", res.data);
      if (res.data.status) {
        dispatch({
          type: GET_REWARD,

          payload: res.data,
        });
      }
    })
    .catch((error) => console.log(error));
};
