import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';
import Toast from 'react-native-simple-toast';
import * as actionTypes from "./actionTypes";

const SERVER_HOST = 'http://10.0.2.2:8000';

const onLogin = data => {
    return {
        type: actionTypes.LOGIN,
        data
    };
};

export const _TOKEN = () => {
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYjQ5ODRhMGIzYzY3ZjYyMjMxOWYxMjFlODJkOWI0MzIwNWVkNDI3MDM1YjczNTIzZjJjMTU1YTI3N2I0ZGQ2YTg4YzBlZjcwNjJlMThjMjgiLCJpYXQiOjE2MDU3NDM5ODksIm5iZiI6MTYwNTc0Mzk4OSwiZXhwIjoxNjM3Mjc5OTg5LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.VLl-2Fy3UpxtDplxHHQTsxQVrLUS24FoUHHAuMFZA0lVEtU_hxsOIA7pCtjk7PnJRutqU1zqz_LcaeYjefQgV_U-F15t-oxQw8J6FqradoUtb_hyUeHgjK71yuZp_3DMNy925ujeHr324Mpw1mW2UvR04DNGFLGtKUUWx5QmQB7uqXXfWXTgFbRxedVPaXpBoaHWOvTbamjkGawfPtQaCRZT3Y_5D_Bq3mkt1xY3OXCEFvIziwmecODPgOMUIjkaoss9zwvvLN5UH-g0mJJXmuOt8iHZbACYLPlBDnqcMPapcLvkdCz1OHSiyUgXe3vm-ESuHGUPTq_YTSwHo9ABrWaYUBeCmeAcRgE5oYKH1yPfbw3KpaAdMOChDqOZZkQ-LnBCc82MDTHHiWPw46cXL-i8hhW8ymwM96MM7fibluSljqXLOCA0xQ8l9luy9Qc2ggyX4Jpan0RDr8lZHHJWHPiihGGAiBKZCuhHKI-5NDYPGt8J30ebj0sn4hPjTSgLhqi8S3DMPnrbHMEFY6_q6wL6dhjDwHuh7T_nyLIu3cPc1SFeCRKe8TYCSaXHl68M6khSdgR61Tub-4sVZLxieyzlBf3Qzo7tpGYDf3gAVhgv9Y2h13zU2FhbPBNHkmusWOsu97ky_-kmpBP5YXaqNTDzPZt6cXNuDS98yuxZEMs";
    return token;
}

export const get = (route) => async dispatch => {
    return fetch(`${SERVER_HOST}/api/${route}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
    })
        .then(res => res.json())
        .then(res => {
            Toast.show(res.message);
            dispatch(onLogin(res.data))
            return res;
        })
        .catch(err => showNetworkError());
}

export const post = (route, params) => async dispatch => {
    return fetch(`${SERVER_HOST}/api/${route}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(params)
    })
        .then(res => res.json())
        .then(res => {
            Toast.show(res.message);
            dispatch(onLogin(res.data))
            return res;
        })
        .catch(err => showNetworkError());
}

export const showNetworkError = () => {
    Alert.alert(
        'Network Error!',
        'Click Ok To Restart App.',
        [
            { text: 'OK', onPress: () => RNRestart.Restart() },
        ],
        { cancelable: false },
    );
}