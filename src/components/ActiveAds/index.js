import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image } from 'react-native-elements';

import { BaseColor } from '@config';
import * as Api from '@api';
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
            <TouchableOpacity style={{ flex: 1, flexDirection: "row", marginBottom: 10, borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor, padding: 10 }}
                onPress={() => navigation.navigate("AdDetail", { ad_id: item.id })}>
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
                            <Text style={{ color: BaseColor.primaryColor }}>{item.category.name}</Text>
                            <Text style={{ color: BaseColor.greyColor, fontSize: 10 }}>Age</Text>
                            <Text>{item.age} {item.unit}</Text>
                            <Text style={{ color: BaseColor.greyColor, fontSize: 10 }}>Location</Text>
                            <Text numberOfLines={1}>{adsLocation}</Text>
                        </View>
                        <View style={{ flexDirection: "column", paddingLeft: 10, }}>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <View style={{ width: 10, height: 10, borderRadius: 100, backgroundColor: BaseColor.activeColor, marginRight: 5 }}></View>
                                <Text style={{ color: BaseColor.activeColor, fontSize: 13, textAlign: "right" }}>Active</Text>
                            </View>
                            <Text style={{ textAlign: "right", flex: 1, textAlignVertical: "center", fontWeight: "bold", position: "absolute", bottom: 0, right: 0 }}>$ {item.price}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 15 }}>
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