import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config';
import * as Api from '@api';
import * as Utils from '@utils';

import { store } from '@store';
import { connect } from "react-redux";
import * as global from "@api/global";

class InboxItem extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        const { data, navigation } = this.props;
        const { ads, buyer, seller, message } = data.item;

        if (message.length == 0)
            return null;

        const user_id = store.getState().auth.login.user.id;
        const other_user = user_id == buyer.id ? seller : buyer;
        const latest_message = message[message.length - 1];

        const ad_images = [];
        ads.meta.forEach((item, key) => {
            if (item.meta_key == '_ad_image')
                ad_images.push(item.meta_value);
        });

        const unread_message = message.filter((item, key) => {
            return item.read_status == 0 && user_id != item.id_user_snd;
        });

        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate("Chat", { ad_id: ads.id, room_id: data.item.id });
                    if (unread_message.length > 0)
                        this.props.setStore(global.U_MESSAGE_DECREMENT, unread_message.length);
                }}
                style={{ flex: 1, flexDirection: "row", paddingBottom: 20 }} >
                <View>
                    {other_user ?
                        <Image
                            source={{ uri: Api.SERVER_HOST + other_user?.avatar }}
                            PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                            placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                            style={{ alignSelf: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.dddColor, width: 80, height: 80, borderRadius: 100 }}>
                        </Image>
                        :
                        <View style={{ width: 80, height: 80, marginHorizontal: 10, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.whiteColor, fontSize: 30 }}>{other_user?.name?.charAt(0).toUpperCase()}</Text>
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
                    <Text style={{ color: BaseColor.greyColor, fontSize: 12, marginTop: 10 }} numberOfLines={1}>{latest_message?.message}</Text>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: BaseColor.greyColor, fontSize: 12 }}>{Utils.relativeTime(latest_message?.created_at)}</Text>
                    <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: 5 }}>
                        {unread_message.length > 0 &&
                            <View style={{ width: 23, height: 23, backgroundColor: "red", justifyContent: "center", alignItems: "center", borderRadius: 100, padding: 2 }}>
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 12 }}>{unread_message.length}</Text>
                            </View>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setStore: (type, data) => dispatch({ type, data })
    }
}

export default connect(null, mapDispatchToProps)(InboxItem);