import { StyleSheet } from "react-native";
import { BaseColor } from "./color";

export const BaseStyle = StyleSheet.create({
  tabBar: {
    shadowColor: BaseColor.whiteColor,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10
  }
});
