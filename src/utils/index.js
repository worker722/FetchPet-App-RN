import { Dimensions } from 'react-native';
import Moment from 'moment';
import geolocation from '@react-native-community/geolocation';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const EMAIL_REGEX = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
const NUMBER_REGEX = /^\d+$/;

export const GOOGLE_GEO_API_KEY = 'AIzaSyDjLHfb1SLxXyuDBrzgrlwroA7LMRJ8EKQ';
export const GOOGLE_OAUTH_WEB_CLIENT_ID = '1007858365668-c8e7pmt0htjmd33ua386rmib3fhe9qt4.apps.googleusercontent.com';
export const GOOGLE_MAP_API_URL = 'https://maps.googleapis.com/maps/api/';

export const BOOST_ADS_DISTANCE = 100;

export const SCREEN = {
    WIDTH: SCREEN_WIDTH,
    HEIGHT: SCREEN_HEIGHT
};

export const isValidEmail = (email) => {
    return EMAIL_REGEX.test(String(email).toLowerCase());
};

export const isValidNumber = (number) => {
    if (number == '')
        return true;
    return NUMBER_REGEX.test(String(number));
}

export const DATE2STR = (date, format) => {
    if (!date) return '';
    return Moment(date).format(format)
};

export const relativeTime = (date) => {
    if (!date) return '';
    const now = Moment();
    const expiration = Moment(date).add(-8, 'seconds');
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
            geolocation.getCurrentPosition(
                (data) => resolve(data.coords),
                (err) => reject(err)
            );
        }
    );
};

export const getAddressByCoords = async (latitude, longitude, callback) => {
    const params = `address=${latitude},${longitude}&key=${GOOGLE_GEO_API_KEY}`;
    fetch(`${GOOGLE_MAP_API_URL}geocode/json?${encodeURI(params)}`)
        .then((response) => response.json())
        .then((responseJson) => {
            const address = {
                short: responseJson.results[responseJson.results.length - 2].formatted_address,
                long: responseJson.results[0].formatted_address
            };
            callback(address);
        }).catch((error) => callback(null));
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

        if (!unit)
            unit = "N";

        if (unit == "K") { dist = dist * 1.609344 }
        else if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}