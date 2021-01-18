import * as global from "@api/global";

const initialState = {
	UNREAD_MESSAGE: 0,
	IS_IN_CHAT: false,
	IS_BUYER_MODE: true,
	PUSH_ALERT: null,
	PUSH_ALERT_TYPE: 'success',
	NAVIGATION: null,
	FREE_SELL_ADS: 3,
	IS_VALID_SUBSCRIPTION: false,
	CURRENT_LOCATION: null,
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
				IS_BUYER_MODE: action.data ? action.data : !state.IS_BUYER_MODE
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
		case global.FREE_SELL_ADS:
			return {
				...state,
				FREE_SELL_ADS: state.FREE_SELL_ADS - 1
			};
		case global.IS_VALID_SUBSCRIPTION:
			return {
				...state,
				IS_VALID_SUBSCRIPTION: action.data
			};
		case global.PUSH_ALERT_TYPE:
			return {
				...state,
				PUSH_ALERT_TYPE: action.data
			};
		case global.CURRENT_LOCATION:
			return {
				...state,
				CURRENT_LOCATION: action.data
			};
		default:
			return state;
	}
};