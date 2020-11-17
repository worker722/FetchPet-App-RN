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

        this.closeCallback = () => {
            this.props.navigation.goBack(null)
        }
    }

    test = () => {

    }

    render = () => {
        const navigation = this.props.navigation;
        return (
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Header icon_left={"arrow-left"} title={"Setting"} callback_left={this.closeCallback} />

                <LinkItem title={"Privacy"} subtitle={"Passwork, Phone number visiblity"} icon_right={"angle-right"} action={this.test} is_showLine={true} />
                <LinkItem title={"Notification"} subtitle={"Edit your billing name and address, etc"} icon_right={"angle-right"} action={this.test} is_showLine={true} />
                <LinkItem title={"Logout"} subtitle={""} icon_right={"angle-right"} action={this.test} />
                <LinkItem title={"Logout from all devices"} subtitle={""} icon_right={"angle-right"} action={this.test} is_showLine={true} />
                <LinkItem title={"Deactivate account and delete my data"} subtitle={""} icon_right={"angle-right"} action={this.test} is_showLine={true} />
            </View>
        )
    }
}