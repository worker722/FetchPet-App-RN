import React, { Component } from 'react';
import {
    View,
    FlatList,
    ScrollView,
    RefreshControl
} from 'react-native';
import { FavouriteAds, Loader } from '@components';
import { BaseColor } from '@config';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as Utils from '@utils';
import * as global from '@api/global';
import { store } from "@store";

class Favourite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            showRefresh: false,

            ads: null,
        }

        props.navigation.addListener("willFocus", (event) => {
            this.UNSAFE_componentWillMount();
        });
    }

    UNSAFE_componentWillMount = () => {
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
        const response = await this.props.api.get('ads/favouriteAds');
        if (response?.success) {
            const ads = await this.sortAdsByDistance(response.data.ads);
            this.setState({ ads });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    sortAdsByDistance = async (ads) => {
        if (!ads)
            return [];

        const adsWithDistance = await Promise.all(ads.map(async item => await this.getAdsDistance(item)));
        adsWithDistance.sort((a, b) => {
            if (a.distance > b.distance) return 1;
            else if (a.distance < b.distance) return -1;
            return 0;
        });
        return adsWithDistance;
    }

    getAdsDistance = async (item) => {
        const currentLocation = await Utils.getCurrentLocation();
        item.distance = await Utils.getDistance(item.lat, item.long, currentLocation.latitude, currentLocation.longitude);
        return item;
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
                            <FavouriteAds data={item} navigation={this.props.navigation} />
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
export default connect(null, mapDispatchToProps)(Favourite);