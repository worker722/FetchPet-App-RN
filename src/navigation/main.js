import React from "react";
import { Image, View } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BaseColor, BaseStyle, Images } from '@config';

// START UP PAGE
import Welcome from "@screen/StartUp/Welcome";
import Login from "@screen/StartUp/Login";
import SignUp from "@screen/StartUp/SignUp";

// HOME PAGE
import Home from "@screen/Home";
import AdDetail from "@screen/Home/AdDetail";
import ImageSlider from "@screen/Home/AdDetail/ImageSlider";

// OTHER PAGE
import Notification from "@screen/Notification";

// SELL PAGE
import Sell from "@screen/Sell";
import SellEdit from "@screen/Sell/SellEdit";
import CustomMap from "@screen/Sell/CustomMap";

// MY ADS PAGE
import MyAds from "@screen/MyAds";

// CHAT PAGE
import Inbox from "@screen/Inbox";
import Chat from "@screen/Inbox/Chat";

// PROFILE PAGE
import Profile from "@screen/Profile";
import ProfileEdit from "@screen/Profile/ProfileEdit";
import ShowProfile from "@screen/Profile/ProfileEdit/ShowProfile";
import Help from "@screen/Profile/Help";
import Version from "@screen/Profile/Help/Version";
import ContactSupport from "@screen/Profile/Help/ContactSupport";
import Setting from "@screen/Profile/Setting";
import Privacy from "@screen/Profile/Setting/Privacy";

// CONFIG FOR BOTTOM NAVIGATOR
const bottomTabNavigatorConfig = {
	initialRouteName: "Home",
	tabBarOptions: {
		showIcon: true,
		showLabel: true,
		activeTintColor: BaseColor.primaryColor,
		inactiveTintColor: BaseColor.greyColor,
		style: BaseStyle.tabBar,
		labelStyle: {
			fontSize: 12
		}
	}
};

// TAB BAR NAVIGATION
const routeConfigs = {
	Home: {
		screen: Home,
		navigationOptions: ({ navigation }) => ({
			title: "Home",
			tabBarIcon: ({ focused, tintColor }) => {
				return <Icon color={tintColor} name="home" size={20} solid={focused ? true : false} />;
			}
		})
	},
	Inbox: {
		screen: Inbox,
		navigationOptions: ({ navigation }) => ({
			title: "Inbox",
			tabBarIcon: ({ focused, tintColor }) => {
				return <Icon color={tintColor} name="comment-dots" size={20} solid={focused ? true : false} />;
			}
		})
	},
	Sell: {
		screen: Sell,
		navigationOptions: ({ navigation }) => ({
			title: "Sell",
			tabBarIcon: ({ focused, tintColor }) => {
				return (
					<View
						style={{
							width: 40,
							height: 40,
							justifyContent: "center",
							alignItems: "center",
							marginBottom: 30,
							borderRadius: 100,
							backgroundColor: BaseColor.whiteColor
						}}
					>
						<Image source={focused ? Images.ic_sell_fill : Images.ic_sell} />
					</View>
				)
			}
		})
	},
	MyAds: {
		screen: MyAds,
		navigationOptions: ({ navigation }) => ({
			title: "MyAds",
			tabBarIcon: ({ focused, tintColor }) => {
				return <Icon color={tintColor} name="heart" size={20} solid={focused ? true : false} />
			}
		})
	},
	Profile: {
		screen: Profile,
		navigationOptions: ({ navigation }) => ({
			title: "Profile",
			tabBarIcon: ({ focused, tintColor }) => {
				return <Icon color={tintColor} name="user-circle" size={20} solid={focused ? true : false} />
			}
		})
	}
};

// DEFINE BOTTOM NAVIGATOR AS A SCREEN IN STACK
const BottomTabNavigator = createBottomTabNavigator(
	routeConfigs,
	bottomTabNavigatorConfig
);

// MAIN STACK VIEW APP
const StackNavigator = createStackNavigator(
	{
		BottomTabNavigator: {
			screen: BottomTabNavigator
		},
		Welcome: {
			screen: Welcome
		},
		Home: {
			screen: Home
		},
		Login: {
			screen: Login
		},
		SignUp: {
			screen: SignUp
		},
		Notification: {
			screen: Notification
		},
		AdDetail: {
			screen: AdDetail
		},
		ImageSlider: {
			screen: ImageSlider
		},
		Chat: {
			screen: Chat
		},
		ProfileEdit: {
			screen: ProfileEdit
		},
		ShowProfile: {
			screen: ShowProfile
		},
		Help: {
			screen: Help
		},
		Version: {
			screen: Version
		},
		ContactSupport: {
			screen: ContactSupport
		},
		Setting: {
			screen: Setting
		},
		Privacy: {
			screen: Privacy
		},
		CustomMap: {
			screen: CustomMap
		},
		SellEdit: {
			screen: SellEdit
		}
	},
	{
		headerMode: "none",
		initialRouteName: "BottomTabNavigator"
	}
);

// DEFINE ROOT STACK SUPPORT MODAL SCREEN
const RootStack = createStackNavigator(
	{
		StackNavigator: {
			screen: StackNavigator
		}
	},
	{
		mode: "modal",
		headerMode: "none",
		initialRouteName: "StackNavigator",
	}
);

export default RootStack;