import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { BaseColor } from '@config';
import { store } from '@store';
import * as Utils from '@utils';

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
                {user_id == item.receiver.id ?
                    <View style={{ marginTop: 20, flex: 1, justifyContent: "flex-start", alignItems: "flex-start" }}>
                        <View style={{ backgroundColor: BaseColor.primaryColor, borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomRightRadius: 15, padding: 10, maxWidth: "70%" }}>
                            <Text style={{ color: "white" }}>{item.message}</Text>
                            <Text style={{ color: "white", fontSize: 12, marginTop: 10 }}>{message_date}</Text>
                        </View>
                    </View>
                    :
                    <View style={{ justifyContent: "flex-end", alignItems: "flex-end", marginTop: 20, flex: 1 }}>
                        <View style={{ backgroundColor: BaseColor.greyColor, borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomLeftRadius: 15, padding: 10, justifyContent: "flex-end", alignItems: "flex-end", maxWidth: "70%" }}>
                            <Text style={{ color: "white", textAlign: "left" }}>{item.message}</Text>
                            <Text style={{ color: "white", fontSize: 12, marginTop: 10 }}>{message_date}</Text>
                        </View>
                    </View>
                }
            </View>
        )
    }
}