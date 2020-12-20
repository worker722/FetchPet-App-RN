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

export default class InboxItem extends Component {
    constructor(props) {
        super(props);
    }

    UNSAFE_componentWillMount = () => {
        const { data } = this.props;
        const { message } = data.item;
        const latest_message = message[message.length - 1];
        const { ads } = latest_message;
        const ad_images = [];
        ads.meta.forEach((item, key) => {
            if (item.meta_key == '_ad_image')
                ad_images.push(item.meta_value);
        });
        this.setState({ ad_images });
    }

    render = () => {
        const user_id = store.getState().auth.login.user.id;
        const { ad_images } = this.state;

        const { data, navigation } = this.props;
        const { message } = data.item;
        const latest_message = message[message.length - 1];
        const { sender, receiver, ads } = latest_message;
        const avatar = user_id == sender.id ? receiver.avatar : sender.avatar;
        const name = user_id == sender.id ? receiver.name : sender.name;

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate("Chat", { ad_id: data.item.id_ads })}
                style={{ flex: 1, flexDirection: "row", paddingBottom: 20 }} >
                <View>
                    {avatar ?
                        <Image
                            source={{ uri: Api.SERVER_HOST + avatar }}
                            PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                            PlaceholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                            style={{ alignSelf: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.dddColor, width: 80, height: 80, borderRadius: 100 }}>
                        </Image>
                        :
                        <View style={{ width: 80, height: 80, marginHorizontal: 10, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.whiteColor, fontSize: 30 }}>{name?.charAt(0).toUpperCase()}</Text>
                        </View>
                    }
                    <TouchableOpacity
                        style={{ position: "absolute", bottom: 0, right: 3 }}
                        onPress={() => navigation.navigate("AdDetail", { ad_id: ads.id })}>
                        <Image
                            source={{ uri: Api.SERVER_HOST + ad_images[0] }}
                            PlaceholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                            PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                            style={{ width: 30, height: 30, borderRadius: 100, borderWidth: 1, borderColor: BaseColor.dddColor }}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <View style={{ marginLeft: 10, justifyContent: "center", flex: 1 }}>
                    <Text>{user_id == sender.id ? receiver.name : sender.name}</Text>
                    <Text style={{ color: BaseColor.greyColor, fontSize: 12, marginTop: 10 }} numberOfLines={1}>{latest_message.message}</Text>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: BaseColor.greyColor, fontSize: 12 }}>{Utils.relativeTime(latest_message.created_at)}</Text>
                    <TouchableOpacity style={{ alignSelf: "flex-end", paddingVertical: 5, paddingRight: 5, paddingLeft: 15 }}>
                        {/* <Icon name={"ellipsis-v"} color={BaseColor.greyColor} size={20}></Icon> */}
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }
}