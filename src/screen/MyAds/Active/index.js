import React, { Component } from 'react';
import {
    View,
    FlatList,
    ScrollView,
    RefreshControl
} from 'react-native';
import { ActiveAds, Loader } from '@components';
import { BaseColor } from '@config';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as global from '@api/global';
import { store } from "@store";

class Active extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            showRefresh: false,

            ads: null,
        }
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ ads: [] });
        const is_social = store.getState().auth.login.user.is_social;
        if (is_social == -1) {
            global.showGuestMessage();
        }
        else {
            this.setState({ showLoader: true });
            this.start();
        }
    }

    start = async () => {
        const response = await this.props.api.get('ads/activeAds');
        if (response?.success) {
            this.setState({ ads: response.data.ads });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    _onRefresh = () => {
        const is_social = store.getState().auth.login.user.is_social;
        if (is_social == -1) {
            global.showGuestMessage();
        }
        else {
            this.setState({ showRefresh: true, ads: null });
            this.start();
        }
    }

    render = () => {
        const { ads, showLoader, showRefresh } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <FlatList
                        style={{ paddingHorizontal: 10, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={ads}
                        renderItem={(item, key) => (
                            <ActiveAds data={item} navigation={this.props.navigation} />
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
export default connect(null, mapDispatchToProps)(Active);