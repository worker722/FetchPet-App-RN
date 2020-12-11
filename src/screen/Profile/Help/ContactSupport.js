import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Images } from '@config';
import { Header } from '@components';
import { Image } from 'react-native-elements';

export default class ContactSupport extends Component {
    constructor(props) {
        super(props);
    }

    goBack = () => {
        this.props.navigation.goBack(null)
    }

    render = () => {
        const navigation = this.props.navigation;
        return (
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Header icon_left={"arrow-left"} title={"Help Center"} callback_left={this.goBack} />
                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
                    <Image placeholderStyle={{ backgroundColor: "transparent" }} source={Images.logo} style={{ width: 196, height: 70 }} resizeMode={"stretch"}></Image>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 30 }}>
                    <Text>Contact Support : </Text>
                    <Text>darryl@buybitcoins.site</Text>
                </View>
            </View>
        )
    }
}