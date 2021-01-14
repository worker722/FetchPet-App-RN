import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Linking,
    Image as RNImage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image } from 'react-native-elements';

import { BaseColor, Images } from '@config';
import * as Utils from '@utils';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as global from "@api/global";

class FavouriteAds extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: null,
            ad_images: [],
            is_removed: false
        }
    }

    UNSAFE_componentWillMount = () => {
        const { data } = this.props;
        const item = data.item;
        const ad_images = [];
        item.meta.forEach((item, key) => {
            if (item.meta_key == '_ad_image')
                ad_images.push(item.meta_value);
        });
        this.setState({ item, ad_images });
        Utils.getAddressByCoords(item.lat, item.long, true, (adsLocation) => {
            this.setState({ adsLocation });
        });
    }

    onChat = () => {
        const { navigation } = this.props;
        const { item } = this.state;
        navigation.navigate("Chat", { ad_id: item.id, room_id: -1 });
    }

    onCall = () => {
        const { item } = this.state;
        let phoneNumber = '';
        if (Platform.OS === 'android')
            phoneNumber = `tel:${item.user.phonenumber}`;
        else
            phoneNumber = `tel://${item.user.phonenumber}`;

        try {
            Linking.openURL(phoneNumber);
        } catch (error) {
        }
    }

    removeFavAds = async () => {
        Alert.alert(
            'Remove Favourite Pet',
            'Are you sure you want to remove this pet on your favourites?',
            [
                {
                    text: 'Remove',
                    onPress: async () => {
                        this.setState({ is_removed: true });
                        const { item } = this.state;
                        const param = { ad_id: item.id, is_fav: false };
                        await this.props.api.post('ads/ad_favourite', param);
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
            ],
            { cancelable: false }
        );
    }

    render = () => {
        const { adsLocation, item, ad_images, is_removed } = this.state;

        if (is_removed)
            return null;

        const { navigation } = this.props;
        const user_meta = item.user.meta;
        let is_showPhonenumber = false;
        user_meta?.forEach((item, key) => {
            if (item.meta_key == global._SHOW_PHONE_ON_ADS)
                is_showPhonenumber = item.meta_value == 1 ? true : false;
        });

        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: "row", marginBottom: 5, borderRadius: 10, backgroundColor: BaseColor.placeholderColor, paddingVertical: 8, paddingHorizontal: 10 }} onPress={() => navigation.navigate("AdDetail", { ad_id: item.id, view: true })}>
                <View>
                    <Image
                        source={{ uri: Api.SERVER_HOST + ad_images[0] }}
                        style={{ width: 80, height: 80, borderRadius: 100, borderWidth: 1, borderColor: BaseColor.dddColor }}
                        placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                        PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}></Image>
                    {item.is_boost &&
                        <View style={{ position: "absolute", top: 0, right: 0, width: 28, height: 28, backgroundColor: BaseColor.boostColor, borderRadius: 100, borderWidth: 1, borderColor: BaseColor.whiteColor, justifyContent: "center", alignItems: "center" }}>
                            <RNImage source={Images.ic_boost} style={{ width: 18, height: 18 }}></RNImage>
                        </View>
                    }
                </View>
                <View style={{ width: 1, marginLeft: 10, height: "90%", backgroundColor: BaseColor.dddColor }}></View>
                <View style={{ flexDirection: "column", flex: 1, paddingLeft: 10, justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{ color: BaseColor.primaryColor }}>{item.category.name}</Text>
                    <Text style={{ marginVertical: 5 }}>{item.breed.name}</Text>
                    <Text numberOfLines={1}>{adsLocation}</Text>
                </View>
                <View style={{ flexDirection: "column", flex: 1, paddingLeft: 10, }}>
                    <Text style={{ color: "grey", fontSize: 12, textAlign: "right" }}>{Utils.relativeTime(item.updated_at)} posted</Text>
                    <Text style={{ fontSize: 20, textAlign: "right" }}>$ {item.price}</Text>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flexDirection: "row", width: 120 }}>
                        <TouchableOpacity onPress={this.onChat} style={{ width: 30, height: 30, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                            <Icon name={"comment"} size={15} color={BaseColor.whiteColor}></Icon>
                        </TouchableOpacity>
                        {is_showPhonenumber && item.user.phonenumber &&
                            <TouchableOpacity onPress={this.onCall} style={{ width: 30, height: 30, marginLeft: 15, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                <Icon name={"phone"} size={15} color={BaseColor.whiteColor} ></Icon>
                            </TouchableOpacity>
                        }
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={() => onFavourite(data.index, item, !item.is_fav)} style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, borderRadius: 100, borderWidth: 1, borderColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                            <Icon name={"heart"} size={15} color={BaseColor.primaryColor} solid={item.is_fav}></Icon>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(FavouriteAds);