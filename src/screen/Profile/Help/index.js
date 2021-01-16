import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import { Header, LinkItem } from '@components';
import Rate, { AndroidMarket } from 'react-native-rate';
import * as global from "@api/global";
import { BaseColor } from '@config';

export default class Help extends Component {
    constructor(props) {
        super(props);
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    version = () => {
        this.props.navigation.navigate("Version");
    }

    contactUs = () => {
        this.props.navigation.navigate("ContactSupport");
    }

    rateApp = () => {
        const options = {
            GooglePackageName: global.ANDROID_PACKAGE,
            preferredAndroidMarket: AndroidMarket.Google,
            AppleAppID: global.APPLE_APP_ID,
            preferInApp: true,
            openAppStoreIfInAppFails: true,
        }
        Rate.rate(options, success => { });
    }

    render = () => {
        return (
            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: BaseColor.whiteColor }}>
                <Header icon_left={"arrow-left"} title={"Help & Support"} callback_left={this.goBack} />

                <LinkItem title={"Help Center"} subtitle={"See FAQ and contact support"} icon_right={"angle-right"} action={this.contactUs} />
                <LinkItem title={"Rate us"} subtitle={"If you love our app, please rake a moment to rate it"} icon_right={"angle-right"} action={this.rateApp} />
                <LinkItem title={"Version"} subtitle={global.getAppVersion()} icon_right={"angle-right"} action={this.version} />
            </View>
        )
    }
}