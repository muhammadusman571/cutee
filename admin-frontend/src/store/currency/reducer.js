import { CLOSE_CURRENCY_DIALOG, GET_CURRENCY, OPEN_CURRENCY_DIALOG, CREATE_NEW_CURRENCY, UPDATE_CURRENCY, DELETE_CURRENCY, UPDATE_CURRENCY_STATUS } from "./types";



const initialState = {
    currency: [],
    dialog: false,
    dialogData: null,
    total: 0
};

const currencyReducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_CURRENCY:

            return {
                ...state,
                currency: action.payload.data,
                // total: action.payload.total,
            };

        case CREATE_NEW_CURRENCY:

            const data = [...state.currency];
            data.unshift(action.payload);
            return {
                ...state,
                currency: data,
            };

        case UPDATE_CURRENCY:
            return {
                ...state,
                currency: state.currency.map((currency) => {
                    if (currency._id === action.payload._id) return action.payload;
                    else return currency;
                }),
            };

        case DELETE_CURRENCY:
            return {
                ...state,
                currency: state.currency.filter((currency) => currency._id !== action.payload),
            };

        case UPDATE_CURRENCY_STATUS:
            console.log("action.payload", action.payload);

            if (action.payload.status === true) {
                return {
                    ...state,
                    currency: action.payload.data
                };
            } else {
                return state;
            }

        case OPEN_CURRENCY_DIALOG:
            return {
                ...state,
                dialog: true,
                dialogData: action.payload || null,
            };
        case CLOSE_CURRENCY_DIALOG:
            return {
                ...state,
                dialog: false,
                dialogData: null,
            };
        default:
            return state;
    }
};


export default currencyReducer