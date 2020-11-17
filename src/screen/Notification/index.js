import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BaseColor } from '../../config';
import Header from '../../components/Header';

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

        this.closeCallback = () => {
            this.props.navigation.goBack(null);
        }
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
                <Header title={"Notification"} icon_left={"times-circle"} callback_left={this.closeCallback} />
                <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingHorizontal: 20 }}>Notification</Text>
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