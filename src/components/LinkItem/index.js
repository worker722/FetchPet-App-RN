import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { BaseColor } from '@config';

export default class LinkItem extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {

        return (
            <>
                <TouchableOpacity style={{ width: "100%", marginTop: 20, flexDirection: "row", paddingHorizontal: 20 }}>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 18 }}>Logout from all devices</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                        <Icon name={"angle-right"} size={25} color={BaseColor.greyColor}></Icon>
                    </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: BaseColor.dddColor, width: "98%", height: 1, marginTop: 15, marginHorizontal: "1%" }}></View>
            </>
        )
    }
}