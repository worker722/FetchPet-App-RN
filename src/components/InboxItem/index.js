import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator
} from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BaseColor } from '@config';
import * as Api from '@api';
import { store } from '@store';

export default class InboxItem extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        const { data, navigation } = this.props;
        const user_id = store.getState().auth.login.user.id;
        const { sender, receiver } = data.item;

        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: "row", paddingBottom: 20 }} onPress={() => navigation.navigate("Chat")}>
                <View>
                    <Image
                        source={{ uri: Api.SERVER_HOST + (user_id == sender.id ? receiver.avatar : sender.avatar) }}
                        activeOpacity={0.7}
                        PlaceholderContent={<ActivityIndicator size={20} color={BaseColor.primaryColor} />}
                        placeholderStyle={{ backgroundColor: "transparent" }}
                        style={{ alignSelf: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.dddColor, width: 80, height: 80, borderRadius: 100 }}>
                    </Image>
                    {sender.ads_image && receiver.ads_image &&
                        <Image
                            source={{ uri: Api.SERVER_HOST + (user_id == sender.id ? receiver.ads_image : sender.ads_image) }}
                            activeOpacity={0.7}
                            placeholderStyle={{ backgroundColor: "transparent" }}
                            resizeMode="cover"
                            PlaceholderContent={<ActivityIndicator size={5} color={BaseColor.primaryColor} />}
                            containerStyle={{ position: "absolute", bottom: 0, right: 0, borderWidth: 1, borderColor: BaseColor.dddColor, width: 30, height: 30, borderRadius: 100 }}>
                        </Image>
                    }
                </View>
                <View style={{ marginLeft: 10, justifyContent: "center", flex: 1 }}>
                    <Text>{user_id == sender.id ? receiver.name : sender.name}</Text>
                    <Text style={{ color: BaseColor.greyColor, fontSize: 12 }} numberOfLines={1}>{data.item.create_at}</Text>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: BaseColor.greyColor, fontSize: 12 }}>{data.item.latest_time}</Text>
                    <Icon name={"ellipsis-v"} color={BaseColor.greyColor} size={20}></Icon>
                </View>
            </TouchableOpacity>
        )
    }
}