import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RBSheet from "react-native-raw-bottom-sheet";

import { Utils } from '../../utils';
import { BaseColor } from '../../config';
import { AirPlayDevices } from '../../components/AirPlayDevices';

let mainCategory = [
    {
        index: 0,
        title: "Photo",
        icon: "images"
    },
    {
        index: 1,
        title: "Video",
        icon: "film"
    },
    {
        index: 2,
        title: "Live Camera",
        icon: "camera"
    },
    {
        index: 3,
        title: "Web Browser",
        icon: "globe"
    }
];

const category_padding = 5;
const category_width = (Utils.screen.width - category_padding * 6) / 2;
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
            <View style={{ flex: 1, backgroundColor: BaseColor.primaryColor }}>
                <View style={{ height: 50, flexDirection: "row", paddingHorizontal: 10, paddingTop: 20 }}>
                    <TouchableOpacity>
                        <Icon name={"star"} size={25} color={BaseColor.whiteColor}></Icon>
                    </TouchableOpacity>
                    <Text style={{ flex: 1, textAlign: "center", color: BaseColor.whiteColor, fontSize: 20, fontWeight: "bold" }}>Home</Text>
                    <TouchableOpacity onPress={() => this.RBSheetRef.open()}>
                        <Icon name={"rss-square"} size={25} color={BaseColor.whiteColor}></Icon>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.2, justifyContent: "center", alignItems: "center", paddingHorizontal: category_padding * 2, backgroundColor: "#fff", borderRadius: 10, margin: category_padding * 2 }}>
                    <Text style={{ color: BaseColor.primaryColor, fontSize: 15 }}>Make sure your phone and Smart TV are connected to the same wifi network.</Text>
                </View>
                <TouchableOpacity style={{ flex: 0.4, justifyContent: "center", alignItems: "center" }} activeOpacity={0.7}>
                    <View style={{ flex: 1, flexDirection: 'column', width: category_width * 2 + category_padding * 2, height: category_width, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: "#fff", marginHorizontal: category_padding }}>
                        <Icon name={"rss-square"} size={70} color={BaseColor.categoryColor}></Icon>
                        <Text style={{ fontSize: 17 }}>Sreen Mirroring</Text>
                    </View>
                </TouchableOpacity>
                <FlatList
                    style={{ paddingHorizontal: category_padding, flex: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={mainCategory}
                    renderItem={this.renderItem}
                    numColumns={2}
                />
                <RBSheet
                    ref={ref => {
                        this.RBSheetRef = ref;
                    }}
                    height={Utils.screen.height / 4 * 3}
                    openDuration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center",
                            borderTopLeftRadius: 20, borderTopRightRadius: 20
                        }
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 20, marginVertical: 20, textAlign: "center" }}>Select a Device to Connect</Text>
                        <Text style={{ fontSize: 15, textAlign: "center", paddingHorizontal: 15 }}>Make sure your phone and Smart TV are connected to the same wifi network.</Text>
                        <AirPlayDevices />
                    </View>
                </RBSheet>
            </View>
        )
    }
}