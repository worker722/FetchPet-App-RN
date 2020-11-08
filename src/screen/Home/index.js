import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ScrollView,
    SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RBSheet from "react-native-raw-bottom-sheet";

import { BaseColor } from '../../config';
import { Header } from '../../components';

let tempItems = [
    {
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        latestTime: "17hours ago"
    },
    {
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        latestTime: "17hours ago"
    },
    {
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        latestTime: "17hours ago"
    }
    , {
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        latestTime: "17hours ago"
    },
    {
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        latestTime: "17hours ago"
    },
    {
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        latestTime: "17hours ago"
    },
    {
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        latestTime: "17hours ago"
    }
];

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.7}>
                <View style={{ flex: 1, flexDirection: 'column', width: category_width, height: category_width - 20, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: "#fff", marginHorizontal: category_padding, marginTop: category_padding * 2 }}>
                    <Icon name={item.icon} size={70} color={BaseColor.categoryColor}></Icon>
                    <Text style={{ fontSize: 15 }}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render = () => {
        return (
            <View style={{flex:1, marginTop:40}}>
                <Header></Header>
            </View>
        )
    }
}