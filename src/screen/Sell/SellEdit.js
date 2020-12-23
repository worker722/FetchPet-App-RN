import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    TextInput,
    Modal,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Header, Loader, CustomModalPicker } from '@components';
import MapView, { Marker } from 'react-native-maps';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import Styles from './style';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as Utils from '@utils';

const image_size = (Utils.SCREEN.WIDTH - 40) / 3;

class SellEdit extends Component {
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
                latitudeDelta: 0.0001,
                longitudeDelta: 0.0001
            },
            ads: {},
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
            showImagePanLoader: false,
            showRefresh: false,
            uploadedImages: [],
            is_edit_image: false,
        }
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const param = { ad_id: this.props.navigation.state.params.ad_id };
        let response = await this.props.api.get('ads/sell');
        if (response?.success) {
            const { category, breed } = response.data;
            if (category.length > 0) {
                this.setState({ category: category });
            }
            if (breed.length > 0)
                this.setState({ breed: breed });
        }
        response = await this.props.api.post('ads', param);
        if (response?.success) {
            const { ads } = response.data;
            this.setState({ ads });
            this.setState({
                price: ads.price,
                age: ads.age,
                description: ads.description,
                selectedCategory: ads.category.name,
                selectedBreed: ads.breed.name,
                selectedGender: ads.gender == 1 ? "Male" : "Female",
                selectedUnit: ads.unit
            });

            let region = {
                latitude: ads.lat,
                longitude: ads.long,
                latitudeDelta: 0.0001,
                longitudeDelta: 0.0001,
            }
            this.setState({ region });

            let uploadedImages = [];
            ads.meta.forEach((item, key) => {
                if (item.meta_key == '_ad_image')
                    uploadedImages.push({ index: key, id: item.id, path: Api.SERVER_HOST + item.meta_value });
            });
            this.setState({ uploadedImages });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    openPhotoPicker = (index) => {
        if (index == 0) {
            ImagePicker.openCamera({
                mediaType: 'photo',
                width: 500,
                height: 500,
                includeExif: true,
                multiple: true,
                cropping: true
            }).then(images => {
                this.setState({ visiblePickerModal: false, uploadedImages: images, is_edit_image: true });
            });
        }
        else if (index == 1) {
            ImagePicker.openPicker({
                mediaType: 'photo',
                width: 500,
                height: 500,
                includeExif: true,
                multiple: true,
                cropping: true
            }).then(images => {
                this.setState({ visiblePickerModal: false, uploadedImages: images, is_edit_image: true });
            });
        }
    }

    showPickerModal = () => {
        this.setState({ visiblePickerModal: true })
    }

    selectLocation = (region) => {
        let currentRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: 0.0001,
            longitudeDelta: 0.0001,
        }
        this.setState({ region: currentRegion });
    }

    editAds = async () => {
        const { ads, selectedCategory, selectedBreed, selectedGender, selectedUnit, age, price, description, uploadedImages, region, is_edit_image } = this.state;
        console.log(selectedUnit)
        if (uploadedImages.length == 0) {
            Toast.show("Please choose pet images.");
            return;
        }
        if (selectedCategory == '') {
            Toast.show("Please select pet category.");
            return;
        }
        if (selectedBreed == '') {
            Toast.show("Please select pet breed.");
            return;
        }
        if (age == 0) {
            Toast.show("Please input pet age.");
            return;
        }
        if (price == 0) {
            Toast.show("Please input pet price.");
            return;
        }
        if (region.latitude == 0 && region.longitude == 0) {
            Toast.show("Please pick location.");
            return;
        }
        this.setState({ showLoader: true });
        const params = { is_edit_image: is_edit_image, ad_id: ads.id, category: selectedCategory, breed: selectedBreed, age: age, unit: selectedUnit, price: price, gender: selectedGender == 'Male' ? 1 : 0, image_key: 'ad_image', lat: region.latitude, long: region.longitude, description: description ? description : '' };
        let response;
        if (is_edit_image) {
            response = await this.props.api.createAds('ads/edit', uploadedImages, params);
        }
        else {
            response = await this.props.api.post('ads/edit', params);
        }
        this.setState({ showLoader: false });
        if (response?.success) {
            this.props.navigation.navigate("Home");
            this.setState({ uploadedImages: [], age: 0, price: 0, description: '', is_edit_image: false });
        }
    }

    _onRefresh = () => {
        this.setState({ showRefresh: true });
        this.start();
    }

    deleteImage = (index, item) => {
        const { uploadedImages } = this.state;
        if (uploadedImages.length > 0) {
            Alert.alert(
                'Delete Image',
                'Are you sure you want to delete this image?',
                [
                    {
                        text: 'OK',
                        onPress: async () => {
                            if (!item.id) {
                                uploadedImages.splice(index, 1);
                                this.setState({ uploadedImages });
                                return;
                            }
                            const param = { id: item.id };
                            this.setState({ showImagePanLoader: true });
                            const response = await this.props.api.post('ads/image/delete', param);
                            if (response?.success) {
                                const { ads } = response.data;
                                let uploadedImages = [];
                                ads.meta.forEach((item, key) => {
                                    if (item.meta_key == '_ad_image')
                                        uploadedImages.push({ index: key, id: item.id, path: Api.SERVER_HOST + item.meta_value });
                                });
                                this.setState({ uploadedImages });
                            }
                            this.setState({ showImagePanLoader: false });
                        }
                    },
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                    },
                ],
                { cancelable: false }
            );
        }
    }

    renderImage = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", width: image_size, marginLeft: 10 }} onPress={() => this.deleteImage(index, item)}>
                <Image
                    source={{ uri: item.path }}
                    style={{ width: image_size, height: image_size, borderColor: BaseColor.dddColor, borderWidth: 1, borderRadius: 10 }}
                    resizeMode="cover"
                    placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                    PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}></Image>
            </TouchableOpacity>
        )
    }

    render = () => {
        const { selectedCategory, selectedBreed, selectedGender, selectedUnit, category, breed, gender, age, unit, description, price, visiblePickerModal, showImagePanLoader, showLoader, showRefresh, uploadedImages, region } = this.state;
        const navigation = this.props.navigation;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <Header navigation={navigation} mainHeader={true} />
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 20, paddingLeft: 10 }}>Edit Ads</Text>
                        <View style={{ flex: 1 }}></View>
                        {uploadedImages.length > 0 &&
                            <TouchableOpacity style={{ paddingRight: 10 }} onPress={this.showPickerModal}>
                                <Icon name={"plus-circle"} size={25} color={BaseColor.primaryColor}></Icon>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{ height: image_size + 40, borderRadius: 10, marginHorizontal: 5, borderColor: BaseColor.dddColor, borderWidth: 1, marginTop: 10, justifyContent: "center", alignItems: "center", paddingRight: 10 }}>
                        {showImagePanLoader ?
                            <Loader size={30} />
                            :
                            <>
                                {uploadedImages.length == 0 ?
                                    <>
                                        <Icon name={"image"} size={35} color={BaseColor.primaryColor}></Icon>
                                        <TouchableOpacity
                                            onPress={this.showPickerModal}
                                            style={{ backgroundColor: BaseColor.primaryColor, paddingVertical: 7, borderWidth: 1, borderColor: BaseColor.dddColor, borderRadius: 10, paddingHorizontal: 10, borderRadius: 5, marginTop: 5 }}>
                                            <Text style={{ color: BaseColor.whiteColor }}>Choose from gallery</Text>
                                        </TouchableOpacity>
                                    </>
                                    :
                                    <FlatList
                                        keyExtractor={(item, index) => index.toString()}
                                        data={uploadedImages}
                                        horizontal={true}
                                        renderItem={this.renderImage}
                                    />
                                }
                            </>
                        }
                    </View>
                    <View style={{ width: "100%", marginTop: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"Select a Category"} data={category} selectedValue={selectedCategory} onValueChange={(item, key) => this.setState({ selectedCategory: item.name })} />
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, marginLeft: 10, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"Select a Breed"} data={breed} selectedValue={selectedBreed} onValueChange={(item, key) => this.setState({ selectedBreed: item.name })} />
                        </View>
                    </View>
                    <View style={{ width: "100%", marginTop: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor }}>
                            <TextInput
                                value={`${age}`}
                                onChangeText={(text) => this.setState({ age: text })}
                                placeholder={"Age"} keyboardType={"number-pad"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, flex: 1, paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }} />
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, marginLeft: 10, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"Select a Unit"} data={unit} selectedValue={selectedUnit} onValueChange={(item, key) => this.setState({ selectedUnit: item.name })} />
                        </View>
                    </View>
                    <View style={{ width: "100%", marginTop: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, borderColor: BaseColor.dddColor }}>
                            <CustomModalPicker title={"Select a Gender"} data={gender} selectedValue={selectedGender} onValueChange={(item, key) => this.setState({ selectedGender: item.name })} />
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, marginLeft: 10, height: 50, borderColor: BaseColor.dddColor }}>
                            <TextInput
                                value={`${price}`}
                                onChangeText={(text) => this.setState({ price: text })}
                                placeholder={"Price"} keyboardType={"number-pad"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, flex: 1, paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }} />
                        </View>
                    </View>
                    <View style={{ padding: 10, height: 100, marginTop: 10, borderWidth: 1, borderColor: BaseColor.dddColor, borderRadius: 10, marginHorizontal: 10 }}>
                        <TextInput
                            value={description}
                            onChangeText={(text) => this.setState({ description: text })}
                            style={{ flex: 1, textAlign: "left" }} placeholder={"Let them know about your pet."} multiline={true}></TextInput>
                    </View>
                    <View style={{ padding: 10, marginTop: 10 }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 18 }}>Location</Text>
                        <MapView
                            onPress={() => navigation.navigate("CustomMap", { selectLocation: this.selectLocation, currentRegion: region })}
                            style={{ flex: 1, height: 160, marginTop: 10 }}
                            scrollEnabled={false}
                            region={region}
                        >
                            {region.latitude != 0 && region.longitude != 0 &&
                                <Marker coordinate={region} />
                            }
                        </MapView>
                    </View>
                    <TouchableOpacity
                        onPress={this.editAds}
                        style={{ marginTop: 15, marginBottom: 20, backgroundColor: BaseColor.primaryColor, borderRadius: 5, justifyContent: "center", alignItems: "center", paddingVertical: 10, marginHorizontal: 15 }}>
                        <Text style={{ color: BaseColor.whiteColor, fontSize: 18 }}>Edit Ads</Text>
                    </TouchableOpacity>
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

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(SellEdit);