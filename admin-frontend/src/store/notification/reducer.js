import { OPEN_NOTIFICATION_DIALOG, CLOSE_NOTIFICATION_DIALOG, SEND_ALL_NOTIFICATION, SEND_PERSONAL_NOTIFICATION } from "./types";

const initialState = {
    notification: [],
    dialog: false,
    dialogData: null,
    selectedUserId: null,
};


const notificationReducer = (state = initialState, action) => {
    switch (action.type) {

        case SEND_ALL_NOTIFICATION:

            return {
                ...state,
                notification: action.payload,


            };
        case SEND_PERSONAL_NOTIFICATION:

            return {
                ...state,
                notification: action.payload,

            };


        case OPEN_NOTIFICATION_DIALOG:
            return {
                ...state,
                dialog: true,
                selectedUserId: action.payload,
            };
        case CLOSE_NOTIFICATION_DIALOG:
            return {
                ...state,
                dialog: false,
                dialogData: null,   
                selectedUserId: null,
            };
        default:
            return state;
    }
}

export default notificationReducer;