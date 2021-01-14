import * as global from "@api/global";

const initialState = {
	UNREAD_MESSAGE: 0,
	IS_IN_CHAT: false,
	IS_BUYER_MODE: false,
	PUSH_ALERT: null,
	NAVIGATION: null
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case global.U_MESSAGE_INCREMENT:
			return {
				...state,
				UNREAD_MESSAGE: state.UNREAD_MESSAGE + action.data,
			};
		case global.U_MESSAGE_DECREMENT:
			return {
				...state,
				UNREAD_MESSAGE: (state.UNREAD_MESSAGE - action.data) > 0 ? (state.UNREAD_MESSAGE - action.data) : 0
			};
		case global.U_MESSAGE_SET:
			return {
				...state,
				UNREAD_MESSAGE: action.data
			};
		case global.IS_IN_CHAT_PAGE:
			return {
				...state,
				IS_IN_CHAT: action.data
			};
		case global.IS_BUYER_MODE:
			return {
				...state,
				IS_BUYER_MODE: !state.IS_BUYER_MODE
			};
		case global.PUSH_ALERT:
			return {
				...state,
				PUSH_ALERT: action.data
			};
		case global.NAVIGATION:
			return {
				...state,
				NAVIGATION: action.data
			};
		default:
			return state;
	}
};