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

export default class Help extends Component {
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
                <Header icon_left={"arrow-left"} title={"Help & Support"} callback_left={this.closeCallback} />
                <TouchableOpacity style={{ width: "100%", marginTop: 50, flexDirection: "row", paddingHorizontal: 20 }}>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 18 }}>Help Center</Text>
                        <Text style={{ color: BaseColor.grayColor }}>See FAQ and contact support</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                        <Icon name={"angle-right"} size={25} color={BaseColor.grayColor}></Icon>
                    </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: BaseColor.dddColor, width: "98%", height: 1, marginTop: 10, marginHorizontal: "1%" }}></View>
                <TouchableOpacity style={{ width: "100%", marginTop: 20, flexDirection: "row", paddingHorizontal: 20 }}>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 18 }}>Rate us</Text>
                        <Text style={{ color: BaseColor.grayColor }}>if you love our app, please rake a moment to rate it</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                        <Icon name={"angle-right"} size={25} color={BaseColor.grayColor}></Icon>
                    </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: BaseColor.dddColor, width: "98%", height: 1, marginTop: 10, marginHorizontal: "1%" }}></View>
                <TouchableOpacity style={{ width: "100%", marginTop: 20, flexDirection: "row", paddingHorizontal: 20 }}>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 18 }}>Invite friends Fetch</Text>
                        <Text style={{ color: BaseColor.grayColor }}>Invite your friend to buy and sell pets</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                        <Icon name={"angle-right"} size={25} color={BaseColor.grayColor}></Icon>
                    </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: BaseColor.dddColor, width: "98%", height: 1, marginTop: 10, marginHorizontal: "1%" }}></View>
                <TouchableOpacity style={{ width: "100%", marginTop: 20, flexDirection: "row", paddingHorizontal: 20 }}>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 18 }}>Version</Text>
                        <Text style={{ color: BaseColor.grayColor }}>14.13.002</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                        <Icon name={"angle-right"} size={25} color={BaseColor.grayColor}></Icon>
                    </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: BaseColor.dddColor, width: "98%", height: 1, marginTop: 10, marginHorizontal: "1%" }}></View>
            </View>
        )
    }
}