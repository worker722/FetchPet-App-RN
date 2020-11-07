import React, { Component } from "react";
import {
  View
} from "react-native";

import { Image } from 'react-native-elements';
import { Images } from '../../config';

export default class Splash extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    setTimeout(() => {
      this.props.navigation.navigate("Login");
    }, 2000);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
        <Image source={Images.logo}></Image>
      </View>
    );
  }
}