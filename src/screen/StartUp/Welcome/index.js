import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text
} from 'react-native';

import { Image } from 'react-native-elements';
import { Images, BaseColor } from '@config';
import * as Utils from '@utils';

const image_height = Utils.SCREEN.HEIGHT / 4;

export default class Welcome extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ position: "absolute", top: 0, width: "100%", height: image_height }}>
                    <Image
                        source={{ uri: "https://ichef.bbci.co.uk/news/800/cpsprodpb/BAF5/production/_111516874_gettyimages-451627799-1.jpg" }}
                        style={{ width: "100%", height: image_height + 30 }} placeholderStyle={{ backgroundColor: "transparent" }}></Image>
                </View>
                <View style={{ position: "absolute", width: "100%", height: image_height, top: 0, backgroundColor: BaseColor.blackColor, opacity: 0.3 }}></View>
                <View style={{ position: "absolute", top: 0, width: "100%", height: image_height - 30, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 30, color: "white", fontWeight: "bold" }}>Welcome!</Text>
                </View>
                <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: image_height - 20, backgroundColor: BaseColor.whiteColor }}>
                    <View style={{ width: "100%", height: 80, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                        <Image placeholderStyle={{ backgroundColor: "transparent" }} source={Images.logo} style={{ width: 168, height: 60 }} resizeMode={"stretch"}></Image>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 80 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")} style={{ width: "80%", height: 50 }}>
                            <View style={{ flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 15, fontWeight: "bold" }}>LOGIN</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("SignUp")} style={{ width: "80%", height: 50, marginTop: 10 }}>
                            <View style={{ flex: 1, borderRadius: 10, backgroundColor: BaseColor.whiteColor, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: BaseColor.dddColor }}>
                                <Text style={{ color: BaseColor.primaryColor, fontSize: 15, fontWeight: "bold" }}>SIGN UP</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}