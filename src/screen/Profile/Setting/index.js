import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { BaseColor } from '@config';
import { Header } from '@components';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class Setting extends Component {
    constructor(props) {
        super(props);

        this.closeCallback = () => {
            this.props.navigation.goBack(null)
        }
    }

    render = () => {
        const navigation = this.props.navigation;
        return (
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Header icon_left={"arrow-left"} title={"Setting"} callback_left={this.closeCallback} />
                <TouchableOpacity style={{ width: "100%", marginTop: 50, flexDirection: "row", paddingHorizontal: 20 }}>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 18 }}>Privacy</Text>
                        <Text style={{ color: BaseColor.greyColor }}>Passwork, Phone number visiblity</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                        <Icon name={"angle-right"} size={25} color={BaseColor.greyColor}></Icon>
                    </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: BaseColor.dddColor, width: "98%", height: 1, marginTop: 10, marginHorizontal: "1%" }}></View>
                <View style={{ width: "100%", marginTop: 20, flexDirection: "row", paddingHorizontal: 20 }}>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 18 }}>Notification</Text>
                        <Text style={{ color: BaseColor.greyColor }}>Edit your billing name and address, etc</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                        <Icon name={"angle-right"} size={25} color={BaseColor.greyColor}></Icon>
                    </View>
                </View>
                <View style={{ backgroundColor: BaseColor.dddColor, width: "98%", height: 1, marginTop: 10, marginHorizontal: "1%" }}></View>
                <TouchableOpacity style={{ width: "100%", marginTop: 20, flexDirection: "row", paddingHorizontal: 20 }}>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 18 }}>Logout</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                        <Icon name={"angle-right"} size={25} color={BaseColor.greyColor}></Icon>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: "100%", marginTop: 20, flexDirection: "row", paddingHorizontal: 20 }}>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 18 }}>Logout from all devices</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                        <Icon name={"angle-right"} size={25} color={BaseColor.greyColor}></Icon>
                    </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: BaseColor.dddColor, width: "98%", height: 1, marginTop: 15, marginHorizontal: "1%" }}></View>
                <TouchableOpacity style={{ width: "100%", marginTop: 20, flexDirection: "row", paddingHorizontal: 20 }}>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 18 }}>Deactivate account and delete my data</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                        <Icon name={"angle-right"} size={25} color={BaseColor.greyColor}></Icon>
                    </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: BaseColor.dddColor, width: "98%", height: 1, marginTop: 10, marginHorizontal: "1%" }}></View>
            </View>
        )
    }
}