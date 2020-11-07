import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Icon from 'react-native-vector-icons/FontAwesome5';

import { BaseColor, BaseStyle } from '../config'
/* Main Screen */
import Welcome from "../screen/Welcome";
import Home from "../screen/Home";
import Login from "../screen/Login";
import SignUp from "../screen/SignUp";

// Config for bottom navigator
// const bottomTabNavigatorConfig = {
// 	initialRouteName: "Home",
// 	tabBarOptions: {
// 		showIcon: true,
// 		showLabel: true,
// 		activeTintColor: BaseColor.primaryColor,
// 		inactiveTintColor: BaseColor.grayColor,
// 		style: BaseStyle.tabBar,
// 		labelStyle: {
// 			fontSize: 12
// 		}
// 	}
// };

// Tab bar navigation
// const routeConfigs = {
// 	Home: {
// 		screen: Home,
// 		navigationOptions: ({ navigation }) => ({
// 			title: "Home",
// 			tabBarIcon: ({ focused, tintColor }) => {
// 				return <Icon color={tintColor} name="home" size={20} solid />;
// 			}
// 		})
// 	},
// 	Help: {
// 		screen: Help,
// 		navigationOptions: ({ navigation }) => ({
// 			title: "Help",
// 			tabBarIcon: ({ focused, tintColor }) => {
// 				return <Icon color={tintColor} name="question-circle" size={20} solid />;
// 			}
// 		})
// 	},
// 	Setting: {
// 		screen: Setting,
// 		navigationOptions: ({ navigation }) => ({
// 			title: "Setting",
// 			tabBarIcon: ({ focused, tintColor }) => {
// 				return <Icon color={tintColor} name="cog" size={20} solid />
// 			}
// 		})
// 	}
// };

// Define bottom navigator as a screen in stack
// const BottomTabNavigator = createBottomTabNavigator(
// 	routeConfigs,
// 	bottomTabNavigatorConfig
// );

// Main Stack View App
const StackNavigator = createStackNavigator(
	{
		// BottomTabNavigator: {
		// 	screen: BottomTabNavigator
		// },
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
		initialRouteName: "Welcome"
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