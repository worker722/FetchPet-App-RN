import React from "react";
import { Image } from 'react-native';
import { Images } from '@config';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { connect } from "react-redux";

// HOME PAGE
import Home from "@screen/Home";
import AdDetail from "@screen/Home/AdDetail";
import AdvancedFilter from "@screen/Home/AdvancedFilter";
import FilterResult from "@screen/Home/AdvancedFilter/FilterResult";
import ImageSlider from "@screen/Home/AdDetail/ImageSlider";

// DASHBOARD PAGE
import Dashboard from "@screen/Dashboard";

// OTHER PAGE
import Notification from "@screen/Notification";

// SELL PAGE
import Sell from "@screen/Sell";
import SellEdit from "@screen/Sell/SellEdit";
import CustomMap from "@screen/Sell/CustomMap";

// MY ADS PAGE
import MyAds from "@screen/MyAds";
import Favourite from "@screen/Favourite";

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
import NotifiSetting from "@screen/Profile/Setting/NotifiSetting";

// PACKAGE
import Package from "@screen/Package";

const Tab = createBottomTabNavigator();
const TabNavigator = (props) => {
	return (
		<Tab.Navigator
			initialRouteName={props.IS_BUYER_MODE ? "Home" : "Home"}>
			{props.IS_BUYER_MODE ?
				<>
					<Tab.Screen name="Home" component={Home}
						options={({ navigation }) => ({
							title: "Home",
							tabBarIcon: ({ focused, tintColor }) => {
								return <Image source={focused ? Images.ic_home_fill : Images.ic_home} />;
							}
						})} />
					<Tab.Screen name="Inbox" component={Inbox}
						options={({ navigation }) => ({
							title: "Chat",
							tabBarIcon: ({ focused, tintColor }) => {
								return <Image source={focused ? Images.ic_chat_fill : Images.ic_chat} />;
							}
						})} />
					<Tab.Screen name="Favourite" component={Favourite}
						options={({ navigation }) => ({
							title: "Favourite",
							tabBarIcon: ({ focused, tintColor }) => {
								return <Image source={focused ? Images.ic_favourite_fill : Images.ic_favourite} />;
							}
						})} />
				</>
				:
				<>
					<Tab.Screen name="Home" component={Dashboard}
						options={({ navigation }) => ({
							title: "Home",
							tabBarIcon: ({ focused, tintColor }) => {
								return <Image source={focused ? Images.ic_dashboard_fill : Images.ic_dashboard} />;
							}
						})} />
					<Tab.Screen name="Inbox" component={Inbox}
						options={({ navigation }) => ({
							title: "Chat",
							tabBarIcon: ({ focused, tintColor }) => {
								return <Image source={focused ? Images.ic_chat_fill : Images.ic_chat} />;
							}
						})} />
					<Tab.Screen name="Sell" component={Sell}
						options={({ navigation }) => ({
							title: "Sell",
							tabBarIcon: ({ focused, tintColor }) => {
								return (
									<Image source={Images.ic_sell} style={{ marginBottom: 30 }} resizeMode={"contain"} />
								)
							}
						})} />
					<Tab.Screen name="MyAds" component={MyAds}
						options={({ navigation }) => ({
							title: "MyAds",
							tabBarIcon: ({ focused, tintColor }) => {
								return <Image source={focused ? Images.ic_myads_fill : Images.ic_myads} />;
							}
						})} />
				</>
			}
			<Tab.Screen name="Profile" component={Profile}
				options={({ navigation }) => ({
					title: "Profile",
					tabBarIcon: ({ focused, tintColor }) => {
						return <Image source={focused ? Images.ic_profile_fill : Images.ic_profile} />;
					}
				})} />
		</Tab.Navigator>
	);
}

const mapStateToProps = ({ app: { IS_BUYER_MODE } }) => {
	return { IS_BUYER_MODE };
};

const BottomTabNavigator = connect(mapStateToProps, null)(TabNavigator);

const Stack = createStackNavigator();
const RootStack = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator headerMode="none" initialRouteName="BottomTabNavigator">
				<Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
				<Stack.Screen name="AdvancedFilter" component={AdvancedFilter} />
				<Stack.Screen name="FilterResult" component={FilterResult} />
				<Stack.Screen name="AdDetail" component={AdDetail} />
				<Stack.Screen name="ImageSlider" component={ImageSlider} />
				<Stack.Screen name="Notification" component={Notification} />
				<Stack.Screen name="Chat" component={Chat} />
				<Stack.Screen name="ProfileEdit" component={ProfileEdit} />
				<Stack.Screen name="ShowProfile" component={ShowProfile} />
				<Stack.Screen name="Help" component={Help} />
				<Stack.Screen name="Version" component={Version} />
				<Stack.Screen name="ContactSupport" component={ContactSupport} />
				<Stack.Screen name="Setting" component={Setting} />
				<Stack.Screen name="NotifiSetting" component={NotifiSetting} />
				<Stack.Screen name="Privacy" component={Privacy} />
				<Stack.Screen name="BlockContact" component={BlockContact} />
				<Stack.Screen name="CustomMap" component={CustomMap} />
				<Stack.Screen name="SellEdit" component={SellEdit} />
				<Stack.Screen name="Package" component={Package} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default RootStack;