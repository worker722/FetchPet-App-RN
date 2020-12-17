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
    RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RBSheet from "react-native-raw-bottom-sheet";
import { getStatusBarHeight } from 'react-native-status-bar-height';

import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { store, SetPrefrence } from "@store";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as global from "@api/global";

import firebase from 'react-native-firebase';

import { Loader, Header, HomeAds } from '@components';

import { BaseColor } from '@config';
import * as Utils from '@utils';

const filterItem_width = (Utils.SCREEN.WIDTH - 20) / 4;

const FILTER_TYPE = {
    TOP_CATEGORY: 0,
    CATEGORY: 1,
    BREED: 2,
    GENDER: 3
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {

            pets: [],
            topCategory: [],

            filterCategory: [],
            filterBreed: [],
            filterGender: [
                {
                    id: 1,
                    type: FILTER_TYPE.GENDER,
                    name: 'Male',
                    is_selected: true
                },
                {
                    id: 0,
                    type: FILTER_TYPE.GENDER,
                    name: 'Female',
                    is_selected: false
                }
            ],
            filterPrice: {
                basic_min: 0,
                basic_max: 10000,
                min: 0,
                max: 1000,
            },

            searchText: '',
            currentCategoryID: -1,
            currentBreedID: -1,
            currentGender: 1,

            showRefresh: false,
            showLoader: false,
            showContentLoader: false
        }

        props.navigation.addListener("willFocus", (event) => {
            this.UNSAFE_componentWillMount();
        });
    }

    async createNotificationListeners() {
        firebase.notifications().onNotificationDisplayed((notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });

        /*
        * Triggered when a particular notification has been received in foreground
        * */
        if (Platform.OS == "android") {
            this.notificationListenerANDROID = firebase.notifications().onNotification((notification) => {
                const { title, body, data } = notification;
                if (data.type != global.NOTIFICATION_CHAT_MESSAGE)
                    this.showNotification(title, body);
            });
        }
        else {
            this.notificationListenerIOS = firebase.messaging().onMessage((notification) => {
                const { title, body, data } = notification;
                console.log('notification', notification);
                if (data.type != global.NOTIFICATION_CHAT_MESSAGE)
                    this.showNotification(title, body);
            })
        }

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
        }
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

        if (Platform.OS === "android") {
            const localNotification = new firebase.notifications.Notification({
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

            firebase.notifications()
                .displayNotification(localNotification)
                .catch(err => console.error(err));
        }
        else {
            const localNotification = new firebase.notifications.Notification()
                .setNotificationId(new Date().toLocaleString())
                .setTitle(title)
                .setBody(body)

            firebase.notifications()
                .displayNotification(localNotification)
                .catch(err => console.error(err));
        }
    }

    handleAppStateChange = (nextAppState) => { }

    componentWillUnmount = async () => {
        AppState.removeEventListener('change', this.handleAppStateChange);
        if (Platform.OS === 'ios')
            this.notificationListenerIOS && this.notificationListenerIOS();
        else
            this.notificationListenerANDROID && this.notificationListenerANDROID();
    }

    componentDidMount = async () => {
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
                    firebase.messaging().getToken().then(token => { });
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            firebase.messaging().registerForNotifications();
                        })
                        .catch(error => {
                        });
                }
            });
    }

    UNSAFE_componentWillMount = async () => {
        this.setState({ showLoader: true })
        await this.start();
    }

    start = async () => {
        const response = await this.props.api.get('home');
        if (response?.success) {
            let ads = await this.sortAdsByDistance(response.data.ads);
            console.log(ads);
            let topCategory = response.data.category;
            let filterBreed = response.data.breed;
            let is_show_apple_button = response.data.is_show_apple_button;
            await SetPrefrence('is_show_apple_button', is_show_apple_button);

            topCategory.filter((item, index) => {
                item.type = FILTER_TYPE.TOP_CATEGORY;
                item.is_selected = false;
            });
            topCategory.unshift({ id: -1, name: "All", is_selected: true, type: FILTER_TYPE.TOP_CATEGORY });

            filterBreed.filter((item, index) => {
                if (index == 0) {
                    item.is_selected = true;
                    this.setState({ currentBreedID: item.id });
                }
                else item.is_selected = false;
                item.type = FILTER_TYPE.BREED;
            })
            this.setState({
                filterPrice: {
                    basic_min: 0,
                    basic_max: response.data.max_price,
                    min: 0,
                    max: response.data.max_price,
                },
                pets: ads,
                topCategory: topCategory,
                filterBreed: filterBreed
            });
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

    filterSelected = async (type, id) => {
        if (type == FILTER_TYPE.TOP_CATEGORY) {
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
        else if (type == FILTER_TYPE.BREED) {
            let filterBreed = this.state.filterBreed;
            filterBreed.forEach((item, key) => {
                if (item.id == id) item.is_selected = true;
                else item.is_selected = false;
            });
            this.setState({ filterBreed: filterBreed, currentBreedID: id });
        }
        else if (type == FILTER_TYPE.GENDER) {
            let filterGender = this.state.filterGender;
            filterGender.forEach((item, key) => {
                if (item.id == id) {
                    item.is_selected = true;
                    this.setState({ currentGender: item.id });
                }
                else item.is_selected = false;
            });
            this.setState({ filterGender: filterGender, currentGender: id });
        }
    }

    getFilterData = async () => {
        const { currentCategoryID, searchText } = this.state;

        this.setState({ pets: [] });
        const param = { id_category: currentCategoryID, searchText: searchText };
        const response = await this.props.api.post('home/filter_category', param);
        this.setState({ showContentLoader: false, showRefresh: false });

        if (response?.success) {
            const ads = await this.sortAdsByDistance(response.data.ads);
            this.setState({ pets: ads });
        }
    }

    filterPet = async () => {
        this.RBSheetRef.close();
        this.setState({ showLoader: true, ads: [] });
        const { currentCategoryID, currentBreedID, currentGender, filterPrice } = this.state;
        const params = { id_category: currentCategoryID, id_breed: currentBreedID, gender: currentGender, price: filterPrice };
        console.log(params)
        const response = await this.props.api.post("home/filter", params);
        if (response?.success) {
            const ads = await this.sortAdsByDistance(response.data.ads);
            this.setState({ pets: ads });
        }
        this.setState({ showLoader: false });
    }

    favouriteAds = async (index, item, value) => {
        let pets = this.state.pets;
        pets[index].is_fav = value;
        this.setState({ pets: pets });
        const param = { ad_id: item.id, is_fav: value };
        const response = await this.props.api.post('ads/ad_favourite', param);
    }

    renderFilterItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.filterSelected(item.type, item.id)} style={{ width: filterItem_width, justifyContent: "center", alignItems: "center", backgroundColor: item.is_selected ? BaseColor.primaryColor : "white", height: 40, borderRadius: 5 }}>
                <Text style={{ color: !item.is_selected ? BaseColor.primaryColor : "white" }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    searchAds = async () => {
        if (this.state.searchText == '')
            return;

        this.setState({ showContentLoader: true });
        this.getFilterData();
    }

    goAdsDetail = (id) => {
        this.props.navigation.navigate("AdDetail", { ad_id: id, view: true });
    }

    _onRefresh = async () => {
        this.setState({ showRefresh: true });
        this.getFilterData();
    }

    priceRangeChanged = (values) => {
        let filterPrice = this.state.filterPrice;
        filterPrice.min = values[0];
        filterPrice.max = values[1];
        this.setState({ filterPrice });
    }

    render = () => {

        const { pets, showLoader, showRefresh, showContentLoader, topCategory, filterBreed, filterGender, filterPrice } = this.state;
        const navigation = this.props.navigation;
        
        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingTop: getStatusBarHeight(true) }}>
                <Header navigation={this.props.navigation} mainHeader={true} />
                <View style={{ flexDirection: "row", width: "100%", height: 40, paddingHorizontal: 10, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ borderRadius: 5, height: 40, flex: 1, backgroundColor: BaseColor.primaryColor }}>
                        <TextInput
                            onChangeText={(text) => this.setState({ searchText: text })}
                            style={{ flex: 1, paddingLeft: 45, paddingRight: 20, color: "white" }}
                            placeholder={"Search"} placeholderTextColor={BaseColor.whiteColor}></TextInput>
                        <TouchableOpacity style={{ position: "absolute", padding: 10 }} onPress={() => this.searchAds()}>
                            <Icon name={"search"} size={20} color={BaseColor.whiteColor}></Icon>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.RBSheetRef.open()} style={{ backgroundColor: BaseColor.primaryColor, width: 40, height: 40, marginLeft: 10, alignItems: "center", borderRadius: 5, justifyContent: "center", padding: 5 }}>
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
                                <HomeAds data={item} onItemClick={this.goAdsDetail} onFavourite={this.favouriteAds} navigation={navigation} />
                            )}
                        />
                    </ScrollView>
                }

                <RBSheet
                    ref={ref => {
                        this.RBSheetRef = ref;
                    }}
                    height={Utils.SCREEN.HEIGHT / 2}
                    openDuration={10}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center",
                            borderTopLeftRadius: 30, borderTopRightRadius: 30
                        }
                    }}>

                    <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <View style={{ width: 120, height: 6, backgroundColor: "#9b9b9b", borderRadius: 100 }}></View>
                        </View>
                        <Text style={{ fontSize: 18, color: BaseColor.primaryColor, marginTop: 10 }}>Breed</Text>
                        <View style={{ flexDirection: "row", width: "100%", marginTop: 5 }}>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={filterBreed}
                                horizontal={true}
                                renderItem={this.renderFilterItem}
                            />
                        </View>
                        <Text style={{ fontSize: 18, color: BaseColor.primaryColor, marginTop: 10 }}>Gender</Text>
                        <View style={{ flexDirection: "row", width: "100%", marginTop: 5 }}>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={filterGender}
                                horizontal={true}
                                renderItem={this.renderFilterItem}
                            />
                        </View>
                        <Text style={{ fontSize: 18, color: BaseColor.primaryColor, marginTop: 10 }}>Price</Text>
                        <View style={{ flexDirection: "row", paddingHorizontal: 5 }}>
                            <Text style={{ flex: 1 }}>$ {filterPrice.min}</Text>
                            <Text style={{ flex: 1, textAlign: "right" }}>$ {filterPrice.max}</Text>
                        </View>
                        <View style={{ paddingHorizontal: 10 }}>
                            <MultiSlider
                                markerStyle={{
                                    ...Platform.select({
                                        ios: {
                                            height: 20,
                                            width: 20,
                                            shadowColor: '#000000',
                                            shadowOffset: {
                                                width: 0,
                                                height: 3
                                            },
                                            shadowRadius: 1,
                                            shadowOpacity: 0.1
                                        },
                                        android: {
                                            height: 20,
                                            width: 20,
                                            borderRadius: 10,
                                            backgroundColor: BaseColor.primaryColor
                                        }
                                    })
                                }}
                                pressedMarkerStyle={{
                                    ...Platform.select({
                                        android: {
                                            height: 16,
                                            width: 16,
                                            borderRadius: 8,
                                            backgroundColor: BaseColor.primaryColor
                                        }
                                    })
                                }}
                                selectedStyle={{ backgroundColor: BaseColor.primaryColor, height: 3 }}
                                onValuesChange={this.priceRangeChanged}
                                values={[filterPrice.min, filterPrice.max]}
                                min={filterPrice.basic_min}
                                max={filterPrice.basic_max}
                                sliderLength={Utils.SCREEN.WIDTH - 40}
                                allowOverlap={false}
                            />
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                            <TouchableOpacity
                                onPress={this.filterPet}
                                style={{ justifyContent: "center", alignItems: "center", borderRadius: 5, paddingHorizontal: 40, height: 40, backgroundColor: BaseColor.primaryColor }}>
                                <Text style={{ color: BaseColor.whiteColor }}>Filter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </RBSheet>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(Home);