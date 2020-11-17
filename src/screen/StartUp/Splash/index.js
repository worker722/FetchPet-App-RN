import React, { Component } from "react";
import {
  View
} from "react-native";

import { Image } from 'react-native-elements';
import { Images } from '../../../config';

export default class Splash extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    setTimeout(() => {
      this.props.navigation.navigate("Welcome");
    }, 2000);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
        <Image placeholderStyle={{ backgroundColor: "transparent" }} source={Images.logo} style={{ width: 168, height: 60 }} resizeMode={"stretch"}></Image>
      </View>
    );
  }
}