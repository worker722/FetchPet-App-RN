import { Dimensions } from 'react-native';

const screen_width = Dimensions.get("window").width;
const screen_height = Dimensions.get("window").height;

export const Utils = {
    screen: {
        width: screen_width,
        height: screen_height
    }
}