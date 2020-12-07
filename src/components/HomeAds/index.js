import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Platform,
    Linking
} from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BaseColor } from '@config';
import * as Api from '@api';
import { store } from '@store';
import * as Utils from '@utils';

export default class HomeAds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLocation: '',
            item: {},
        }
    }

    componentWillMount = () => {
        const { data } = this.props;
        const item = data.item;
        this.setState({ item });
        Utils.getAddressByCoords(item.lat, item.long, true, (userLocation) => {
            this.setState({ userLocation });
        });
    }

    onChat = () => {

    }

    onCall = () => {
        const { item } = this.state;
        let phoneNumber = 'telprompt:' + item.phonenumber;
        if (Platform.OS === 'android') {
            phoneNumber = 'tel:' + item.phonenumber;
        }

        Linking.openURL(phoneNumber);
    }

    render = () => {
        const user_id = store.getState().auth.login.user.id;

        const { userLocation, item } = this.state;

        const { onItemClick, onFavourite } = this.props;

        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: "row", marginBottom: 20 }} onPress={() => onItemClick(item.id)}>
                <View>
                    <Image
                        source={{ uri: Api.SERVER_HOST + item.meta[0].meta_value }}
                        style={{ width: 120, height: "100%", borderRadius: 5 }}
                        placeholderStyle={{ backgroundColor: "transparent" }}
                        PlaceholderContent={<ActivityIndicator size={20} color={BaseColor.primaryColor}></ActivityIndicator>}></Image>
                </View>
                <View style={{ flexDirection: "column", flex: 1, paddingLeft: 10, justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{ color: "grey", fontSize: 10 }}>Category</Text>
                    <Text style={{ color: BaseColor.primaryColor }}>{item.category.name}</Text>
                    <Text style={{ color: "grey", fontSize: 10 }}>Breed</Text>
                    <Text>{item.breed.name}</Text>
                    <Text style={{ color: "grey", fontSize: 10 }}>Age</Text>
                    <Text>{item.age} Years</Text>
                    <Text style={{ color: "grey", fontSize: 10 }}>Location</Text>
                    <Text numberOfLines={1}>{userLocation}</Text>
                </View>
                <View style={{ flexDirection: "column", paddingLeft: 10, }}>
                    <Text style={{ color: "grey", fontSize: 10 }}>10 requestes, 16 hours ago</Text>
                    <Text style={{ fontSize: 20, textAlign: "right" }}>$ {item.price}</Text>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity onPress={this.onChat} style={{ flex: 1 }}>
                            <Icon name={"comment"} size={20} color={BaseColor.primaryColor} solid></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onCall} style={{ flex: 1 }}>
                            <Icon name={"phone"} size={20} color={BaseColor.primaryColor} ></Icon>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}></View>
                        {item.is_fav ?
                            <TouchableOpacity onPress={() => onFavourite(index, item, false)} style={{ position: "absolute", bottom: 0, right: 0 }}>
                                <Icon name={"heart"} size={20} color={BaseColor.primaryColor} solid></Icon>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => onFavourite(index, item, true)} style={{ position: "absolute", bottom: 0, right: 0 }}>
                                <Icon name={"heart"} size={20} color={BaseColor.primaryColor} ></Icon>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}