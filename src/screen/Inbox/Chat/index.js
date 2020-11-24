import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    RefreshControl,
    ActivityIndicator,
    AppState,
    Platform
} from 'react-native';
import { BaseColor } from '@config';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';
import * as Utils from '@utils';
import { ChatMessage, Loader } from '@components';
import * as global from "@api/global";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chat: [],
            ads: null,
            other_user: null,
            message: '',

            showLoader: false,
            showRefresh: false,
            is_sending: false,
        }
    }

    createNotificationListeners = async () => {
        if (Platform.OS == "android") {
            this.notificationListenerANDROID = firebase.notifications().onNotification((notification) => {
                const { title, body, data } = notification;
                console.log('chat notification', data);
            });
        }
        else {
            this.notificationListenerIOS = firebase.messaging().onMessage((notification) => {
                const { title, body, data } = notification;
                if (data.type != global.NOTIFICATION_CHAT_MESSAGE)
                    this.showNotification(title, body);
            })
        }
    }

    handleAppStateChange = (nextAppState) => { }

    componentDidMount = async () => {
        await this.createNotificationListeners();
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount = () => {
        this.notificationListenerANDROID && this.notificationListenerANDROID();
        this.notificationListenerIOS && this.notificationListenerIOS();
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    componentWillMount = async () => {
        this.setState({ showLoader: true });
        const param = { ad_id: this.props.navigation.state.params.ad_id };
        const response = await this.props.api.post("chat", param);
        this.setState({ showLoader: false });
        if (response.success) {

            const user_id = store.getState().auth.login.user.id;
            const last_message = response.data.chat[response.data.chat.length - 1];
            const other_user = user_id == last_message?.sender.id ? last_message?.receiver : last_message?.sender;

            this.setState({
                chat: response.data.chat,
                ads: response.data.ads,
                other_user: other_user
            })
            this.scrollView.scrollToEnd({ animated: true })
        }
    }

    _onRefresh = async () => {
        this.setState({ showRefresh: true });
        const param = { ad_id: this.props.navigation.state.params.ad_id };
        const response = await this.props.api.post("chat", param);
        this.setState({ showRefresh: false });
        if (response.success) {

            const user_id = store.getState().auth.login.user.id;
            const last_message = response.data.chat[response.data.chat.length - 1];
            const other_user = user_id == last_message?.sender.id ? last_message?.receiver : last_message?.sender;
            this.setState({
                chat: response.data.chat,
                ads: response.data.ads,
                other_user: other_user,
            });
            this.scrollView.scrollToEnd({ animated: true })
        }
    }

    sendMessage = async () => {
        const { message, other_user, ads } = this.state;

        if (message == '')
            return;

        let now = new Date();

        const param = {
            id_ads: ads.id,
            id_user_snd: store.getState().auth.login.user.id,
            id_user_rcv: other_user.id,
            message: message,
            attach_file: '',
            message_type: 0,
            read_status: 0,
            last_seen_time: now
        }
        this.setState({ is_sending: true });
        const response = await this.props.api.post('chat/post', param);
        this.setState({ is_sending: false });
        if (response.success) {
            let chat = this.state.chat;
            chat.push(response.data.newMessage);
            this.setState({ chat: chat });
        }
    }

    render = () => {
        const { chat, ads, showLoader, showRefresh, other_user, is_sending } = this.state;
        const last_message = chat[chat.length - 1];

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
                <ScrollView
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        this.scrollView.scrollToEnd({ animated: true });
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }
                >
                    <View style={{ flex: 1, padding: 10 }}>
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={chat}
                            renderItem={(item, index) => (
                                <ChatMessage data={item} />
                            )}
                        />
                    </View>
                </ScrollView>
                <View style={{ height: 70, paddingVertical: 10, width: "100%", justifyContent: "center", alignItems: "center", borderTopWidth: 3, borderTopColor: BaseColor.dddColor }}>
                    <TextInput
                        style={{ flex: 1, backgroundColor: BaseColor.dddColor, width: "100%", borderRadius: 30, paddingLeft: 20, paddingRight: 100 }}
                        value={this.state.message}
                        onChangeText={(text) => this.setState({ message: text })}
                    >
                    </TextInput>
                    <View style={{ position: "absolute", right: 0, top: 0, bottom: 0, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <TouchableOpacity style={{ paddingHorizontal: 15 }}>
                            <Icon name={"paperclip"} size={20} color={"grey"}></Icon>
                        </TouchableOpacity>
                        {is_sending ?
                            <View style={{ padding: 8, marginRight: 25, borderRadius: 100, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                                <ActivityIndicator size={20} color={BaseColor.primaryColor} />
                            </View>
                            :
                            <TouchableOpacity onPress={() => this.sendMessage()} style={{ padding: 8, marginRight: 25, borderRadius: 100, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                                <Icon name={"location-arrow"} size={20} color={"grey"}></Icon>
                            </TouchableOpacity>
                        }
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