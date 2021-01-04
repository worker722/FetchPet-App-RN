
import { Platform } from 'react-native';
import Toast from 'react-native-simple-toast';

//STORE VARIABLE TYPES
export const LOGIN = "LOGIN";
export const U_MESSAGE_SET = "U_MESSAGE_SET";
export const U_MESSAGE_INCREMENT = "U_MESSAGE_INCREMENT";
export const U_MESSAGE_DECREMENT = "U_MESSAGE_DECREMENT";
export const IS_IN_CHAT_PAGE = "IS_IN_CHAT_PAGE";

//NOTIFICATION TYPE
export const CHAT_MESSAGE_NOTIFICATION = "chat_message";
export const ACCOUNT_STATUS_NOTIFICATION = "account_status";

//NOTIFICATION CHANNEL SETTING FOR ANDROID ONLY
export const NOTIFICATION_CHANNEL_ID = "FETCH-APP";
export const NOTIFICATION_CHANNEL_NAME = "FETCH-APP";
export const NOTIFICATION_CHANNEL_DESCRIPTION = "FETCH-APP";

//USER META KEY
export const _SHOW_NOTIFICATION = '_show_notification';
export const _SHOW_PHONE_ON_ADS = '_show_phone_on_ads';

//PREF KEYS
export const PREF_REMEMBER_ME = 'PREF_REMEMBER_ME';
export const PREF_APPLE_EMAIL = 'PREF_APPLE_EMAIL';
export const PREF_APPLE_NAME = 'PREF_APPLE_NAME';
export const PREF_SHOW_APPLE_BUTTON = 'PREF_SHOW_APPLE_BUTTON';

//ANDROID PACKAGE, APPLEAPP ID
export const ANDROID_PACKAGE = 'com.darryl.fetch';
export const APPLE_APP_ID = '1545467871';

export const showToastMessage = (message, duration) => {
    Toast.show(message, duration ? duration : Toast.LONG);
}

export const showGuestMessage = () => {
    showToastMessage("Please login to use this feature.");
}

export const getAppShareLink = () => {
    return Platform.select(({
        android: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
        ios: `https://apps.apple.com/us/app/id${APPLE_APP_ID}`
    }));
}

export const getAppVersion = () => {
    return Platform.select(({
        android: "1.0.4",
        ios: "2.0.2"
    }));
}