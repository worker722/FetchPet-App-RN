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
        const { title, subtitle, icon_left, icon_right, action, is_showLine } = this.props;

        return (
            <>
                <TouchableOpacity style={{ width: "100%", marginTop: 20, height: 40, flexDirection: "row", paddingHorizontal: 20, alignItems: "center", justifyContent: "center" }} onPress={() => action()}>
                    {icon_left &&
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: 40, marginRight: 10 }}>
                            <Icon name={icon_left} size={25} color={BaseColor.greyColor}></Icon>
                        </View>
                    }
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 18 }}>{title}</Text>
                        {subtitle != '' &&
                            <Text style={{ color: BaseColor.greyColor }}>{subtitle}</Text>
                        }
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Icon name={icon_right} size={25} color={BaseColor.greyColor}></Icon>
                    </View>
                </TouchableOpacity>
                {is_showLine &&
                    <View style={{ backgroundColor: BaseColor.dddColor, width: "98%", height: 1, marginTop: 15, marginHorizontal: "1%" }}></View>
                }
            </>
        )
    }
}