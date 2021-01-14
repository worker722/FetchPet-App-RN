import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    Image as RNImage,
    ActivityIndicator,
    FlatList,
    Platform
} from 'react-native';
import { BaseColor, Images } from '@config';
import { Header, Loader, CustomModalPicker } from '@components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Image } from 'react-native-elements';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as Utils from '@utils';
import * as global from '@api/global';

class AdvancedFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            showRefresh: false,

            searchText: '',

            category_data: [],
            breed_data: [],
            gender_data: [
                {
                    id: 1,
                    name: "Male"
                },
                {
                    id: 0,
                    name: "Female"
                }
            ],

            category: { id: -1, name: "All" },
            breed: { id: -2, name: "Pet's Breed" },
            price: {
                min: 0,
                max: 1000
            },
            age: "",
            gender: { id: -1, name: "Gender" },
        }
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const response = await this.props.api.get("filter");
        if (response?.success) {
            const { category } = this.state;
            let { category_data, breed_data } = response.data;
            category_data.unshift(category);
            breed_data.unshift({ id: -1, name: "All" });

            category_data.forEach((item, index) => {
                if (item.id == -1) item.is_select = true;
                else item.is_select = false;
            })

            this.setState({ category_data, breed_data, price: { min: 0, max: response.data.max_price } });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    _onRefresh = () => {
        this.setState({ showRefresh: true });
        this.start();
    }

    filterSelected = (id) => {
        let { category_data } = this.state;
        category_data.forEach((item, key) => {
            if (item.id == id) {
                item.is_select = true;
                this.setState({ category: item });
            }
            else item.is_select = false;
        });
        this.setState({ category_data });
    }

    searchPet = () => {
        const { searchText } = this.state;
        if (searchText == '') {
            return;
        }
        this.filterPet();
    }

    filterPet = () => {
        const { breed } = this.state;
        if (breed.id == -2) {
            global.showToastMessage("Please select pet's breed.");
            return;
        }
        this.props.navigation.navigate("FilterResult", this.state);
    }

    goBack = () => {
        this.props.navigation.goBack(null);
    }

    priceRangeChanged = (values) => {
        this.setState({ price: { min: values[0], max: values[1] } });
    }

    renderFilterItem = ({ item, index }) => {
        return (
            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                <TouchableOpacity activeOpacity={1}
                    onPress={() => this.filterSelected(item.id)}
                    style={{ width: 54, height: 54, borderWidth: 5, justifyContent: "center", alignItems: "center", borderColor: item.is_select ? BaseColor.primaryColor : BaseColor.whiteColor, borderRadius: 100, marginBottom: 5 }}>
                    {item.icon ?
                        <Image source={{ uri: Api.SERVER_HOST + item.icon }} PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />} placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} resizeMode={"stretch"} style={{ width: 45, height: 45, borderRadius: 100 }}></Image>
                        :
                        <RNImage source={Images.ic_category_all} placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} resizeMode={"stretch"} style={{ width: 45, height: 45, borderRadius: 100 }}></RNImage>
                    }
                </TouchableOpacity>
                <Text style={{ color: item.is_select ? BaseColor.primaryColor : BaseColor.greyColor }} numberOfLines={1}>{item.name}</Text>
            </View>
        )
    }

    render = () => {
        const { showLoader, showRefresh, category_data, breed_data, gender_data, breed, age, gender, price } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <Header icon_left={"arrow-left"} title={"Filter Your Pets"} color_icon_right={BaseColor.primaryColor} callback_left={this.goBack} />
                <View style={{ borderRadius: 100, marginHorizontal: 10, height: 40, backgroundColor: BaseColor.placeholderColor }}>
                    <TextInput
                        onChangeText={(text) => this.setState({ searchText: text })}
                        returnKeyType="search"
                        style={{ flex: 1, paddingLeft: 100, paddingRight: 20, color: BaseColor.whiteColor }}
                        placeholder={"Search"} placeholderTextColor={BaseColor.greyColor}></TextInput>
                    <View style={{ position: "absolute", left: 15, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        <RNImage source={Images.logo} style={{ width: 50, height: 17 }} resizeMode={"stretch"}></RNImage>
                        <TouchableOpacity style={{ padding: 10 }} onPress={this.filterPet}>
                            <Icon name={"search"} size={18} color={BaseColor.primaryColor}></Icon>
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={category_data}
                    numColumns={4}
                    style={{ maxHeight: 260, marginTop: 10 }}
                    renderItem={this.renderFilterItem}
                />
                <ScrollView style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <View style={{ flex: 1, marginHorizontal: 10, paddingHorizontal: 10, borderWidth: 1, borderRadius: 100, height: 50, borderColor: BaseColor.primaryColor }}>
                        <CustomModalPicker title={"Select a Breed"} data={breed_data} selectedValue={breed.name} onValueChange={(breed, key) => this.setState({ breed })} />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 10, paddingHorizontal: 10, marginTop: 10, borderWidth: 1, borderRadius: 100, height: 50, marginLeft: 10, borderColor: BaseColor.primaryColor }}>
                        <CustomModalPicker title={"Select a Gender"} data={gender_data} selectedValue={gender.name} onValueChange={(gender, key) => this.setState({ gender })} />
                    </View>
                    <TextInput keyboardType={"number-pad"} value={age.toString()} onChangeText={(age) => this.setState({ age })} placeholder={"Age"} placeholderTextColor={BaseColor.greyColor} style={{ marginTop: 10, marginHorizontal: 10, fontSize: 15, textAlign: "center", color: BaseColor.blackColor, flex: 1, borderRadius: 100, borderColor: BaseColor.primaryColor, borderWidth: 1, justifyContent: "center", alignItems: "center" }}>
                    </TextInput>
                    <View style={{ flexDirection: "row", paddingHorizontal: 20, marginTop: 20 }}>
                        <Text style={{ flex: 1 }}>$ {price.min}</Text>
                        <Text style={{ flex: 1, textAlign: "right" }}>$ {price.max}</Text>
                    </View>
                    <View style={{ marginHorizontal: 20 }}>
                        <MultiSlider
                            markerStyle={{
                                ...Platform.select({
                                    ios: {
                                        height: 22,
                                        width: 22,
                                        shadowColor: '#000000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 3
                                        },
                                        shadowRadius: 1,
                                        shadowOpacity: 0.1,
                                        marginTop: 9,
                                        borderRadius: 100
                                    },
                                    android: {
                                        height: 22,
                                        width: 22,
                                        borderRadius: 100,
                                        marginTop: 9,
                                        borderWidth: 1,
                                        borderColor: BaseColor.whiteColor,
                                        backgroundColor: BaseColor.primaryColor
                                    }
                                })
                            }}
                            selectedStyle={{ backgroundColor: BaseColor.primaryColor, height: 10 }}
                            unselectedStyle={{ height: 10 }}
                            onValuesChange={this.priceRangeChanged}
                            values={[price.min, price.max]}
                            min={price.min}
                            max={price.max}
                            sliderLength={Utils.SCREEN.WIDTH - 40}
                            allowOverlap={false}
                        />
                    </View>
                    <View style={{ paddingVertical: 20, paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }}>
                        <TouchableOpacity
                            onPress={this.filterPet}
                            style={{ backgroundColor: BaseColor.primaryColor, borderRadius: 5, width: "100%", height: 50, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.whiteColor, fontSize: 18 }}>Filter</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(AdvancedFilter);