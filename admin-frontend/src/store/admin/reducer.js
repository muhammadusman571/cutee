import setToken from "../../util/SetToken";

import { key } from "../../util/Config";
import setDevKey from "../../util/SetDevKey";

import {
  SET_ADMIN,
  UNSET_ADMIN,
  UPDATE_PROFILE,
  SIGNUP_ADMIN,
  OPEN_ADMIN_DIALOG,
  CLOSE_ADMIN_DIALOG,
  SET_ADMINS,
  ACTIVE_INACTIVE_ADMIN,
  ADMIN_ERROR,
  TOGGLE_MANAGEMENT_DIALOG,
} from "./types";
import axios from "axios";

const initialState = {
  isAuth: false,
  admin: {},
  dialog: false,
  managementDialog: false,
  dialogData: null,
  admins: [], // list of admins
  total: 0, // total admins for pagination
  error: null,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ADMIN:
      setToken(action.payload);
      setDevKey(key);
      localStorage.setItem("TOKEN", action.payload);
      localStorage.setItem("KEY", key);
      console.log("set admin reducer", key, action.payload);
      console.log(axios.defaults);

      return {
        ...state,
        isAuth: true,
        admin: action.payload,
      };

    case UNSET_ADMIN:
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("KEY");

      setDevKey(null);
      setToken(null);
      return {
        ...state,
        isAuth: false,
        admin: {},
      };

    case UPDATE_PROFILE:
      return {
        ...state,
        admin: { ...state.admin, ...action.payload },
      };

    case SIGNUP_ADMIN:
      return state;

    case OPEN_ADMIN_DIALOG:
      return { ...state, dialog: true, dialogData: action.payload || null };
    case CLOSE_ADMIN_DIALOG:
      return { ...state, dialog: false, dialogData: null };
    case TOGGLE_MANAGEMENT_DIALOG:
      return { ...state, managementDialog: !state.managementDialog };
    case SET_ADMINS:
      return {
        ...state,
        admins: action.payload.admins,
        total: action.payload.total,
      };

    case ACTIVE_INACTIVE_ADMIN:
      return {
        ...state,
        admins: state.admins.map((a) =>
          a._id === action.payload._id ? action.payload : a
        ),
      };

    case ADMIN_ERROR:
      return {
        ...state,
        admins: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default adminReducer;
