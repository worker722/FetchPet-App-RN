import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Main from "./main";
import Splash from "@screen/StartUp/Splash";
import Welcome from "@screen/StartUp/Welcome";
import Login from "@screen/StartUp/Login";
import SignUp from "@screen/StartUp/SignUp";

const AppNavigator = createSwitchNavigator(
	{
		Splash: Splash,
		Welcome: Welcome,
		Login: Login,
		SignUp: SignUp,
		Main: Main
	},
	{
		initialRouteName: "Splash"
	}
);

export default createAppContainer(AppNavigator);
