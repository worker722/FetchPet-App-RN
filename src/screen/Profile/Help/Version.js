import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Images, BaseColor } from '@config';
import { Header } from '@components';
import { Image } from 'react-native-elements';

export default class Version extends Component {
    constructor(props) {
        super(props);
    }

    goBack = () => {
        this.props.navigation.goBack(null)
    }

    render = () => {
        return (
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Header icon_left={"arrow-left"} title={"Version"} callback_left={this.goBack} />
                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
                    <Image PlaceholderStyle={{ backgroundColor: BaseColor.whiteColor }} source={Images.logo} style={{ width: 196, height: 70 }} resizeMode={"stretch"}></Image>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 30 }}>
                    <Text>Current Version : </Text>
                    <Text>1.0.1</Text>
                </View>
            </View>
        )
    }
}