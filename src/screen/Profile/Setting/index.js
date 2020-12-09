import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { BaseColor } from '@config';
import { Header, LinkItem } from '@components';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

import { store, SetPrefrence } from '@store';
export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_showNotification: true
        }
    }

    componentWillMount = async () => {
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

    setNotificationStatus = () => {
        this.setState({
            is_showNotification: !this.state.is_showNotification
        })
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

    deactivateAccount = () => {

    }

    render = () => {
        const navigation = this.props.navigation;
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