import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Images, BaseColor } from '@config';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        const { navigation, mainHeader, title, icon_left, icon_right, text_left, text_right, callback_left, callback_right } = this.props;
        
        return (
            <View style={{ width: "100%", height: 80, paddingHorizontal: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                {mainHeader &&
                    <>
                        <Image placeholderStyle={{ backgroundColor: "transparent" }} source={Images.logo} style={{ width: 100, height: 35 }} resizeMode={"stretch"}></Image>
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => navigation.navigate("Notification")}>
                            <Icon solid name="bell" size={20} color={BaseColor.primaryColor}></Icon>
                        </TouchableOpacity>
                    </>
                }
                <TouchableOpacity onPress={() => callback_left()} style={{ position: "absolute", left: 20 }}>
                    <>
                        {icon_left &&
                            <Icon name={icon_left} color={BaseColor.primaryColor} size={20}></Icon>
                        }
                        {text_left &&
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 17 }}>{text_left}</Text>
                        }
                    </>
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {title &&
                        <Text style={{ fontSize: 22, color: BaseColor.primaryColor, fontWeight: "bold" }}>{title}</Text>
                    }
                </View>
                <TouchableOpacity onPress={() => callback_right()} style={{ position: "absolute", right: 20 }}>
                    <>
                        {icon_right &&
                            <Icon name={icon_right} color={BaseColor.primaryColor} size={20}></Icon>
                        }
                        {text_right &&
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 17 }}>{text_right}</Text>
                        }
                    </>
                </TouchableOpacity>
            </View>
        )
    }
}