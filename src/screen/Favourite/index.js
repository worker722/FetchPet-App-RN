import React, { Component } from 'react';
import {
    View,
    FlatList,
    ScrollView,
    RefreshControl,
    Image,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { FavouriteAds, Loader, Header } from '@components';
import { BaseColor, Images } from '@config';
import Icon from 'react-native-vector-icons/FontAwesome5';

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

            searchText: '',

            ads: null,
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

    searchAds = async () => {
        const { searchText } = this.state;
        if (searchText == '') {
            return;
        }

        this.setState({ showLoader: true });
        const params = { searchText };
        const response = await this.props.api.post('ads/favouriteAds/search', params);
        if (response?.success) {
            const ads = await this.sortAdsByDistance(response.data.ads);
            this.setState({ ads });
        }
        this.setState({ showLoader: false });
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
        const { ads, showLoader, showRefresh } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <Header navigation={this.props.navigation} mainHeader={true} />
                <View style={{ flexDirection: "row", marginHorizontal: 10, marginTop: 10, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <View style={{ backgroundColor: BaseColor.primaryColor, width: 30, height: 30, borderRadius: 100, justifyContent: "center", alignItems: "center" }}>
                        <Icon name={"heart"} size={15} color={BaseColor.whiteColor} solid></Icon>
                    </View>
                    <Text style={{ color: BaseColor.primaryColor, fontSize: 20, marginLeft: 10, flex: 1, fontWeight: "600" }}>Favourites</Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%", height: 40, marginTop: 10, paddingHorizontal: 10, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ borderRadius: 100, height: 40, flex: 1, backgroundColor: BaseColor.placeholderColor }}>
                        <TextInput
                            onChangeText={(text) => this.setState({ searchText: text })}
                            onSubmitEditing={this.searchAds}
                            returnKeyType="search"
                            style={{ flex: 1, paddingLeft: 100, paddingRight: 20, color: BaseColor.blackColor }}
                            placeholder={"Search"} placeholderTextColor={BaseColor.greyColor}></TextInput>
                        <View style={{ position: "absolute", left: 15, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                            <Image source={Images.logo} style={{ width: 50, height: 17 }} resizeMode={"stretch"}></Image>
                            <TouchableOpacity style={{ padding: 10 }} onPress={this.searchAds}>
                                <Icon name={"search"} size={18} color={BaseColor.primaryColor}></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("AdvancedFilter", { type: 1 })} style={{ backgroundColor: BaseColor.placeholderColor, width: 40, height: 40, marginLeft: 10, alignItems: "center", borderRadius: 100, justifyContent: "center", padding: 5 }}>
                        <Icon name={"sliders-h"} size={20} color={BaseColor.primaryColor}></Icon>
                    </TouchableOpacity>
                </View>
                <ScrollView keyboardShouldPersistTaps='always'
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