import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { Header, Loader } from '@components';
import { BaseColor } from '@config';
import { Image } from 'react-native-elements';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';

class BlockContact extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoader: false,
            showRefresh: false,
            user: [],
        }
    }

    UNSAFE_componentWillMount = async () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const response = await this.props.api.get("inbox/blocklist");
        if (response?.success) {
            this.setState({ user: response.data.user });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    goBack = () => {
        this.props.navigation.goBack(null);
    }

    _onRefresh = () => {
        this.setState({ showRefresh: true });
        this.start();
    }

    unblock = async (id, index) => {
        let { user } = this.state;
        user.splice(index, 1);
        this.setState({ user });
        await this.props.api.post("inbox/unblock", { user_id: id });
    }

    renderItem = ({ item, key }) => {
        return (
            <View style={{ marginTop: 6, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 1, justifyContent: "center", alignItems: "center", flexDirection: "row", borderWidth: 1, borderColor: BaseColor.dddColor, borderRadius: 10 }}>
                {item.avatar ?
                    <Image
                        source={{ uri: Api.SERVER_HOST + item.avatar }}
                        placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                        PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                        style={{ width: 70, height: 70, borderRadius: 100, borderColor: BaseColor.dddColor, borderWidth: 1 }}
                    >
                    </Image>
                    :
                    <View style={{ width: 70, height: 70, borderRadius: 100, backgroundColor: BaseColor.primaryColor, borderColor: BaseColor.dddColor, borderWidth: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: BaseColor.whiteColor, fontSize: 25 }}>{item.name?.charAt(0).toUpperCase()}</Text>
                    </View>
                }
                <Text style={{ fontSize: 20, marginLeft: 20 }}>{item.name}</Text>
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity
                    onPress={() => this.unblock(item.id, key)}
                    style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: BaseColor.primaryColor, borderRadius: 20 }}>
                    <Text style={{ color: BaseColor.whiteColor, fontSize: 12 }}>UnBlock</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render = () => {
        const { showLoader, showRefresh, user } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: BaseColor.whiteColor }}>
                <Header icon_left={"arrow-left"} callback_left={this.goBack} title={"Blocked Contact"} />
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={showRefresh}
                            onRefresh={this._onRefresh} />}
                >
                    <FlatList
                        style={{ marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={user}
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
export default connect(null, mapDispatchToProps)(BlockContact);