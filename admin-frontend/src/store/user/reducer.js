import {
  BLOCK_UNBLOCK_SWITCH,
  GET_USER,
  GET_BLOCKED_USER,
  GET_HISTORY,
  EDIT_COIN,
  UPDATE_USER,
  EDIT_UID,
} from "./types";

const initialState = {
  user: [],
  male: 0,
  female: 0,
  totalUser: 0,
  activeUser: 0,
  blockedUser: [],
  totalBlockedUser: 0,
  history: [],
  totalHistoryUser: 0,
  income: 0,
  outgoing: 0,
  totalCallCharge: 0,
  liveStreamingIncome: 0,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.payload.user,
        male: action.payload.male,
        female: action.payload.female,
        totalUser: action.payload.total,
        activeUser: action.payload.activeUser,
      };

    case BLOCK_UNBLOCK_SWITCH:
      return {
        ...state,
        user: state.user.map((user) => {
          if (user._id === action.payload._id)
            return {
              ...user,
              isBlock: action.payload.isBlock,
            };
          else return user;
        }),
        blockedUser: action.payload.isBlock
          ? state.blockedUser
          : state.blockedUser.filter(
              (user) => user._id !== action.payload._id,
            ),
        totalBlockedUser: action.payload.isBlock
          ? state.totalBlockedUser
          : state.blockedUser.some((user) => user._id === action.payload._id)
            ? state.totalBlockedUser - 1
            : state.totalBlockedUser,
      };

    case GET_BLOCKED_USER:
      return {
        ...state,
        blockedUser: action.payload.user,
        totalBlockedUser: action.payload.total,
      };

    case GET_HISTORY:
      return {
        ...state,
        history: action.payload.history,
        totalHistoryUser: action.payload.total,
        income: action.payload.incomeTotal,
        outgoing: action.payload.outgoingTotal,
        totalCallCharge: action.payload.totalCallCharge,
        liveStreamingIncome: action.payload.income,
      };
    case EDIT_COIN:
      return {
        ...state,
        user: state.user.map((user) => {
          if (user._id === action.payload.id) return action.payload.data;
          else return user;
        }),
      };
    case EDIT_UID:
      return {
        ...state,
        user: state.user.map((user) => {
          if (user._id === action.payload.id) return action.payload.data;
          else return user;
        }),
      };

    case "UPDATE_USER_UPLOAD_TAGS":
      return {
        ...state,
        user: state.user.map((u) =>
          u._id === action.payload.userId
            ? { ...u, uploadTags: action.payload.uploadTags }
            : u,
        ),
      };
    case "UPDATE_USER_UPLOAD_BADGES":
      return {
        ...state,
        user: state.user.map((u) =>
          u._id === action.payload.userId
            ? { ...u, uploadBadges: action.payload.uploadBadges }
            : u,
        ),
      };
    case UPDATE_USER:
      return {
        ...state,
        user: state.user.map((u) => {
          if (u._id === action.payload.userId) {
            return {
              ...u,
              isOfficialFrame: action.payload.isOfficialFrame,
              avatarFrameImage: action.payload.avatarFrameImage,
            };
          }
          return u;
        }),
      };

    default:
      return state;
  }
};

export default userReducer;
