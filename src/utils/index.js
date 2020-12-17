import { Dimensions, Platform } from 'react-native';
import Moment from 'moment';
import geolocation from '@react-native-community/geolocation';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const EMAIL_VALIDATE = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

export const GOOGLE_API_KEY = 'AIzaSyDjLHfb1SLxXyuDBrzgrlwroA7LMRJ8EKQ';
export const GOOGLE_MAP_API_URL = 'https://maps.googleapis.com/maps/api/';

export const SCREEN = {
    WIDTH: SCREEN_WIDTH,
    HEIGHT: SCREEN_HEIGHT
};

export const isValidEmail = (email) => {
    return EMAIL_VALIDATE.test(String(email).toLowerCase());
};

export const DATE2STR = (date, format) => {
    if (!date) return '';
    return Moment(date).format(format)
};

export const relativeTime = (date) => {
    if (!date) return '';
    const now = Moment();
    const expiration = Moment(date).add(-50, 'seconds');
    const diff = now.diff(expiration);
    const diffDuration = Moment.duration(diff);
    const days = diffDuration.days();
    const hours = diffDuration.hours();
    const mins = diffDuration.minutes();
    const secs = diffDuration.seconds();
    if (days <= 0) {
        if (hours <= 0) {
            if (mins <= 0) return `${secs} sec${secs > 1 ? 's ago' : ' ago'}`;
            else return `${mins} min${mins > 1 ? 's ago' : ' ago'}`;
        } else {
            return `${hours} hour${hours > 1 ? 's ago' : ' ago'}`;
        }
    } else if (days < 3) {
        return `${days} day${days > 1 ? 's ago' : ' ago'}`;
    }
    return DATE2STR(date, 'D MMM');
};

export const getCurrentLocation = async () => {
    return new Promise(
        async (resolve, reject) => {
            if (Platform.OS == "ios")
                await geolocation.requestAuthorization();
            geolocation.getCurrentPosition(
                (data) => resolve(data.coords),
                (err) => reject(err)
            );
        }
    );
};

export const getAddressByCoords = async (latitude, longitude, shortAddress, callback) => {
    const params = `address=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
    fetch(`${GOOGLE_MAP_API_URL}geocode/json?${encodeURI(params)}`)
        .then((response) => response.json())
        .then((responseJson) => {
            if (shortAddress)
                callback(responseJson.results[responseJson.results.length - 2].formatted_address);
            else
                callback(responseJson.results[0].formatted_address);
        }).catch((error) => console.log(error));
};

export const getDistance = async (lat1, lng1, lat2, lng2, unit) => {
    if ((lat1 == lat2) && (lng1 == lng2))
        return 0;
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lng1 - lng2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        return dist;
    }
}