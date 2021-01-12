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
    FlatList
} from 'react-native';
import { BaseColor, Images } from '@config';
import { Header, Loader, CustomModalPicker } from '@components';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Image } from 'react-native-elements';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as global from '@api/global';

const default_icon = "/material/img/category-all.png";

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
                min: "",
                max: ""
            },
            age: 0,
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
            const { category, breed } = this.state;
            let { category_data, breed_data } = response.data;
            category_data.unshift(category);
            breed_data.unshift({ id: -1, name: "All" });

            category_data.forEach((item, index) => {
                if (item.id == -1) item.is_select = true;
                else item.is_select = false;
            })

            this.setState({ category_data, breed_data });
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

    renderFilterItem = ({ item, index }) => {
        const icon = item.icon ? item.icon : default_icon;

        return (
            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                <TouchableOpacity activeOpacity={1}
                    onPress={() => this.filterSelected(item.id)}
                    style={{ width: 55, height: 55, borderWidth: 5, justifyContent: "center", alignItems: "center", borderColor: item.is_select ? BaseColor.primaryColor : BaseColor.whiteColor, borderRadius: 100, marginBottom: 5 }}>
                    <Image source={{ uri: Api.SERVER_HOST + icon }} PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />} placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} resizeMode={"stretch"} style={{ width: 45, height: 45, borderRadius: 100 }}></Image>
                </TouchableOpacity>
                <Text style={{ color: item.is_select ? BaseColor.primaryColor : BaseColor.greyColor }} numberOfLines={1}>{item.name}</Text>
            </View>
        )
    }

    render = () => {
        const { showLoader, showRefresh, category_data, breed_data, gender_data, breed, age, gender } = this.state;

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
                        <View style={{ padding: 10 }}>
                            <Icon name={"search"} size={18} color={BaseColor.primaryColor}></Icon>
                        </View>
                    </View>
                </View>
                <ScrollView keyboardShouldPersistTaps='always' style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <View style={{ flex: 1, paddingVertical: 10, maxHeight: 260 }}>
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={category_data}
                            numColumns={4}
                            renderItem={this.renderFilterItem}
                        />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 10, paddingHorizontal: 10, borderWidth: 1, borderRadius: 100, height: 50, borderColor: BaseColor.primaryColor }}>
                        <CustomModalPicker title={"Select a Breed"} data={breed_data} selectedValue={breed.name} onValueChange={(breed, key) => this.setState({ breed })} />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 10, paddingHorizontal: 10, marginTop: 10, borderWidth: 1, borderRadius: 100, height: 50, marginLeft: 10, borderColor: BaseColor.primaryColor }}>
                        <CustomModalPicker title={"Select a Gender"} data={gender_data} selectedValue={gender.name} onValueChange={(gender, key) => this.setState({ gender })} />
                    </View>
                    <TextInput keyboardType={"number-pad"} value={age} onChangeText={(age) => this.setState({ age })} placeholder={"Age"} placeholderTextColor={BaseColor.greyColor} style={{ marginTop: 10, marginHorizontal: 10, fontSize: 15, textAlign: "center", color: BaseColor.blackColor, flex: 1, borderRadius: 100, borderColor: BaseColor.primaryColor, borderWidth: 1, justifyContent: "center", alignItems: "center" }}>
                    </TextInput>
                    <View style={{ paddingVertical: 20, paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }}>
                        <TouchableOpacity
                            onPress={this.filterPet}
                            style={{ backgroundColor: BaseColor.primaryColor, borderRadius: 5, width: "60%", height: 50, justifyContent: "center", alignItems: "center" }}>
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