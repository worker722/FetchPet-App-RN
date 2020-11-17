import React from "react";
import { View, Image } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Icon from 'react-native-vector-icons/FontAwesome5';

import { BaseColor, BaseStyle } from '../config'
/* start up Screen */
import Welcome from "../screen/Welcome";
import Login from "../screen/Login";
import SignUp from "../screen/SignUp";

// bottom navigation
import Home from "../screen/Home";
import ChatList from "../screen/ChatList";
import Sell from "../screen/Sell";
import MyAds from "../screen/MyAds";
import Profile from "../screen/Profile";

// other page
import Notification from "../screen/Notification";
import AdDetail from "../screen/AdDetail";
import Chat from "../screen/Chat";
import ProfileEdit from "../screen/ProfileEdit";
import Other from "../screen/Other";
import Setting from "../screen/Setting";
import Help from "../screen/Help";


// Config for bottom navigator
const bottomTabNavigatorConfig = {
	initialRouteName: "Home",
	tabBarOptions: {
		showIcon: true,
		showLabel: true,
		activeTintColor: BaseColor.primaryColor,
		inactiveTintColor: BaseColor.grayColor,
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
	ChatList: {
		screen: ChatList,
		navigationOptions: ({ navigation }) => ({
			title: "Chat",
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
						source={focused ? require('../assets/images/sell-fill.png') : require('../assets/images/sell.png')}
						style={{
							width: 40,
							height: 40,
							alignContent: 'center',
							backgroundColor: "#fff",
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
		Other: {
			screen: Other
		},
		Help: {
			screen: Help
		},
		Setting: {
			screen: Setting
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