import * as global from "@api/global";

const initialState = {
  unread_message: 0,
  is_in_chat: false
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case global.U_MESSAGE_INCREMENT:
      return {
        ...state,
        unread_message: state.unread_message + action.data,
      };
    case global.U_MESSAGE_DECREMENT:
      return {
        ...state,
        unread_message: (state.unread_message - action.data) > 0 ? (state.unread_message - action.data) : 0
      };
    case global.U_MESSAGE_SET:
      return {
        ...state,
        unread_message: action.data
      };
    case global.IS_IN_CHAT_PAGE:
      return {
        ...state,
        is_in_chat: action.data
      }
    default:
      return state;
  }
};