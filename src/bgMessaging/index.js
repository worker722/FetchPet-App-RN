import * as global from "@api/global";
import { SetPrefrence } from "@store";

export default async (notification) => {
	try {
		const { data } = notification;
		const notificationData = JSON.parse(data.data);
		if (notificationData.notification_type == global.CHAT_MESSAGE_NOTIFICATION) {
			if (!this.props.IS_IN_CHAT)
				this.props.setStore(global.U_MESSAGE_INCREMENT, 1);
		}
		else if (notificationData.notification_type == global.ACCOUNT_STATUS_NOTIFICATION) {
			if (notificationData?.active == 0) {
				// await SetPrefrence(global.PREF_REMEMBER_ME, 0);
			}
		}
	} catch (error) {
		console.log('remote notification received error', error);
	}

	return Promise.resolve(notification);
}