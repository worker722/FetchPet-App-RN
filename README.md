# 0.59.8 to 0.63.4

1. AsyncStorage was moved on react-native. So use from @react-native-async-storage/async-storage
2. Add @react-native-community/datetimepicker
3. @react-native-community/masked-view, react-native-screens, react-native-safe-area-context, react-native-reanimated for react-navigation
4. Add jetifier to convert Native Java Code to AndroidX from react native dependencies
  ```
  ##  on project root
  npx jetify
  ```
5. WebView was moved on react-native. So use from react-native-webview
6. Drawer navigation on react-navigation-drawer
7. react-native-firebase and fbsdk upgrade
  ##
    pod 'FBSDKCoreKit', '8.1'
    pod 'FBSDKLoginKit', '8.1'
    pod 'FBSDKShareKit', '8.1'

    pod 'Firebase/Core', '~> 7.4.0'
    pod 'Firebase/Messaging', '~> 7.4.0'
  ##
8. after react-native 0.61.0 + packages auto linking
9. scrpit starting command upgrade as following
   # on package.json
      "android": "react-native run-android",
      "ios": "react-native run-ios",
      "start": "react-native start",
