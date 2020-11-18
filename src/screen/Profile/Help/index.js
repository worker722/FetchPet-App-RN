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

export default class Help extends Component {
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
                <Header icon_left={"arrow-left"} title={"Help & Support"} callback_left={this.goBack} />

                <LinkItem title={"Help Center"} subtitle={"See FAQ and contact support"} icon_right={"angle-right"} action={this.test} is_showLine={true} />
                <LinkItem title={"Rate us"} subtitle={"If you love our app, please rake a moment to rate it"} icon_right={"angle-right"} action={this.test} is_showLine={true} />
                <LinkItem title={"Invite friends Fetch"} subtitle={"Invite your friend to buy and sell pets"} icon_right={"angle-right"} action={this.test} is_showLine={true} />
                <LinkItem title={"Version"} subtitle={"14.13.002"} icon_right={"angle-right"} action={this.test} is_showLine={true} />
            </View>
        )
    }
}