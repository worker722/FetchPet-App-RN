import { StyleSheet } from "react-native";
import { Responsive, BaseColor } from "@config";

import { getStatusBarHeight } from "react-native-status-bar-height";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10000,
    elevation: 10000,
    backgroundColor: BaseColor.whiteColor
  },
  alertBGContainer: {
    paddingHorizontal: Responsive.widthPercentageToDP("8%"),
    paddingTop:
      Responsive.heightPercentageToDP("3%") + getStatusBarHeight(true),
    paddingBottom: Responsive.heightPercentageToDP("3%"),
  },
  alertMainContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageStyle: {
    marginRight: Responsive.widthPercentageToDP("5%"),
    aspectRatio: 1,
  },
  alertTitleStyle: {
    fontSize: Responsive.convertFontScale("18"),
    fontWeight: "900",
    color: BaseColor.whiteColor,
    marginVertical: Responsive.heightPercentageToDP("0.5%"),
  },
  alertMessageStyle: {
    fontSize: Responsive.convertFontScale("15"),
    fontWeight: "500",
    color: BaseColor.whiteColor,
    marginVertical: Responsive.heightPercentageToDP("0.5%"),
  },
  alertButtonStyle: {
    width: Responsive.widthPercentageToDP("18%"),
    height: Responsive.heightPercentageToDP("4%"),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BaseColor.whiteColor,
    borderRadius: Responsive.heightPercentageToDP("2%"),
    marginHorizontal: Responsive.widthPercentageToDP("2%"),
  },
  alertButtonContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: Responsive.heightPercentageToDP("1%"),
  },
  alertButtonTextStyle: {
    fontSize: Responsive.convertFontScale(12),
    fontWeight: "500",
    color: BaseColor.blackColor,
  },
});

export default { styles };
