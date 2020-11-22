
import { AppRegistry } from 'react-native';
import App from './src/App';
import bgMessaging from '@bgMessaging';
import { name as appName } from './src/app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);