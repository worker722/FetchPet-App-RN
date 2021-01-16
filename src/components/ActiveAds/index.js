import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Image as RNImage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image } from 'react-native-elements';

import { BaseColor, Images } from '@config';
import * as Api from '@api';
import * as global from '@api/global';
import * as Utils from '@utils';

export default class ActiveAds extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: null,
            ad_images: [],
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

    render = () => {
        const { adsLocation, item, ad_images } = this.state;
        const { navigation } = this.props;

        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: "row", marginBottom: 10, borderRadius: 10, backgroundColor: BaseColor.placeholderColor, padding: 10 }}
                onPress={() => navigation.navigate("AdDetail", { ad_id: item.id })}>
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <Image
                        source={{ uri: Api.SERVER_HOST + ad_images[0] }}
                        activeOpacity={0.7}
                        placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                        PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                        style={{ alignSelf: 'center', marginRight: 10, borderWidth: 1, borderColor: BaseColor.dddColor, width: 80, height: 80, borderRadius: 100 }}>
                    </Image>
                    <View style={{ width: 1, height: 80, backgroundColor: BaseColor.dddColor }}></View>
                    {item.is_boost &&
                        <View style={{ position: "absolute", top: 0, right: 8, width: 28, height: 28, backgroundColor: BaseColor.boostColor, borderRadius: 100, borderWidth: 1, borderColor: BaseColor.whiteColor, justifyContent: "center", alignItems: "center" }}>
                            <RNImage source={Images.ic_boost} style={{ width: 18, height: 18 }}></RNImage>
                        </View>
                    }
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flexDirection: "column", flex: 1, paddingLeft: 10, justifyContent: "center", alignItems: "flex-start" }}>
                            <Text style={{ color: BaseColor.primaryColor, fontWeight: "bold", fontSize: 17 }}>{item?.category?.name}</Text>
                            <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>{item?.breed?.name}</Text>
                            <Text numberOfLines={1} style={{ fontWeight: "bold", fontSize: 13 }}>{adsLocation}</Text>
                        </View>
                        <View style={{ paddingLeft: 10 }}>
                            <Text style={{ textAlign: "right", textAlignVertical: "center", fontWeight: "bold", fontSize: 18 }}>$ {item.price}</Text>
                            {!item.is_boost &&
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("Package", { checkout_type: global._CHECKOUT_BOOST_ADS, ad_id: item.id })}
                                    style={{ flexDirection: "row", backgroundColor: BaseColor.boostColor, marginTop: 5, borderRadius: 5, padding: 8, justifyContent: "center", alignItems: "center" }}>
                                    <RNImage source={Images.ic_boost} style={{ width: 15, height: 15 }}></RNImage>
                                    <Text style={{ color: BaseColor.whiteColor, fontStyle: "italic", fontSize: 12, marginLeft: 5 }}>Boost Now</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <Text style={{ fontSize: 10, color: BaseColor.greyColor }} numberOfLines={1}>{Utils.relativeTime(item.updated_at)} posted</Text>
                        </View>
                        <View style={{ paddingLeft: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Icon name={"eye"} size={13} color={BaseColor.greyColor}></Icon>
                            <Text style={{ fontSize: 10, color: BaseColor.greyColor, marginLeft: 5 }}>View : {item.views}</Text>
                        </View>
                        <View style={{ paddingLeft: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Icon name={"heart"} size={13} color={BaseColor.greyColor}></Icon>
                            <Text style={{ fontSize: 10, color: BaseColor.greyColor, marginLeft: 5 }}>Like : {item.likes}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}