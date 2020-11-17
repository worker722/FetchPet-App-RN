import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput
} from 'react-native';
import { BaseColor } from '@config';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Avatar } from 'react-native-elements';

const chatItems = [
    {
        index: 0,
        sender: false,
        message: 'Hello, How are you? Good morning. I am good',
        time: 'Nov 16, 2020 18:30'
    },
    {
        index: 0,
        sender: true,
        message: 'Hello, How are you? Good morning. I am good',
        time: 'Nov 16, 2020 18:30'
    },
    {
        index: 0,
        sender: false,
        message: 'Hello, How are you? Good morning. I am good',
        time: 'Nov 16, 2020 18:30'
    },
    {
        index: 0,
        sender: true,
        message: 'Hello, How are you? Good morning. I am good',
        time: 'Nov 16, 2020 18:30'
    }
]
export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempItems: chatItems,
            message: ''
        }
        this.is_send = false;
    }

    sendMessage = () => {
        if (this.state.message == '')
            return;

        let chatItem = { message: this.state.message, time: 'Nov 16, 2020 18:30', sender: this.is_send };
        let tempItems = this.state.tempItems;
        tempItems.push(chatItem);
        this.setState({
            tempItems: tempItems,
            message: ''
        })
        this.is_send = !this.is_send;
    }

    renderItem = ({ item }) => {
        return (
            <>
                {item.sender ?
                    <View style={{ marginTop: 20, flex: 1, justifyContent: "flex-start", alignItems: "flex-start" }}>
                        <View style={{ backgroundColor: BaseColor.primaryColor, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, padding: 10, maxWidth: "70%" }}>
                            <Text style={{ color: "white" }}>{item.message}</Text>
                            <Text style={{ color: "white", fontSize: 12, marginTop: 10 }}>{item.time}</Text>
                        </View>
                    </View>
                    :
                    <View style={{ justifyContent: "flex-end", alignItems: "flex-end", marginTop: 20, flex: 1 }}>
                        <View style={{ backgroundColor: BaseColor.grayColor, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, padding: 10, justifyContent: "flex-end", alignItems: "flex-end", maxWidth: "70%" }}>
                            <Text style={{ color: "white", textAlign: "left" }}>{item.message}</Text>
                            <Text style={{ color: "white", fontSize: 12, marginTop: 10 }}>{item.time}</Text>
                        </View>
                    </View>
                }
            </>
        )
    }

    render = () => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: "100%", height: 80, backgroundColor: BaseColor.primaryColor, flexDirection: "row", padding: 10 }}>
                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", padding: 10 }} onPress={() => this.props.navigation.goBack(null)} >
                        <Icon name={"arrow-left"} size={20} color={"#fff"}></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")} style={{ justifyContent: "center", alignItems: "center", marginLeft: 10 }}>
                        <Avatar
                            size='large'
                            rounded
                            source={{ uri: 'data:image/jpeg;base64,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' }}
                            activeOpacity={0.7}
                            placeholderStyle={{ backgroundColor: "transparent" }}
                            containerStyle={{ alignSelf: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: "#ddd", width: 60, height: 60 }}>
                        </Avatar>
                        <Avatar
                            size='small'
                            rounded
                            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRqpVnlXSLL_JcgkyUeI5vHfUp1bGhuJ62fhw&usqp=CAU' }}
                            activeOpacity={0.7}
                            placeholderStyle={{ backgroundColor: "transparent" }}
                            containerStyle={{ position: "absolute", bottom: 0, right: 0, borderWidth: 1, borderColor: "#fff", width: 30, height: 30 }}>
                        </Avatar>
                    </TouchableOpacity>
                    <View style={{ justifyContent: "center", paddingLeft: 10, flex: 1 }}>
                        <Text style={{ color: "white" }}>Ben K</Text>
                        <Text style={{ color: "white", fontSize: 12 }}>Last Seen: 14 minutes ago</Text>
                    </View>
                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", paddingLeft: 30 }}>
                        <Icon name={"ellipsis-v"} size={18} color={"white"}></Icon>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <FlatList
                        style={{ marginTop: 30, paddingHorizontal: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.tempItems}
                        renderItem={this.renderItem}
                    >
                    </FlatList>
                </ScrollView>
                <View style={{ position: "absolute", bottom: 0, padding: 10, height: 70, width: "100%", justifyContent: "center", alignItems: "center", borderTopWidth: 3, borderTopColor: "#ddd" }}>
                    <TextInput
                        style={{ flex: 1, backgroundColor: "#ddd", width: "100%", borderRadius: 30, paddingLeft: 20, paddingRight: 100 }}
                        value={this.state.message}
                        onChangeText={(text) => this.setState({ message: text })}
                    >
                    </TextInput>
                    <View style={{ position: "absolute", right: 0, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <TouchableOpacity style={{ paddingHorizontal: 15 }}>
                            <Icon name={"paperclip"} size={20} color={"grey"}></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.sendMessage()} style={{ padding: 8, marginRight: 25, borderRadius: 100, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                            <Icon name={"location-arrow"} size={20} color={"grey"}></Icon>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}