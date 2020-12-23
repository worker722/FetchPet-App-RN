import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image } from 'react-native-elements';

import { BaseColor } from '@config';
import * as Utils from '@utils';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';

class FavouriteAds extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ads: null,
            ad_images: [],
            is_removed: true
        }
    }

    UNSAFE_componentWillMount = () => {
        const { data } = this.props;
        const ads = data.item;
        const ad_images = [];
        ads.meta.forEach((item, key) => {
            if (item.meta_key == '_ad_image')
                ad_images.push(item.meta_value);
        });
        this.setState({ ads, ad_images });
        Utils.getAddressByCoords(ads.lat, ads.long, true, (adsLocation) => {
            this.setState({ adsLocation });
        });
    }

    removeFavAds = async () => {
        Alert.alert(
            'Remove Favourite Pet',
            'Are you sure you want to remove this pet on your favourites?',
            [
                {
                    text: 'OK',
                    onPress: async () => {
                        this.setState({ is_removed: false });
                        const { ads } = this.state;
                        const param = { ad_id: ads.id, is_fav: false };
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
        const { adsLocation, ads, ad_images, is_removed } = this.state;
        const { navigation } = this.props;

        if (!is_removed)
            return null;

        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: "row", marginBottom: 10, borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor, padding: 10 }}
                onPress={() => navigation.navigate("AdDetail", { ad_id: ads.id })}>
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <Image
                        source={{ uri: Api.SERVER_HOST + ad_images[0] }}
                        activeOpacity={0.7}
                        placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                        PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                        style={{ alignSelf: 'center', marginRight: 10, borderWidth: 1, borderColor: BaseColor.dddColor, width: 100, height: 100, borderRadius: 100 }}>
                    </Image>
                    <View style={{ width: 1, height: 100, backgroundColor: BaseColor.dddColor }}></View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flexDirection: "column", flex: 1, paddingLeft: 10, justifyContent: "center", alignItems: "flex-start" }}>
                            <Text style={{ color: BaseColor.greyColor, fontSize: 10 }}>Category</Text>
                            <Text style={{ color: BaseColor.primaryColor }}>{ads.category.name}</Text>
                            <Text style={{ color: BaseColor.greyColor, fontSize: 10 }}>Age</Text>
                            <Text>{ads.age} {ads.unit}</Text>
                            <Text style={{ color: BaseColor.greyColor, fontSize: 10 }}>Location</Text>
                            <Text numberOfLines={1}>{adsLocation}</Text>
                        </View>
                        <View style={{ paddingLeft: 10 }}>
                            <Text style={{ textAlign: "right", flex: 1, textAlignVertical: "top", fontWeight: "bold" }}>$ {ads.price}</Text>
                            <TouchableOpacity onPress={this.removeFavAds} style={{ position: "absolute", right: 0, bottom: 0 }}>
                                <Icon name={"heart"} size={20} color={BaseColor.primaryColor} solid></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 15 }}>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <Text style={{ fontSize: 10, color: BaseColor.greyColor }} numberOfLines={1}>{Utils.relativeTime(ads.updated_at)} posted</Text>
                        </View>
                        <View style={{ paddingLeft: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Icon name={"eye"} size={13} color={BaseColor.greyColor}></Icon>
                            <Text style={{ fontSize: 10, color: BaseColor.greyColor, marginLeft: 5 }}>View : {ads.views}</Text>
                        </View>
                        <View style={{ paddingLeft: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Icon name={"heart"} size={13} color={BaseColor.greyColor}></Icon>
                            <Text style={{ fontSize: 10, color: BaseColor.greyColor, marginLeft: 5 }}>Like : {ads.likes}</Text>
                        </View>
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