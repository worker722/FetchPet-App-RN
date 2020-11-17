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
        const { navigation, mainHeader, title, leftIcon, rightIcon, leftText, rightText, leftAction, rightAction } = props;
        this.state = {
            navigation,
            mainHeader,
            title,
            leftIcon,
            rightIcon,
            leftText,
            rightText,
            leftAction,
            rightAction
        }
    }

    render = () => {
        return (
            <View style={{ width: "100%", height: 80, paddingHorizontal: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                {this.state.mainHeader &&
                    <>
                        <Image placeholderStyle={{ backgroundColor: "transparent" }} source={Images.logo} style={{ width: 100, height: 35 }} resizeMode={"stretch"}></Image>
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => this.state.navigation.navigate("Notification")}>
                            <Icon solid name="bell" size={20} color={BaseColor.primaryColor}></Icon>
                        </TouchableOpacity>
                    </>
                }
                {this.state.leftIcon &&
                    <TouchableOpacity>
                        <Icon name={this.state.leftIcon} color={BaseColor.primaryColor} size={20}></Icon>
                    </TouchableOpacity>
                }
                {this.state.rightText &&
                    <Text style={{ color: BaseColor.primaryColor }}>{this.state.rightText}</Text>
                }
                <View style={{ flex: 1 }}>
                    {this.state.title &&
                        <Text style={{ fontSize: 20, color: BaseColor.primaryColor, fontWeight: "bold" }}>{this.state.title}</Text>
                    }
                </View>
                <TouchableOpacity>
                    <>
                        {this.state.rightIcon &&
                            <Icon name={this.state.rightIcon} color={BaseColor.primaryColor} size={20}></Icon>
                        }
                        {this.state.leftText &&
                            <Text style={{ color: BaseColor.primaryColor }}>{this.state.leftText}</Text>
                        }
                    </>
                </TouchableOpacity>
            </View>
        )
    }
}