import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
    RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BaseColor } from '@config';
import { Header, Loader } from '@components';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';
import * as Utils from '@utils';
import * as global from "@api/global";

class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notification: null,
            showLoader: false,
            showRefresh: false
        }

        props.navigation.addListener("willFocus", (event) => {
            this.componentWillMount();
        });
    }

    componentWillMount = () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const response = await this.props.api.get("notification");
        this.setState({ showLoader: false, showRefresh: false });
        if (response?.success) {
            this.setState({ notification: response.data.notification });
        }
    }

    goBack = () => {
        this.props.navigation.goBack(null);
    }

    _onRefresh = () => {
        this.setState({ showRefresh: true });
        this.start();
    }

    _onNotificationClicked = (item) => {
        if (item.type == 0) {
            this.props.navigation.navigate("Chat", { ad_id: item.id_type });
        }
        else {
            this.props.navigation.navigate("AdDetail", { ad_id: item.id_type });
        }

        if (item.read_status == 0) {
            const params = { id: item.id };
            this.props.api.post('notification/read', params);
        }
    }

    delete = async (index, key) => {
        const params = { id: index };
        const response = await this.props.api.post("notification/delete", params);
        if (response?.success) {
            let notification = this.state.notification;
            notification.splice(key, 1);
            this.setState({ notification });
        }
    }

    renderItem = ({ item, key }) => {
        return (
            <TouchableOpacity onPress={() => this._onNotificationClicked(item)} style={{ marginTop: 6, marginBottom: 1, flexDirection: "row", borderWidth: 1, borderColor: BaseColor.dddColor, borderRadius: 10 }}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    {item.read_status == 0 &&
                        <View style={{ width: 2, marginVertical: 15, backgroundColor: BaseColor.primaryColor }}></View>
                    }
                    <View style={{ margin: 15 }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 16 }}>{item.title}</Text>
                        <Text style={{ color: BaseColor.greyColor, marginTop: 5, fontSize: 12 }}>{Utils.relativeTime(item.created_at)}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.delete(item.id, key)} style={{ justifyContent: "center", alignItems: "center", paddingRight: 10 }}>
                    <Icon name={"trash-alt"} size={20} color={BaseColor.primaryColor} />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    render = () => {
        const { showLoader, showRefresh, notification } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1 }}>
                <Header title={"Notification"} icon_left={"times-circle"} callback_left={this.goBack} />
                <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingHorizontal: 20 }}>Notification</Text>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={showRefresh}
                            onRefresh={this._onRefresh} />}
                >
                    <FlatList
                        style={{ paddingHorizontal: 10, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={notification}
                        renderItem={this.renderItem}
                    >
                    </FlatList>
                </ScrollView>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(Notification);