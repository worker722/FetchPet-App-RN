import * as actionTypes from "@api/actionTypes";
const initialState = {
  login: {
    success: false
  },
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        login: action.data
      };
    default:
      return state;
  }
};