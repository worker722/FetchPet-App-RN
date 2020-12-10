import React from "react";
import { View, Image } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Icon from 'react-native-vector-icons/FontAwesome5';

import { BaseColor, BaseStyle, Images } from '@config';

/* start up Screen */
import Welcome from "@screen/StartUp/Welcome";
import Login from "@screen/StartUp/Login";
import SignUp from "@screen/StartUp/SignUp";

// bottom navigation
import Home from "@screen/Home";
import AdDetail from "@screen/Home/AdDetail";

// other page
import Notification from "@screen/Notification";

// sell
import Sell from "@screen/Sell";
import SellEdit from "@screen/Sell/SellEdit";
import CustomMap from "@screen/Sell/CustomMap";

// my ads
import MyAds from "@screen/MyAds";

//chat
import Inbox from "@screen/Inbox";
import Chat from "@screen/Inbox/Chat";

//profile
import Profile from "@screen/Profile";
import ProfileEdit from "@screen/Profile/ProfileEdit";
import ShowProfile from "@screen/Profile/ProfileEdit/ShowProfile";
import Help from "@screen/Profile/Help";
import Version from "@screen/Profile/Help/Version";
//setting
import Setting from "@screen/Profile/Setting";
import Privacy from "@screen/Profile/Setting/Privacy";


// Config for bottom navigator
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

// Tab bar navigation
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
					<Image
						source={focused ? Images.ic_sell_fill : Images.ic_sell}
						style={{
							width: 40,
							height: 40,
							alignContent: 'center',
							marginBottom: 15,
							borderRadius: 100,
							zIndex: 1000
						}}
					/>
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

// Define bottom navigator as a screen in stack
const BottomTabNavigator = createBottomTabNavigator(
	routeConfigs,
	bottomTabNavigatorConfig
);

// Main Stack View App
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

// Define Root Stack support Modal Screen
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