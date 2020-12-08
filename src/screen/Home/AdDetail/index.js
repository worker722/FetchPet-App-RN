import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Linking,
    Platform,
    Share,
    Modal,
    TextInput,
    RefreshControl
} from 'react-native';
import { BaseColor } from '@config';
import { Header, Loader } from '@components';
import * as Utils from '@utils';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Avatar, Image } from 'react-native-elements';
import { Rating } from 'react-native-ratings';
import Styles from './style';

import Toast from 'react-native-simple-toast';

import * as Animatable from 'react-native-animatable';

import MapView, { Marker } from 'react-native-maps';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';

const slider_height = Math.floor(Utils.SCREEN.HEIGHT / 11 * 3);
class AdDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ads: {},
            adsLocation: '',
            showLoader: false,
            showRefresh: false,
            animType: null,

            orderName: '',
            orderEmail: '',
            orderPhone: '',
            orderDesc: '',

            visibleOrderDialog: false,
        }
    }

    componentWillMount = async () => {
        this.setState({ showLoader: true });
        const param = { ad_id: this.props.navigation.state.params.ad_id };
        const response = await this.props.api.post('ads', param);
        this.setState({ showLoader: false, ads: response.data.ads });
        Utils.getAddressByCoords(response.data.ads.lat, response.data.ads.long, false, (adsLocation) => {
            this.setState({ adsLocation });
        });
    }

    favouriteAds = async () => {
        let item = this.state.ads;
        item.is_fav = !item.is_fav;
        this.setState({ ads: item });
        const param = { ad_id: item.id, is_fav: item.is_fav };
        const response = await this.props.api.post('ads/ad_favourite', param);
    }

    goBack = () => {
        this.props.navigation.goBack(null);
    }

    shareAds = async () => {
        Share.share({
            message:
                "Fetch" + "\n" + "Pet marketplace app. Welcome to here!",
        });
    }

    onChat = () => {
        const { navigation } = this.props;
        const { ads } = this.state;
        navigation.navigate("Chat", { ad_id: ads.id });
    }

    onCall = () => {
        const { ads } = this.state;
        let phoneNumber = 'telprompt:' + ads.user.phonenumber;
        if (Platform.OS === 'android') {
            phoneNumber = 'tel:' + ads.user.phonenumber;
        }

        Linking.openURL(phoneNumber);
    }

    _onScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.y;
        if (scrollPosition > 150) {
            this.setState({ animType: "fadeInRight" });
        }
        else if (scrollPosition < 10) {
            this.setState({ animType: "fadeOutRight" });
        }
    }

    showOrderDialog = () => {
        const { ads } = this.state;
        this.setState({
            orderName: ads.user.name,
            orderEmail: ads.user.email,
            orderPhone: ads.user.phonenumber,
        })
        this.setState({ visibleOrderDialog: true });
    }

    orderAds = async () => {
        const { ads, orderName, orderEmail, orderPhone, orderDesc } = this.state;
        if (orderName == '') {
            Toast.show("Please input name.");
            return;
        }
        if (orderEmail == '') {
            Toast.show("Please input email");
            return;
        }
        if (orderPhone == '') {
            Toast.show("Please input phone number");
            return;
        }
        this.setState({ showLoader: true });
        const params = { id_ads: ads.id, name: orderName, email: orderEmail, phonenumber: orderPhone, description: orderDesc, status: 0 };
        const response = await this.props.api.post('ads/order', params);

        if (response?.success) {
            this.setState({ visibleOrderDialog: false });
            this.props.navigation.goBack(null);
        }
        else
            this.setState({ showLoader: false });
    }

    _onRefresh = () => {
        
    }

    render = () => {
        const { ads, showLoader, showRefresh, adsLocation, animType, visibleOrderDialog, orderName, orderEmail, orderPhone, orderDesc } = this.state;
        const navigation = this.props.navigation;
        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}
                    onScroll={this._onScroll}
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <View style={{ height: slider_height }}>
                        <Swiper style={{ height: slider_height }} autoplay={true} dotColor={"white"} paginationStyle={{ position: "absolute", bottom: 10 }} activeDotColor={BaseColor.primaryColor} dotStyle={{ width: 8, height: 8, borderRadius: 100 }} activeDotStyle={{ width: 11, height: 11, borderRadius: 100 }}>
                            {ads?.meta?.map((item, key) => (
                                <View key={key} style={{ flex: 1 }}>
                                    <Image source={{ uri: Api.SERVER_HOST + item.meta_value }}
                                        style={{ width: "100%", height: slider_height }}
                                        PlaceholderContent={<ActivityIndicator size={30} color={BaseColor.primaryColor}
                                            placeholderStyle={{ backgroundColor: "white" }} />}
                                    />
                                </View>
                            ))}
                        </Swiper>
                    </View>
                    <View style={{ position: "absolute", flexDirection: "row" }}>
                        <Header icon_left={"arrow-left"} icon_right={"share-alt"} color_icon_left={"white"} color_icon_right={"white"} callback_left={this.goBack} callback_right={this.shareAds} />
                    </View>
                    <View style={{ position: "absolute", top: (slider_height - 40), right: 10 }}>
                        <Text style={{ fontSize: 18, color: BaseColor.whiteColor, fontWeight: "bold" }}>$ {ads?.price}</Text>
                    </View>

                    <View style={{ flex: 1, padding: 20 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 20, color: BaseColor.primaryColor, fontWeight: "bold" }}>Detail</Text>
                            <TouchableOpacity onPress={() => this.favouriteAds()} style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-end" }}>
                                <Icon name={"heart"} size={20} color={BaseColor.primaryColor} solid={ads?.is_fav}></Icon>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Pet</Text>
                                <Text style={{ color: BaseColor.primaryColor, fontSize: 17, fontWeight: "bold" }}>{ads?.category?.name}</Text>
                                <Text style={{ color: BaseColor.greyColor, marginTop: 15, fontSize: 13 }}>Age</Text>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>{ads?.age} Years</Text>
                                <Text style={{ color: BaseColor.greyColor, marginTop: 15, fontSize: 13 }}>Gender</Text>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Male</Text>
                            </View>
                            <View style={{ flex: 0.7 }}>
                                <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Breed</Text>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>{ads?.breed?.name}</Text>
                                <Text style={{ color: BaseColor.greyColor, marginTop: 15, fontSize: 13 }}>Location</Text>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>{adsLocation}</Text>
                            </View>
                        </View>
                        <Text style={{ color: BaseColor.greyColor, marginTop: 15, fontSize: 13 }}>Description</Text>
                        <Text style={{ fontSize: 14 }}>{ads?.description}</Text>
                        <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => navigation.navigate("Profile", { user_id: ads.user.id })}>
                            <Avatar
                                size='medium'
                                rounded
                                source={{ uri: Api.SERVER_HOST + ads?.user?.avatar }}
                                activeOpacity={0.7}
                                placeholderStyle={{ backgroundColor: "transparent" }}
                                PlaceholderContent={<ActivityIndicator size={15} color-={BaseColor.primaryColor} />}
                                containerStyle={{ alignSelf: 'center', marginVertical: 20, marginHorizontal: 10 }}>
                            </Avatar>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: BaseColor.primaryColor }}>{ads?.user?.name}</Text>
                                <Text style={{ fontSize: 10 }}>Member since JUN 2018</Text>
                                <View style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                                    <Rating
                                        readonly={true}
                                        ratingCount={5}
                                        startingValue={5}
                                        imageSize={13}
                                    />
                                </View>
                            </View>
                            <Icon name={"angle-right"} color={BaseColor.primaryColor} size={25}></Icon>
                        </TouchableOpacity>
                        <Text style={{ color: BaseColor.primaryColor, marginTop: 15, fontSize: 20, fontWeight: "bold" }}>Location</Text>
                        <View style={{ width: "100%", height: 200, paddingTop: 10 }}>
                            <MapView
                                region={{
                                    latitude: ads?.lat,
                                    longitude: ads?.long,
                                    latitudeDelta: 0.0005,
                                    longitudeDelta: 0.0005,
                                }}
                                scrollEnabled={false}
                                style={{ flex: 1 }}
                            >
                                <Marker coordinate={{
                                    latitude: ads?.lat,
                                    longitude: ads?.long,
                                    latitudeDelta: 0.0001,
                                    longitudeDelta: 0.0001,
                                }} />
                            </MapView>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ padding: 10, flexDirection: "row", height: 60 }}>
                    <TouchableOpacity
                        onPress={this.onChat}
                        style={{ borderWidth: 1, borderColor: BaseColor.greyColor, marginRight: "10%", borderRadius: 5, height: 40, width: "45%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        <Icon name={"comment"} color={BaseColor.primaryColor} size={20}></Icon>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 18, marginLeft: 10 }}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.onCall}
                        style={{ backgroundColor: BaseColor.primaryColor, borderRadius: 5, height: 40, width: "45%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        <Icon name={"phone"} color={BaseColor.whiteColor} size={20}></Icon>
                        <Text style={{ color: BaseColor.whiteColor, fontSize: 18, marginLeft: 10 }}>Call</Text>
                    </TouchableOpacity>
                </View>
                {animType &&
                    <View style={{ position: "absolute", right: 0, bottom: Math.floor(Utils.SCREEN.HEIGHT / 2) }}>
                        <Animatable.View animation={animType} iterationCount={1} direction="normal">
                            <TouchableOpacity
                                onPress={this.showOrderDialog}
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: "row" }}>
                                <View style={{ paddingHorizontal: 15, paddingVertical: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 18 }}>Order</Text>
                                </View>
                                <View style={{ transform: [{ rotateZ: '45deg' }], width: 8, height: 8, backgroundColor: BaseColor.primaryColor, marginLeft: -4 }}></View>
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                }

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={visibleOrderDialog}>
                    <View style={Styles.modalContainer}>
                        <View style={Styles.modalContentContainer}>
                            <Text style={{ fontSize: 20, marginBottom: 20 }}>Make an Order</Text>
                            <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, padding: 10 }} onPress={() => this.setState({ visibleOrderDialog: false })}>
                                <Icon name={"times"} size={22} color={BaseColor.primaryColor}></Icon>
                            </TouchableOpacity>
                            <Text style={{ color: BaseColor.greyColor, marginBottom: 5 }}>Name</Text>
                            <TextInput
                                value={orderName}
                                onChangeText={(text) => this.setState({ orderName: text })}
                                placeholderTextColor={BaseColor.greyColor} style={{ borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor, fontSize: 15, height: 50, paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }}
                            />
                            <Text style={{ color: BaseColor.greyColor, marginBottom: 5, marginTop: 10 }}>Email</Text>
                            <TextInput
                                value={orderEmail}
                                onChangeText={(text) => this.setState({ orderEmail: text })}
                                placeholderTextColor={BaseColor.greyColor} style={{ borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor, fontSize: 15, height: 50, paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }}
                            />
                            <Text style={{ color: BaseColor.greyColor, marginBottom: 5, marginTop: 10 }}>Phone number</Text>
                            <TextInput
                                value={orderPhone}
                                onChangeText={(text) => this.setState({ orderPhone: text })}
                                placeholderTextColor={BaseColor.greyColor}
                                keyboardType="number-pad"
                                style={{ borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor, fontSize: 15, height: 50, paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }}
                            />
                            <Text style={{ color: BaseColor.greyColor, marginBottom: 5, marginTop: 10 }}>Description</Text>
                            <TextInput
                                value={orderDesc}
                                onChangeText={(text) => this.setState({ orderDesc: text })}
                                placeholderTextColor={BaseColor.greyColor} style={{ borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor, fontSize: 15, height: 100, paddingHorizontal: 10, justifyContent: "center", alignItems: "center", textAlign: "left" }}
                            />
                            <View style={{ paddingVertical: 10, flexDirection: "row" }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ visibleOrderDialog: false })}
                                    style={{ borderWidth: 1, borderColor: BaseColor.greyColor, flex: 1, borderRadius: 5, height: 40, marginRight: 10, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                    <Text style={{ color: BaseColor.primaryColor, fontSize: 18, marginLeft: 10 }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.orderAds}
                                    style={{ backgroundColor: BaseColor.primaryColor, borderRadius: 5, flex: 1, height: 40, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 18, marginLeft: 10 }}>Order</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(AdDetail);