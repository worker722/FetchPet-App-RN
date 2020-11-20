import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RBSheet from "react-native-raw-bottom-sheet";
import RangeSlider from 'rn-range-slider';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';

import { Loader, Header } from '@components';

import { BaseColor } from '@config';
import * as Utils from '@utils';

const filterItem_width = (Utils.screen.width - 20) / 4;

const FILTER_TYPE = {
    TOP_CATEGORY: 0,
    CATEGORY: 1,
    BREED: 2,
    GENDER: 3
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {

            pets: [],
            topCategory: [],

            filterCategory: [],
            filterBreed: [],
            filterGender: [
                {
                    id: 1,
                    type: FILTER_TYPE.GENDER,
                    name: 'Male',
                    is_selected: true
                },
                {
                    id: 2,
                    type: FILTER_TYPE.GENDER,
                    name: 'Female',
                    is_selected: false
                }
            ],
            filterPrice: {
                min: 0,
                max: 10000,
            },
            searchText: '',

            showLoader: false,
            showContentLoader: false
        }
    }

    componentWillMount = async () => {
        await this.start();
    }

    start = async () => {
        this.setState({ showLoader: true })
        const response = await this.props.api.get('home');
        this.setState({ showLoader: false });

        if (response.success) {

            let ads = response.data.ads;
            // let filterCategory = response.data.category;
            let topCategory = response.data.category;
            let filterBreed = response.data.breed;

            topCategory.filter((item, index) => {
                item.type = FILTER_TYPE.TOP_CATEGORY;
                item.is_selected = false;
            });
            topCategory.unshift({ id: -1, name: "All", is_selected: true, type: FILTER_TYPE.TOP_CATEGORY });

            // filterCategory.filter((item, index) => {
            //     if (index == 0) item.is_selected = true;
            //     else item.is_selected = false;
            // });

            filterBreed.filter((item, index) => {
                if (index == 0) item.is_selected = true;
                else item.is_selected = false;
            })

            this.setState({
                pets: ads,
                topCategory: topCategory,
                // filterCategory: filterCategory,
                filterBreed: filterBreed
            })
        }
    }

    filterSelected = async (type, id) => {
        if (type == FILTER_TYPE.TOP_CATEGORY) {
            this.setState({ showContentLoader: true });
            let topCategory = this.state.topCategory;
            topCategory.forEach((item, key) => {
                if (item.id == id) item.is_selected = true;
                else item.is_selected = false;
            });
            this.setState({ topCategory: topCategory });
            const param = { id_category: id };
            const response = await this.props.api.post('home/filter_category', param);
            this.setState({ showContentLoader: false });

            if (response.success) {
                this.setState({ pets: response.data.ads });
            }
        }
        else if (type == FILTER_TYPE.CATEGORY) {
            let filterCategory = this.state.filterCategory;
            filterCategory.forEach((item, key) => {
                if (item.id == id) item.is_selected = true;
                else item.is_selected = false;
            });
            this.setState({ filterCategory: filterCategory });
        }
        else if (type == FILTER_TYPE.BREED) {
            let filterBreed = this.state.filterBreed;
            filterBreed.forEach((item, key) => {
                if (item.id == id) item.is_selected = true;
                else item.is_selected = false;
            });
            this.setState({ filterBreed: filterBreed });
        }
        else if (type == FILTER_TYPE.GENDER) {
            let filterGender = this.state.filterGender;
            filterGender.forEach((item, key) => {
                if (item.id == id) item.is_selected = true;
                else item.is_selected = false;
            });
            this.setState({ filterGender: filterGender });
        }
    }

    filterPet = () => {
        const { filterCategory, filterBreed, filterGender, filterPrice } = this.state;
        let categoryItem = filterCategory.filter((item, index) => {
            return item.is_selected;
        });
    }

    favouriteAds = async (index, item, value) => {
        let pets = this.state.pets;
        pets[index].is_fav = value;
        this.setState({ pets: pets });
        const param = { ad_id: item.id, is_fav: value };
        const response = await this.props.api.post('ads/ad_favourite', param);
    }

    renderFilterItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.filterSelected(item.type, item.id)} style={{ width: filterItem_width, justifyContent: "center", alignItems: "center", backgroundColor: item.is_selected ? BaseColor.primaryColor : "white", height: 40, borderRadius: 5 }}>
                <Text style={{ color: !item.is_selected ? BaseColor.primaryColor : "white" }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    searchAds = async () => {
        const { searchText } = this.state;
        if (searchText == '')
            return;

        this.setState({ showContentLoader: true });
        const param = { searchText: searchText };
        const response = await this.props.api.post('home/search', param);
        this.setState({ showContentLoader: false });
        console.log(response);
        if (response.success) {
            this.setState({ pets: response.data.ads });
        }
    }

    goAdsDetail = (id) => {
        this.props.navigation.navigate("AdDetail", { ad_id: id });
    }

    renderPetItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: "row", marginBottom: 20 }} onPress={() => this.goAdsDetail(item.id)}>
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
                    <Text>{item.location}</Text>
                </View>
                <View style={{ flexDirection: "column", paddingLeft: 10, }}>
                    <Text style={{ color: "grey", fontSize: 10 }}>10 requestes, 16 hours ago</Text>
                    <Text style={{ fontSize: 20, textAlign: "right" }}>$ {item.price}</Text>
                    {item.is_fav ?
                        <TouchableOpacity onPress={() => this.favouriteAds(index, item, false)} style={{ position: "absolute", bottom: 0, right: 0 }}>
                            <Icon name={"heart"} size={20} color={BaseColor.primaryColor} solid></Icon>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => this.favouriteAds(index, item, true)} style={{ position: "absolute", bottom: 0, right: 0 }}>
                            <Icon name={"heart"} size={20} color={BaseColor.primaryColor} ></Icon>
                        </TouchableOpacity>
                    }
                </View>
            </TouchableOpacity>
        )
    }

    render = () => {

        const { pets, showLoader, showContentLoader, topCategory, filterCategory, filterBreed, filterGender } = this.state;

        if (showLoader)
            return (<Loader />);

        ///range slider
        const renderThumb = () => {
            return (<View style={{ width: 15, height: 15, backgroundColor: BaseColor.primaryColor, borderRadius: 100 }}></View>)
        }
        const renderRail = () => {
            return (<View style={{ height: 8, flex: 1, backgroundColor: "#9b9b9b", borderRadius: 100 }}></View>)
        }
        const renderRailSelected = () => {
            return (<View style={{ height: 8, backgroundColor: BaseColor.primaryColor }}></View>)
        }
        const renderLabel = () => {
            return (<View></View>)
        }
        const renderNotch = () => {
            return (<View></View>)
        }

        return (
            <View style={{ flex: 1, zIndex: -1 }}>
                <Header navigation={this.props.navigation} mainHeader={true} />
                <View style={{ flexDirection: "row", width: "100%", height: 40, paddingHorizontal: 10, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ borderRadius: 5, height: 40, flex: 1, backgroundColor: BaseColor.primaryColor }}>
                        <TextInput
                            onChangeText={(text) => this.setState({ searchText: text })}
                            style={{ flex: 1, paddingLeft: 45, paddingRight: 20, color: "white" }}
                            placeholder={"Search"} placeholderTextColor={"#fff"}></TextInput>
                        <TouchableOpacity style={{ position: "absolute", padding: 10 }} onPress={() => this.searchAds()}>
                            <Icon name={"search"} size={20} color={BaseColor.whiteColor}></Icon>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.RBSheetRef.open()} style={{ backgroundColor: BaseColor.primaryColor, width: 40, height: 40, marginLeft: 10, alignItems: "center", borderRadius: 5, justifyContent: "center", padding: 5 }}>
                        <Icon name={"sliders-h"} size={20} color={BaseColor.whiteColor}></Icon>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", marginHorizontal: 10, marginTop: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: BaseColor.primaryColor, fontSize: 20, flex: 1, fontWeight: "600" }}>Category of Pets</Text>
                    <TouchableOpacity style={{ marginLeft: 10, marginTop: 10 }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 13 }}>Show All</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: "100%", height: 50, paddingHorizontal: 10, flexDirection: "row", marginTop: 10 }}>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={topCategory}
                        horizontal={true}
                        renderItem={this.renderFilterItem}
                    />
                </View>
                <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "600", marginLeft: 10 }}>Latest</Text>
                {showContentLoader ?
                    <Loader />
                    :
                    <FlatList
                        style={{ paddingHorizontal: 10, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={pets}
                        renderItem={this.renderPetItem}
                    />
                }

                <RBSheet
                    ref={ref => {
                        this.RBSheetRef = ref;
                    }}
                    height={Utils.screen.height / 5 * 3}
                    openDuration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center",
                            borderTopLeftRadius: 30, borderTopRightRadius: 30
                        }
                    }}>

                    <View style={{ flex: 1, padding: 10 }}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <View style={{ width: 120, height: 8, backgroundColor: "#9b9b9b", borderRadius: 100 }}></View>
                        </View>
                        <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingVertical: 10, fontWeight: "bold" }}>Pet</Text>
                        <View style={{ flexDirection: "row", width: "100%" }}>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={filterCategory}
                                horizontal={true}
                                renderItem={this.renderFilterItem}
                            />
                        </View>
                        <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingVertical: 10, fontWeight: "bold" }}>Breed</Text>
                        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={filterBreed}
                                horizontal={true}
                                renderItem={this.renderFilterItem}
                            />
                        </View>
                        <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingVertical: 10, fontWeight: "bold" }}>Gender</Text>
                        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={filterGender}
                                horizontal={true}
                                renderItem={this.renderFilterItem}
                            />
                        </View>
                        <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingVertical: 10, fontWeight: "bold" }}>Price</Text>
                        <View style={{ width: "100%", height: 20 }}>
                            <RangeSlider
                                style={{ width: Utils.screen.width - 20, height: 20 }}
                                gravity={'center'}
                                min={0}
                                max={800}
                                textFormat='$'
                                step={200}
                                selectionColor="#3df"
                                blankColor="#f618"
                                renderThumb={renderThumb}
                                renderRail={renderRail}
                                renderRailSelected={renderRailSelected}
                                renderLabel={renderLabel}
                                renderNotch={renderNotch}
                            // onValueChanged={(low, high, fromUser) => {
                            //     this.setState({ rangeLow: low, rangeHigh: high })
                            // }}
                            />
                        </View>
                    </View>
                </RBSheet>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(Home);