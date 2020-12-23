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
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { BaseColor } from '@config';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image } from 'react-native-elements';
import firebase from 'react-native-firebase';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store } from "@store";
import * as Api from '@api';
import { ChatMessage, Loader } from '@components';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chat: [],
            ad_images: [],
            room: null,
            ads: null,
            other_user: null,
            message: '',

            showLoader: false,
            showRefresh: false,
            is_sending: false,
        }
    }

    createNotificationListeners = async () => {
        try {
            const user_id = store.getState().auth.login.user.id;
            const { room } = this.state;
            this.notificationListener = firebase.notifications().onNotification((notification) => {
                const newMessage = JSON.parse(notification.data.data);
                if (newMessage?.room?.id == room.id && user_id != newMessage.sender.id) {
                    let chat = this.state.chat;
                    chat.push(newMessage);
                    this.setState({ chat });
                }
            });
        } catch (error) {
        }
    }

    handleAppStateChange = (nextAppState) => { }

    componentDidMount = async () => {
        await this.createNotificationListeners();
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount = () => {
        this.notificationListener && this.notificationListener();
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    UNSAFE_componentWillMount = async () => {
        this.setState({ showLoader: true });
        await this.start();
    }

    start = async () => {
        const { ad_id, room_id } = this.props.navigation.state.params;
        const param = { ad_id, room_id };
        const response = await this.props.api.post("chat", param);
        if (response.success) {
            const { ads, room } = response.data;
            const user_id = store.getState().auth.login.user.id;
            const other_user = user_id == room.seller.id ? room.buyer : room.seller;

            const ad_images = [];
            ads.meta.forEach((item, key) => {
                if (item.meta_key == '_ad_image')
                    ad_images.push(item.meta_value);
            });

            this.setState({
                room,
                ads,
                other_user,
                ad_images,
                chat: room.message,
            })
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    componentDidMount = () => {
        this.scrollView?.scrollToEnd({ animated: true });
    }

    _onRefresh = async () => {
        this.setState({ showRefresh: true });
        await this.start();
    }

    sendMessage = async () => {
        const { message, room } = this.state;
        const user_id = store.getState().auth.login.user.id;
        if (message == '')
            return;

        const param = {
            id_room: room.id,
            id_user_snd: user_id,
            message: message,
            attach_file: '',
            message_type: 0,
            read_status: 0
        }
        this.setState({ is_sending: true });
        const response = await this.props.api.post('chat/post', param);
        this.setState({ is_sending: false });
        if (response?.success) {
            let chat = this.state.chat;
            chat.push(response.data.newMessage);
            this.setState({ chat: chat });
        }
        this.setState({ message: '' });
    }

    render = () => {
        const { chat, ads, showLoader, showRefresh, other_user, is_sending, ad_images } = this.state;
        const navigation = this.props.navigation;

        if (showLoader)
            return (<Loader />);

        return (
            <KeyboardAvoidingView behavior={Platform.OS == "android" ? "" : "padding"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={40}>
                <View style={{ flex: 1, marginBottom: 10 }}>
                    <View style={{ width: "100%", height: 80, backgroundColor: BaseColor.primaryColor, flexDirection: "row", padding: 10 }}>
                        <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", padding: 10 }} onPress={() => navigation.navigate("Inbox")} >
                            <Icon name={"arrow-left"} size={20} color={BaseColor.whiteColor}></Icon>
                        </TouchableOpacity>
                        <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 10 }}>
                            <TouchableOpacity onPress={() => navigation.navigate("ShowProfile", { user_id: other_user.id })} >
                                {other_user?.avatar ?
                                    <Image
                                        source={{ uri: Api.SERVER_HOST + other_user?.avatar }}
                                        activeOpacity={0.7}
                                        placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                                        PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                                        style={{ alignSelf: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.dddColor, width: 60, height: 60, borderRadius: 100 }}>
                                    </Image>
                                    :
                                    <View style={{ width: 60, height: 60, borderRadius: 100, marginHorizontal: 10, borderWidth: 2, borderColor: BaseColor.whiteColor, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ color: BaseColor.whiteColor, fontSize: 25 }}>{other_user?.name.charAt(0).toUpperCase()}</Text>
                                    </View>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("AdDetail", { ad_id: ads.id })}
                                style={{ position: "absolute", bottom: 0, right: 3, width: 25, height: 25, borderRadius: 100 }}>
                                <Image
                                    source={{ uri: Api.SERVER_HOST + ad_images[0] }}
                                    activeOpacity={0.7}
                                    placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                                    PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                                    style={{ borderWidth: 1, borderColor: BaseColor.dddColor, width: 25, height: 25, borderRadius: 100 }}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: "center", paddingLeft: 10, flex: 1 }}>
                            <Text style={{ color: BaseColor.whiteColor }}>{other_user?.name}</Text>
                        </View>
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
                        }>
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
                    <View style={{ height: 45, paddingHorizontal: 5, width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <TextInput
                            style={{ flex: 1, backgroundColor: BaseColor.dddColor, width: "100%", borderRadius: 30, paddingLeft: 20, paddingRight: 50 }}
                            value={this.state.message}
                            multiline={true}
                            onChangeText={(text) => this.setState({ message: text })}
                        >
                        </TextInput>
                        <View style={{ position: "absolute", right: 0, top: 0, bottom: 0, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            {is_sending ?
                                <View style={{ padding: 8, marginRight: 15, borderRadius: 100, backgroundColor: BaseColor.whiteColor, justifyContent: "center", alignItems: "center" }}>
                                    <ActivityIndicator color={BaseColor.primaryColor} />
                                </View>
                                :
                                <TouchableOpacity onPress={() => this.sendMessage()} style={{ padding: 8, marginRight: 15, borderRadius: 100, backgroundColor: BaseColor.whiteColor, justifyContent: "center", alignItems: "center" }}>
                                    <Icon name={"location-arrow"} size={15} color={"grey"}></Icon>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>

            </KeyboardAvoidingView>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(Chat);