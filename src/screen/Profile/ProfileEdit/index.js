import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Header, Loader } from '@components';
import { Avatar } from 'react-native-elements';
import { BaseColor } from '@config';
import PhoneInput from 'react-native-phone-input';
import ImagePicker from 'react-native-image-crop-picker';
import Styles from './style';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';

class ProfileEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoader: false,

            is_edit: false,
            name: '',
            email: '',
            phonenumber: "+1",
            valid_phone: true,
            visiblePickerModal: false,
            user: {},
        }
    }

    componentWillMount = async () => {
        this.setState({ showLoader: true });
        const param = { user_id: store.getState().auth.login.user.id };
        const response = await this.props.api.post('profile', param);
        this.setState({ showLoader: false });
        if (response?.success) {
            this.setState({ user: response.data.user, name: response.data.user.name, email: response.data.user.email });
        }
    }

    goBack = () => {
        this.props.navigation.goBack(null);
    }

    cancelEdit = () => {
        this.setState({ is_edit: false })
    }

    save = () => {
        this.setState({ is_edit: false })
    }

    openPhotoPicker = (index) => {
        if (index == 0) {
            ImagePicker.openCamera({
                mediaType: 'photo',
                width: 500,
                height: 500,
                includeExif: true
            }).then(images => {
                console.log(images);
                this.setState({ visiblePickerModal: false });
            });
        }
        else if (index == 1) {
            ImagePicker.openPicker({
                mediaType: 'photo',
                width: 500,
                height: 500,
                includeExif: true
            }).then(images => {
                console.log(images);
                this.setState({ visiblePickerModal: false });
            });
        }
        else {
            this.setState({ visiblePickerModal: false });
        }
    }

    render = () => {
        const { is_edit, phonenumber, name, email, valid_phone, user, showLoader } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1 }}>
                {is_edit ?
                    <Header icon_left={"times"} callback_left={this.cancelEdit} title={"Edit Profile"} text_right={"save"} callback_right={this.save} />
                    :
                    <Header icon_left={"arrow-left"} callback_left={this.goBack} title={"Edit Profile"} />
                }
                <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingHorizontal: 20 }}>{is_edit ? 'Basic Infomation' : 'Profile'}</Text>
                <View style={{ marginTop: 15, marginLeft: 15, flexDirection: "row", paddingRight: 20 }}>
                    <View>
                        <Avatar
                            size='xlarge'
                            rounded
                            source={{ uri: Api.SERVER_HOST + user?.avatar }}
                            activeOpacity={0.7}
                            placeholderStyle={{ backgroundColor: "transparent" }}
                            containerStyle={{ marginHorizontal: 10, borderWidth: 1, borderColor: "#808080", width: 90, height: 90, borderRadius: 100 }}>
                        </Avatar>
                        {is_edit &&
                            <TouchableOpacity
                                onPress={() => this.setState({ visiblePickerModal: true })}
                                style={{ width: 40, height: 40, backgroundColor: BaseColor.primaryColor, position: "absolute", justifyContent: "center", alignItems: "center", bottom: 0, right: 0, borderRadius: 100, borderWidth: 3, borderColor: BaseColor.whiteColor }}>
                                <Icon name={"camera"} size={18} color={BaseColor.whiteColor}></Icon>
                            </TouchableOpacity>
                        }
                    </View>
                    {is_edit ?
                        <View style={{ flex: 1, justifyContent: "center", paddingLeft: 20 }}>
                            <TextInput style={[Styles.textinput, { fontSize: 16 }]}
                                value={name}
                                onChangeText={(text) => this.setState({ name: text })}
                                underlineColorAndroid="transparent"
                                placeholder="Enter Your Name"
                                placeholderTextColor={BaseColor.greyColor} />
                        </View>
                        :
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                    <Text style={{ fontSize: 18 }}>21</Text>
                                    <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Following</Text>
                                </View>
                                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                    <Text style={{ fontSize: 18 }}>66</Text>
                                    <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Followers</Text>
                                </View>
                                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                    <Text style={{ fontSize: 18 }}>54</Text>
                                    <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Total ads</Text>
                                </View>
                            </View>
                            <View style={{ width: "100%", height: 1, backgroundColor: BaseColor.dddColor, position: "absolute", bottom: 10 }}></View>
                        </View>
                    }
                </View>
                {!is_edit ?
                    <View style={{ marginLeft: 15, marginTop: 10 }}>
                        <Text style={{ fontSize: 20 }}>{user?.name}</Text>
                        <TouchableOpacity onPress={() => { this.setState({ is_edit: true }); this.forceUpdate() }}
                            style={{ justifyContent: "center", alignItems: "center", marginTop: 10, borderWidth: 1, borderColor: BaseColor.primaryColor, paddingHorizontal: 10, paddingVertical: 5, width: "30%", borderRadius: 5 }}>
                            <Text style={{ color: BaseColor.primaryColor }}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <>
                        <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingHorizontal: 20, marginTop: 30 }}>Contact Infomation</Text>
                        <View style={{ paddingHorizontal: 20, paddingTop: 30 }}>
                            <PhoneInput
                                ref={(ref) => { this.phone = ref; }}
                                style={[Styles.textinput, { width: "100%", paddingVertical: 15 }]}
                                initialCountry={"en"}
                                flagStyle={{ width: 35, height: 20 }}
                                textProps={{ placeholder: "Please input your phone number" }}
                                textStyle={{ fontSize: 17, color: valid_phone ? BaseColor.primaryColor : BaseColor.greyColor }}
                                value={phonenumber}
                                onChangePhoneNumber={(value) => this.setState({ valid_phone: this.phone.isValidNumber() })}
                                placeholderTextColor={BaseColor.greyColor}
                            />
                            <TextInput style={[Styles.textinput, { marginTop: 20 }]}
                                value={email}
                                onChangeText={(text) => this.setState({ email: text })}
                                underlineColorAndroid="transparent"
                                placeholder="Email"
                                placeholderTextColor={BaseColor.greyColor} />
                        </View>
                    </>
                }

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.visiblePickerModal}>
                    <View style={Styles.modalContainer}>
                        <View style={Styles.modalContentContainer}>
                            <Text style={{ fontSize: 20, }}>Profile Photo</Text>
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
                            <TouchableOpacity
                                onPress={() => this.openPhotoPicker(2)}
                                style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                                <View style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    <Icon name={"trash-alt"} size={20} color={BaseColor.whiteColor}></Icon>
                                </View>
                                <Text style={{ flex: 1, fontSize: 17, marginLeft: 20 }}>Remove</Text>
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
export default connect(null, mapDispatchToProps)(ProfileEdit);

