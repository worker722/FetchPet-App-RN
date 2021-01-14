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
    }

    UNSAFE_componentWillMount = async () => {
        GoogleSignin.configure({
            iosClientId: 'YOUR IOS CLIENT ID',
        });
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

    goNotifiSetting = () => {
        this.props.navigation.navigate("NotifiSetting")
    }

    logOut = async () => {
        await SetPrefrence(global.PREF_REMEMBER_ME, 0);
        const is_social = store.getState().auth.login?.user?.is_social;
        if (is_social == 1) {
            await GoogleSignin.signOut();
        }
        else if (is_social == 2) {
            // LoginManager.logOut();
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
            // LoginManager.logOut();
        }
        else if (is_social == 3) {
            await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGOUT,
            });
        }
        this.props.setStore(global.LOGIN, null);
        this.props.navigation.navigate('Welcome');
    }

    render = () => {
        return (
            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: BaseColor.whiteColor }}>
                <Header icon_left={"arrow-left"} title={"Setting"} callback_left={this.goBack} />
                <LinkItem title={"Privacy"} subtitle={"Passwork, Phone number visiblity"} icon_right={"angle-right"} action={this.goPrivacy} />
                <LinkItem title={"Block Contact"} subtitle={"Show block contact list"} icon_right={"angle-right"} action={this.goBlockContact} />
                <LinkItem title={"Notifications"} subtitle={""} icon_right={"angle-right"} action={this.goNotifiSetting} />
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