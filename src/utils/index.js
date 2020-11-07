import { Dimensions } from 'react-native';

const screen_width = Dimensions.get("screen").width;
const screen_height = Dimensions.get("screen").height;

export const Utils = {
    screen: {
        width: screen_width,
        height: screen_height
    }
}