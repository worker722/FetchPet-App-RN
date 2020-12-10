import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { BaseColor, Images } from '@config';
import { Header, LinkItem } from '@components';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image } from 'react-native-elements';

export default class Version extends Component {
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
                <Header icon_left={"arrow-left"} title={"Version"} callback_left={this.goBack} />
                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
                    <Image placeholderStyle={{ backgroundColor: "transparent" }} source={Images.logo} style={{ width: 196, height: 70 }} resizeMode={"stretch"}></Image>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                    <Text>Current Version : </Text>
                    <Text>1.0.1</Text>
                </View>
            </View>
        )
    }
}