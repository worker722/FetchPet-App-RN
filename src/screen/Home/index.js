import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    AppState,
    Platform,
    ScrollView,
    RefreshControl,
    PermissionsAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import geolocation from '@react-native-community/geolocation';

import { store, SetPrefrence } from "@store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as global from "@api/global";

import firebase from 'react-native-firebase';

import { Loader, Header, HomeAds } from '@components';

import { BaseColor } from '@config';
import * as Utils from '@utils';
import { event } from 'react-native-reanimated';

const filterItem_width = (Utils.SCREEN.WIDTH - 20) / 4;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {

            pets: [],
            topCategory: [],

            searchText: '',
            currentCategoryID: -1,

            showRefresh: false,
            showLoader: false,
            showContentLoader: false
        }

        this.props.setStore(global.IS_IN_CHAT_PAGE, false);

        props.navigation.addListener("willFocus", (event) => {
            this.UNSAFE_componentWillMount();
        });
    }

    createNotificationListeners = async () => {
        if (Platform.OS == "android") {
            this.notificationListener_ANDROID = firebase.notifications().onNotification((notification) => {
                this._onMessageReceived(notification);
            });
        }
        else {
            this.notificationListener_IOS = firebase.messaging().onMessage((notification) => {
                this._onMessageReceived(notification);
            });
        }
    }

    _onMessageReceived = (notification) => {
        const { title, body } = notification;
        this.showNotification(title, body);
        if (!this.props.is_in_chat)
            this.props.setStore(global.U_MESSAGE_INCREMENT, 1);
    }

    showNotification(title, body) {
        const user_meta = store.getState().auth.login.user.meta;
        let is_showNotification = false;
        user_meta?.forEach((item, key) => {
            if (item.meta_key == global._SHOW_NOTIFICATION)
                is_showNotification = item.meta_value == 1 ? true : false;
        });
        if (!is_showNotification)
            return;

        let localNotification = null;
        if (Platform.OS === "android") {
            localNotification = new firebase.notifications.Notification({
                sound: 'default',
                show_in_foreground: true,
            })
                .setNotificationId(new Date().toLocaleString())
                .setTitle(title)
                .setBody(body)
                .android.setChannelId(global.NOTIFICATION_CHANNEL_ID)
                .android.setColor(BaseColor.primaryColor)
                .android.setSmallIcon('ic_notification')
                .android.setPriority(firebase.notifications.Android.Priority.High);
        }
        else {
            localNotification = new firebase.notifications.Notification()
                .setNotificationId(new Date().toLocaleString())
                .setTitle(title)
                .setBody(body)
        }

        firebase.notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
    }

    handleAppStateChange = (nextAppState) => { }

    componentWillUnmount = async () => {
        AppState.removeEventListener('change', this.handleAppStateChange);
        if (Platform.OS == "android")
            this.notificationListener_ANDROID && this.notificationListener_ANDROID();
        else
            this.notificationListener_IOS && this.notificationListener_IOS();
    }

    componentDidMount = async () => {
        await this.requestPermission();

        await this.createNotificationListeners();
        AppState.addEventListener('change', this.handleAppStateChange);

        if (Platform.OS == "android") {
            const channel = new firebase.notifications.Android.Channel(
                global.NOTIFICATION_CHANNEL_ID,
                global.NOTIFICATION_CHANNEL_NAME,
                firebase.notifications.Android.Importance.High
            ).setDescription(global.NOTIFICATION_CHANNEL_DESCRIPTION);
            firebase.notifications().android.createChannel(channel);
        }

        await firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    firebase.messaging().getToken().then(async token => {
                        if (token) {
                            const params = { token, platform: Platform.OS };
                            if (!Api._TOKEN())
                                return;

                            await this.props.api.post("profile/token", params);
                        }
                    });
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            if (Platform.OS == "ios")
                                firebase.messaging().ios.registerForRemoteNotifications();
                        })
                        .catch(error => {
                        });
                }
            });
    }

    requestPermission = async () => {
        try {
            if (Platform.OS == "android") {
                const granted = await PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
                    ],
                );
                if (
                    granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                }
            }
            else {
                geolocation.requestAuthorization();
                await Utils.getCurrentLocation();
            }
        } catch (err) {
        }
    };

    UNSAFE_componentWillMount = async () => {
        this.setState({ showLoader: true })
        await this.start();
    }

    start = async () => {
        if (!Api._TOKEN())
            return;

        const response = await this.props.api.get('home');
        if (response?.success) {
            if (response.data.unread_message > 0)
                this.props.setStore(global.U_MESSAGE_SET, response.data.unread_message);

            let ads = await this.sortAdsByDistance(response.data.ads);
            let topCategory = response.data.category;

            let is_show_apple_button = response.data.is_show_apple_button;
            await SetPrefrence(global.PREF_SHOW_APPLE_BUTTON, is_show_apple_button);

            topCategory.filter((item, index) => {
                item.is_selected = false;
            });
            topCategory.unshift({ id: -1, name: "All", is_selected: true });

            this.setState({
                pets: ads,
                topCategory: topCategory
            });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    sortAdsByDistance = async (ads) => {
        if (!ads) return [];

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

    filterSelected = async (id) => {
        this.setState({ showContentLoader: true });
        let topCategory = this.state.topCategory;
        topCategory.forEach((item, key) => {
            if (item.id == id) item.is_selected = true;
            else item.is_selected = false;
        });
        this.setState({ topCategory: topCategory, currentCategoryID: id }, () => {
            this.setState({ showContentLoader: true });
            this.getFilterData();
        });
    }

    getFilterData = async () => {
        const { currentCategoryID, searchText } = this.state;

        this.setState({ pets: [] });
        const param = { id_category: currentCategoryID, searchText: searchText };
        const response = await this.props.api.post('home/filter', param);
        this.setState({ showContentLoader: false, showRefresh: false });

        if (response?.success) {
            const ads = await this.sortAdsByDistance(response.data.ads);
            this.setState({ pets: ads });
        }
    }

    favouriteAds = async (index, item, value) => {
        let { pets } = this.state;
        pets[index].is_fav = value;
        this.setState({ pets });
        const param = { ad_id: item.id, is_fav: value };
        await this.props.api.post('ads/ad_favourite', param);
    }

    renderFilterItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={1}
                onPress={() => this.filterSelected(item.id)}
                style={{ width: filterItem_width, justifyContent: "center", alignItems: "center", backgroundColor: item.is_selected ? BaseColor.primaryColor : BaseColor.whiteColor, height: 40, borderRadius: 5, marginBottom: 5 }}>
                <Text style={{ color: !item.is_selected ? BaseColor.primaryColor : BaseColor.whiteColor }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    searchAds = async () => {
        if (this.state.searchText == '')
            return;

        this.setState({ showContentLoader: true });
        this.getFilterData();
    }

    _onRefresh = async () => {
        this.setState({ showRefresh: true });
        this.getFilterData();
    }

    render = () => {

        const { pets, showLoader, showRefresh, showContentLoader, topCategory } = this.state;
        const { navigation } = this.props;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <Header navigation={navigation} mainHeader={true} />
                <View style={{ flexDirection: "row", width: "100%", height: 40, paddingHorizontal: 10, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ borderRadius: 5, height: 40, flex: 1, backgroundColor: BaseColor.primaryColor }}>
                        <TextInput
                            onChangeText={(text) => this.setState({ searchText: text })}
                            onSubmitEditing={this.searchAds}
                            returnKeyType="search"
                            style={{ flex: 1, paddingLeft: 45, paddingRight: 20, color: BaseColor.whiteColor }}
                            placeholder={"Search"} placeholderTextColor={BaseColor.whiteColor}></TextInput>
                        <TouchableOpacity style={{ position: "absolute", padding: 10 }} onPress={this.searchAds}>
                            <Icon name={"search"} size={20} color={BaseColor.whiteColor}></Icon>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("AdvancedFilter")} style={{ backgroundColor: BaseColor.primaryColor, width: 40, height: 40, marginLeft: 10, alignItems: "center", borderRadius: 5, justifyContent: "center", padding: 5 }}>
                        <Icon name={"sliders-h"} size={20} color={BaseColor.whiteColor}></Icon>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", marginHorizontal: 10, marginTop: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: BaseColor.primaryColor, fontSize: 20, flex: 1, fontWeight: "600" }}>Category of Pets</Text>
                </View>
                <View style={{ width: "100%", height: 50, paddingHorizontal: 10, flexDirection: "row", marginTop: 10 }}>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={topCategory}
                        horizontal={true}
                        renderItem={this.renderFilterItem}
                    />
                </View>
                <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "600", marginLeft: 10 }}>Latest</Text>
                {showContentLoader ?
                    <Loader />
                    :
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
                            data={pets}
                            renderItem={(item, key) => (
                                <HomeAds data={item} onFavourite={this.favouriteAds} navigation={navigation} />
                            )}
                        />
                    </ScrollView>
                }
            </View>
        )
    }
}

const mapStateToProps = ({ app: { is_in_chat } }) => {
    return { is_in_chat };
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch),
        setStore: (type, data) => dispatch({ type, data })
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);