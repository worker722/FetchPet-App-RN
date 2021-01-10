import React, { Component } from 'react';
import {
    View,
    Text,
    RefreshControl,
    ScrollView,
    FlatList,
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
                    <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingHorizontal: 20 }}>Basic Infomation</Text>
                    <View style={{ marginTop: 15, marginLeft: 15, paddingRight: 20, flexDirection: "row" }}>
                        <View>
                            {user?.avatar ?
                                <Image
                                    source={{ uri: Api.SERVER_HOST + user?.avatar }}
                                    activeOpacity={0.7}
                                    placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                                    containerStyle={{ marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.greyColor, width: 80, height: 80, borderRadius: 100 }}>
                                </Image>
                                :
                                <View style={{ marginHorizontal: 10, width: 80, height: 80, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 30 }}>{user?.name?.charAt(0).toUpperCase()}</Text>
                                </View>
                            }
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
                            <Text style={{ fontSize: 22, color: BaseColor.primaryColor }}>{user?.name}</Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingHorizontal: 20, paddingTop: 20 }}>Contact Infomation</Text>
                    <View style={{ flexDirection: "row", paddingHorizontal: 20, paddingVertical: 20 }}>
                        <Text style={{ fontSize: 17, color: BaseColor.greyColor }}>Email : </Text>
                        <Text style={{ fontSize: 17, paddingRight: 20 }}>{user?.email}</Text>
                    </View>
                    {is_showPhonenumber && user?.phonenumber &&
                        <View style={{ flexDirection: "row", paddingHorizontal: 20, paddingBottom: 20 }}>
                            <Text style={{ fontSize: 17, color: BaseColor.greyColor }}>Phone number : </Text>
                            <Text style={{ fontSize: 17 }}>{user?.phonenumber}</Text>
                        </View>
                    }
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

