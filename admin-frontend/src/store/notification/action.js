import axios from "axios";
import { Toast } from "../../util/Toast";
import { CLOSE_NOTIFICATION_DIALOG, SEND_ALL_NOTIFICATION ,SEND_PERSONAL_NOTIFICATION} from "./types";
import { apiInstanceFetch } from "../../util/api";

export const notification = (formData) => (dispatch) => {
    axios
        .post(`notification/all`, formData)
        .then((res) => {
            
            if (res.data.status) {
                dispatch({
                    type: SEND_ALL_NOTIFICATION,
                    payload: res.data,
                });

                dispatch({type: CLOSE_NOTIFICATION_DIALOG,});
                Toast("success", "Notification sent successfully");
            } else {
                Toast("error", res.data.message);
            }
        })
        .catch((error) => console.log(error));
};

export const personal = (formData) => (dispatch) => {
    axios
        .post(`notification/user`, formData)
        .then((res) => {
            
            if (res.data.status) {

                dispatch({
                    type: SEND_PERSONAL_NOTIFICATION,
                    payload: res.data,
                });

                dispatch({type: CLOSE_NOTIFICATION_DIALOG,});
                Toast("success", "Notification sent successfully");
            } else {
                Toast("error", res.data.message);
            }
        })
        .catch((error) => console.log(error));
};


  


    