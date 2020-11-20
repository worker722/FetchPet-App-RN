import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { BaseColor } from '@config';
import { Header, Loader } from '@components';
import * as Utils from '@utils';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Avatar, Image } from 'react-native-elements';
import { Rating } from 'react-native-ratings';
import MapView from 'react-native-maps';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';

const slider_height = Math.floor(Utils.screen.height / 11 * 3);
class AdDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ads: null,

            showLoader: false,
        }
    }

    componentWillMount = async () => {
        this.setState({ showLoader: true });
        console.log(this.props.navigation.state.params.ad_id);
        const param = { ad_id: this.props.navigation.state.params.ad_id };
        const response = await this.props.api.post('ads/ad_detail', param);
        this.setState({ showLoader: false, ads: response.data.ads });
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

    shareAds = () => {

    }

    render = () => {
        const { ads, showLoader } = this.state;
        const navigation = this.props.navigation;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ height: slider_height }}>
                        <Swiper style={{ height: slider_height }} autoplay={true} dotColor={"white"} paginationStyle={{ position: "absolute", bottom: 10 }} activeDotColor={BaseColor.primaryColor} dotStyle={{ width: 8, height: 8, borderRadius: 100 }} activeDotStyle={{ width: 11, height: 11, borderRadius: 100 }}>
                            {ads.meta.map((item, key) => (
                                <View style={{ flex: 1 }}>
                                    <Image source={{ uri: Api.SERVER_HOST + item.meta_value }}
                                        style={{ width: "100%", height: slider_height }}
                                        PlaceholderContent={<ActivityIndicator size={30} color={BaseColor.price}
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
                        <Text style={{ fontSize: 18, color: "#fff", fontWeight: "bold" }}>$ {ads.price}</Text>
                    </View>

                    <View style={{ flex: 1, padding: 20 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 20, color: BaseColor.primaryColor, fontWeight: "bold" }}>Detail</Text>
                            <TouchableOpacity onPress={() => this.favouriteAds()} style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-end" }}>
                                <Icon name={"heart"} size={20} color={BaseColor.primaryColor} solid={ads.is_fav}></Icon>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Pet</Text>
                                <Text style={{ color: BaseColor.primaryColor, fontSize: 17, fontWeight: "bold" }}>{ads.category.name}</Text>
                                <Text style={{ color: BaseColor.greyColor, marginTop: 15, fontSize: 13 }}>Age</Text>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>{ads.age} Years</Text>
                                <Text style={{ color: BaseColor.greyColor, marginTop: 15, fontSize: 13 }}>Gender</Text>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Male</Text>
                            </View>
                            <View style={{ flex: 0.7 }}>
                                <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Breed</Text>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>{ads.breed.name}</Text>
                                <Text style={{ color: BaseColor.greyColor, marginTop: 15, fontSize: 13 }}>Location</Text>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>{ads.location}</Text>
                            </View>
                        </View>
                        <Text style={{ color: BaseColor.greyColor, marginTop: 15, fontSize: 13 }}>Description</Text>
                        <Text style={{ fontSize: 14 }}>{ads.description}</Text>
                        <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => navigation.navigate("Profile")}>
                            <Avatar
                                size='medium'
                                rounded
                                source={{ uri: ads.user.avatar }}
                                activeOpacity={0.7}
                                placeholderStyle={{ backgroundColor: "transparent" }}
                                PlaceholderContent={<ActivityIndicator size={15} color-={BaseColor.primaryColor} />}
                                containerStyle={{ alignSelf: 'center', marginVertical: 20, marginHorizontal: 10 }}
                            ></Avatar>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: BaseColor.primaryColor }}>{ads.user.name}</Text>
                                <Text style={{ fontSize: 10 }}>Member since JUN 2018</Text>
                                <Text style={{ color: BaseColor.primaryColor, fontSize: 10 }}>SEE PROFILE</Text>
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
                                    latitude: ads.lat,
                                    longitude: ads.long,
                                    // latitudeDelta: 0.0922,
                                    // longitudeDelta: 0.0421,
                                }}
                                style={{ flex: 1 }}
                            >
                            </MapView>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ padding: 10, flexDirection: "row", height: 65 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Inbox")} style={{ borderWidth: 1, borderColor: BaseColor.greyColor, marginRight: "10%", borderRadius: 10, height: 45, width: "45%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        <Icon name={"comment"} color={BaseColor.primaryColor} size={20}></Icon>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 18, marginLeft: 10 }}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: BaseColor.primaryColor, borderRadius: 10, height: 45, width: "45%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        <Icon name={"phone"} color={"#fff"} size={20}></Icon>
                        <Text style={{ color: "#fff", fontSize: 18, marginLeft: 10 }}>Chat</Text>
                    </TouchableOpacity>
                </View>
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