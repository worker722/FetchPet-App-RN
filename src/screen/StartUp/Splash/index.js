import React, { Component } from "react";
import {
  View,
  PermissionsAndroid,
  Platform,
  Image
} from "react-native";
import geolocation from '@react-native-community/geolocation';

import { BaseColor, Images } from '@config';
import * as Utils from '@utils';
import { store, GetPrefrence } from '@store';
import * as global from "@api/global";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';

class Splash extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount = async () => {
    const navigation = this.props.navigation;

    const response = await this.props.api.post("accountStatus");
    if (response?.success && response?.data?.status == 1) {
      setTimeout(async () => {
        const rememberMe = await GetPrefrence(global.PREF_REMEMBER_ME);
        if (rememberMe == '1' && store.getState().auth.login?.user?.token)
          navigation.navigate("Home");
        else
          navigation.navigate("Welcome");
      }, 1000);
    }
    else {
      navigation.navigate("Welcome");
    }
  }

  componentDidMount = async () => {
    await this.requestPermission();
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
        }
      }
      else {
        geolocation.requestAuthorization();
        await Utils.getCurrentLocation();
      }
    } catch (err) {
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor, alignItems: "center", justifyContent: "center" }}>
        <Image source={Images.logo} style={{ width: 225, height: 80 }} resizeMode={"stretch"}></Image>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    api: bindActionCreators(Api, dispatch)
  };
};
export default connect(null, mapDispatchToProps)(Splash);