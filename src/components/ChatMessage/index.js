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
        const user_id = store.getState().auth.login.user.id;
        const { data } = this.props;
        const item = data.item;
        const message_date = Utils.DATE2STR(item.created_at, 'D MMM HH:mm');

        return (
            <View>
                {user_id != item.id_user_snd ?
                    <View style={{ marginTop: 20, flex: 1, justifyContent: "flex-start", alignItems: "flex-start" }}>
                        <View style={{ backgroundColor: BaseColor.primaryColor, borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomRightRadius: 15, padding: 10, maxWidth: "70%" }}>
                            {item.attach_file &&
                                <Image
                                    source={{ uri: Api.SERVER_HOST + item.attach_file }}
                                    style={{ marginVertical: 10, borderRadius: 20, width: 200, height: 150 }}
                                    PlaceholderContent={<ActivityIndicator color={BaseColor.white} />}
                                />
                            }
                            {item.message &&
                                <Text style={{ color: BaseColor.whiteColor }}>{item.message}</Text>
                            }
                            <Text style={{ color: BaseColor.whiteColor, fontSize: 12, marginTop: 10 }}>{message_date}</Text>
                        </View>
                    </View>
                    :
                    <View style={{ justifyContent: "flex-end", alignItems: "flex-end", marginTop: 20, flex: 1 }}>
                        <View style={{ backgroundColor: BaseColor.greyColor, borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomLeftRadius: 15, padding: 10, justifyContent: "flex-end", alignItems: "flex-end", maxWidth: "70%" }}>
                            {item.attach_file &&
                                <Image
                                    source={{ uri: Api.SERVER_HOST + item.attach_file }}
                                    style={{ marginVertical: 10, borderRadius: 20, width: 200, height: 150 }}
                                    PlaceholderContent={<ActivityIndicator color={BaseColor.white} />}
                                />
                            }
                            {item.message &&
                                <Text style={{ color: BaseColor.whiteColor, textAlign: "left" }}>{item.message}</Text>
                            }
                            <Text style={{ color: BaseColor.whiteColor, fontSize: 12, marginTop: 10 }}>{message_date}</Text>
                        </View>
                    </View>
                }
            </View>
        )
    }
}