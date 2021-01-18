import { Platform } from 'react-native';
import * as global from "./global";
import { store } from '@store';

// export const SERVER_HOST = 'http://10.0.2.2';
// export const SERVER_HOST = 'http://192.168.109.72';
// export const SERVER_HOST = 'https://fetch.market';
export const SERVER_HOST = 'http://18.219.134.49';

const onLogin = data => {
    return {
        type: global.LOGIN,
        data
    };
};

export const _TOKEN = () => {
    try {
        const token = store?.getState()?.auth?.login?.user?.token;
        return token;
    } catch (error) {
        return null;
    }
}

export const get = (route) => async dispatch => {
    return fetch(`${SERVER_HOST}/api/${route}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${_TOKEN()}`
        },
    })
        .then(res => res.json())
        .then(res => {
            if (res.message != '')
                global.showToastMessage(res.message);
            return res;
        })
        .catch(err => {
            console.log('method-get-error', err, route);
            return null;
        });
}

export const post = (route, params, is_store) => async dispatch => {
    return fetch(`${SERVER_HOST}/api/${route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${_TOKEN()}`
        },
        body: JSON.stringify(params)
    })
        .then(res => res.json())
        .then(res => {
            if (res.message != '')
                global.showToastMessage(res.message);
            if (res.success && is_store)
                dispatch(onLogin(res.data))
            return res;
        })
        .catch(err => {
            console.log('method-post-error', err, route, params);
            return null;
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
        uri: Platform.OS == "android" ? image.path : `file://${image.path}`,
        type: image.mime,
        name: `profile_image.${extension}`,
    };
    formData.append('profile_image', photo);

    return fetch(`${SERVER_HOST}/api/${route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${_TOKEN()}`
        },
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            if (res.message != '')
                global.showToastMessage(res.message);
            dispatch(onLogin(res.data))
            return res;
        })
        .catch(err => {
            console.log('profile-upload-error', err);
            return null;
        });
}

export const postMessage = (route, image, params) => async dispatch => {
    const formData = new FormData();

    const keys = Object.keys(params);
    keys.forEach(item => {
        formData.append(item, params[item]);
    });

    const extension = image.mime.substring(image.mime.indexOf("/") + 1, image.mime.length);
    const photo = {
        uri: Platform.OS == "android" ? image.path : `file://${image.path}`,
        type: image.mime,
        name: `chat_image.${extension}`,
    };
    formData.append('chat_image', photo);

    return fetch(`${SERVER_HOST}/api/${route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${_TOKEN()}`
        },
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            if (res.message != '')
                global.showToastMessage(res.message);
            return res;
        })
        .catch(err => {
            console.log('chat-upload-error', err);
            return null;
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
            uri: Platform.OS == "android" ? images[i].path : `file://${images[i].path}`,
            type: images[i].mime,
            name: `ad_image.${extension}`,
        };
        formData.append('ad_image[]', photo);
    }

    return fetch(`${SERVER_HOST}/api/${route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${_TOKEN()}`
        },
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            if (res.message != '')
                global.showToastMessage(res.message);
            return res;
        })
        .catch(err => {
            console.log('ads-upload-error', err);
            return null;
        });
}