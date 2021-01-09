import * as global from "@api/global";

export default async (notification) => {
  try {
    const { data } = notification;
    const notificationData = JSON.parse(data.data);
    if (notificationData.notification_type == global.CHAT_MESSAGE_NOTIFICATION) {
      if (!this.props.IS_IN_CHAT)
        this.props.setStore(global.U_MESSAGE_INCREMENT, 1);
    }
  } catch (error) {
    console.log('index notification received error', error);
  }

  return Promise.resolve(notification);
}