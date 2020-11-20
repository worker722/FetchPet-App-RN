import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    Picker,
    TextInput,
} from 'react-native';
import { BaseColor } from '@config';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Header } from '@components';
import MapView from 'react-native-maps';
// import ModalPicker from 'react-native-modal-picker';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';

const tempCategoryData = ['Dog', 'Cat', 'Parrot'];
const tempBreedData = ['BullDog', 'Persion', 'Shepeter'];
const tempGenderData = ['Male', 'Female'];
class Sell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: 'Dog',
            selectedBreed: 'Dog',
            selectedGender: 'Male'
        }
    }

    componentWillMount = async () => {
        const response = this.props.api.get('ads/sell');
        console.log(response);
    }

    render = () => {
        const { selectedCategory, selectedBreed, selectedGender } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <Header navigation={this.props.navigation} mainHeader={true} />
                    <Text style={{ color: BaseColor.primaryColor, fontSize: 20, paddingLeft: 10 }}>Create A New Ads</Text>
                    <View style={{ width: "100%", height: 170, backgroundColor: BaseColor.greyColor, marginTop: 10, justifyContent: "center", alignItems: "center" }}>
                        <Icon name={"image"} size={40} color={"white"}></Icon>
                        <TouchableOpacity style={{ backgroundColor: "white", paddingVertical: 7, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, paddingHorizontal: 10, borderRadius: 5, marginTop: 5 }}>
                            <Text style={{ color: BaseColor.primaryColor }}>Choose from gallery</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "100%", marginTop: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, borderColor: "#ddd" }}>
                            {Platform.OS == "android" ?
                                <Picker
                                    selectedValue={selectedCategory}
                                    style={{ height: 40, flex: 1, color: BaseColor.primaryColor }}
                                    onValueChange={(value, index) => this.setState({ selectedCategory: value })}
                                    itemStyle={{ height: 40 }}
                                    mode="dropdown"
                                >
                                    {tempCategoryData.map((item, index) => (
                                        <Picker.Item label={item} value={0} />
                                    ))}
                                </Picker>
                                :
                                <ModalPicker
                                    data={tempData}
                                    style={{ width: "100%", height: 40 }}
                                    initValue={-1}
                                    cancelText={"cancel"}
                                    onChange={(option) => this.setState({ selectedCategory: option })}>
                                    <Text numberOfLines={1}>{selectedCategory}</Text>
                                </ModalPicker>
                            }
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, marginLeft: 10, borderColor: "#ddd" }}>
                            {Platform.OS == "android" ?
                                <Picker
                                    selectedValue={selectedBreed}
                                    style={{ height: 40, flex: 1, color: BaseColor.primaryColor }}
                                    onValueChange={(value, index) => this.setState({ selectedBreed: value })}
                                    itemStyle={{ height: 40 }}
                                    mode="dropdown"
                                >
                                    {tempBreedData.map((item, index) => (
                                        <Picker.Item label={item} value={0} />
                                    ))}
                                </Picker>
                                :
                                <ModalPicker
                                    data={tempBreedData}
                                    style={{ width: "100%", height: 40 }}
                                    initValue={-1}
                                    cancelText={"cancel"}
                                    onChange={(option) => this.setState({ selectedBreed: option })}>
                                    <Text numberOfLines={1}>{selectedBreed}</Text>
                                </ModalPicker>
                            }
                        </View>
                    </View>
                    <View style={{ width: "100%", marginTop: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, borderColor: "#ddd" }}>
                            <TextInput placeholder={"Age"} keyboardType={"number-pad"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, flex: 1, paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }} />
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, height: 50, marginLeft: 10, borderColor: "#ddd" }}>
                            {Platform.OS == "android" ?
                                <Picker
                                    selectedValue={selectedGender}
                                    style={{ height: 40, flex: 1, color: BaseColor.primaryColor }}
                                    onValueChange={(value, index) => this.setState({ selectedGender: value })}
                                    itemStyle={{ height: 40 }}
                                    mode="dropdown"
                                >
                                    {tempGenderData.map((item, index) => (
                                        <Picker.Item label={item} value={0} />
                                    ))}
                                </Picker>
                                :
                                <ModalPicker
                                    data={tempGenderData}
                                    style={{ width: "100%", height: 40 }}
                                    initValue={-1}
                                    cancelText={"cancel"}
                                    onChange={(option) => this.setState({ selectedGender: option })}>
                                    <Text numberOfLines={1}>{selectedGender}</Text>
                                </ModalPicker>
                            }
                        </View>
                    </View>
                    <View style={{ padding: 10, height: 100, marginTop: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, marginHorizontal: 10 }}>
                        <TextInput style={{ flex: 1, textAlign: "left" }} placeholder={"Let them know about your pet."} multiline={true}></TextInput>
                    </View>
                    <View style={{ padding: 10, marginTop: 10 }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 18 }}>Location</Text>
                        <MapView
                            region={{
                                latitude: Number(100.3232, 10),
                                longitude: Number(-300.22, 10),
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            style={{ flex: 1, height: 160, marginTop: 10 }}
                        >
                        </MapView>
                    </View>
                    <TouchableOpacity style={{ marginTop: 15, marginBottom: 20, backgroundColor: BaseColor.primaryColor, borderRadius: 5, justifyContent: "center", alignItems: "center", paddingVertical: 10, marginHorizontal: 15 }}>
                        <Text style={{ color: "#fff", fontSize: 18 }}>Create AD</Text>
                    </TouchableOpacity>
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
export default connect(null, mapDispatchToProps)(Sell);