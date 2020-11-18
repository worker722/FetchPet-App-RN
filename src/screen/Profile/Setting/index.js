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

export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_showNotification: true
        }
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

    logOut = () => {

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

                <LinkItem title={"Privacy"} subtitle={"Passwork, Phone number visiblity"} icon_right={"angle-right"} action={this.goPrivacy} is_showLine={true} />
                <LinkItem title={"Notification"} subtitle={""} icon_right={"angle-right"} action={this.setNotificationStatus} is_showLine={true} is_switch={true} switch_val={is_showNotification} />
                <LinkItem title={"Logout"} subtitle={""} icon_right={"angle-right"} action={this.logOut} />
                <LinkItem title={"Logout from all devices"} subtitle={""} icon_right={"angle-right"} action={this.logOutAll} is_showLine={true} />
                <LinkItem title={"Deactivate account and delete my data"} subtitle={""} icon_right={"angle-right"} action={this.deactivateAccount} is_showLine={true} />
            </View>
        )
    }
}