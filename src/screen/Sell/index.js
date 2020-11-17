import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { BaseColor } from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Header } from '../../components';
export default class Sell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            country: 'uk'
        }
    }

    render = () => {
        return (
            <View style={{ flex: 1 }}>
                <Header navigation={this.props.navigation} mainHeader={true} />
                <Text style={{ color: BaseColor.primaryColor, fontSize: 20, paddingLeft: 10 }}>Create A New Ads</Text>
                <View style={{ width: "100%", height: 200, backgroundColor: "#808080", marginTop: 10, justifyContent: "center", alignItems: "center" }}>
                    <Icon name={"image"} size={40} color={"white"}></Icon>
                    <TouchableOpacity style={{ backgroundColor: "white", paddingVertical: 7, paddingHorizontal: 10, borderRadius: 5, marginTop: 5 }}>
                        <Text style={{ color: BaseColor.primaryColor }}>Choose from gallery</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: "100%", marginTop: 10, flexDirection: "row" }}>

                </View>
            </View>
        )
    }
}