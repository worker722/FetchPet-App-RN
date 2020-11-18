import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { BaseColor } from '@config';
import { act } from 'react-test-renderer';

export default class LinkItem extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        const { title, subtitle, icon_left, icon_right, action, is_showLine, is_switch, switch_val } = this.props;

        return (
            <>
                <TouchableOpacity
                    style={{ width: "100%", marginTop: 20, height: 40, flexDirection: "row", paddingHorizontal: 20, alignItems: "center", justifyContent: "center" }}
                    onPress={() => action()}
                >
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
                        {is_switch ?
                            <Switch
                                value={switch_val}
                                onValueChange={(value) => action()}
                                style={{ scaleX: 0.8, scaleY: 0.8 }}
                                thumbColor={BaseColor.primaryColor}
                                trackColor={{ true: BaseColor.primaryColor, false: BaseColor.dddColor }}
                            />
                            :
                            <Icon name={icon_right} size={25} color={BaseColor.greyColor}></Icon>
                        }
                    </View>
                </TouchableOpacity>
                {is_showLine &&
                    <View style={{ backgroundColor: BaseColor.dddColor, width: "98%", height: 1, marginTop: 15, marginHorizontal: "1%" }}></View>
                }
            </>
        )
    }
}