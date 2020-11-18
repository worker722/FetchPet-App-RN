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

export default class Other extends Component {
    constructor(props) {
        super(props);
    }

    goBack = () => {
        this.props.navigation.goBack(null)
    }

    test = () => {

    }

    render = () => {
        const navigation = this.props.navigation;
        return (
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Header icon_left={"arrow-left"} title={"Others"} callback_left={this.goBack} />

                <LinkItem title={"Invoices"} subtitle={"See and download you invoices"} icon_right={"angle-right"} action={this.test} is_showLine={true} />
                <LinkItem title={"Billing infomation"} subtitle={"Edit your billing name and address, etc"} icon_right={"angle-right"} action={this.test} is_showLine={true} />
            </View>
        )
    }
}