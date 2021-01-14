import {
    PixelRatio,
    Platform
} from 'react-native';
import * as Utils from '@utils';

const convertFontScale = fontSize => {
    const baseSize = Platform.select({ ios: 375, android: 420 });
    return fontSize * (Utils.SCREEN.WIDTH / baseSize);
};

const widthPercentageToDP = widthPercent => {
    const elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel((Utils.SCREEN.WIDTH * elemWidth) / 100);
};

const heightPercentageToDP = heightPercent => {
    const elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel((Utils.SCREEN.HEIGHT * elemHeight) / 100);
};

const listenOrientationChange = that => {
    Dimensions.addEventListener('change', newDimensions => {
        Utils.SCREEN.WIDTH = newDimensions.window.width;
        Utils.SCREEN.HEIGHT = newDimensions.window.height;
        that.setState({
            orientation: Utils.SCREEN.WIDTH < Utils.SCREEN.HEIGHT ? 'portrait' : 'landscape',
        });
    });
};

const removeOrientationListener = () => {
    Dimensions.removeEventListener('change', () => { });
};

export default {
    widthPercentageToDP,
    heightPercentageToDP,
    listenOrientationChange,
    removeOrientationListener,
    convertFontScale,
};