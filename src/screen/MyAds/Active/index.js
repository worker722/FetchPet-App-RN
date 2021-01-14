import React, { Component } from 'react';
import {
    View,
    FlatList,
    ScrollView,
    RefreshControl,
    Text
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

            boosted_ads: [],
            normal_ads: []
        }

        props.navigation.addListener("willFocus", (event) => {
            this.UNSAFE_componentWillMount();
        });
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ ads: [] });
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
        const response = await this.props.api.get('ads/activeAds');
        if (response?.success) {
            let boosted_ads = [];
            let normal_ads = [];
            response.data.ads.forEach((item, index) => {
                if (item.is_boost) boosted_ads.push(item);
                else normal_ads.push(item);
            });
            this.setState({ boosted_ads, normal_ads });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    _onRefresh = () => {
        const is_social = store.getState().auth.login?.user?.is_social;
        if (is_social == -1) {
            global.showGuestMessage();
        }
        else {
            this.setState({ showRefresh: true, ads: null });
            this.start();
        }
    }

    render = () => {
        const { boosted_ads, normal_ads, showLoader, showRefresh } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <ScrollView keyboardShouldPersistTaps='always'
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    {boosted_ads.length > 0 &&
                        <View style={{ marginTop: 20, marginHorizontal: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 17 }}>Boosted Ads</Text>
                            <View style={{ marginLeft: 10, height: 1, backgroundColor: BaseColor.greyColor, flex: 1 }}></View>
                        </View>
                    }
                    <FlatList
                        style={{ paddingHorizontal: 10, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={boosted_ads}
                        renderItem={(item, key) => (
                            <ActiveAds data={item} navigation={this.props.navigation} />
                        )}
                    >
                    </FlatList>
                    {normal_ads.length > 0 &&
                        <View style={{ marginTop: 10, marginHorizontal: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 17 }}>Normal Ads</Text>
                            <View style={{ marginLeft: 10, height: 1, backgroundColor: BaseColor.greyColor, flex: 1 }}></View>
                        </View>
                    }
                    <FlatList
                        style={{ paddingHorizontal: 10, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={normal_ads}
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