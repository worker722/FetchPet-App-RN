import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import { Header, LinkItem } from '@components';
import Rate, { AndroidMarket } from 'react-native-rate';

export default class Help extends Component {
    constructor(props) {
        super(props);
    }

    goBack = () => {
        this.props.navigation.goBack(null)
    }

    version = () => {
        this.props.navigation.navigate("Version");
    }

    contactUs = () => {
        this.props.navigation.navigate("ContactSupport");
    }

    rateApp = () => {
        const options = {
            GooglePackageName: "com.fetch",
            preferredAndroidMarket: AndroidMarket.Google,
        }
        Rate.rate(options, success => { });
    }

    render = () => {
        const navigation = this.props.navigation;
        return (
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Header icon_left={"arrow-left"} title={"Help & Support"} callback_left={this.goBack} />

                <LinkItem title={"Help Center"} subtitle={"See FAQ and contact support"} icon_right={"angle-right"} action={this.contactUs} />
                <LinkItem title={"Rate us"} subtitle={"If you love our app, please rake a moment to rate it"} icon_right={"angle-right"} action={this.rateApp} />
                {/* <LinkItem title={"Invite friends Fetch"} subtitle={"Invite your friend to buy and sell pets"} icon_right={"angle-right"} /> */}
                <LinkItem title={"Version"} subtitle={"1.0.1"} icon_right={"angle-right"} action={this.version} />
            </View>
        )
    }
}