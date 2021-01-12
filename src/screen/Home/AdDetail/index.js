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
    RefreshControl
} from 'react-native';
import { BaseColor } from '@config';
import { Header, Loader } from '@components';
import * as Utils from '@utils';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image } from 'react-native-elements';
import { Rating } from 'react-native-ratings';
import { BallIndicator } from 'react-native-indicators';

import MapView, { Marker } from 'react-native-maps';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store } from "@store";
import * as Api from '@api';
import * as global from "@api/global";

const slider_height = Math.floor(Utils.SCREEN.HEIGHT / 11 * 3);

class AdDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ads: {},
            ad_images: [],
            adsLocation: '',
            activeSlide: 0,
            showLoader: false,
            showRefresh: false,
            view: false
        }

        props.navigation.addListener("willFocus", (event) => {
            this.UNSAFE_componentWillMount();
        });

        this._carousel = null;
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ showLoader: true, view: this.props.navigation.state.params.view ? true : false });
        this.start();
    }

    start = async () => {
        const param = { ad_id: this.props.navigation.state.params.ad_id, view: this.state.view };
        const response = await this.props.api.post('ads', param);
        if (response?.success) {
            await Utils.getAddressByCoords(response.data.ads.lat, response.data.ads.long, false, (adsLocation) => {
                this.setState({ adsLocation });
            });
            const ad_images = [];
            response.data.ads.meta.forEach((item, key) => {
                if (item.meta_key == '_ad_image')
                    ad_images.push(item.meta_value);
            });
            this.setState({ ads: response.data.ads, ad_images });
        }
        this.setState({ showLoader: false, showRefresh: false, view: false });
    }

    favouriteAds = async () => {
        let item = this.state.ads;
        item.is_fav = !item.is_fav;
        this.setState({ ads: item });
        const param = { ad_id: item.id, is_fav: item.is_fav };
        await this.props.api.post('ads/ad_favourite', param);
    }

    goBack = () => {
        this.props.navigation.goBack(null);
    }

    shareAds = async () => {
        Share.share({
            message:
                "Fetch - Your Local Pet Marketplace App!" + "\n" + "Online Location Based Pet MarketPlace App." + "\n" + global.getAppShareLink()
        });
    }

    onChat = () => {
        const { navigation } = this.props;
        const { ads } = this.state;
        navigation.navigate("Chat", { ad_id: ads.id, room_id: -1 });
    }

    onCall = () => {
        const { ads } = this.state;
        let phoneNumber = '';
        if (Platform.OS === 'android')
            phoneNumber = `tel:${ads.user.phonenumber}`;
        else
            phoneNumber = `tel://${ads.user.phonenumber}`;

        Linking.openURL(phoneNumber);
    }

    onEdit = () => {
        this.props.navigation.navigate("SellEdit", { ad_id: this.state.ads.id });
    }

    _onRefresh = () => {
        this.setState({ showRefresh: true });
        this.start();
    }

    showFullScreen = () => {
        const { ad_images } = this.state;
        this.props.navigation.navigate("ImageSlider", { data: ad_images });
    }

    _renderItem = ({ item, index }) => {
        return (
            <View key={index} style={{ flex: 1 }}>
                <Image source={{ uri: Api.SERVER_HOST + item }}
                    style={{ width: "100%", height: slider_height, borderRadius: 10 }}
                    PlaceholderContent={<BallIndicator color={BaseColor.primaryColor} size={30} />}
                    placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                />
            </View>
        );
    }

    render = () => {
        const user_id = store.getState().auth.login?.user?.id;
        const is_social = store.getState().auth.login?.user?.is_social;
        const { ads, ad_images, showLoader, showRefresh, adsLocation, activeSlide } = this.state;
        const navigation = this.props.navigation;

        const user_meta = ads?.user?.meta;
        let is_showPhonenumber = false;
        user_meta?.forEach((item, key) => {
            if (item.meta_key == global._SHOW_PHONE_ON_ADS)
                is_showPhonenumber = item.meta_value == 1 ? true : false;
        });

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor, paddingBottom: Platform.OS == "android" ? 0 : 10, paddingTop: 10 }}>
                <ScrollView keyboardShouldPersistTaps='always' style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <View>
                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={ad_images}
                            autoplay={true}
                            autoplayDelay={1000}
                            autoplayInterval={3000}
                            renderItem={this._renderItem}
                            sliderWidth={Utils.SCREEN.WIDTH}
                            itemWidth={Utils.SCREEN.WIDTH - 80}
                            onSnapToItem={(index) => this.setState({ activeSlide: index })}
                        >
                        </Carousel>
                        <Pagination
                            dotsLength={ad_images.length}
                            activeDotIndex={activeSlide}
                            dotStyle={{
                                width: 10,
                                height: 10,
                                borderRadius: 100,
                                marginHorizontal: 8,
                                backgroundColor: BaseColor.primaryColor
                            }}
                            inactiveDotStyle={{
                                backgroundColor: BaseColor.greyColor
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />
                    </View>
                    <View style={{ position: "absolute", flexDirection: "row" }}>
                        <Header icon_left={"arrow-left"} icon_right={"share-alt"} color_icon_left={BaseColor.whiteColor} color_icon_right={BaseColor.whiteColor} callback_left={this.goBack} callback_right={this.shareAds} />
                    </View>
                    <TouchableOpacity style={{ position: "absolute", top: (slider_height - 40), left: 10 }} onPress={this.showFullScreen}>
                        <Icon name="expand-arrows-alt" size={25} color={BaseColor.whiteColor}></Icon>
                    </TouchableOpacity>
                    <View style={{ position: "absolute", top: (slider_height - 40), right: 10 }}>
                        <Text style={{ fontSize: 18, color: BaseColor.whiteColor, fontWeight: "bold" }}>$ {ads?.price}</Text>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 5 }}>
                        <View style={{ backgroundColor: BaseColor.primaryColor, height: 5, width: "30%", borderRadius: 100 }}></View>
                    </View>
                    <View style={{ flex: 1, padding: 20 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 20, color: BaseColor.primaryColor, fontWeight: "bold" }}>Detail</Text>
                            {user_id != ads?.user?.id && is_social != -1 &&
                                <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-end" }}>
                                    <TouchableOpacity onPress={() => this.favouriteAds()} >
                                        <Icon name={"heart"} size={20} color={BaseColor.primaryColor} solid={ads?.is_fav}></Icon>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Pet</Text>
                                <Text style={{ color: BaseColor.primaryColor, fontSize: 17, fontWeight: "bold" }}>{ads?.category?.name}</Text>
                                <Text style={{ color: BaseColor.greyColor, marginTop: 15, fontSize: 13 }}>Age</Text>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>{ads?.age} {ads?.unit}</Text>
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
                        {user_id != ads?.user?.id &&
                            <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => navigation.navigate("ShowProfile", { user_id: ads.user.id })}>
                                {ads?.user?.avatar ?
                                    <Image
                                        source={{ uri: Api.SERVER_HOST + ads?.user?.avatar }}
                                        activeOpacity={0.7}
                                        placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                                        PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                                        style={{ alignSelf: 'center', marginVertical: 20, marginHorizontal: 10, width: 60, height: 60, borderRadius: 100, borderWidth: 1, borderColor: BaseColor.dddColor }}>
                                    </Image>
                                    :
                                    <View style={{ width: 60, height: 60, marginVertical: 20, marginHorizontal: 10, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ color: BaseColor.whiteColor, fontSize: 25 }}>{ads?.user?.name?.charAt(0).toUpperCase()}</Text>
                                    </View>
                                }
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: BaseColor.primaryColor }}>{ads?.user?.name}</Text>
                                    <Text style={{ fontSize: 10 }}>Member since {Utils.DATE2STR(ads?.user?.created_at, 'MMM YYYY')}</Text>
                                    {/* <View style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                                        <Rating
                                            readonly={true}
                                            ratingCount={5}
                                            startingValue={5}
                                            imageSize={13}
                                        />
                                    </View> */}
                                </View>
                                <Icon name={"angle-right"} color={BaseColor.primaryColor} size={25}></Icon>
                            </TouchableOpacity>
                        }
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
                {is_social != -1 &&
                    <>
                        {user_id != ads?.user?.id ?
                            <View style={{ paddingVertical: 20, flexDirection: "row", height: 80, justifyContent: "center", alignItems: "center" }}>
                                {is_showPhonenumber && ads.user.phonenumber ?
                                    <>
                                        <TouchableOpacity
                                            onPress={this.onChat}
                                            style={{ borderWidth: 1, borderColor: BaseColor.greyColor, marginRight: "10%", borderRadius: 5, height: 45, width: "40%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                            <Icon name={"comment"} color={BaseColor.primaryColor} size={20}></Icon>
                                            <Text style={{ color: BaseColor.primaryColor, fontSize: 18, marginLeft: 10 }}>Chat</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={this.onCall}
                                            style={{ backgroundColor: BaseColor.primaryColor, borderRadius: 5, height: 45, width: "40%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                            <Icon name={"phone"} color={BaseColor.whiteColor} size={20}></Icon>
                                            <Text style={{ color: BaseColor.whiteColor, fontSize: 18, marginLeft: 10 }}>Call</Text>
                                        </TouchableOpacity>
                                    </>
                                    :
                                    <TouchableOpacity
                                        onPress={this.onChat}
                                        style={{ borderWidth: 1, marginHorizontal: 10, backgroundColor: BaseColor.primaryColor, borderColor: BaseColor.greyColor, borderRadius: 5, height: 45, flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                        <Icon name={"comment-dots"} color={BaseColor.whiteColor} size={20}></Icon>
                                        <Text style={{ color: BaseColor.whiteColor, fontSize: 18, marginLeft: 10 }}>Chat</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            :
                            <View style={{ padding: 20, flexDirection: "row", height: 80 }}>
                                <TouchableOpacity
                                    onPress={this.onEdit}
                                    style={{ borderWidth: 1, borderColor: BaseColor.greyColor, backgroundColor: BaseColor.primaryColor, borderRadius: 5, height: 45, width: "100%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                    <Icon name={"edit"} color={BaseColor.whiteColor} size={20}></Icon>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 18, marginLeft: 10 }}>Edit Ads</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </>
                }
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