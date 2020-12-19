import React, { Component } from "react";
import { View, FlatList, TouchableOpacity, Image } from "react-native";
import Swiper from "react-native-swiper";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BaseColor } from "@config";
import * as Api from '@api';

export default class ImageSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: props.navigation.state.params.data,
            selectedIndex: 0
        };
        this.flatListRef = null;
        this.swiperRef = null;
    }

    onSelect(selectedIndex) {
        this.setState({ selectedIndex: selectedIndex }, () => {
            this.flatListRef.scrollToIndex({
                animated: true,
                index: selectedIndex
            });
        });
    }

    onTouchImage(touched) {
        if (touched == this.state.selectedIndex) return;
        this.swiperRef.scrollBy(touched - this.state.selectedIndex, false);
    }

    render() {
        const { images, selectedIndex } = this.state;

        return (
            <View
                style={{ backgroundColor: "#000", flex: 1 }}
            >
                <View style={{ flex: 1 }}>
                    <Swiper
                        ref={ref => {
                            this.swiperRef = ref;
                        }}
                        dotStyle={{
                            backgroundColor: BaseColor.dddColor
                        }}
                        paginationStyle={{ bottom: 0 }}
                        loop={false}
                        activeDotColor={BaseColor.primaryColor}
                        removeClippedSubviews={false}
                        onIndexChanged={index => this.onSelect(index)}
                    >
                        {images.map((item, key) => {
                            return (
                                <Image
                                    key={`${key}`}
                                    style={{ width: "100%", height: "100%", borderRadius: 20 }}
                                    resizeMode={'contain'}
                                    source={{ uri: Api.SERVER_HOST + item }}
                                />
                            );
                        })}
                    </Swiper>
                </View>
                <View style={{ width: "100%", flexDirection: "row", paddingLeft: 10, height: 70, position: "absolute", top: 0, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                        <Icon name={"arrow-left"} color={BaseColor.whiteColor} size={25}></Icon>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}></View>
                </View>
                <View style={{ paddingVertical: 10, height: 90 }}>
                    <FlatList
                        ref={ref => {
                            this.flatListRef = ref;
                        }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={images}
                        keyExtractor={(item, index) => `${index}`}
                        style={{ paddingRight: 15 }}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    this.onTouchImage(index);
                                }}
                                activeOpacity={0.8}
                                style={{ alignItems: "center", justifyContent: "center" }}
                            >
                                <Image
                                    style={{
                                        width: index == selectedIndex ? 70 : 60,
                                        height: index == selectedIndex ? 70 : 60,
                                        marginLeft: 15,
                                        borderRadius: 8,
                                        borderColor: BaseColor.greyColor,
                                        borderWidth: 1
                                    }}
                                    source={{ uri: Api.SERVER_HOST + item }}
                                />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        );
    }
}