import React from "react";
import { Image } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { BaseColor, BaseStyle, Images } from '@config';

// START UP PAGE
import Welcome from "@screen/StartUp/Welcome";
import Login from "@screen/StartUp/Login";
import SignUp from "@screen/StartUp/SignUp";

// HOME PAGE
import Home from "@screen/Home";
import AdDetail from "@screen/Home/AdDetail";
import AdvancedFilter from "@screen/Home/AdvancedFilter";
import FilterResult from "@screen/Home/AdvancedFilter/FilterResult";
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
import BlockContact from "@screen/Profile/Setting/BlockContact";

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
				return <Image source={focused ? Images.ic_home_fill : Images.ic_home} style={{ width: 18, height: 19 }} />;
			}
		})
	},
	Inbox: {
		screen: Inbox,
		navigationOptions: ({ navigation }) => ({
			title: "Inbox",
			tabBarIcon: ({ focused, tintColor }) => {
				return <Image source={focused ? Images.ic_chat_fill : Images.ic_chat} style={{ width: 20, height: 19 }} />;
			}
		})
	},
	Sell: {
		screen: Sell,
		navigationOptions: ({ navigation }) => ({
			title: "Sell",
			tabBarIcon: ({ focused, tintColor }) => {
				return (
					<Image source={Images.ic_sell} style={{ width: 48, height: 48, marginBottom: 30 }} />
				)
			}
		})
	},
	MyAds: {
		screen: MyAds,
		navigationOptions: ({ navigation }) => ({
			title: "MyAds",
			tabBarIcon: ({ focused, tintColor }) => {
				return <Image source={focused ? Images.ic_myads_fill : Images.ic_myads} style={{ width: 20, height: 19 }} />;
			}
		})
	},
	Profile: {
		screen: Profile,
		navigationOptions: ({ navigation }) => ({
			title: "Profile",
			tabBarIcon: ({ focused, tintColor }) => {
				return <Image source={focused ? Images.ic_profile_fill : Images.ic_profile} style={{ width: 20, height: 20 }} />;
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
		Login: {
			screen: Login
		},
		SignUp: {
			screen: SignUp
		},
		Home: {
			screen: Home
		},
		AdvancedFilter: {
			screen: AdvancedFilter
		},
		FilterResult: {
			screen: FilterResult
		},
		AdDetail: {
			screen: AdDetail
		},
		ImageSlider: {
			screen: ImageSlider
		},
		Notification: {
			screen: Notification
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
		BlockContact: {
			screen: BlockContact
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