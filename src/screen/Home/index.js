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
    PermissionsAndroid,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import geolocation from '@react-native-community/geolocation';
import { Image } from 'react-native-elements';

import { GoogleSignin } from '@react-native-community/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
// import { LoginManager } from 'react-native-fbsdk';

import { store, SetPrefrence } from "@store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as global from "@api/global";

import messaging from '@react-native-firebase/messaging';

import { Loader, Header, HomeAds } from '@components';

import { BaseColor } from '@config';
import * as Utils from '@utils';

const default_icon = "/material/img/normal.png";

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
        this.notificationListener = messaging().onMessage((remoteMessage) => {
            this._onMessageReceived(remoteMessage);
        });
    }

    logout = async () => {
        await SetPrefrence(global.PREF_REMEMBER_ME, 0);
        const is_social = store.getState().auth.login?.user?.is_social;
        if (is_social == 1) {
            await GoogleSignin.signOut();
        }
        else if (is_social == 2) {
            LoginManager.logOut();
        }
        else if (is_social == 3) {
            await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGOUT,
            });
        }
        this.props.setStore(global.LOGIN, null);
        this.props.navigation.navigate('Welcome');
    }

    _onMessageReceived = (remoteMessage) => {
        try {
            const { notification, data } = remoteMessage;
            this.showNotification(notification);

            const notificationData = JSON.parse(data.data);
            if (notificationData.notification_type == global.CHAT_MESSAGE_NOTIFICATION) {
                if (!this.props.IS_IN_CHAT)
                    this.props.setStore(global.U_MESSAGE_INCREMENT, 1);
            }
            else if (notificationData.notification_type == global.ACCOUNT_STATUS_NOTIFICATION) {
                if (notificationData?.active == 0)
                    this.logout();
            }
        } catch (error) {
            console.log('home notification received error', error);
        }
    }

    showNotification(notification) {
        const user_meta = store.getState().auth.login?.user?.meta;
        let is_showNotification = false;
        user_meta?.forEach((item, key) => {
            if (item.meta_key == global._SHOW_NOTIFICATION)
                is_showNotification = item.meta_value == 1 ? true : false;
        });
        if (!is_showNotification)
            return;

        this.props.setStore(global.PUSH_ALERT, notification);
    }

    handleAppStateChange = (nextAppState) => { }

    componentWillUnmount = async () => {
        AppState.removeEventListener('change', this.handleAppStateChange);
        this.notificationListener && this.notificationListener();
    }

    componentDidMount = async () => {
        await this.requestPermission();

        await this.createNotificationListeners();
        AppState.addEventListener('change', this.handleAppStateChange);

        await messaging().hasPermission()
            .then(async enabled => {
                if (enabled) {
                    this.getFcmToken();
                } else {
                    await messaging().requestPermission()
                        .then(async () => {
                            this.getFcmToken();
                        })
                        .catch(error => {
                        });
                }
            });
    }

    getFcmToken = async () => {
        const user_meta = store.getState().auth.login?.user?.meta;
        let is_showNotification = true;
        user_meta?.forEach((item, key) => {
            if (item.meta_key == global._SHOW_NOTIFICATION)
                is_showNotification = item.meta_value == 1 ? true : false;
        });

        if (!is_showNotification)
            return;

        if (!messaging().isDeviceRegisteredForRemoteMessages)
            await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        if (token) {
            const params = { token, platform: Platform.OS };
            if (!Api._TOKEN())
                return;

            await this.props.api.post("profile/token", params);
        }
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
            this.props.setStore(global.U_MESSAGE_SET, 0);
            if (response.data.unread_message > 0)
                this.props.setStore(global.U_MESSAGE_SET, response.data.unread_message);

            let pets = await this.sortAdsByDistance(response.data.ads);
            let topCategory = response.data.category;

            let is_show_apple_button = response.data.is_show_apple_button;
            await SetPrefrence(global.PREF_SHOW_APPLE_BUTTON, is_show_apple_button);

            topCategory.filter((item, index) => {
                item.is_selected = false;
            });
            topCategory.unshift({ id: -1, name: "All", is_selected: true, icon: default_icon });

            this.setState({ pets, topCategory });
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
        try {
            const currentLocation = await Utils.getCurrentLocation();
            item.distance = await Utils.getDistance(item.lat, item.long, currentLocation.latitude, currentLocation.longitude);
            return item;
        } catch (error) {
            item.distance = 0;
            return item;
        }
    }

    filterSelected = async (currentCategoryID) => {
        this.setState({ showContentLoader: true });
        let topCategory = this.state.topCategory;
        topCategory.forEach((item, key) => {
            if (item.id == currentCategoryID) item.is_selected = true;
            else item.is_selected = false;
        });
        this.setState({ topCategory, currentCategoryID }, () => {
            this.setState({ showContentLoader: true });
            this.getFilterData();
        });
    }

    getFilterData = async () => {
        const { currentCategoryID, searchText } = this.state;

        this.setState({ pets: [] });
        const param = { id_category: currentCategoryID, searchText };
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
            <View style={{ alignItems: "center", justifyContent: "center", width: 60, marginRight: 25 }}>
                <TouchableOpacity activeOpacity={1}
                    onPress={() => this.filterSelected(item.id)}
                    style={{ width: 60, height: 60, borderWidth: 6, justifyContent: "center", alignItems: "center", borderColor: item.is_selected ? BaseColor.primaryColor : BaseColor.whiteColor, borderRadius: 100, marginBottom: 5 }}>
                    <Image source={{ uri: Api.SERVER_HOST + item.icon ? item.icon : default_icon }} PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />} placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} resizeMode={"cover"} style={{ width: 45, height: 45, borderRadius: 100 }}></Image>
                </TouchableOpacity>
                <Text style={{ color: item.is_selected ? BaseColor.primaryColor : BaseColor.greyColor }} numberOfLines={1}>{item.name}</Text>
            </View>
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

        const { pets, showLoader, showRefresh, showContentLoader, topCategory, notification } = this.state;
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
                <View style={{ width: "100%", paddingHorizontal: 10, flexDirection: "row", marginTop: 10 }}>
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

const mapStateToProps = ({ app: { IS_IN_CHAT } }) => {
    return { IS_IN_CHAT };
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch),
        setStore: (type, data) => dispatch({ type, data })
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);