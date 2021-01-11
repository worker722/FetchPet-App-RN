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

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as global from '@api/global';
import { store } from "@store";

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

    UNSAFE_componentWillMount = () => {
        this.setState({ chatInbox: [] });
        const is_social = store.getState().auth.login?.user?.is_social;
        if (is_social == -1) {
            global.showGuestMessage();
        }
        else {
            this.setState({ showLoader: true });
            this.start();
        }
    }

    start = async () => {
        const response = await this.props.api.get('inbox');
        if (response?.success) {
            const inbox = response.data.inbox;
            inbox.sort((a, b) => {
                if (a.message.length == 0)
                    return 1;
                if (b.message.length == 0)
                    return -1;

                const a_end = a.message[a.message.length - 1];
                const b_end = b.message[b.message.length - 1];
                if (b_end.created_at >= a_end.created_at)
                    return 1;
                else if (b_end.created_at < a_end.created_at)
                    return -1;
            });
            this.setState({ chatInbox: inbox });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    refreshList = () => {
        this.setState({ showLoader: true });
        this.start();
    }

    _onRefresh = () => {
        const is_social = store.getState().auth.login?.user?.is_social;
        if (is_social == -1) {
            global.showGuestMessage();
        }
        else {
            this.setState({ showRefresh: true });
            this.start();
        }
    }

    render = () => {
        const { chatInbox, showLoader, showRefresh } = this.state;

        if (showLoader)
            return (<Loader />)

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <Header navigation={this.props.navigation} mainHeader={true} />
                <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "bold", paddingLeft: 10 }}>Chat</Text>
                <View style={{ padding: 10, paddingTop: 0 }}>
                    <Text style={{ fontSize: 18, marginTop: 10 }}>Active Chat</Text>
                    <ScrollView keyboardShouldPersistTaps='always'
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
                                <InboxItem data={item} refresh={this.refreshList} navigation={this.props.navigation} />
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