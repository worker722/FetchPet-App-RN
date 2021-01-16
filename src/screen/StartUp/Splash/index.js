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

export default class Splash extends Component {
	constructor(props) {
		super(props);
	}

	UNSAFE_componentWillMount = async () => {
		await this.requestPermission();
	}

	componentDidMount = () => {
		setTimeout(() => {
			this.props.navigation.navigate("Main");
		}, 2000);
	}

	requestPermission = async () => {
		try {
			if (Platform.OS == "android") {
				await PermissionsAndroid.requestMultiple(
					[
						PermissionsAndroid.PERMISSIONS.CAMERA,
						PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
						PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
						PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
						PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
					],
				);
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
				<Image source={Images.logo} style={{ width: 240, height: 80 }} resizeMode={"stretch"}></Image>
			</View>
		);
	}
}