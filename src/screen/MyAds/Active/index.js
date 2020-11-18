import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { BaseColor } from '@config';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';


const tempData = [
    {
        index: 0,
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=1.00xw:0.756xh;0,0.0756xh&resize=980:*",
        latestTime: "17hours ago",
        is_fav: false
    },
    {
        index: 1,
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=1.00xw:0.756xh;0,0.0756xh&resize=980:*",
        latestTime: "17hours ago",
        is_fav: false
    },
    {
        index: 2,
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=1.00xw:0.756xh;0,0.0756xh&resize=980:*",
        latestTime: "17hours ago",
        is_fav: false
    }
    , {
        index: 3,
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=1.00xw:0.756xh;0,0.0756xh&resize=980:*",
        latestTime: "17hours ago",
        is_fav: false
    },
    {
        index: 4,
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=1.00xw:0.756xh;0,0.0756xh&resize=980:*",
        latestTime: "17hours ago",
        is_fav: false
    },
    {
        index: 5,
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=1.00xw:0.756xh;0,0.0756xh&resize=980:*",
        latestTime: "17hours ago",
        is_fav: false
    },
    {
        index: 6,
        category: "Dog",
        breed: "BullGod",
        age: 10,
        price: 999,
        location: "Boulder, USA",
        requestNum: 10,
        image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=1.00xw:0.756xh;0,0.0756xh&resize=980:*",
        latestTime: "17hours ago",
        is_fav: false
    }
];

export default class Active extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempData: tempData
        }
    }

    renderItem = ({ item }) => {
        const { navigation } = this.props;

        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: "row", marginBottom: 10, borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor, padding: 10 }}
                onPress={() => navigation.navigate("AdDetail", { item: item })}>
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <Avatar
                        size='xlarge'
                        rounded
                        source={{ uri: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=1.00xw:0.756xh;0,0.0756xh&resize=980:*' }}
                        activeOpacity={0.7}
                        placeholderStyle={{ backgroundColor: "transparent" }}
                        containerStyle={{ alignSelf: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.dddColor, width: 100, height: 100 }}>
                    </Avatar>
                    <View style={{ width: 1, height: 100, backgroundColor: BaseColor.dddColor }}></View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flexDirection: "column", flex: 1, paddingLeft: 10, justifyContent: "center", alignItems: "flex-start" }}>
                            <Text style={{ color: "grey", fontSize: 10 }}>Category</Text>
                            <Text style={{ color: BaseColor.primaryColor }}>{item.category}</Text>
                            <Text style={{ color: "grey", fontSize: 10 }}>Age</Text>
                            <Text>{item.age} Years</Text>
                            <Text style={{ color: "grey", fontSize: 10 }}>Location</Text>
                            <Text>{item.location}</Text>
                        </View>
                        <View style={{ flexDirection: "column", paddingLeft: 10, }}>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <View style={{ width: 10, height: 10, borderRadius: 100, backgroundColor: "#0cfa07", marginRight: 5 }}></View>
                                <Text style={{ color: "#0cfa07", fontSize: 13, textAlign: "right" }}>Active</Text>
                            </View>
                            <Text style={{ textAlign: "right", flex: 1, textAlignVertical: "center", fontWeight: "bold" }}>$ {item.price}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 15 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 10, color: BaseColor.greyColor }} numberOfLines={1}>10 requests, 16hours ago</Text>
                        </View>
                        <View style={{ paddingLeft: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Icon name={"eye"} size={13} color={BaseColor.greyColor}></Icon>
                            <Text style={{ fontSize: 10, color: BaseColor.greyColor, marginLeft: 5 }}>View : 58</Text>
                        </View>
                        <View style={{ paddingLeft: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Icon name={"heart"} size={13} color={BaseColor.greyColor}></Icon>
                            <Text style={{ fontSize: 10, color: BaseColor.greyColor, marginLeft: 5 }}>Like : 94</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render = () => {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{ paddingHorizontal: 10, marginTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.tempData}
                    renderItem={this.renderItem}
                >
                </FlatList>
            </View>
        )
    }
}