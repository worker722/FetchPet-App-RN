import React, { Component } from 'react';
import {
    View,
    ScrollView,
    RefreshControl,
    FlatList
} from 'react-native';
import { BaseColor } from '@config';
import { Header, Loader, HomeAds } from '@components';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as Utils from '@utils';

class FilterResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            showRefresh: false,

            pets: []
        }
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const response = await this.props.api.post("filter/get", this.props.route.params);
        if (response?.success) {
            const pets = await this.sortAdsByDistance(response.data.pets);
            this.setState({ pets });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    sortAdsByDistance = async (ads) => {
        if (!ads)
            return [];

        const adsWithDistance = await Promise.all(ads.map(async item => await this.getAdsDistance(item)));
        let nearBoostAds = [];
        let normalAds = [];
        adsWithDistance.forEach((item, index) => {
            if (item.distance <= Utils.BOOST_ADS_DISTANCE && item.is_boost)
                nearBoostAds.push(item);
            else
                normalAds.push(item);
        })
        nearBoostAds.sort((a, b) => {
            if (a.distance > b.distance) return 1;
            else if (a.distance < b.distance) return -1;
            return 0;
        });
        normalAds.sort((a, b) => {
            if (a.distance > b.distance) return 1;
            else if (a.distance < b.distance) return -1;
            return 0;
        });
        return nearBoostAds.concat(normalAds);
    }

    getAdsDistance = async (item) => {
        try {
            let currentLocation = this.props.route.params.map.region;
            if (currentLocation.latitude == 0 && currentLocation.longitude == 0)
                currentLocation = await Utils.getCurrentLocation();
            item.distance = await Utils.getDistance(item.lat, item.long, currentLocation.latitude, currentLocation.longitude);
            return item;
        } catch (error) {
            item.distance = 0;
            return item;
        }
    }

    _onRefresh = () => {
        this.setState({ showRefresh: true });
        this.start();
    }

    favouriteAds = async (index, item, value) => {
        let { pets } = this.state;
        pets[index].is_fav = value;
        this.setState({ pets });
        const param = { ad_id: item.id, is_fav: value };
        await this.props.api.post('ads/ad_favourite', param);
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    render = () => {
        const { showLoader, showRefresh, pets } = this.state;
        const { navigation } = this.props;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <Header icon_left={"arrow-left"} title={"Filter Result"} color_icon_right={BaseColor.primaryColor} callback_left={this.goBack} />
                <ScrollView keyboardShouldPersistTaps='always' style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <FlatList
                        style={{ paddingHorizontal: 10, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={pets}
                        renderItem={(item, key) => (
                            <HomeAds data={item} onFavourite={this.favouriteAds} navigation={navigation} />
                        )}
                    />
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
export default connect(null, mapDispatchToProps)(FilterResult);