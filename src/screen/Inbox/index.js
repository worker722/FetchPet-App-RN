import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    RefreshControl
} from 'react-native';
import { BaseColor } from '@config';
import { Header, Loader, InboxItem } from '@components';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';

class Inbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatInbox: [],
            showLoader: false,
            showRefresh: false,
        }

        props.navigation.addListener("willFocus", (event) => {
            this.UNSAFE_componentWillMount();
        });
    }

    UNSAFE_componentWillMount = async () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const response = await this.props.api.get('inbox');
        if (response?.success) {
            let inbox = response.data.inbox;
            inbox.sort((a, b) => {
                let a_end = a.message[a.message.length - 1];
                let b_end = b.message[b.message.length - 1];
                if (b_end.created_at >= a_end.created_at)
                    return 1;
                else if (b_end.created_at < a_end.created_at)
                    return -1;
            });
            this.setState({ chatInbox: inbox });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    _onRefresh = () => {
        this.start();
    }

    render = () => {
        const { chatInbox, showLoader, showRefresh } = this.state;

        if (showLoader)
            return (<Loader />)

        return (
            <View style={{ flex: 1, paddingTop: getStatusBarHeight(true) }}>
                <Header navigation={this.props.navigation} mainHeader={true} />
                <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "bold", paddingLeft: 10 }}>Chat</Text>
                <View style={{ padding: 10, paddingTop: 0 }}>
                    <Text style={{ fontSize: 18, marginTop: 10 }}>Active Chat</Text>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={showRefresh}
                                onRefresh={this._onRefresh}
                            />
                        } >
                        <FlatList
                            style={{ marginTop: 30 }}
                            keyExtractor={(item, index) => index.toString()}
                            data={chatInbox}
                            renderItem={(item, index) => (
                                <InboxItem data={item} navigation={this.props.navigation} />
                            )}
                        />
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(Inbox);