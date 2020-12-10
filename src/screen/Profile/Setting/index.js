import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { BaseColor } from '@config';
import { Header, LinkItem } from '@components';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
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

        const user_meta = store.getState().auth.login.user.meta;
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

    setNotificationStatus = async () => {
        const params = { key: global._SHOW_NOTIFICATION, value: this.state.is_showNotification ? 0 : 1 };
        const response = await this.props.api.post("profile/setting", params, true);
        if (response?.success) {
            this.setState({ is_showNotification: !this.state.is_showNotification });
        }
    }

    logOut = async () => {
        await SetPrefrence("rememberMe", 0);
        await SetPrefrence('user', null);
        if (store.getState().auth.login.user.is_social == 1) {
            await GoogleSignin.signOut();
        }
        this.props.navigation.navigate('Welcome');
    }

    logOutAll = () => {

    }

    deactivateAccount = async () => {

    }

    render = () => {
        const { is_showNotification } = this.state;

        return (
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Header icon_left={"arrow-left"} title={"Setting"} callback_left={this.goBack} />

                <LinkItem title={"Privacy"} subtitle={"Passwork, Phone number visiblity"} icon_right={"angle-right"} action={this.goPrivacy} />
                <LinkItem title={"Notification"} subtitle={""} icon_right={"angle-right"} action={this.setNotificationStatus} is_switch={true} switch_val={is_showNotification} />
                <LinkItem title={"Logout"} subtitle={""} icon_right={"angle-right"} action={this.logOut} />
                <LinkItem title={"Logout from all devices"} subtitle={""} icon_right={"angle-right"} action={this.logOutAll} />
                <LinkItem title={"Deactivate account and delete my data"} subtitle={""} icon_right={"angle-right"} action={this.deactivateAccount} />
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(Setting);