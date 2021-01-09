import { createSwitchNavigator, createAppContainer } from "react-navigation";
import MainBuyer from "./MainBuyer";
import Splash from "@screen/StartUp/Splash";

const AppNavigator = createSwitchNavigator(
	{
		Splash: Splash,
		MainBuyer: MainBuyer
	},
	{
		initialRouteName: "Splash"
	}
);

export default createAppContainer(AppNavigator);
