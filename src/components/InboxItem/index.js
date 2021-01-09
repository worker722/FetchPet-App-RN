import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    AppState,
    Alert,
    Platform
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config';
import * as Api from '@api';
import * as Utils from '@utils';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Menu, { MenuItem } from 'react-native-material-menu';

import firebase from 'react-native-firebase';

import { store } from '@store';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as global from "@api/global";

class InboxItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: {},
            latest_message: {},
            unread_message: 0,
        }

        this.menuRef = null;
    }

    UNSAFE_componentWillMount = () => {
        const { item } = this.props.data;
        const { ads, message } = item;
        const user_id = store.getState().auth.login.user.id;
        const unread_message = message.filter((item, key) => {
            return item.read_status == 0 && user_id != item.id_user_snd;
        });

        const ad_images = [];
        ads.meta.forEach((item, key) => {
            if (item.meta_key == '_ad_image')
                ad_images.push(item.meta_value);
        });

        const latest_message = message[message.length - 1];

        this.setState({ unread_message: unread_message.length, room: item, ad_images, latest_message });
    }

    createNotificationListeners = async () => {
        try {
            if (Platform.OS == "android") {
                this.notificationListener_ANDROID = firebase.notifications().onNotification((notification) => {
                    this._onMessageReceived(notification);
                });
            }
            else {
                this.notificationListener_IOS = firebase.messaging().onMessage((notification) => {
                    this._onMessageReceived(notification);
                });
            }
        } catch (error) {
        }
    }

    _onMessageReceived = (notification) => {
        try {
            const { data } = notification;
            const notificationData = JSON.parse(data.data);
            if (notificationData.notification_type == global.CHAT_MESSAGE_NOTIFICATION) {
                const user_id = store.getState().auth.login.user.id;
                const { room } = this.state;
                if (notificationData.id_room == room.id && notificationData.id_user_snd != user_id && !this.props.IS_IN_CHAT) {
                    let { unread_message } = this.state;
                    unread_message++;
                    this.setState({ unread_message, latest_message: notificationData });
                }
            }
        } catch (error) {
            console.log('inbox item notification received error', error);
        }
    }

    handleAppStateChange = (nextAppState) => { }

    componentDidMount = async () => {
        await this.createNotificationListeners();
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount = () => {
        if (Platform.OS == "android")
            this.notificationListener_ANDROID && this.notificationListener_ANDROID();
        else
            this.notificationListener_IOS && this.notificationListener_IOS();

        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    setMenuRef = ref => {
        this.menuRef = ref;
    };

    block = () => {
        Alert.alert(
            'Block this User?',
            "If you block this user, all contact will be blocked with this user." + "\n" + "Are you sure you want to block this user?",
            [
                {
                    text: 'Block',
                    onPress: async () => {
                        this.menuRef.hide();
                        await this.props.api.post("inbox/block", { room_id: this.state.room.id });
                        const { refresh } = this.props;
                        refresh();
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => this.menuRef.hide(),
                    style: 'cancel'
                },
            ],
            { cancelable: false }
        );
    };

    showMenu = () => {
        this.menuRef.show();
    };

    render = () => {
        const { unread_message, room, ad_images, latest_message } = this.state;

        const { navigation } = this.props;

        const { ads, buyer, seller, message, s_block_b, b_block_s } = room;

        if (!message || message.length == 0)
            return null;

        const user_id = store.getState().auth.login.user.id;
        const other_user = user_id == buyer.id ? seller : buyer;

        let is_blocked = false;
        if (other_user == buyer && b_block_s > 0) {
            is_blocked = true;
        }
        else if (other_user == seller && s_block_b > 0) {
            is_blocked = true;
        }

        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate("Chat", { ad_id: ads.id, room_id: room.id });
                    if (unread_message > 0)
                        this.props.setStore(global.U_MESSAGE_DECREMENT, unread_message);
                }}
                style={{ flex: 1, flexDirection: "row", paddingBottom: 20 }} >
                <View>
                    {other_user.avatar ?
                        <Image
                            source={{ uri: Api.SERVER_HOST + other_user.avatar }}
                            PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                            placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                            style={{ alignSelf: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.dddColor, width: 80, height: 80, borderRadius: 100 }}>
                        </Image>
                        :
                        <View style={{ width: 80, height: 80, marginHorizontal: 10, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.whiteColor, fontSize: 30 }}>{other_user?.name?.charAt(0).toUpperCase()}</Text>
                        </View>
                    }
                    {is_blocked &&
                        <View style={{ position: "absolute", left: 15, bottom: 0 }}>
                            <Icon name={"ban"} size={20} color={"red"}></Icon>
                        </View>
                    }
                    <TouchableOpacity
                        style={{ position: "absolute", bottom: 0, right: 3 }}
                        onPress={() => navigation.navigate("AdDetail", { ad_id: ads.id })}>
                        <Image
                            source={{ uri: Api.SERVER_HOST + ad_images[0] }}
                            placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                            PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                            style={{ width: 30, height: 30, borderRadius: 100, borderWidth: 1, borderColor: BaseColor.dddColor }}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <View style={{ marginLeft: 10, justifyContent: "center", flex: 1 }}>
                    <Text>{other_user?.name}</Text>
                    {latest_message?.attach_file ?
                        <Icon name="image" size={25} color={BaseColor.greyColor}></Icon>
                        :
                        <Text style={{ color: BaseColor.greyColor, fontSize: 12, marginTop: 10 }} numberOfLines={1}>{latest_message?.message}</Text>
                    }
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: BaseColor.greyColor, fontSize: 12 }}>{Utils.relativeTime(latest_message?.created_at)}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ justifyContent: "center", flex: 1, alignItems: "center", paddingVertical: 5 }}>
                            {unread_message > 0 &&
                                <View style={{ width: 23, height: 23, backgroundColor: "red", justifyContent: "center", alignItems: "center", borderRadius: 100, padding: 2 }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 12 }}>{unread_message}</Text>
                                </View>
                            }
                        </View>
                        <Menu
                            ref={this.setMenuRef}
                            button={
                                <TouchableOpacity
                                    onPress={this.showMenu}
                                    style={{ alignSelf: "flex-end", paddingVertical: 5, paddingRight: 5, paddingLeft: 15 }}>
                                    <Icon name={"ellipsis-v"} color={BaseColor.greyColor} size={20}></Icon>
                                </TouchableOpacity>
                            }>
                            <MenuItem onPress={this.block}>Block</MenuItem>
                        </Menu>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const mapStateToProps = ({ app: { IS_IN_CHAT } }) => {
    return { IS_IN_CHAT };
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch),
        setStore: (type, data) => dispatch({ type, data })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InboxItem);