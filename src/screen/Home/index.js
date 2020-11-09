import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    Button,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RBSheet from "react-native-raw-bottom-sheet";
import ButtonGroup from 'react-native-button-group';

import { BaseColor, BaseStyle } from '../../config';
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
        this.state = {
            currentCategoryIndex: 0,
        }
    }

    categorySeleted = (index) => {
        this.setState({ currentCategoryIndex: index })
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: "row", marginBottom: 20 }} activeOpacity={1}>
                <View>
                    <Image
                        source={{ uri: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=1.00xw:0.756xh;0,0.0756xh&resize=980:*" }}
                        // source={{ uri: "data:image/jpeg;base64,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" }}
                        style={{ width: 110, height: 120, borderRadius: 5 }}></Image>
                </View>
                <View style={{ flexDirection: "column", paddingLeft: 10, justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{ color: "grey", fontSize: 10 }}>Category</Text>
                    <Text style={{ color: BaseColor.primaryColor }}>{item.category}</Text>
                    <Text style={{ color: "grey", fontSize: 10 }}>Breed</Text>
                    <Text>{item.breed}</Text>
                    <Text style={{ color: "grey", fontSize: 10 }}>Age</Text>
                    <Text>{item.age} Years</Text>
                    <Text style={{ color: "grey", fontSize: 10 }}>Location</Text>
                    <Text>{item.location}</Text>
                </View>
                <View style={{ flexDirection: "column", paddingLeft: 10, }}>
                    <Text style={{ color: "grey", fontSize: 10 }}>{item.requestNum} requestes, {item.latestTime}</Text>
                    <Text style={{ fontSize: 20, textAlign: "right" }}>$ {item.price}</Text>
                    <Icon name={"heart"} size={20} color={BaseColor.primaryColor} style={{ position: "absolute", bottom: 0, right: 0 }}></Icon>
                </View>
            </TouchableOpacity>
        )
    }

    render = () => {
        return (
            <View style={{ flex: 1, marginTop: 40 }}>
                <Header />
                <View style={{ flexDirection: "row", width: "100%", height: 50, paddingHorizontal: 10, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ borderRadius: 5, height: 40, flex: 1, backgroundColor: BaseColor.primaryColor }}>
                        <TextInput style={{ flex: 1, paddingLeft: 45, paddingRight: 20, color: "white" }} placeholder={"Search"} placeholderTextColor={"#fff"}></TextInput>
                        <Icon name={"search"} size={20} color={BaseColor.whiteColor} style={{ position: "absolute", left: 10, top: 10 }}></Icon>
                    </View>
                    <View style={{ backgroundColor: BaseColor.primaryColor, width: 40, height: 40, marginLeft: 10, alignItems: "center", borderRadius: 5, justifyContent: "center", padding: 5 }}>
                        <Icon name={"sliders-h"} size={20} color={BaseColor.whiteColor}></Icon>
                    </View>
                </View>
                <View style={{ flexDirection: "row", marginHorizontal: 10, marginTop: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: BaseColor.primaryColor, fontSize: 20, flex: 1, fontWeight: "600" }}>Category of Pets</Text>
                    <Text style={{ color: BaseColor.primaryColor, fontSize: 13, marginLeft: 10, marginTop: 10 }}>Show All</Text>
                </View>
                <View style={{ width: "100%", height: 50, paddingHorizontal: 10, flexDirection: "row", marginTop: 10 }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.categorySeleted(0)} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: this.state.currentCategoryIndex == 0 ? BaseColor.primaryColor : "white", height: 40, borderRadius: 5 }}>
                        <Text style={{ color: this.state.currentCategoryIndex == 0 ? "white" : BaseColor.primaryColor }}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.categorySeleted(1)} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: this.state.currentCategoryIndex == 1 ? BaseColor.primaryColor : "white", height: 40, borderRadius: 5 }}>
                        <Text style={{ color: this.state.currentCategoryIndex == 1 ? "white" : BaseColor.primaryColor }}>Dogs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.categorySeleted(2)} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: this.state.currentCategoryIndex == 2 ? BaseColor.primaryColor : "white", height: 40, borderRadius: 5 }}>
                        <Text style={{ color: this.state.currentCategoryIndex == 2 ? "white" : BaseColor.primaryColor }}>Cats</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.categorySeleted(3)} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: this.state.currentCategoryIndex == 3 ? BaseColor.primaryColor : "white", height: 40, borderRadius: 5 }}>
                        <Text style={{ color: this.state.currentCategoryIndex == 3 ? "white" : BaseColor.primaryColor }}>Parrots</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "600", marginLeft: 10 }}>Latest</Text>
                <FlatList
                    style={{ paddingHorizontal: 10, marginTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={tempItems}
                    renderItem={this.renderItem}
                >
                </FlatList>
            </View>
        )
    }
}