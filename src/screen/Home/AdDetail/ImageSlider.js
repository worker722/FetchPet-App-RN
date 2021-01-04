import React, { Component } from "react";
import {
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { Image } from 'react-native-elements';
import Swiper from "react-native-swiper";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BaseColor } from "@config";
import * as Api from '@api';
import { BallIndicator } from 'react-native-indicators';

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
                style={{ backgroundColor: BaseColor.blackColor, flex: 1 }}
            >
                <View style={{ flex: 1, paddingTop: 70 }}>
                    <Swiper
                        ref={ref => {
                            this.swiperRef = ref;
                        }}
                        dotStyle={{ width: 8, height: 8, borderRadius: 100, backgroundColor: BaseColor.whiteColor }} dotColor={BaseColor.primaryColor} activeDotStyle={{ width: 11, height: 11, borderRadius: 100 }}
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
                                    style={{ width: "100%", height: "100%", borderRadius: 3 }}
                                    resizeMode={'contain'}
                                    source={{ uri: Api.SERVER_HOST + item }}
                                    placeholderStyle={{ backgroundColor: "transparent" }}
                                    PlaceholderContent={<BallIndicator color={BaseColor.whiteColor} size={35} />}
                                />
                            );
                        })}
                    </Swiper>
                </View>
                <View style={{ paddingBottom: 20, paddingTop: 10 }}>
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
                                        borderColor: index == selectedIndex ? BaseColor.whiteColor : BaseColor.greyColor,
                                        borderWidth: 2
                                    }}
                                    source={{ uri: Api.SERVER_HOST + item }}
                                    placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                                    PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} size={"small"} />}
                                />
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View style={{ width: "100%", flexDirection: "row", paddingLeft: 10, height: 70, position: "absolute", top: 0, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                        <Icon name={"arrow-left"} color={BaseColor.whiteColor} size={25}></Icon>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}></View>
                </View>
            </View>
        );
    }
}