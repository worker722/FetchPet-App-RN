import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { BaseColor } from '@config';

export default class LinkItem extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        const { title, subtitle, icon_left, icon_right, action, is_switch, switch_val } = this.props;

        return (
            <>
                <TouchableOpacity
                    style={{ width: "100%", marginTop: 5, height: 80, flexDirection: "row", paddingHorizontal: 15, alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: 5, borderColor: BaseColor.dddColor }}
                    onPress={action}
                >
                    {icon_left &&
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: 40, marginRight: 10 }}>
                            <Icon name={icon_left} size={25} color={BaseColor.greyColor}></Icon>
                        </View>
                    }
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 18 }}>{title}</Text>
                        {subtitle != '' &&
                            <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>{subtitle}</Text>
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
            </>
        )
    }
}