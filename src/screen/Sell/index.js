import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Image as RNImage
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor, Images } from '@config';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Header, Loader, CustomModalPicker } from '@components';
import MapView, { Marker } from 'react-native-maps';
import ImagePicker from 'react-native-image-crop-picker';

import Styles from './style';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as Utils from '@utils';
import * as global from "@api/global";
import { store } from "@store";

const image_size = (Utils.SCREEN.WIDTH - 40) / 3;

class Sell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: '',
            selectedBreed: '',
            selectedGender: 'Male',
            selectedUnit: 'Day(s)',
            age: 0,
            description: '',
            price: 0,
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.001,
                longitudeDelta: 0.0001
            },
            category: [],
            breed: [],
            gender: [
                { id: 1, name: 'Male' },
                { id: 0, name: 'Female' }
            ],
            unit: [
                { id: 0, name: "Day(s)" },
                { id: 1, name: "Week(s)" },
                { id: 2, name: "Month(s)" },
                { id: 3, name: "Year(s)" },
            ],

            visiblePickerModal: false,
            showLoader: false,
            showRefresh: false,
            uploadedImages: [],
        }
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const is_social = store.getState().auth.login?.user?.is_social;
        if (is_social == -1) {
            global.showGuestMessage();
        }

        const response = await this.props.api.get('ads/sell');
        if (response?.success) {
            let { category, breed } = response.data;
            if (category.length > 0) {
                category.forEach((item, index) => {
                    if (index == 0) item.is_selected = true;
                    else item.is_selected = false;
                });
                this.setState({ category, selectedCategory: category[0].name });
            }
            if (breed.length > 0)
                this.setState({ breed, selectedBreed: breed[0].name });
        }

        Utils.getCurrentLocation().then(
            (data) => {
                this.setState({
                    region: {
                        latitude: data.latitude,
                        longitude: data.longitude,
                        latitudeDelta: 0.0005,
                        longitudeDelta: 0.0005
                    }
                });
            }
        );

        this.setState({ showLoader: false, showRefresh: false });
    }

    openPhotoPicker = (index) => {
        try {
            if (index == 0) {
                ImagePicker.openCamera({
                    mediaType: 'photo',
                    width: 500,
                    height: 500,
                    includeExif: true,
                    multiple: true,
                }).then(images => {
                    this.setState({ visiblePickerModal: false, uploadedImages: [images] });
                });
            }
            else if (index == 1) {
                ImagePicker.openPicker({
                    mediaType: 'photo',
                    width: 500,
                    height: 500,
                    includeExif: true,
                    multiple: true,
                }).then(images => {
                    if (images.length > 5) {
                        global.showToastMessage("You can select up to 5 pet images.");
                        return;
                    }
                    this.setState({ visiblePickerModal: false, uploadedImages: images });
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    showPickerModal = () => {
        const { uploadedImages } = this.state;
        if (uploadedImages.length == 5) {
            global.showToastMessage("You can select up to 5 pet images.");
            return;
        }
        this.setState({ visiblePickerModal: true })
    }

    selectLocation = (region) => {
        let currentRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: 0.0005,
            longitudeDelta: 0.0005,
        }
        this.setState({ region: currentRegion });
    }

    createAds = async (type) => {
        const is_social = store.getState().auth.login?.user?.is_social;
        if (is_social == -1) {
            global.showGuestMessage();
        }
        else {
            const { selectedCategory, selectedBreed, selectedGender, selectedUnit, age, price, description, uploadedImages, region } = this.state;
            if (uploadedImages.length < 1) {
                global.showToastMessage("Please choose at least one pet image.");
                return;
            }
            if (selectedCategory == '') {
                global.showToastMessage("Please select pet category.");
                return;
            }
            if (selectedBreed == '') {
                global.showToastMessage("Please select pet breed.");
                return;
            }
            if (age == 0) {
                global.showToastMessage("Please input pet age.");
                return;
            }
            if (price == 0) {
                global.showToastMessage("Please input pet price.");
                return;
            }
            if (region.latitude == 0 && region.longitude == 0) {
                global.showToastMessage("Please pick location.");
                return;
            }
            this.setState({ showLoader: true });
            const params = { category: selectedCategory, breed: selectedBreed, age: age, price: price, gender: selectedGender == 'Male' ? 1 : 0, image_key: 'ad_image', unit: selectedUnit, lat: region.latitude, long: region.longitude, description: description ? description : '' };
            const response = await this.props.api.createAds('ads/create', uploadedImages, params);
            this.setState({ showLoader: false });
            if (response?.success) {
                if (type == 0)
                    this.props.navigation.navigate("Home");
                else if (type == 1)
                    this.props.navigation.navigate("Package", { checkout_type: global._CHECKOUT_BOOST_ADS, ad_id: response.data.id })

                this.setState({ uploadedImages: [], age: 0, price: 0, description: '' });
                this.props.setStore(global.FREE_SELL_ADS);
            }
        }
    }

    _onRefresh = () => {
        const is_social = store.getState().auth.login?.user?.is_social;
        if (is_social == -1) {
            global.showGuestMessage();
        }
        else {
            this.setState({ showRefresh: true });
            this.start();
        }
    }

    filterSelected = async (id) => {
        let { category } = this.state;
        category.forEach((item, key) => {
            if (item.id == id) {
                item.is_selected = true;
                this.setState({ selectedCategory: item.name })
            }
            else
                item.is_selected = false;
        });
        this.setState({ category });
    }

    deleteImage = (index) => {
        const { uploadedImages } = this.state;
        try {
            Alert.alert(
                'Delete Image',
                'Are you sure you want to delete this image?',
                [
                    {
                        text: 'Remove',
                        onPress: () => { uploadedImages.splice(index, 1); this.setState({ uploadedImages }) }
                    },
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
        }
    }

    renderImage = ({ item, index }) => {
        const { uploadedImages } = this.state;
        return (
            <>
                {item?.path &&
                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", width: image_size - 9, marginLeft: 10 }} onPress={() => this.deleteImage(index)}>
                        <Image
                            source={{ uri: item.path }}
                            style={{ width: image_size - 10, height: image_size, borderColor: BaseColor.primaryColor, borderWidth: 1, borderRadius: 10 }}
                            resizeMode="cover"
                            placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                            PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}></Image>
                    </TouchableOpacity>
                }
                {index == uploadedImages.length - 1 &&
                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", width: image_size - 39, marginLeft: 10 }} onPress={this.showPickerModal}>
                        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: BaseColor.whiteColor, width: image_size - 40, height: image_size - 20, borderRadius: 8, borderWidth: 1, borderColor: BaseColor.primaryColor }}>
                            <RNImage source={Images.ic_add} style={{ width: 25, height: 25 }}></RNImage>
                        </View>
                    </TouchableOpacity>
                }
            </>
        )
    }

    renderFilterItem = ({ item, index }) => {
        return (
            <View style={{ alignItems: "center", justifyContent: "center", width: 60, marginRight: 20 }}>
                <TouchableOpacity activeOpacity={1}
                    onPress={() => this.filterSelected(item.id)}
                    style={{ width: 54, height: 54, borderWidth: 5, justifyContent: "center", alignItems: "center", borderColor: item.is_selected ? BaseColor.primaryColor : BaseColor.whiteColor, borderRadius: 100, marginBottom: 5 }}>
                    {item.icon ?
                        <Image source={{ uri: Api.SERVER_HOST + item.icon }} PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />} placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} resizeMode={"stretch"} style={{ width: 45, height: 45, borderRadius: 100 }}></Image>
                        :
                        <RNImage source={Images.ic_category_all} placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} resizeMode={"stretch"} style={{ width: 45, height: 45, borderRadius: 100 }}></RNImage>
                    }
                </TouchableOpacity>
                <Text style={{ color: item.is_selected ? BaseColor.primaryColor : BaseColor.greyColor }} numberOfLines={1}>{item.name}</Text>
            </View>
        )
    }

    render = () => {
        const { selectedBreed, selectedGender, selectedUnit, category, breed, gender, unit, visiblePickerModal, showLoader, showRefresh, uploadedImages, region } = this.state;
        const navigation = this.props.navigation;

        if (uploadedImages.length == 0) {
            uploadedImages.push({})
        }

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <Header navigation={navigation} mainHeader={true} />
                <ScrollView keyboardShouldPersistTaps='always' style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <Text style={{ color: BaseColor.primaryColor, fontSize: 20, paddingLeft: 10 }}>Create Ads</Text>
                    <View style={{ height: image_size + 40, marginHorizontal: 10, borderRadius: 10, backgroundColor: BaseColor.placeholderColor, borderColor: BaseColor.dddColor, borderWidth: 1, marginTop: 10, justifyContent: "center", alignItems: "center", paddingRight: 10 }}>
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={uploadedImages}
                            horizontal={true}
                            renderItem={this.renderImage}
                        />
                    </View>
                    <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                        <FlatList
                            style={{ paddingBottom: 5 }}
                            keyExtractor={(item, index) => index.toString()}
                            data={category}
                            horizontal={true}
                            renderItem={this.renderFilterItem}
                        />
                    </View>

                    <View style={{ width: "100%", marginTop: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, height: 50, borderRadius: 100, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"Select a Breed"} data={breed} selectedValue={selectedBreed} onValueChange={(item, key) => this.setState({ selectedBreed: item.name })} />
                        </View>
                    </View>
                    <View style={{ width: "100%", marginTop: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, height: 50, borderRadius: 100, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"Select a Gender"} data={gender} selectedValue={selectedGender} onValueChange={(item, key) => this.setState({ selectedGender: item.name })} />
                        </View>
                    </View>
                    <View style={{ width: "100%", marginTop: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                        <View style={{ flex: 2, borderWidth: 1, borderRadius: 100, borderColor: BaseColor.dddColor }}>
                            <TextInput
                                onChangeText={(text) => this.setState({ age: text })}
                                placeholder={"Type Age"} keyboardType={"number-pad"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, flex: 1, paddingHorizontal: 20, textAlignVertical: "center", justifyContent: "center", alignItems: "center" }} />
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 100, paddingVertical: 5, marginLeft: 10, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"Select a Unit"} data={unit} selectedValue={selectedUnit} onValueChange={(item, key) => this.setState({ selectedUnit: item.name })} />
                        </View>
                    </View>
                    <View style={{ width: "100%", marginTop: 10, flexDirection: "row", height: 50, paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 100, borderColor: BaseColor.dddColor }}>
                            <TextInput
                                onChangeText={(text) => this.setState({ price: text })}
                                placeholder={"Price"} keyboardType={"number-pad"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, flex: 1, paddingHorizontal: 20, textAlignVertical: "center", justifyContent: "center", alignItems: "center" }} />
                        </View>
                    </View>
                    <View style={{ padding: 10, height: 100, marginTop: 10, borderWidth: 1, borderColor: BaseColor.dddColor, borderRadius: 10, marginHorizontal: 10 }}>
                        <TextInput
                            onChangeText={(text) => this.setState({ description: text })}
                            style={{ flex: 1, textAlign: "left" }} placeholder={"Let them know about your pet."} multiline={true}></TextInput>
                    </View>
                    <View style={{ padding: 10, marginTop: 10 }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 18 }}>Location</Text>
                        <MapView
                            style={{ flex: 1, height: 160, marginTop: 10 }}
                            scrollEnabled={false}
                            zoomEnabled={false}
                            onPress={() => navigation.navigate("CustomMap", { selectLocation: this.selectLocation, currentRegion: region })}
                            region={region}
                        >
                            {region.latitude != 0 && region.longitude != 0 &&
                                <Marker coordinate={region} />
                            }
                        </MapView>
                    </View>
                    {(this.props.FREE_SELL_ADS > 0 || this.props.IS_VALID_SUBSCRIPTION) &&
                        <>
                            <TouchableOpacity
                                onPress={() => this.createAds(1)}
                                style={{ marginTop: 15, flexDirection: "row", backgroundColor: BaseColor.boostColor, borderRadius: 5, justifyContent: "center", alignItems: "center", paddingVertical: 10, marginHorizontal: 15 }}>
                                <RNImage source={Images.ic_boost} style={{ width: 20, height: 20 }}></RNImage>
                                <Text style={{ color: BaseColor.whiteColor, marginLeft: 10, fontSize: 18, fontStyle: "italic" }}>Boost AD</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.createAds(0)}
                                style={{ marginTop: 5, marginBottom: 30, backgroundColor: BaseColor.primaryColor, borderRadius: 5, justifyContent: "center", alignItems: "center", paddingVertical: 10, marginHorizontal: 15 }}>
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 18 }}>Create AD</Text>
                            </TouchableOpacity>
                        </>
                    }

                </ScrollView>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={visiblePickerModal}>
                    <View style={Styles.modalContainer}>
                        <View style={Styles.modalContentContainer}>
                            <Text style={{ fontSize: 20, }}>Select new ads image</Text>
                            <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, padding: 10 }} onPress={() => this.setState({ visiblePickerModal: false })}>
                                <Icon name={"times"} size={22} color={BaseColor.primaryColor}></Icon>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.openPhotoPicker(0)}
                                style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 15 }}>
                                <View style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    <Icon name={"camera"} size={20} color={BaseColor.whiteColor}></Icon>
                                </View>
                                <Text style={{ flex: 1, fontSize: 17, marginLeft: 20 }}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.openPhotoPicker(1)}
                                style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                                <View style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    <Icon name={"image"} size={20} color={BaseColor.whiteColor}></Icon>
                                </View>
                                <Text style={{ flex: 1, fontSize: 17, marginLeft: 20 }}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
        )
    }
}

const mapStateToProps = ({ app: { FREE_SELL_ADS, IS_VALID_SUBSCRIPTION } }) => {
    return { FREE_SELL_ADS, IS_VALID_SUBSCRIPTION };
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch),
        setStore: (type, data) => dispatch({ type, data })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sell);