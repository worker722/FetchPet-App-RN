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

export default class ClosedAds extends Component {
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
    }

    render = () => {
        const { item, ad_images } = this.state;
        const { navigation } = this.props;

        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: "row", marginBottom: 10, backgroundColor: BaseColor.greyColor, borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor, paddingLeft: 7 }}
                onPress={() => navigation.navigate("AdDetail", { ad_id: item.id })}>
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", backgroundColor: BaseColor.whiteColor, paddingRight: 10 }}>
                    <Image
                        source={{ uri: Api.SERVER_HOST + ad_images[0] }}
                        activeOpacity={0.7}
                        PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                        placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                        style={{ alignSelf: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.dddColor, width: 65, height: 65, borderRadius: 100 }}>
                    </Image>
                    <Text style={{ color: BaseColor.primaryColor, textAlign: "center", marginLeft: 5, fontWeight: "bold" }}>{item.category.name}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor, padding: 10 }}>
                    <View>
                        <View style={{ paddingLeft: 10 }}>
                            <Text style={{ textAlign: "right", flex: 1, textAlignVertical: "center", fontWeight: "bold" }}>$ {item.price}</Text>
                            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                                <View style={{ width: 10, height: 10, borderRadius: 100, backgroundColor: BaseColor.greyColor, marginRight: 5 }}></View>
                                <Text style={{ color: BaseColor.greyColor, fontSize: 12, textAlign: "right" }}>Status: Closed</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 15 }}>
                            <View style={{ flex: 1 }}>
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
                </View>
            </TouchableOpacity>
        )
    }
}