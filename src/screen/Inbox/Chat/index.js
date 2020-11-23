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

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';
import * as Utils from '@utils';
import { ChatMessage, Loader } from '@components';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chat: [],
            ads: null,
            message: '',

            showLoader: false,
        }
    }

    componentWillMount = async () => {
        this.setState({ showLoader: true });
        const param = { ad_id: this.props.navigation.state.params.ad_id };
        const response = await this.props.api.post("chat", param);
        this.setState({ showLoader: false });
        if (response.success) {
            this.setState({
                chat: response.data.chat,
                ads: response.data.ads
            })
        }
    }

    sendMessage = () => {
        if (this.state.message == '')
            return;
    }

    render = () => {
        const { chat, ads, showLoader } = this.state;
        const user_id = store.getState().auth.login.user.id;

        const last_message = chat[chat.length - 1];
        const other_user = user_id == last_message?.sender.id ? last_message?.receiver : last_message?.sender;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: "100%", height: 80, backgroundColor: BaseColor.primaryColor, flexDirection: "row", padding: 10 }}>
                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", padding: 10 }} onPress={() => this.props.navigation.goBack(null)} >
                        <Icon name={"arrow-left"} size={20} color={BaseColor.whiteColor}></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")} style={{ justifyContent: "center", alignItems: "center", marginLeft: 10 }}>
                        <Avatar
                            size='large'
                            rounded
                            source={{ uri: Api.SERVER_HOST + other_user?.avatar }}
                            activeOpacity={0.7}
                            placeholderStyle={{ backgroundColor: "transparent" }}
                            containerStyle={{ alignSelf: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.dddColor, width: 60, height: 60 }}>
                        </Avatar>
                        <Avatar
                            size='small'
                            rounded
                            source={{ uri: Api.SERVER_HOST + ads?.meta[0].meta_value }}
                            activeOpacity={0.7}
                            placeholderStyle={{ backgroundColor: "transparent" }}
                            containerStyle={{ position: "absolute", bottom: 0, right: 0, borderWidth: 1, borderColor: BaseColor.whiteColor, width: 30, height: 30 }}>
                        </Avatar>
                    </TouchableOpacity>
                    <View style={{ justifyContent: "center", paddingLeft: 10, flex: 1 }}>
                        <Text style={{ color: "white" }}>{other_user?.name}</Text>
                        <Text style={{ color: "white", fontSize: 12 }}>Last Seen: {Utils.relativeTime(last_message?.last_seen_time)}</Text>
                    </View>
                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", paddingLeft: 30 }}>
                        <Icon name={"ellipsis-v"} size={18} color={"white"}></Icon>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <FlatList
                        style={{ marginTop: 30, paddingHorizontal: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={chat}
                        renderItem={(item, index) => (
                            <ChatMessage data={item} />
                        )}
                    />
                </ScrollView>
                <View style={{ position: "absolute", bottom: 0, padding: 10, height: 70, width: "100%", justifyContent: "center", alignItems: "center", borderTopWidth: 3, borderTopColor: BaseColor.dddColor }}>
                    <TextInput
                        style={{ flex: 1, backgroundColor: BaseColor.dddColor, width: "100%", borderRadius: 30, paddingLeft: 20, paddingRight: 100 }}
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

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(Chat);