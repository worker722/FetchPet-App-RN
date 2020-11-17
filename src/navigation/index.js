import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Main from "./main";
import Splash from "@screen/StartUp/Splash";

const AppNavigator = createSwitchNavigator(
	{
		Splash: Splash,
		Main: Main
	},
	{
		initialRouteName: "Splash"
	}
);

export default createAppContainer(AppNavigator);
