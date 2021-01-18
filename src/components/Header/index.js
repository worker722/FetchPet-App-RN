import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Images, BaseColor } from '@config';
import * as Animatable from 'react-native-animatable';
import { store } from '@store';

import { connect } from "react-redux";

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        const { UNREAD_MESSAGE, navigation, mainHeader, title, color_title, icon_left, color_icon_left, color_icon_right, icon_right, text_left, text_right, callback_left, callback_right } = this.props;

        const is_social = store.getState().auth.login?.user?.is_social;

        return (
            <View style={{ width: "100%", height: 70, paddingHorizontal: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                {mainHeader &&
                    <>
                        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{ backgroundColor: "transparent" }}>
                            <Image source={Images.logo} style={{ width: 84, height: 35 }} resizeMode={"stretch"}></Image>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}></View>
                        {is_social != -1 &&
                            <TouchableOpacity style={{ position: "absolute", right: 15 }} onPress={() => navigation.navigate("Notification")}>
                                <Icon solid name="bell" size={25} color={BaseColor.primaryColor}></Icon>
                                {UNREAD_MESSAGE > 0 &&
                                    <Animatable.View animation={"bounceIn"} iterationCount={1} duration={500} direction="normal" style={{ position: "absolute", right: -10, top: -10, width: 23, height: 23, backgroundColor: "red", justifyContent: "center", alignItems: "center", borderRadius: 100, padding: 2 }}>
                                        <Text style={{ color: BaseColor.whiteColor, fontSize: 12 }}>{UNREAD_MESSAGE}</Text>
                                    </Animatable.View>
                                }
                            </TouchableOpacity>
                        }
                    </>
                }
                <TouchableOpacity onPress={() => callback_left()}>
                    <>
                        {icon_left &&
                            <Icon name={icon_left} color={color_icon_left ? color_icon_left : BaseColor.primaryColor} size={25}></Icon>
                        }
                        {text_left &&
                            <Text style={{ color: color_icon_left ? color_icon_left : BaseColor.primaryColor, fontSize: 17 }}>{text_left}</Text>
                        }
                    </>
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {title &&
                        <Text style={{ fontSize: 23, color: color_title ? color_title : BaseColor.primaryColor, fontWeight: "bold" }}>{title}</Text>
                    }
                </View>
                <TouchableOpacity onPress={() => callback_right()} style={{ position: "absolute", right: 20 }}>
                    <>
                        {icon_right &&
                            <Icon name={icon_right} color={color_icon_right ? color_icon_right : BaseColor.primaryColor} size={25}></Icon>
                        }
                        {text_right &&
                            <Text style={{ color: color_icon_right ? color_icon_right : BaseColor.primaryColor, fontSize: 17 }}>{text_right}</Text>
                        }
                    </>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = ({ app: { UNREAD_MESSAGE } }) => {
    return { UNREAD_MESSAGE };
}

export default connect(mapStateToProps, null)(Header);