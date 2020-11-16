import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BaseColor } from '../../config';

const notifications = [
    {
        index: 0,
        type: 0,
        title: '',
        content: '',
        time: ''
    },
    {
        index: 0,
        type: 0,
        title: '',
        content: '',
        time: ''
    },
    {
        index: 0,
        type: 0,
        title: '',
        content: '',
        time: ''
    },
    {
        index: 0,
        type: 0,
        title: '',
        content: '',
        time: ''
    },
    {
        index: 0,
        type: 0,
        title: '',
        content: '',
        time: ''
    },
    {
        index: 0,
        type: 0,
        title: '',
        content: '',
        time: ''
    },
    {
        index: 0,
        type: 0,
        title: '',
        content: '',
        time: ''
    }
]
export default class Notification extends Component {
    constructor(props) {
        super(props);
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity>
                <View style={{ paddingHorizontal: 10, paddingBottom: 20 }}>
                    <Text style={{ color: BaseColor.primaryColor, fontSize: 16 }}>You received a new message.</Text>
                    <Text style={{ color: "grey", fontSize: 12 }}>18:30</Text>
                    <View style={{ width: "100%", height: 1, backgroundColor: "lightgrey", marginTop: 10 }}></View>
                </View>
            </TouchableOpacity>
        )
    }

    render = () => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", width: "100%", paddingHorizontal: 10, paddingVertical: 20 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} style={{ position: "absolute", zIndex: 999, left: 0, top: 0, width: 50, height: 50, padding: 10 }}>
                        <Icon name={"times-circle"} size={25} color={BaseColor.primaryColor}></Icon>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 25, color: BaseColor.primaryColor, flex: 1, textAlign: "center", zIndex: -1 }}>Notification</Text>
                </View>
                <Text style={{ fontSize: 23, color: BaseColor.primaryColor, paddingHorizontal: 20 }}>Notification</Text>
                <FlatList
                    style={{ paddingHorizontal: 10, marginTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={notifications}
                    renderItem={this.renderItem}
                >
                </FlatList>
            </View>
        )
    }
}