import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';
import Toast from 'react-native-simple-toast';
import * as actionTypes from "./actionTypes";
import { store } from '@store';

const SERVER_HOST = 'http://10.0.2.2:8000';

const onLogin = data => {
    return {
        type: actionTypes.LOGIN,
        data
    };
};

export const _TOKEN = () => {
    try {
        const token = store.getState().auth.login.user.token;
        return token;
    } catch (error) {
        return null;
    }
}

export const get = (route) => async dispatch => {
    return fetch(`${SERVER_HOST}/api/${route}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${_TOKEN()}`
        },
    })
        .then(res => res.json())
        .then(res => {
            Toast.show(res.message);
            return res;
        })
        .catch(err => showNetworkError());
}

export const post = (route, params) => async dispatch => {
    return fetch(`${SERVER_HOST}/api/${route}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${_TOKEN()}`
        },
        body: JSON.stringify(params)
    })
        .then(res => res.json())
        .then(res => {
            Toast.show(res.message);
            if (res.success)
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