import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Main from "./main";
import Splash from "../screen/Splash";

const AppNavigator = createSwitchNavigator(
	{
		Splash: Splash,
		Main: Main
	},
	{
		initialRouteName: "Loading"
	}
);

export default createAppContainer(AppNavigator);
