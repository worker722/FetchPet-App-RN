import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Platform,
    Linking,
} from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BaseColor } from '@config';
import * as Api from '@api';
import { store } from '@store';
import * as Utils from '@utils';
import * as global from "@api/global";

export default class HomeAds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adsLocation: '',
            item: {},
            ad_images: {}
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
        this.setState({ ad_images, item });

        Utils.getAddressByCoords(item.lat, item.long, true, (adsLocation) => {
            this.setState({ adsLocation });
        });
    }

    onChat = () => {
        const { navigation } = this.props;
        const { item } = this.state;
        navigation.navigate("Chat", { ad_id: item.id });
    }

    onCall = () => {
        const { item } = this.state;
        let phoneNumber = '';
        if (Platform.OS === 'android')
            phoneNumber = `tel:${item.user.phonenumber}`;
        else
            phoneNumber = `tel://${item.user.phonenumber}`;

        Linking.openURL(phoneNumber);
    }

    onEdit = () => {
        this.props.navigation.navigate("SellEdit", { ad_id: this.state.item.id });
    }

    render = () => {
        const user_id = store.getState().auth.login.user.id;

        const { adsLocation, item, ad_images } = this.state;

        const { onItemClick, onFavourite, data } = this.props;

        const user_meta = item.user.meta;
        let is_showPhonenumber = false;
        user_meta?.forEach((item, key) => {
            if (item.meta_key == global._SHOW_PHONE_ON_ADS)
                is_showPhonenumber = item.meta_value == 1 ? true : false;
        });

        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: "row", marginBottom: 20 }} onPress={() => onItemClick(item.id)}>
                <View>
                    <Image
                        source={{ uri: Api.SERVER_HOST + ad_images[0] }}
                        style={{ width: 120, height: "100%", borderRadius: 5, borderWidth: 1, borderColor: BaseColor.dddColor }}
                        PlaceholderStyle={{ backgroundColor: "white" }}
                        PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}></Image>
                </View>
                <View style={{ flexDirection: "column", flex: 1, paddingLeft: 10, justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{ color: "grey", fontSize: 10 }}>Category</Text>
                    <Text style={{ color: BaseColor.primaryColor }}>{item.category.name}</Text>
                    <Text style={{ color: "grey", fontSize: 10 }}>Breed</Text>
                    <Text>{item.breed.name}</Text>
                    <Text style={{ color: "grey", fontSize: 10 }}>Age</Text>
                    <Text>{item.age} Years</Text>
                    <Text style={{ color: "grey", fontSize: 10 }}>Location</Text>
                    <Text numberOfLines={1}>{adsLocation}</Text>
                </View>
                <View style={{ flexDirection: "column", flex: 1, paddingLeft: 10, }}>
                    <Text style={{ color: "grey", fontSize: 12, textAlign: "right" }}>{Utils.relativeTime(item.updated_at)} posted</Text>
                    <Text style={{ fontSize: 20, textAlign: "right" }}>$ {item.price}</Text>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flexDirection: "row" }}>
                        {user_id != item.user.id ?
                            <>
                                <TouchableOpacity onPress={this.onChat} style={{ flex: 1 }}>
                                    <Icon name={"comment-dots"} size={20} color={BaseColor.primaryColor}></Icon>
                                </TouchableOpacity>
                                {is_showPhonenumber && item.user.phonenumber &&
                                    <TouchableOpacity onPress={this.onCall} style={{ flex: 1 }}>
                                        <Icon name={"phone"} size={20} color={BaseColor.primaryColor} ></Icon>
                                    </TouchableOpacity>
                                }
                                <View style={{ flex: 1 }} />
                                <TouchableOpacity onPress={() => onFavourite(data.index, item, !item.is_fav)} style={{ position: "absolute", bottom: 0, right: 0 }}>
                                    <Icon name={"heart"} size={20} color={BaseColor.primaryColor} solid={item.is_fav}></Icon>
                                </TouchableOpacity>
                            </>
                            :
                            <>
                                <View style={{ flex: 1 }}></View>
                                <TouchableOpacity onPress={this.onEdit} style={{ position: "absolute", bottom: 0, right: 0 }}>
                                    <Icon name={"edit"} size={20} color={BaseColor.primaryColor} solid></Icon>
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}