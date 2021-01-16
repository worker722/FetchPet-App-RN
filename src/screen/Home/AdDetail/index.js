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
import { Loader } from '@components';
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
            activeSlideIndex: 0,
            showLoader: false,
            showRefresh: false,
            view: false,
            show_more_location: false
        }

        props.navigation.addListener("willFocus", (event) => {
            this.UNSAFE_componentWillMount();
        });

        this._carousel = null;
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ showLoader: true, view: this.props.route.params.view ? true : false });
        this.start();
    }

    componentDidMount = () => {
        this._carousel?.startAutoplay(true);
    }

    start = async () => {
        const param = { ad_id: this.props.route.params.ad_id, view: this.state.view };
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
        let { ads } = this.state;
        ads.is_fav = !ads.is_fav;
        this.setState({ ads });
        const param = { ad_id: ads.id, is_fav: ads.is_fav };
        await this.props.api.post('ads/ad_favourite', param);
    }

    goBack = () => {
        this.props.navigation.goBack();
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

        try {
            Linking.openURL(phoneNumber);
        } catch (error) {
        }
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
        const { ads, ad_images, showLoader, showRefresh, adsLocation, activeSlideIndex, show_more_location } = this.state;
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
                <View style={{ height: 50, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity style={{ padding: 10 }} onPress={this.goBack}>
                        <Icon name={"arrow-left"} size={25} color={BaseColor.primaryColor}></Icon>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                </View>
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
                            autoplayInterval={3000}
                            renderItem={this._renderItem}
                            sliderWidth={Utils.SCREEN.WIDTH}
                            itemWidth={Utils.SCREEN.WIDTH - 80}
                            onSnapToItem={(index) => this.setState({ activeSlideIndex: index })}
                        >
                        </Carousel>
                        <Pagination
                            dotsLength={ad_images.length}
                            activeDotIndex={activeSlideIndex}
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
                    <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 20, paddingTop: ad_images.length > 1 ? 0 : 20 }}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity style={{ position: "absolute", left: 0, width: 35, height: 35, borderRadius: 100, borderColor: BaseColor.primaryColor, borderWidth: 1, justifyContent: "center", alignItems: "center" }} onPress={this.showFullScreen}>
                                <Icon name="expand-arrows-alt" size={18} color={BaseColor.primaryColor}></Icon>
                            </TouchableOpacity>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 28, fontWeight: "bold" }}>$ {ads?.price}</Text>
                            </View>
                            <View style={{ position: "absolute", alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                                <View style={{ flex: 1 }} />
                                <TouchableOpacity onPress={this.favouriteAds} style={{ borderColor: BaseColor.primaryColor, borderWidth: 1, borderRadius: 100, width: 35, height: 35, justifyContent: "center", alignItems: "center" }}>
                                    <Icon name={"heart"} size={18} color={BaseColor.primaryColor} solid={ads?.is_fav}></Icon>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.shareAds} style={{ marginLeft: 20, backgroundColor: BaseColor.primaryColor, borderRadius: 100, width: 35, height: 35, justifyContent: "center", alignItems: "center" }}>
                                    <Icon name={"share-alt"} size={18} color={BaseColor.whiteColor}></Icon>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ paddingTop: 20 }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Category</Text>
                                <View style={{ flex: 1 }}></View>
                                <Text style={{ color: BaseColor.primaryColor }}>{ads?.category?.name}</Text>
                            </View>
                            <View style={{ marginVertical: 10, height: 1, width: "100%", backgroundColor: BaseColor.dddColor }}></View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Breed</Text>
                                <View style={{ flex: 1 }}></View>
                                <Text style={{ color: BaseColor.primaryColor }}>{ads?.breed?.name}</Text>
                            </View>
                            <View style={{ marginVertical: 10, height: 1, width: "100%", backgroundColor: BaseColor.dddColor }}></View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Age</Text>
                                <View style={{ flex: 1 }}></View>
                                <Text >{ads?.age} {ads?.unit}</Text>
                            </View>
                            <View style={{ marginVertical: 10, height: 1, width: "100%", backgroundColor: BaseColor.dddColor }}></View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Gender</Text>
                                <View style={{ flex: 1 }}></View>
                                <Text >{ads?.gender == 1 ? "Male" : "Female"}</Text>
                            </View>
                            <View style={{ marginVertical: 10, height: 1, width: "100%", backgroundColor: BaseColor.dddColor }}></View>
                            <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => this.setState({ show_more_location: !show_more_location })}>
                                <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Location</Text>
                                <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end" }}>
                                    {!show_more_location &&
                                        <Icon name={"map-marker-alt"} size={15} color={BaseColor.primaryColor}></Icon>
                                    }
                                </View>
                                <Text numberOfLines={show_more_location ? 10 : 1} style={{ textAlign: "right", marginLeft: 10, maxWidth: show_more_location ? "70%" : "50%" }}>{show_more_location ? adsLocation : adsLocation?.split(" ").reverse().join(" ")}</Text>
                                <Icon name={show_more_location ? "angle-down" : "angle-right"} size={15} color={BaseColor.primaryColor} style={{ marginLeft: 10 }}></Icon>
                            </TouchableOpacity>
                            <View style={{ marginVertical: 10, height: 1, width: "100%", backgroundColor: BaseColor.dddColor }}></View>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1 }}></View>
                                <Text>{Utils.relativeTime(ads?.updated_at)} posted</Text>
                            </View>
                            <View style={{ marginVertical: 10, height: 1, width: "100%", backgroundColor: BaseColor.dddColor }}></View>
                        </View>
                        <Text style={{ color: BaseColor.primaryColor, marginTop: 15, marginBottom: 5, fontSize: 13 }}>Description</Text>
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