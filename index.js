import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
import bgMessaging from '@bgMessaging';
import messaging from '@react-native-firebase/messaging';
import { name as appName } from './src/app.json';

messaging().setBackgroundMessageHandler(bgMessaging);

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        return null;
    }

    return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);