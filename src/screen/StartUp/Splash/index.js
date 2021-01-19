import React, { Component } from "react";
import {
	View,
	PermissionsAndroid,
	Platform,
	Image,
	BackHandler,
	Linking,
	Alert
} from "react-native";
import geolocation from '@react-native-community/geolocation';

import VersionCheck from 'react-native-version-check';

import { BaseColor, Images } from '@config';
import * as Utils from '@utils';
import { GetPrefrence } from '@store';
import * as global from "@api/global";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';

class Splash extends Component {
	constructor(props) {
		super(props);
	}

	UNSAFE_componentWillMount = async () => {
		await this.checkVersionUpdateNeeded();
		await this.requestPermission();
	}

	componentDidMount = async () => {
		const navigation = this.props.navigation;
		this.props.setStore(global.NAVIGATION, navigation);
		this.props.setStore(global.PUSH_ALERT, null);
		if (Api._TOKEN()) {
			const response = await this.props.api.post("accountStatus");
			if (response?.success) {
				setTimeout(async () => {
					const rememberMe = await GetPrefrence(global.PREF_REMEMBER_ME);
					if (rememberMe == 1)
						navigation.navigate("Main");
					else
						navigation.navigate("Welcome");
				}, 1000);
			}
			else {
				navigation.navigate("Welcome");
			}
		}
		else {
			setTimeout(() => {
				navigation.navigate("Welcome");
			}, 2000);
		}
	}

	checkVersionUpdateNeeded = async () => {
		const updateNeeded = await VersionCheck.needUpdate();
		if (updateNeeded.isNeeded) {
			Alert.alert(
				'Please Update', 'You will have to update your app to the latest version to continue using.',
				[
					{
						text: 'OK', onPress: () => {
							BackHandler.exitApp();
							Linking.openURL(updateNeeded.storeUrl)
						}
					},
				],
				{ cancelable: false },
			);
		}
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
				<Image source={Images.logo} style={{ width: 192, height: 80 }} resizeMode={"stretch"}></Image>
			</View>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		api: bindActionCreators(Api, dispatch),
		setStore: (type, data) => dispatch({ type, data })
	};
};

export default connect(null, mapDispatchToProps)(Splash);