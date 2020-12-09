import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';
import Toast from 'react-native-simple-toast';
import * as global from "./global";
import { store } from '@store';

export const SERVER_HOST = 'http://10.0.2.2:8000';
// export const SERVER_HOST = 'http://54.177.72.41';

const onLogin = data => {
    return {
        type: global.LOGIN,
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
            if (res.message != '')
                Toast.show(res.message);
            return res;
        })
        .catch(err => {
            if (_TOKEN() != null) {
                console.log('method-get-error', err);
                // showNetworkError();
            }
        });
}

export const post = (route, params, is_store) => async dispatch => {
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
            if (res.message != '')
                Toast.show(res.message);
            if (res.success && is_store)
                dispatch(onLogin(res.data))
            return res;
        })
        .catch(err => {
            if (_TOKEN() != null) {
                console.log('method-post-error', err);
                // showNetworkError();
            }
        });
}

export const editProfile = (route, image, params) => async dispatch => {
    const formData = new FormData();

    const keys = Object.keys(params);
    keys.forEach(item => {
        formData.append(item, params[item]);
    });

    const extension = image.mime.substring(image.mime.indexOf("/") + 1, image.mime.length);
    const photo = {
        uri: image.path,
        type: image.mime,
        name: "profile_image." + extension,
    };
    formData.append('profile_image', photo);

    return fetch(`${SERVER_HOST}/api/${route}`, {
        method: 'POST',
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': `Bearer ${_TOKEN()}`
        },
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            if (res.message != '')
                Toast.show(res.message);
            dispatch(onLogin(res.data))
            return res;
        })
        .catch(err => {
            if (_TOKEN() != null) {
                console.log('ads-upload-error', err);
                // showNetworkError();
            }
        });
}

export const createAds = (route, images, params) => async dispatch => {
    const formData = new FormData();

    const keys = Object.keys(params);
    keys.forEach(item => {
        formData.append(item, params[item]);
    });

    for (var i = 0; i < images.length; i++) {
        const extension = images[i].mime.substring(images[i].mime.indexOf("/") + 1, images[i].mime.length);
        const photo = {
            uri: images[i].path,
            type: images[i].mime,
            name: "ad_image." + extension,
        };
        formData.append('ad_image[]', photo);
    }

    return fetch(`${SERVER_HOST}/api/${route}`, {
        method: 'POST',
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': `Bearer ${_TOKEN()}`
        },
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            if (res.message != '')
                Toast.show(res.message);
            return res;
        })
        .catch(err => {
            if (_TOKEN() != null) {
                console.log('ads-upload-error', err);
                // showNetworkError();
            }
        });
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