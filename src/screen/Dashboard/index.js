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

import { GoogleSignin } from '@react-native-community/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
// import { LoginManager } from 'react-native-fbsdk';

import { store, SetPrefrence } from "@store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as global from "@api/global";

import messaging from '@react-native-firebase/messaging';

import RNRestart from 'react-native-restart';

import { Loader, Header } from '@components';

import { BaseColor, Images } from '@config';
import * as Utils from '@utils';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {

            review: [],

            showRefresh: false,
            showLoader: false,
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

        RNRestart.Restart();
    }

    _onMessageReceived = (remoteMessage, is_show) => {
        try {
            const { data } = remoteMessage;
            if (is_show)
                this.showNotification(remoteMessage);

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
                if (notificationData?.active == 0)
                    this.logout();
            }
        } catch (error) {
            console.log('home notification received error', error);
        }
    }

    showNotification(remoteMessage) {
        const user_meta = store.getState().auth.login?.user?.meta;
        let is_showNotification = true;
        user_meta?.forEach((item, key) => {
            if (item.meta_key == global._SHOW_NOTIFICATION)
                is_showNotification = item.meta_value == 1 ? true : false;
        });
        if (!is_showNotification)
            return;

        this.props.setStore(global.PUSH_ALERT, remoteMessage);
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
    }

    UNSAFE_componentWillMount = async () => {
        this.setState({ showLoader: true })
        await this.start();
    }

    start = async () => {
        if (!Api._TOKEN())
            return;

        const response = await this.props.api.get('dashboard');
        if (response?.success) {
            this.props.setStore(global.U_MESSAGE_SET, 0);
            if (response.data.unread_message > 0)
                this.props.setStore(global.U_MESSAGE_SET, response.data.unread_message);

            this.setState({ review: response.data.review });

            let is_show_apple_button = response.data.is_show_apple_button;
            await SetPrefrence(global.PREF_SHOW_APPLE_BUTTON, is_show_apple_button);

            this.props.setStore(global.IS_VALID_SUBSCRIPTION, response.data.is_valid_subscription);
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    _onRefresh = async () => {
        this.setState({ showRefresh: true });
    }

    render = () => {
        const { user } = store.getState().auth.login;
        const { showLoader, showRefresh, review } = this.state;
        const { navigation } = this.props;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <Header navigation={navigation} mainHeader={true} />
                <ScrollView keyboardShouldPersistTaps='always'
                    style={{ padding: 10 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ borderRadius: 10, borderWidth: 1, height: 180, borderColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, paddingVertical: 30 }}>
                            {user?.avatar ?
                                <Image source={{ uri: Api.SERVER_HOST + user?.avatar }} style={{ width: 100, height: 100, borderRadius: 100 }}></Image>
                                :
                                <TouchableOpacity style={{ width: 80, height: 80, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                </TouchableOpacity>
                            }
                            <Text style={{ color: BaseColor.primaryColor, fontWeight: "bold", fontSize: 18 }} numberOfLines={1}>{user?.name}</Text>
                            <View style={{ position: "absolute", top: 23, right: 23, width: 35, height: 35, backgroundColor: BaseColor.pushAlertColor, borderRadius: 100, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 10 }}>Seller</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, marginLeft: 10, height: 180 }}>
                            <View style={{ height: 85, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, borderWidth: 1, borderColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.primaryColor, fontSize: 23 }}>70</Text>
                                    <Text>Active Ads</Text>
                                </View>
                                <View style={{ flex: 1 }}></View>
                                <TouchableOpacity style={{ backgroundColor: BaseColor.primaryColor, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 5, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 10 }}>View Ads</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 85, flexDirection: "row", marginTop: 10 }}>
                                <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, borderWidth: 1, borderColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.primaryColor, fontSize: 23 }}>70</Text>
                                    <Text>Active Ads</Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: 10, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, borderWidth: 1, borderColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.primaryColor, fontSize: 23 }}>70</Text>
                                    <Text>Active Ads</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={{ marginTop: 15, borderRadius: 5, backgroundColor: BaseColor.boostColor, justifyContent: "center", alignItems: "center", paddingVertical: 10 }}>
                        <Text style={{ color: BaseColor.whiteColor, fontStyle: "italic" }}>Boost Your Ads</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ app: { IS_IN_CHAT, FREE_SELL_ADS } }) => {
    return { IS_IN_CHAT, FREE_SELL_ADS };
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch),
        setStore: (type, data) => dispatch({ type, data })
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);