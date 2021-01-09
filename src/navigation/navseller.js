import { createSwitchNavigator, createAppContainer } from "react-navigation";
import MainSeller from "./MainSeller";
import Splash from "@screen/StartUp/Splash";

const AppNavigator = createSwitchNavigator(
	{
		Splash: Splash,
		MainSeller: MainSeller
	},
	{
		initialRouteName: "Splash"
	}
);

export default createAppContainer(AppNavigator);
