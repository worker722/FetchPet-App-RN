import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import { Header, LinkItem } from '@components';

export default class Privacy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_showPhonenumber: true
        }
    }

    goBack = () => {
        this.props.navigation.goBack(null);
    }

    goChangePassword = () => {

    }

    setPhonenumberStatus = () => {
        this.setState({
            is_showPhonenumber: !this.state.is_showPhonenumber
        })
    }

    render = () => {
        const { is_showPhonenumber } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header icon_left={"arrow-left"} callback_left={this.goBack} title={"Privacy"} />

                <LinkItem title={"Show my phone number in ads"} subtitle={""} icon_right={"angle-right"} action={this.setPhonenumberStatus} is_showLine={true} is_switch={true} switch_val={is_showPhonenumber} />
                <LinkItem title={"Change password"} subtitle={""} icon_right={"angle-right"} action={this.goChangePassword} is_showLine={true} />

            </View>
        )
    }
}