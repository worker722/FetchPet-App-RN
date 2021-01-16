import React, { Component } from 'react';
import {
    View,
    FlatList,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { Header, Loader, BlockedUser } from '@components';
import { BaseColor } from '@config';

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
        this.props.navigation.goBack();
    }

    _onRefresh = () => {
        this.setState({ showRefresh: true });
        this.start();
    }

    render = () => {
        const { showLoader, showRefresh, user } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: BaseColor.whiteColor }}>
                <Header icon_left={"arrow-left"} callback_left={this.goBack} title={"Blocked Contact"} />
                <ScrollView keyboardShouldPersistTaps='always'
                    refreshControl={
                        <RefreshControl refreshing={showRefresh}
                            onRefresh={this._onRefresh} />}
                >
                    <FlatList
                        style={{ marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={user}
                        renderItem={(item, key) => (
                            <BlockedUser data={item} />
                        )}
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