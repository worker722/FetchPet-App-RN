import React, { Component } from 'react';
import { View } from 'react-native';
import { Header, LinkItem } from '@components';
import { BaseColor } from '@config';

import { GoogleSignin } from '@react-native-community/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
// import { LoginManager } from 'react-native-fbsdk';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence } from "@store";
import * as Api from '@api';
import * as global from "@api/global";

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_showNotification: true
        }
    }

    UNSAFE_componentWillMount = async () => {
        GoogleSignin.configure({
            iosClientId: 'YOUR IOS CLIENT ID',
        });

        const user_meta = store.getState().auth.login?.user?.meta;
        let is_showNotification = false;
        user_meta?.forEach((item, key) => {
            if (item.meta_key == global._SHOW_NOTIFICATION)
                is_showNotification = item.meta_value == 1 ? true : false;
        });
        this.setState({ is_showNotification });
    }

    goBack = () => {
        this.props.navigation.goBack(null)
    }

    goPrivacy = () => {
        this.props.navigation.navigate("Privacy")
    }

    goBlockContact = () => {
        this.props.navigation.navigate("BlockContact")
    }

    setNotificationStatus = async () => {
        const { is_showNotification } = this.state;
        const params = { key: global._SHOW_NOTIFICATION, value: is_showNotification ? 0 : 1 };
        await this.props.api.post("profile/setting", params, true);
        this.setState({ is_showNotification: !is_showNotification });
    }

    logOut = async () => {
        await SetPrefrence(global.PREF_REMEMBER_ME, 0);
        const is_social = store.getState().auth.login?.user?.is_social;
        if (is_social == 1) {
            await GoogleSignin.signOut();
        }
        else if (is_social == 2) {
            LoginManager.logOut();
        }
        else if (is_social == 3) {
            await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGOUT,
            });
        }
        this.props.setStore(global.LOGIN, null);
        this.props.navigation.navigate('Welcome');
    }

    logOutAll = async () => {
        await SetPrefrence(global.PREF_REMEMBER_ME, 0);
        const is_social = store.getState().auth.login?.user?.is_social;
        if (is_social == 1) {
            await GoogleSignin.signOut();
        }
        else if (is_social == 2) {
            LoginManager.logOut();
        }
        else if (is_social == 3) {
            await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGOUT,
            });
        }
        this.props.setStore(global.LOGIN, null);
        this.props.navigation.navigate('Welcome');
    }

    deactivateAccount = async () => {

    }

    render = () => {
        const { is_showNotification } = this.state;

        return (
            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: BaseColor.whiteColor }}>
                <Header icon_left={"arrow-left"} title={"Setting"} callback_left={this.goBack} />

                <LinkItem title={"Privacy"} subtitle={"Passwork, Phone number visiblity"} icon_right={"angle-right"} action={this.goPrivacy} />
                <LinkItem title={"Block Contact"} subtitle={"Show block contact list"} icon_right={"angle-right"} action={this.goBlockContact} />
                <LinkItem title={"Notification"} subtitle={""} icon_right={"angle-right"} action={this.setNotificationStatus} is_switch={true} switch_val={is_showNotification} />
                <LinkItem title={"Logout"} subtitle={""} icon_right={"angle-right"} action={this.logOut} />
                {/* <LinkItem title={"Logout from all devices"} subtitle={""} icon_right={"angle-right"} action={this.logOutAll} /> */}
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch),
        setStore: (type, data) => dispatch({ type, data })
    };
};
export default connect(null, mapDispatchToProps)(Setting);