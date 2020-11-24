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
    ActivityIndicator
} from 'react-native';
import { Image } from 'react-native-elements';
import { Picker, PickerIOS } from '@react-native-community/picker';
import { BaseColor } from '@config';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Header, Loader } from '@components';
import MapView from 'react-native-maps';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import Styles from './style';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';
import * as Utils from '@utils';

const image_size = (Utils.screen.width - 40) / 3;

class Sell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: '',
            selectedBreed: '',
            selectedGender: 'Male',
            age: 0,
            description: '',
            price: 0,
            location: 'USA boulder',
            category: [],
            breed: [],
            gender: [
                { id: 1, name: 'Male' },
                { id: 0, name: 'Female' }
            ],

            visiblePickerModal: false,
            showLoader: false,
            showImagePanLoader: false,
            uploadedImages: [],
        }
    }

    componentWillMount = async () => {
        this.setState({ showLoader: true });
        const response = await this.props.api.get('ads/sell');
        this.setState({ showLoader: false });
        if (response?.success) {
            const { category, breed } = response.data;
            if (category.length > 0) {
                this.setState({ category: category, selectedCategory: category[0].name });
            }
            if (breed.length > 0)
                this.setState({ breed: breed, selectedBreed: breed[0].name });
        }
    }

    openPhotoPicker = (index) => {
        this.setState({ visiblePickerModal: false, showImagePanLoader: true });
        if (index == 0) {
            ImagePicker.openCamera({
                mediaType: 'photo',
                width: 500,
                height: 500,
                includeExif: true,
                multiple: true,
            }).then(images => {
                this.setState({ uploadedImages: images, showImagePanLoader: false });
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
                this.setState({ uploadedImages: images, showImagePanLoader: false });
            });
        }
    }

    showPickerModal = () => {
        if (this.state.showImagePanLoader)
            return;

        this.setState({ visiblePickerModal: true })
    }

    createAds = async () => {
        if (this.state.showImagePanLoader)
            return;

        const { selectedCategory, selectedBreed, selectedGender, age, price, description, uploadedImages } = this.state;
        if (uploadedImages.length == 0) {
            Toast.show("Please choose pet images.");
            return;
        }
        if (selectedCategory == '') {
            Toast.show("Please select pet category");
            return;
        }
        if (selectedBreed == '') {
            Toast.show("Please select pet breed");
            return;
        }
        if (age == 0) {
            Toast.show("Please input pet age");
            return;
        }
        if (price == 0) {
            Toast.show("Please input pet price");
            return;
        }
        this.setState({ showLoader: true });
        const params = { category: selectedCategory, breed: selectedBreed, age: age, price: price, gender: selectedGender == 'Male' ? 1 : 0, image_key: 'ad_image', lat: 0.0, long: 0.0, description: description };
        const response = await this.props.api.createAds('ads/create', uploadedImages, params);
        this.setState({ showLoader: false });
        if (response?.success) {
            this.props.navigation.navigate("Home");
            this.setState({ uploadedImages: [], age: 0, price: 0, description: '' });
        }
    }

    renderImage = ({ item }) => {
        return (
            <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", width: image_size, marginLeft: 10 }}>
                <Image
                    source={{ uri: item.path }}
                    style={{ width: image_size, height: image_size, borderColor: BaseColor.dddColor, borderWidth: 1, borderRadius: 10 }}
                    resizeMode="cover"
                    placeholderStyle={{ backgroundColor: "transparent" }}
                    PlaceholderContent={<ActivityIndicator size={20} color={BaseColor.primaryColor}></ActivityIndicator>}></Image>
            </TouchableOpacity>
        )
    }

    render = () => {
        const { selectedCategory, selectedBreed, selectedGender, category, breed, gender, visiblePickerModal, showLoader, uploadedImages, showImagePanLoader } = this.state;
        const navigation = this.props.navigation;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <Header navigation={navigation} mainHeader={true} />
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 20, paddingLeft: 10 }}>Create A New Ads</Text>
                        <View style={{ flex: 1 }}></View>
                        {uploadedImages.length > 0 &&
                            <TouchableOpacity style={{ paddingRight: 10 }} onPress={this.showPickerModal}>
                                <Icon name={"plus-circle"} size={25} color={BaseColor.primaryColor}></Icon>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{ width: "100%", height: image_size + 40, borderRadius: 10, borderColor: BaseColor.dddColor, borderWidth: 1, marginTop: 10, justifyContent: "center", alignItems: "center", paddingRight: 10 }}>
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
                            {Platform.OS == "android" ?
                                <Picker
                                    selectedValue={selectedCategory}
                                    style={{ height: 40, flex: 1, color: BaseColor.primaryColor }}
                                    onValueChange={(value, index) => this.setState({ selectedCategory: value })}
                                    itemStyle={{ height: 40 }}
                                    mode="dropdown"
                                >
                                    {category.map((item, index) => (
                                        <Picker.Item key={index} label={item.name} value={item.name} />
                                    ))}
                                </Picker>
                                :
                                <PickerIOS
                                    selectedValue={selectedCategory}
                                    style={{ height: 40, flex: 1, color: BaseColor.primaryColor }}
                                    onValueChange={(value, index) => this.setState({ selectedCategory: value })}
                                    itemStyle={{ height: 40 }}
                                    mode="dropdown"
                                >
                                    {category.map((item, index) => (
                                        <Picker.Item key={index} label={item.name} value={item.name} />
                                    ))}
                                </PickerIOS>
                            }
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, marginLeft: 10, borderColor: BaseColor.dddColor }}>
                            {Platform.OS == "android" ?
                                <Picker
                                    selectedValue={selectedBreed}
                                    style={{ height: 40, flex: 1, color: BaseColor.primaryColor }}
                                    onValueChange={(value, index) => this.setState({ selectedBreed: value })}
                                    itemStyle={{ height: 40 }}
                                    mode="dropdown"
                                >
                                    {breed.map((item, index) => (
                                        <Picker.Item key={index} label={item.name} value={item.name} />
                                    ))}
                                </Picker>
                                :
                                <PickerIOS
                                    selectedValue={selectedBreed}
                                    style={{ height: 40, flex: 1, color: BaseColor.primaryColor }}
                                    onValueChange={(value, index) => this.setState({ selectedBreed: value })}
                                    itemStyle={{ height: 40 }}
                                    mode="dropdown"
                                >
                                    {breed.map((item, index) => (
                                        <Picker.Item key={index} label={item.name} value={item.name} />
                                    ))}
                                </PickerIOS>
                            }
                        </View>
                    </View>
                    <View style={{ width: "100%", marginTop: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor }}>
                            <TextInput
                                onChangeText={(text) => this.setState({ age: text })}
                                placeholder={"Age"} keyboardType={"number-pad"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, flex: 1, paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }} />
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, marginLeft: 10, borderColor: BaseColor.dddColor }}>
                            {Platform.OS == "android" ?
                                <Picker
                                    selectedValue={selectedGender}
                                    style={{ height: 40, flex: 1, color: BaseColor.primaryColor }}
                                    onValueChange={(value, index) => this.setState({ selectedGender: value })}
                                    itemStyle={{ height: 40 }}
                                    mode="dropdown"
                                >
                                    {gender.map((item, index) => (
                                        <Picker.Item key={index} label={item.name} value={item.name} />
                                    ))}
                                </Picker>
                                :
                                <PickerIOS
                                    selectedValue={selectedGender}
                                    style={{ height: 40, flex: 1, color: BaseColor.primaryColor }}
                                    onValueChange={(value, index) => this.setState({ selectedGender: value })}
                                    itemStyle={{ height: 40 }}
                                    mode="dropdown"
                                >
                                    {gender.map((item, index) => (
                                        <Picker.Item key={index} label={item.name} value={item.name} />
                                    ))}
                                </PickerIOS>
                            }
                        </View>
                    </View>
                    <View style={{ width: "100%", marginTop: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, borderColor: BaseColor.dddColor }}>
                            <TextInput
                                onChangeText={(text) => this.setState({ price: text })}
                                placeholder={"Price"} keyboardType={"number-pad"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, flex: 1, paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}></View>
                    </View>
                    <View style={{ padding: 10, height: 100, marginTop: 10, borderWidth: 1, borderColor: BaseColor.dddColor, borderRadius: 10, marginHorizontal: 10 }}>
                        <TextInput style={{ flex: 1, textAlign: "left" }} placeholder={"Let them know about your pet."} multiline={true}></TextInput>
                    </View>
                    <View style={{ padding: 10, marginTop: 10 }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 18 }}>Location</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("CustomMap")} activeOpacity={1}>
                            <MapView
                                style={{ flex: 1, height: 160, marginTop: 10 }}
                                scrollEnabled={false}
                            >
                            </MapView>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={this.createAds}
                        style={{ marginTop: 15, marginBottom: 20, backgroundColor: BaseColor.primaryColor, borderRadius: 5, justifyContent: "center", alignItems: "center", paddingVertical: 10, marginHorizontal: 15 }}>
                        <Text style={{ color: BaseColor.whiteColor, fontSize: 18 }}>Create AD</Text>
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
export default connect(null, mapDispatchToProps)(Sell);