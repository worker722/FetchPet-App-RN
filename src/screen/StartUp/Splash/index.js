import React, { Component } from "react";
import {
  View
} from "react-native";

import { Image } from 'react-native-elements';
import { BaseColor, Images } from '@config';
import { store, SetPrefrence, GetPrefrence } from '@store';
export default class Splash extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    setTimeout(async () => {
      const navigation = this.props.navigation;

      const rememberMe = await GetPrefrence("rememberMe");
      if (rememberMe == '1' && store.getState().auth.login?.user?.token)
        navigation.navigate("Home");
      else
        navigation.navigate("Welcome");
    }, 2000);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor, alignItems: "center", justifyContent: "center" }}>
        <Image placeholderStyle={{ backgroundColor: "transparent" }} source={Images.logo} style={{ width: 225, height: 80 }} resizeMode={"stretch"}></Image>
      </View>
    );
  }
}