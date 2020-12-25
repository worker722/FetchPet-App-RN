import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    AppState
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config';
import * as Api from '@api';
import * as Utils from '@utils';
import Icon from 'react-native-vector-icons/FontAwesome5';

import firebase from 'react-native-firebase';

import { store } from '@store';
import { connect } from "react-redux";
import * as global from "@api/global";

class InboxItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: {},
            latest_message: {},
            unread_message: 0
        }
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
            this.notificationListener = firebase.notifications().onNotification((notification) => {
                const user_id = store.getState().auth.login.user.id;
                const { room } = this.state;
                const newMessage = JSON.parse(notification.data.data);
                if (newMessage.id_room == room.id && newMessage.id_user_snd != user_id && !this.props.is_in_chat) {
                    let { unread_message } = this.state;
                    unread_message++;
                    this.setState({ unread_message, latest_message: newMessage });
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

    render = () => {
        const { navigation } = this.props;
        const { unread_message, room, ad_images, latest_message } = this.state;
        const { ads, buyer, seller, message, sell_by_buy, buy_by_sell } = room;

        if (!message || message.length == 0)
            return null;

        const user_id = store.getState().auth.login.user.id;
        const other_user = user_id == buyer.id ? seller : buyer;
        let is_blocked = false;
        if (other_user == buyer && sell_by_buy > 0) {
            is_blocked = true;
        }
        else if (other_user == seller && buy_by_sell > 0) {
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
                    <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: 5 }}>
                        {unread_message > 0 &&
                            <View style={{ width: 23, height: 23, backgroundColor: "red", justifyContent: "center", alignItems: "center", borderRadius: 100, padding: 2 }}>
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 12 }}>{unread_message}</Text>
                            </View>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const mapStateToProps = ({ app: { is_in_chat } }) => {
    return { is_in_chat };
}

const mapDispatchToProps = dispatch => {
    return {
        setStore: (type, data) => dispatch({ type, data })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InboxItem);