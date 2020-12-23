import * as global from "@api/global";
const initialState = {
  unread_message: 0
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case global.U_MESSAGE_INCREMENT:
      return {
        unread_message: state.unread_message + action.data
      };
    case global.U_MESSAGE_DECREMENT:
      return {
        unread_message: state.unread_message - action.data
      };
    case global.U_MESSAGE_SET:
      return {
        unread_message: action.data
      };
    default:
      return state;
  }
};