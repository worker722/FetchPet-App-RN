import React, { Component } from 'react';
import {
    View,
    Text,
    RefreshControl,
    ScrollView,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { Header, Loader, HomeAds } from '@components';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as Utils from '@utils';

class ShowProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoader: false,
            showRefresh: false,
            user: null,
            pets: null
        }
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const param = { user_id: this.props.navigation.state.params.user_id, inventory: true };
        const response = await this.props.api.post('profile', param);
        if (response?.success) {
            const pets = await this.sortAdsByDistance(response.data.ads);
            this.setState({ user: response.data.user, pets });
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
        try {
            const currentLocation = await Utils.getCurrentLocation();
            item.distance = await Utils.getDistance(item.lat, item.long, currentLocation.latitude, currentLocation.longitude);
            return item;
        } catch (error) {
            item.distance = 0;
            return item;
        }
    }

    _onRefresh = async () => {
        this.setState({ showRefresh: true, pets: [] });
        this.start();
    }

    goBack = () => {
        this.props.navigation.goBack(null);
    }

    goAdsDetail = (id) => {
        this.props.navigation.navigate("AdDetail", { ad_id: id, view: true });
    }

    favouriteAds = async (index, item, value) => {
        let pets = this.state.pets;
        pets[index].is_fav = value;
        this.setState({ pets: pets });
        const param = { ad_id: item.id, is_fav: value };
        const response = await this.props.api.post('ads/ad_favourite', param);
    }

    render = () => {
        const { user, showLoader, showRefresh, pets } = this.state;
        const navigation = this.props.navigation;

        const user_meta = user?.meta;
        let is_showPhonenumber = false;
        user_meta?.forEach((item, key) => {
            if (item.meta_key == global._SHOW_PHONE_ON_ADS)
                is_showPhonenumber = item.meta_value == 1 ? true : false;
        });

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <ScrollView keyboardShouldPersistTaps='always' refreshControl={
                    <RefreshControl
                        refreshing={showRefresh}
                        onRefresh={this._onRefresh}
                    />
                }>
                    <Header icon_left={"arrow-left"} callback_left={this.goBack} title={"See Profile"} />
                    <View style={{ marginTop: 10, marginLeft: 15, paddingRight: 20, justifyContent: "center", alignItems: "center" }}>
                        {user?.avatar ?
                            <Image
                                source={{ uri: Api.SERVER_HOST + user?.avatar }}
                                activeOpacity={0.7}
                                placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                                containerStyle={{ marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.greyColor, width: 90, height: 90, borderRadius: 100 }}>
                            </Image>
                            :
                            <View style={{ marginHorizontal: 10, width: 90, height: 90, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 30 }}>{user?.name?.charAt(0).toUpperCase()}</Text>
                            </View>
                        }
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: 10, marginTop: 10 }}>
                        <Text style={{ fontSize: 22, color: BaseColor.primaryColor }}>{user?.name}</Text>
                        <Text style={{ fontSize: 15 }}>Member since {Utils.DATE2STR(user?.created_at, 'MMM YYYY')}</Text>
                        <TouchableOpacity style={{ marginTop: 10, justifyContent: "center", alignItems: "center", borderColor: BaseColor.dddColor, borderWidth: 1, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 45 }}>
                            <Text style={{ color: BaseColor.primaryColor }}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginHorizontal: 20, flexDirection: "row", marginTop: 20, borderRadius: 10, borderColor: BaseColor.dddColor, borderWidth: 1, justifyContent: "center", alignItems: "center", paddingVertical: 20 }}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 20 }}>21</Text>
                            <Text>Followers</Text>
                        </View>
                        <View style={{ backgroundColor: BaseColor.dddColor, marginHorizontal: 10, width: 1, height: "100%" }}></View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 20 }}>21</Text>
                            <Text>Reviews</Text>
                        </View>
                        <View style={{ backgroundColor: BaseColor.dddColor, marginHorizontal: 10, width: 1, height: "100%" }}></View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 20 }}>21</Text>
                            <Text>Total ads</Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingHorizontal: 20, marginTop: 20 }}>Inventory</Text>
                    <FlatList
                        style={{ paddingHorizontal: 10, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={pets}
                        renderItem={(item, key) => (
                            <HomeAds data={item} onItemClick={this.goAdsDetail} onFavourite={this.favouriteAds} navigation={navigation} />
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
export default connect(null, mapDispatchToProps)(ShowProfile);

