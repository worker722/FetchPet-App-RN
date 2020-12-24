import * as global from "@api/global";
const initialState = {
  login: {
    success: false
  }
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case global.LOGIN:
      return {
        login: action.data
      };
    default:
      return state;
  }
};