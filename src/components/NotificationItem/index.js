import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
} from 'react-native';
import { BaseColor } from '@config';
import * as Api from '@api';
import * as Utils from '@utils';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { store } from '@store';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as global from "@api/global";

class NotificationItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {},
            is_show: true
        }
    }

    UNSAFE_componentWillMount = () => {
        const { data } = this.props;
        const item = data.item;
        this.setState({ item });
    }

    _onClick = () => {
        const { item } = this.state;
        const user_id = store.getState().auth.login.user.id;
        if (item.type == 0) {
            const unread_message = item.room.message.filter((item, key) => {
                return item.read_status == 0 && user_id != item.id_user_snd;
            });

            if (unread_message.length > 0)
                this.props.setStore(global.U_MESSAGE_DECREMENT, unread_message.length);

            this.props.navigation.navigate("Chat", { ad_id: item.room.id_ads, room_id: item.room.id });
        }
        else {
            this.props.navigation.navigate("AdDetail", { ad_id: item.id_type });
        }

        if (item.read_status == 0) {
            const params = { id: item.id };
            this.props.api.post('notification/read', params);
        }
    }

    _onDelete = async () => {
        this.setState({ is_show: false });
        const { item } = this.state;
        const params = { id: item.id };
        await this.props.api.post("notification/delete", params);
    }

    render = () => {
        const { item, is_show } = this.state;

        if (!is_show)
            return null;

        return (
            <TouchableOpacity onPress={this._onClick} style={{ marginTop: 6, marginBottom: 1, flexDirection: "row", borderWidth: 1, borderColor: BaseColor.dddColor, borderRadius: 10 }}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    {item.read_status == 0 &&
                        <View style={{ width: 2, marginVertical: 15, backgroundColor: BaseColor.primaryColor }}></View>
                    }
                    <View style={{ margin: 15 }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 16 }}>{item.title}</Text>
                        <Text style={{ color: BaseColor.greyColor, marginTop: 5, fontSize: 12 }}>{Utils.relativeTime(item.created_at)}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={this._onDelete} style={{ justifyContent: "center", alignItems: "center", paddingRight: 10 }}>
                    <Icon name={"trash-alt"} size={20} color={BaseColor.primaryColor} />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(NotificationItem);