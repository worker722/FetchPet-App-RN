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
    ActivityIndicator,
    Image as RNImage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import geolocation from '@react-native-community/geolocation';
import { Image } from 'react-native-elements';
import { BaseColor, Images } from '@config';
import { Loader, Header, HomeAds } from '@components';
import * as Utils from '@utils';

import { GoogleSignin } from '@react-native-community/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
// import { LoginManager } from 'react-native-fbsdk';

import messaging from '@react-native-firebase/messaging';

import RNRestart from 'react-native-restart';

import { store, SetPrefrence, GetPrefrence } from "@store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as global from "@api/global";

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

        props.navigation.addListener("focus", (event) => {
            this.UNSAFE_componentWillMount();
        });
    }

    createNotificationListeners = async () => {
        this.notificationListener = messaging().onMessage((remoteMessage) => {
            this._onMessageReceived(remoteMessage, true);
        });
        messaging().getInitialNotification((remoteMessage) => {
            if (remoteMessage) {
                this._onMessageReceived(remoteMessage, false);
            }
        });
        messaging().onNotificationOpenedApp((remoteMessage) => {
            this._onMessageReceived(remoteMessage, false);
        });
    }

    logout = async () => {
        await SetPrefrence(global.PREF_REMEMBER_ME, 0);
        const is_social = store.getState().auth.login?.user?.is_social;
        if (is_social == 1) {
            await GoogleSignin.signOut();
        }
        else if (is_social == 2) {
            // LoginManager.logOut();
        }
        else if (is_social == 3) {
            await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGOUT,
            });
        }
        this.props.setStore(global.LOGIN, null);

        setTimeout(() => {
            RNRestart.Restart();
        }, 5200);
    }

    _onMessageReceived = (remoteMessage, is_show) => {
        try {
            const { data } = remoteMessage;

            let type = 'info';
            const notificationData = JSON.parse(data.data);
            if (notificationData.notification_type == global.CHAT_MESSAGE_NOTIFICATION) {
                if (!this.props.IS_IN_CHAT) {
                    if (is_show)
                        this.props.setStore(global.U_MESSAGE_INCREMENT, 1);
                    else
                        this.props.navigation.navigate("Chat", { ad_id: notificationData.room.id_ads, room_id: notificationData.room.id });
                }
            }
            else if (notificationData.notification_type == global.ACCOUNT_STATUS_NOTIFICATION) {
                if (notificationData?.active == 0) {
                    type = 'danger';
                    this.logout();
                }
                else {
                    type = 'success';
                }
            }

            if (is_show)
                this.showNotification(remoteMessage, type);

        } catch (error) {
            console.log('home notification received error', error);
        }
    }

    showNotification(remoteMessage, type) {
        const user_meta = store.getState().auth.login?.user?.meta;
        let is_showNotification = true;
        user_meta?.forEach((item, key) => {
            if (item.meta_key == global._SHOW_NOTIFICATION)
                is_showNotification = item.meta_value == 1 ? true : false;
        });
        if (!is_showNotification)
            return;

        this.props.setStore(global.PUSH_ALERT, remoteMessage);
        this.props.setStore(global.PUSH_ALERT_TYPE, type);
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
                await PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
                    ],
                );
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
        const response = await this.props.api.get('home');
        if (response?.success) {
            this.props.setStore(global.U_MESSAGE_SET, 0);
            if (response.data.unread_message > 0)
                this.props.setStore(global.U_MESSAGE_SET, response.data.unread_message);

            let pets = await this.sortAdsByDistance(response.data.ads);
            let topCategory = response.data.category;

            let is_show_apple_button = response.data.is_show_apple_button;
            await SetPrefrence(global.PREF_SHOW_APPLE_BUTTON, is_show_apple_button);

            this.props.setStore(global.IS_VALID_SUBSCRIPTION, response.data.is_valid_subscription);

            topCategory.filter((item, index) => {
                item.is_selected = false;
            });
            topCategory.unshift({ id: -1, name: "All", is_selected: true });

            this.setState({ pets, topCategory });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    sortAdsByDistance = async (ads) => {
        if (!ads) return [];

        const adsWithDistance = await Promise.all(ads.map(async item => await this.getAdsDistance(item)));
        let nearBoostAds = [];
        let normalAds = [];
        adsWithDistance.forEach((item, index) => {
            if (item.distance <= 100 && item.is_boost)
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
                    style={{ width: 54, height: 54, borderWidth: 5, justifyContent: "center", alignItems: "center", borderColor: item.is_selected ? BaseColor.primaryColor : BaseColor.whiteColor, borderRadius: 100, marginBottom: 5 }}>
                    {item.icon ?
                        <Image source={{ uri: Api.SERVER_HOST + item.icon }} PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />} placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} resizeMode={"stretch"} style={{ width: 45, height: 45, borderRadius: 100 }}></Image>
                        :
                        <RNImage source={Images.ic_category_all} placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} resizeMode={"stretch"} style={{ width: 45, height: 45, borderRadius: 100 }}></RNImage>
                    }
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

    onScrollEnd(e) {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;
        console.log(e.nativeEvent)

        // Divide the horizontal offset by the width of the view to see which page is visible
        let pageNum = Math.floor(contentOffset.y / viewSize.height);
        console.log('scrolled to page ', pageNum);
    }

    render = () => {

        const { pets, showLoader, showRefresh, showContentLoader, topCategory } = this.state;
        const { navigation } = this.props;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <Header navigation={navigation} mainHeader={true} />
                <View style={{ flexDirection: "row", marginHorizontal: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: BaseColor.primaryColor, fontSize: 20, flex: 1, fontWeight: "600" }}>Category of Pets</Text>
                </View>
                <View style={{ width: "100%", paddingHorizontal: 10, marginTop: 10 }}>
                    <FlatList
                        style={{ paddingBottom: 5 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={topCategory}
                        horizontal={true}
                        renderItem={this.renderFilterItem}
                    />
                </View>
                <View style={{ flexDirection: "row", width: "100%", height: 40, marginVertical: 10, paddingHorizontal: 10, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ borderRadius: 100, height: 40, flex: 1, backgroundColor: BaseColor.placeholderColor }}>
                        <TextInput
                            onChangeText={(text) => this.setState({ searchText: text })}
                            onSubmitEditing={this.searchAds}
                            returnKeyType="search"
                            style={{ flex: 1, paddingLeft: 100, paddingRight: 20, color: BaseColor.blackColor }}
                            placeholder={"Search"} placeholderTextColor={BaseColor.greyColor}></TextInput>
                        <View style={{ position: "absolute", left: 15, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                            <RNImage source={Images.logo} style={{ width: 50, height: 17 }} resizeMode={"stretch"}></RNImage>
                            <TouchableOpacity style={{ padding: 10 }} onPress={this.searchAds}>
                                <Icon name={"search"} size={18} color={BaseColor.primaryColor}></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("AdvancedFilter", { type: -1 })} style={{ backgroundColor: BaseColor.placeholderColor, width: 40, height: 40, marginLeft: 10, alignItems: "center", borderRadius: 100, justifyContent: "center", padding: 5 }}>
                        <Icon name={"sliders-h"} size={20} color={BaseColor.primaryColor}></Icon>
                    </TouchableOpacity>
                </View>
                {showContentLoader ?
                    <Loader />
                    :
                    <ScrollView keyboardShouldPersistTaps='always'
                        onMomentumScrollEnd={this.onScrollEnd}
                        refreshControl={
                            <RefreshControl
                                refreshing={showRefresh}
                                onRefresh={this._onRefresh}
                            />
                        }>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "600", marginLeft: 10 }}>Latest</Text>
                        <FlatList
                            style={{ paddingHorizontal: 10, marginTop: 10 }}
                            keyExtractor={(item, index) => index.toString()}
                            data={pets}
                            pagingEnabled
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