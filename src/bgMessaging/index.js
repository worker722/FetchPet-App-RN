
import { Platform } from 'react-native';
import firebase from 'react-native-firebase';
import * as global from "@api/global";
import { BaseColor } from '@config';

export default async (message) => {
  console.log("background message")
  if (Platform.OS === "android") {
    const localNotification = new firebase.notifications.Notification({
      sound: 'default',
      show_in_foreground: true,
    })
      .setNotificationId(new Date().toLocaleString())
      .setTitle(message.data.title)
      .setBody(message.data.body)
      .android.setChannelId(global.NOTIFICATION_CHANNEL_ID)
      .android.setColor(BaseColor.primaryColor)
      .android.setSmallIcon('ic_notification')
      .android.setPriority(firebase.notifications.Android.Priority.High);

    firebase.notifications()
      .displayNotification(localNotification)
      .catch(err => console.error(err));
  }
  else {
    const localNotification = new firebase.notifications.Notification()
      .setNotificationId(new Date().toLocaleString())
      .setTitle(message.data.title)
      .setBody(message.data.body)

    firebase.notifications()
      .displayNotification(localNotification)
      .catch(err => console.error(err));
  }

  return Promise.resolve(message);
}