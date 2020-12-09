import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    AppState,
    Platform,
    Alert,
    ScrollView,
    RefreshControl
} from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RBSheet from "react-native-raw-bottom-sheet";
import RangeSlider from 'rn-range-slider';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';
import * as global from "@api/global";

import firebase from 'react-native-firebase';

import { Loader, Header, HomeAds } from '@components';

import { BaseColor } from '@config';
import * as Utils from '@utils';
import { createPersistoid } from 'redux-persist';

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
                    id: 2,
                    type: FILTER_TYPE.GENDER,
                    name: 'Female',
                    is_selected: false
                }
            ],
            filterPrice: {
                min: 0,
                max: 10000,
            },

            searchText: '',
            currentCategoryID: -1,

            showRefresh: false,
            showLoader: false,
            showContentLoader: false
        }

        props.navigation.addListener("willFocus", (event) => {
            this.componentWillMount();
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
                console.log('home notification', data);
                if (data.type != global.NOTIFICATION_CHAT_MESSAGE)
                    this.showNotification(title, body);
            });
        }
        else {
            this.notificationListenerIOS = firebase.messaging().onMessage((notification) => {
                const { title, body, data } = notification;
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

        firebase.messaging().onMessage(async message => {
        });
    }

    showNotification(title, body) {
        if (Platform.OS === "android") {
            const localNotification = new firebase.notifications.Notification({
                sound: 'default',
                show_in_foreground: true,
            })
                .setNotificationId(new Date().toLocaleString())
                .setTitle(title)
                .setBody(body)
                .android.setChannelId(global.NOTIFICATION_CHANNEL_ID)
                .android.setColor('#ffffff')
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
                    firebase.messaging().getToken().then(token => {
                        // console.log('fcmToken', token)
                    })
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            firebase.messaging().registerForNotifications()
                            alert("User Now Has Permission")
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            });
    }

    componentWillMount = async () => {
        this.setState({ showLoader: true })
        await this.start();
    }

    start = async () => {
        const response = await this.props.api.get('home');

        if (response?.success) {

            let ads = await this.nearestSortAds(response.data.ads);
            // let filterCategory = response.data.category;
            let topCategory = response.data.category;
            let filterBreed = response.data.breed;

            topCategory.filter((item, index) => {
                item.type = FILTER_TYPE.TOP_CATEGORY;
                item.is_selected = false;
            });
            topCategory.unshift({ id: -1, name: "All", is_selected: true, type: FILTER_TYPE.TOP_CATEGORY });

            // filterCategory.filter((item, index) => {
            //     if (index == 0) item.is_selected = true;
            //     else item.is_selected = false;
            // });

            filterBreed.filter((item, index) => {
                if (index == 0) item.is_selected = true;
                else item.is_selected = false;
            })

            this.setState({
                pets: ads,
                topCategory: topCategory,
                // filterCategory: filterCategory,
                filterBreed: filterBreed
            });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    nearestSortAds = async (ads) => {
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

    getMetadataPromise(entry) {
        return new Promise((resolve, reject) => {
            entry.getMetadata(resolve, reject);
        });
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
        else if (type == FILTER_TYPE.CATEGORY) {
            let filterCategory = this.state.filterCategory;
            filterCategory.forEach((item, key) => {
                if (item.id == id) item.is_selected = true;
                else item.is_selected = false;
            });
            this.setState({ filterCategory: filterCategory });
        }
        else if (type == FILTER_TYPE.BREED) {
            let filterBreed = this.state.filterBreed;
            filterBreed.forEach((item, key) => {
                if (item.id == id) item.is_selected = true;
                else item.is_selected = false;
            });
            this.setState({ filterBreed: filterBreed });
        }
        else if (type == FILTER_TYPE.GENDER) {
            let filterGender = this.state.filterGender;
            filterGender.forEach((item, key) => {
                if (item.id == id) item.is_selected = true;
                else item.is_selected = false;
            });
            this.setState({ filterGender: filterGender });
        }
    }

    getFilterData = async () => {
        const { currentCategoryID, searchText } = this.state;
        console.log(currentCategoryID);

        this.setState({ pets: [] });
        const param = { id_category: currentCategoryID, searchText: searchText };
        const response = await this.props.api.post('home/filter_category', param);
        this.setState({ showContentLoader: false, showRefresh: false });

        if (response?.success) {
            const ads = await this.nearestSortAds(response.data.ads);
            this.setState({ pets: ads });
        }
    }

    filterPet = () => {
        const { filterCategory, filterBreed, filterGender, filterPrice } = this.state;
        let categoryItem = filterCategory.filter((item, index) => {
            return item.is_selected;
        });
    }

    favouriteAds = async (index, item, value) => {
        console.log(index)
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

    handleScroll = () => {

    }

    render = () => {

        const { pets, showLoader, showRefresh, showContentLoader, topCategory, filterCategory, filterBreed, filterGender } = this.state;
        const navigation = this.props.navigation;

        if (showLoader)
            return (<Loader />);

        ///range slider
        const renderThumb = () => {
            return (<View style={{ width: 15, height: 15, backgroundColor: BaseColor.primaryColor, borderRadius: 100 }}></View>)
        }
        const renderRail = () => {
            return (<View style={{ height: 8, flex: 1, backgroundColor: "#9b9b9b", borderRadius: 100 }}></View>)
        }
        const renderRailSelected = () => {
            return (<View style={{ height: 8, backgroundColor: BaseColor.primaryColor }}></View>)
        }
        const renderLabel = () => {
            return (<View></View>)
        }
        const renderNotch = () => {
            return (<View></View>)
        }

        return (
            <View style={{ flex: 1, zIndex: -1 }}>
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
                    <TouchableOpacity style={{ marginLeft: 10, marginTop: 10 }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 13 }}>Show All</Text>
                    </TouchableOpacity>
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
                        }
                        onScroll={this.handleScroll}>
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
                    height={Utils.SCREEN.HEIGHT / 5 * 3}
                    openDuration={250}
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
                        <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingVertical: 10, fontWeight: "bold" }}>Pet</Text>
                        <View style={{ flexDirection: "row", width: "100%" }}>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={filterCategory}
                                horizontal={true}
                                renderItem={this.renderFilterItem}
                            />
                        </View>
                        <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingVertical: 10, fontWeight: "bold" }}>Breed</Text>
                        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={filterBreed}
                                horizontal={true}
                                renderItem={this.renderFilterItem}
                            />
                        </View>
                        <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingVertical: 10, fontWeight: "bold" }}>Gender</Text>
                        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={filterGender}
                                horizontal={true}
                                renderItem={this.renderFilterItem}
                            />
                        </View>
                        <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingVertical: 10, fontWeight: "bold" }}>Price</Text>
                        <View style={{ width: "100%", height: 20 }}>
                            <RangeSlider
                                style={{ width: Utils.SCREEN.WIDTH - 20, height: 20 }}
                                gravity={'center'}
                                min={0}
                                max={800}
                                textFormat='$'
                                step={200}
                                selectionColor="#3df"
                                blankColor="#f618"
                                renderThumb={renderThumb}
                                renderRail={renderRail}
                                renderRailSelected={renderRailSelected}
                                renderLabel={renderLabel}
                                renderNotch={renderNotch}
                            // onValueChanged={(low, high, fromUser) => {
                            //     this.setState({ rangeLow: low, rangeHigh: high })
                            // }}
                            />
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