import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { BaseColor } from '../../config';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Avatar } from 'react-native-elements';
import { Rating } from 'react-native-ratings';
import MapView from 'react-native-maps';

export default class AdDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAds: this.props.navigation.state.params.item
        }
    }

    setFav = () => {
        let item = this.state.currentAds;
        item.is_fav = !item.is_fav;
        this.setState({ currentAds: item });
    }

    render = () => {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={{ height: 250 }}>
                    <Swiper style={{ height: 250 }} autoplay={true} dotColor={"white"} paginationStyle={{ position: "absolute", bottom: 10 }} activeDotColor={BaseColor.primaryColor} dotStyle={{ width: 8, height: 8, borderRadius: 100 }} activeDotStyle={{ width: 11, height: 11, borderRadius: 100 }}>
                        <View style={{ flex: 1 }}>
                            <Image source={{ uri: this.state.currentAds.image }} style={{ width: "100%", height: 250 }}></Image>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Image source={{ uri: this.state.currentAds.image }} style={{ width: "100%", height: 250 }}></Image>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Image source={{ uri: this.state.currentAds.image }} style={{ width: "100%", height: 250 }}></Image>
                        </View>
                    </Swiper>
                </View>
                <View style={{ position: "absolute", padding: 10, flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                        <Icon name={"arrow-left"} size={25} color={"white"}></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end" }}>
                        <Icon name={"share-alt"} size={25} color={"white"}></Icon>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ position: "absolute", top: 210, right: 10 }}>
                    <Text style={{ fontSize: 18, color: "#fff", fontWeight: "bold" }}>$ {this.state.currentAds.price}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, padding: 20 }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 20, color: BaseColor.primaryColor, fontWeight: "bold" }}>Detail</Text>
                        <TouchableOpacity onPress={() => this.setFav()} style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-end" }}>
                            <Icon name={"heart"} size={20} color={BaseColor.primaryColor} solid={this.state.currentAds.is_fav}></Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: BaseColor.grayColor, fontSize: 13 }}>Pet</Text>
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 17, fontWeight: "bold" }}>{this.state.currentAds.category}</Text>
                            <Text style={{ color: BaseColor.grayColor, marginTop: 15, fontSize: 13 }}>Age</Text>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{this.state.currentAds.age} Years</Text>
                            <Text style={{ color: BaseColor.grayColor, marginTop: 15, fontSize: 13 }}>Gender</Text>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Male</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Text style={{ color: BaseColor.grayColor, fontSize: 13 }}>Breed</Text>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{this.state.currentAds.breed}</Text>
                            <Text style={{ color: BaseColor.grayColor, marginTop: 15, fontSize: 13 }}>Location</Text>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{this.state.currentAds.location}</Text>
                        </View>
                    </View>
                    <Text style={{ color: BaseColor.grayColor, marginTop: 15, fontSize: 13 }}>Description</Text>
                    <Text style={{ fontSize: 14 }}>Checkout this beautiful dog you ever see. I am from USA you can contact me through by my location or by call.</Text>
                    <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Avatar
                            size='medium'
                            rounded
                            source={{ uri: 'data:image/jpeg;base64,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' }}
                            activeOpacity={0.7}
                            placeholderStyle={{ backgroundColor: "transparent" }}
                            containerStyle={{ alignSelf: 'center', marginVertical: 20, marginHorizontal: 10 }}
                        ></Avatar>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: BaseColor.primaryColor }}>Ben K</Text>
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
                    <View style={{ width: "100%", height: 200, padding: 10 }}>
                        {/* <MapView
                            region={{
                                latitude: Number(100.3232, 10),
                                longitude: Number(-300.22, 10),
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            style={{ flex: 1 }}
                        >
                        </MapView> */}
                    </View>
                </View>
                <View style={{ position: "absolute", padding: 15, flexDirection: "row", height: 80, bottom: 0 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("ChatList")} style={{ borderWidth: 1, borderColor: BaseColor.grayColor, marginRight: "10%", borderRadius: 10, height: 50, width: "45%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        <Icon name={"comment"} color={BaseColor.primaryColor} size={20}></Icon>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 18, marginLeft: 10 }}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: BaseColor.primaryColor, borderRadius: 10, height: 50, width: "45%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        <Icon name={"phone"} color={"#fff"} size={20}></Icon>
                        <Text style={{ color: "#fff", fontSize: 18, marginLeft: 10 }}>Chat</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}