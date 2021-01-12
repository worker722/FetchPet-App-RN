import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image } from 'react-native-elements';

import { BaseColor } from '@config';
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
            <TouchableOpacity style={{ flex: 1, flexDirection: "row", marginBottom: 20 }} onPress={() => navigation.navigate("AdDetail", { ad_id: item.id })}>
                <View>
                    <Image
                        source={{ uri: Api.SERVER_HOST + ad_images[0] }}
                        style={{ width: 120, height: "100%", borderRadius: 5, borderWidth: 1, borderColor: BaseColor.dddColor }}
                        placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                        PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}></Image>
                </View>
                <View style={{ flexDirection: "column", flex: 1, paddingLeft: 10, justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{ color: "grey", fontSize: 10 }}>Category</Text>
                    <Text style={{ color: BaseColor.primaryColor }}>{item.category.name}</Text>
                    <Text style={{ color: "grey", fontSize: 10 }}>Breed</Text>
                    <Text>{item.breed.name}</Text>
                    <Text style={{ color: "grey", fontSize: 10 }}>Age</Text>
                    <Text>{item.age} {item.unit}</Text>
                    <Text style={{ color: "grey", fontSize: 10 }}>Location</Text>
                    <Text numberOfLines={1}>{adsLocation}</Text>
                </View>
                <View style={{ flexDirection: "column", flex: 1, paddingLeft: 10, }}>
                    <Text style={{ color: "grey", fontSize: 12, textAlign: "right" }}>{Utils.relativeTime(item.updated_at)} posted</Text>
                    <Text style={{ fontSize: 20, textAlign: "right" }}>$ {item.price}</Text>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity onPress={this.onChat} style={{ flex: 1 }}>
                            <Icon name={"comment-dots"} size={20} color={BaseColor.primaryColor}></Icon>
                        </TouchableOpacity>
                        {is_showPhonenumber && item.user.phonenumber &&
                            <TouchableOpacity onPress={this.onCall} style={{ flex: 1 }}>
                                <Icon name={"phone"} size={20} color={BaseColor.primaryColor} ></Icon>
                            </TouchableOpacity>
                        }
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={this.removeFavAds} style={{ position: "absolute", bottom: 0, right: 0 }}>
                            <Icon name={"heart"} size={20} color={BaseColor.primaryColor} solid></Icon>
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