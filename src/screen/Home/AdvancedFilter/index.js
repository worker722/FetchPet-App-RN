import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { BaseColor } from '@config';
import { Header, Loader, CustomModalPicker } from '@components';
import * as Utils from '@utils';

import MapView, { Marker } from 'react-native-maps';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';

class AdvancedFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            showRefresh: false,

            user_data: [],
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
            unit_data: [
                { id: 0, name: "Day(s)" },
                { id: 1, name: "Week(s)" },
                { id: 2, name: "Month(s)" },
                { id: 3, name: "Year(s)" },
            ],
            sort_type_data: [
                {
                    name: "Post Date",
                },
                {
                    name: "Price",
                }
            ],
            sort_asc_data: [
                { "name": "ASC" },
                { "name": "DESC" },
            ],

            user: { id: -1, name: "All" },
            category: { id: -1, name: "All" },
            breed: { id: -1, name: "All" },
            map: {
                region: {
                    latitude: 0,
                    longitude: 0,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.0001
                },
                radius: 0
            },
            price: {
                min: "",
                max: ""
            },
            age: {
                min: {
                    num: 0,
                    unit: "Day(s)"
                },
                max: {
                    num: 0,
                    unit: "Day(s)"
                }
            },
            gender: { id: 1, name: "Male" },
            sortBy: {
                type: "Post Date",
                direction: "ASC"
            }
        }
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const response = await this.props.api.get("filter");
        if (response?.success) {
            const { user, category, breed } = this.state;
            let { user_data, category_data, breed_data } = response.data;
            user_data.unshift(user);
            category_data.unshift(category);
            breed_data.unshift(breed);

            this.setState({ user_data, category_data, breed_data });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    _onRefresh = () => {
        this.setState({ showRefresh: true });
        this.start();
    }

    selectLocation = (region) => {
        let currentRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: 0.0005,
            longitudeDelta: 0.0005,
        }
        let { map } = this.state;
        map.region = currentRegion;
        this.setState({ map });
    }

    filterPet = async () => {
        this.props.navigation.navigate("FilterResult", this.state);
    }

    goBack = () => {
        this.props.navigation.goBack(null);
    }

    render = () => {
        const { showLoader, showRefresh, user_data, category_data, breed_data, gender_data, unit_data, sort_type_data, sort_asc_data, user, category, breed, map, price, age, gender, sortBy } = this.state;
        const { navigation } = this.props;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <Header icon_left={"arrow-left"} title={"Advanced Filter"} color_icon_right={BaseColor.primaryColor} callback_left={this.goBack} />
                <View></View>
                <ScrollView keyboardShouldPersistTaps='always' style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <View style={{ flex: 1, paddingTop: 10, paddingHorizontal: 10, flexDirection: "row" }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"Select a User"} data={user_data} selectedValue={user.name} onValueChange={(user, key) => this.setState({ user })} />
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, marginLeft: 10, height: 50, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"Select a Gender"} data={gender_data} selectedValue={gender.name} onValueChange={(gender, key) => this.setState({ gender })} />
                        </View>
                    </View>
                    <View style={{ flex: 1, paddingTop: 10, paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, borderColor: BaseColor.dddColor }}>
                                <CustomModalPicker title={"Select a Category"} data={category_data} selectedValue={category.name} onValueChange={(category, key) => this.setState({ category })} />
                            </View>
                            <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, marginLeft: 10, borderColor: BaseColor.dddColor }}>
                                <CustomModalPicker title={"Select a Breed"} data={breed_data} selectedValue={breed.name} onValueChange={(breed, key) => this.setState({ breed })} />
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 18 }}>Location</Text>
                        <MapView
                            style={{ flex: 1, height: 160, marginTop: 10 }}
                            scrollEnabled={false}
                            zoomEnabled={false}
                            onPress={() => navigation.navigate("CustomMap", { selectLocation: this.selectLocation, currentRegion: map.region })}
                            region={map.region}
                        >
                            {map.region.latitude != 0 && map.region.longitude != 0 &&
                                <Marker coordinate={map.region} />
                            }
                        </MapView>
                    </View>
                    {/* <View style={{ paddingTop: 10, paddingHorizontal: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", marginLeft: "50%" }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor, height: 50 }}>
                            <TextInput
                                onChangeText={(text) => {
                                    if (Utils.isValidNumber(text)) {
                                        this.setState({
                                            map: {
                                                ...map,
                                                radius: text
                                            }
                                        })
                                    }
                                }}
                                placeholder={"Radius"} value={map.radius} keyboardType={"number-pad"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, flex: 1, paddingHorizontal: 10 }} />
                        </View>
                        <Text>  KM</Text>
                    </View> */}
                    <View style={{ flex: 1, paddingTop: 10, paddingHorizontal: 10, flexDirection: "row" }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, borderColor: BaseColor.dddColor }}>
                            <TextInput
                                onChangeText={(text) => {
                                    if (Utils.isValidNumber(text)) {
                                        this.setState({
                                            price: {
                                                ...price,
                                                min: text
                                            }
                                        })
                                    }
                                }}
                                placeholder={"Min Price"} value={price.min} keyboardType={"number-pad"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, flex: 1, paddingHorizontal: 10 }} />
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, marginLeft: 10, borderColor: BaseColor.dddColor }}>
                            <TextInput
                                onChangeText={(text) => {
                                    if (Utils.isValidNumber(text)) {
                                        this.setState({
                                            price: {
                                                ...price,
                                                max: text
                                            }
                                        })
                                    }
                                }}
                                placeholder={"Max Price"} value={price.max} keyboardType={"number-pad"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, flex: 1, paddingHorizontal: 10 }} />
                        </View>
                    </View>
                    <View style={{ paddingTop: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor }}>
                            <TextInput
                                onChangeText={(text) => {
                                    if (Utils.isValidNumber(text)) {
                                        const { min } = this.state.age;
                                        this.setState({
                                            age: {
                                                ...age,
                                                min: {
                                                    ...min,
                                                    num: text
                                                }
                                            }
                                        })
                                    }
                                }}
                                placeholder={"Min Age"} value={age.min.num} keyboardType={"number-pad"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, flex: 1, paddingHorizontal: 10 }} />
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 5, marginLeft: 10, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"Select a Unit"} data={unit_data} selectedValue={age.min.unit}
                                onValueChange={(item, key) => {
                                    const { min } = this.state.age;
                                    this.setState({
                                        age: {
                                            ...age,
                                            min: {
                                                ...min,
                                                unit: item.name
                                            }
                                        }
                                    })
                                }} />
                        </View>
                    </View>
                    <View style={{ paddingTop: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor }}>
                            <TextInput
                                onChangeText={(text) => {
                                    if (Utils.isValidNumber(text)) {
                                        const { max } = this.state.age;
                                        this.setState({
                                            age: {
                                                ...age,
                                                max: {
                                                    ...max,
                                                    num: text
                                                }
                                            }
                                        })
                                    }
                                }}
                                placeholder={"Max Age"} value={age.max.num} keyboardType={"number-pad"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, flex: 1, paddingHorizontal: 10 }} />
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 5, marginLeft: 10, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"Select a Unit"} data={unit_data} selectedValue={age.max.unit}
                                onValueChange={(item, key) => {
                                    const { max } = this.state.age;
                                    this.setState({
                                        age: {
                                            ...age,
                                            max: {
                                                ...max,
                                                unit: item.name
                                            }
                                        }
                                    })
                                }} />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", paddingTop: 10, paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"What do you want to sort by?"} data={sort_type_data} selectedValue={sortBy.type}
                                onValueChange={(item, key) => {
                                    this.setState({
                                        sortBy: {
                                            ...sortBy,
                                            type: item.name
                                        }
                                    })
                                }} />
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, marginLeft: 10, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"Which direction do you want to sort by?"} data={sort_asc_data} selectedValue={sortBy.direction}
                                onValueChange={(item, key) => {
                                    this.setState({
                                        sortBy: {
                                            ...sortBy,
                                            direction: item.name
                                        }
                                    })
                                }} />
                        </View>
                    </View>
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