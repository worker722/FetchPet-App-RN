import React, { Component } from 'react';
import {
    View,
    Text,
    RefreshControl,
    ScrollView,
    FlatList,
} from 'react-native';
import { Header, Loader, HomeAds } from '@components';
import { Avatar } from 'react-native-elements';
import { BaseColor } from '@config';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';

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
            this.setState({ user: response.data.user, pets: response.data.ads });
        }
        this.setState({ showLoader: false, showRefresh: false });
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
            <View style={{ flex: 1, paddingTop: getStatusBarHeight() }}>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={showRefresh}
                        onRefresh={this._onRefresh}
                    />
                }>
                    <Header icon_left={"arrow-left"} callback_left={this.goBack} title={"See Profile"} />
                    <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingHorizontal: 20 }}>Basic Infomation</Text>
                    <View style={{ marginTop: 15, marginLeft: 15, paddingRight: 20 }}>
                        <View>
                            {user?.avatar ?
                                <Avatar
                                    size='xlarge'
                                    rounded
                                    source={{ uri: Api.SERVER_HOST + user?.avatar }}
                                    activeOpacity={0.7}
                                    placeholderStyle={{ backgroundColor: "transparent" }}
                                    containerStyle={{ marginHorizontal: 10, borderWidth: 1, borderColor: "#808080", width: 80, height: 80, borderRadius: 100 }}>
                                </Avatar>
                                :
                                <View style={{ width: 80, height: 80, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 30 }}>{user?.name?.charAt(0).toUpperCase()}</Text>
                                </View>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", padding: 20 }}>
                        <Text style={{ fontSize: 17, color: BaseColor.greyColor }}>Name : </Text>
                        <Text style={{ fontSize: 17 }}>{user?.name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", paddingHorizontal: 20, paddingBottom: 20 }}>
                        <Text style={{ fontSize: 17, color: BaseColor.greyColor }}>Email : </Text>
                        <Text style={{ fontSize: 17 }}>{user?.email}</Text>
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

