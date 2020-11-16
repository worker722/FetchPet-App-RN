import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Images, BaseColor } from '../../config';

export default class Header extends Component {
    constructor(props) {
        super(props);
        const { navigation } = props;
        this.navigation = navigation;
    }

    render = () => {
        return (
            <View style={{ width: "100%", height: 50, paddingHorizontal: 10, flexDirection: "row" }}>
                <Image placeholderStyle={{ backgroundColor: "transparent" }} source={Images.logo} style={{ width: 100, height: 35 }} resizeMode={"stretch"}></Image>
                <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => this.navigation.navigate("Notification")}>
                    <Icon solid name="bell" size={20} color={BaseColor.primaryColor}></Icon>
                </TouchableOpacity>
            </View>
        )
    }
}