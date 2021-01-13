import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator
} from 'react-native';
import { BaseColor } from '@config';
import { Image } from 'react-native-elements';
import { store } from '@store';
import * as Utils from '@utils';
import * as Api from '@api';

export default class ChatMessage extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        const user_id = store.getState().auth.login?.user?.id;
        const { data } = this.props;
        const item = data.item;
        const message_date = Utils.DATE2STR(item.created_at, 'D MMM, YYYY HH:mm A');

        return (
            <View>
                {user_id != item.id_user_snd ?
                    <View style={{ marginTop: 20, flex: 1, justifyContent: "flex-start", alignItems: "flex-start" }}>
                        {item.attach_file &&
                            <Image
                                source={{ uri: Api.SERVER_HOST + item.attach_file }}
                                style={{ borderRadius: 10, width: 200, height: 150 }}
                                placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                                PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                            />
                        }
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 13, marginTop: 10, marginRight: 10 }}>{item.sender?.name}</Text>
                            <Text style={{ color: BaseColor.greyColor, fontSize: 11, marginTop: 10 }}>{message_date}</Text>
                        </View>
                        <View style={{ backgroundColor: BaseColor.placeholderColor, borderBottomLeftRadius: 15, borderTopRightRadius: 15, borderBottomRightRadius: 15, padding: 10, maxWidth: "70%" }}>
                            {item.message &&
                                <Text style={{ color: BaseColor.blackColor, fontSize: 15 }}>{item.message}</Text>
                            }
                        </View>
                    </View>
                    :
                    <View style={{ justifyContent: "flex-end", alignItems: "flex-end", marginTop: 20, flex: 1 }}>
                        {item.attach_file &&
                            <Image
                                source={{ uri: Api.SERVER_HOST + item.attach_file }}
                                style={{ borderRadius: 10, width: 200, height: 150 }}
                                placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                                PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                            />
                        }
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                            <Text style={{ color: BaseColor.greyColor, fontSize: 11, marginTop: 10 }}>{message_date}</Text>
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 13, marginTop: 10, marginLeft: 10 }}>You</Text>
                        </View>
                        <View style={{ backgroundColor: BaseColor.primaryColor, borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderBottomLeftRadius: 15, paddingHorizontal: 10, paddingVertical: 15, justifyContent: "flex-end", alignItems: "flex-end", maxWidth: "70%" }}>
                            {item.message &&
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 15, textAlign: "left" }}>{item.message}</Text>
                            }
                        </View>
                    </View>
                }
            </View>
        )
    }
}