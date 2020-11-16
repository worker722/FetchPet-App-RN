import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Icon from 'react-native-vector-icons/FontAwesome5';

import { BaseColor, BaseStyle } from '../config'
/* Main Screen */
import Welcome from "../screen/Welcome";
import Login from "../screen/Login";
import SignUp from "../screen/SignUp";

// bottom navigation
import Home from "../screen/Home";
import Chat from "../screen/Chat";
import Sell from "../screen/Sell";
import MyAds from "../screen/MyAds";
import Profile from "../screen/Profile";

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
	Chat: {
		screen: Chat,
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
				return <Icon color={tintColor} name="plus-circle" size={20} solid={focused ? true : false} />
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