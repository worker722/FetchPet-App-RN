import React, { Component } from "react";
import {
  View,
  PermissionsAndroid,
  Platform
} from "react-native";
import geolocation from '@react-native-community/geolocation';

import { Image } from 'react-native-elements';
import { BaseColor, Images } from '@config';
import * as Utils from '@utils';
import { store, GetPrefrence } from '@store';

export default class Splash extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    await this.requestPermission();
    setTimeout(async () => {
      const navigation = this.props.navigation;

      const rememberMe = await GetPrefrence("rememberMe");
      if (rememberMe == '1' && store.getState().auth.login?.user?.token)
        navigation.navigate("Home");
      else
        navigation.navigate("Welcome");
    }, 2000);
  }

  requestPermission = async () => {
    try {
      if (Platform.OS == "android") {
        const granted = await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
          ],
        );
        if (
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('permission ok');
        }
      }
      else {
        geolocation.requestAuthorization();
        const response = await Utils.getCurrentLocation();
        console.log('location', response);
      }
    } catch (err) {
      console.log("permission eror", err)
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor, alignItems: "center", justifyContent: "center" }}>
        <Image placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} source={Images.logo} style={{ width: 225, height: 80 }} resizeMode={"stretch"}></Image>
      </View>
    );
  }
}