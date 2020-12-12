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
import Toast from 'react-native-simple-toast';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store } from "@store";
import * as Api from '@api';

import * as Utils from '@utils';

class ProfileEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoader: false,

            avatar: { path: '' },
            name: '',
            email: '',
            phonenumber: "+1",
            valid_phone: true,
            visiblePickerModal: false,
            user: {},
        }

        this.change_image_status = 0;
    }

    UNSAFE_componentWillMount = async () => {
        this.setState({ showLoader: true });
        const param = { user_id: store.getState().auth.login.user.id };
        const response = await this.props.api.post('profile', param);
        this.setState({ showLoader: false });
        if (response?.success) {
            let avatar = Api.SERVER_HOST + response.data.user.avatar;
            if (response.data.user.avatar == null || response.data.user.avatar == '')
                avatar = '';
            this.setState({ user: response.data.user, name: response.data.user.name, phonenumber: response.data.user.phonenumber, email: response.data.user.email, avatar: { path: avatar } });
        }
    }

    goBack = () => {
        this.props.navigation.goBack(null);
    }

    save = async () => {
        const { name, phonenumber, email, avatar } = this.state;
        console.log(phonenumber);
        if (name == '') {
            Toast.show("Please input name.");
            return;
        }
        if (!Utils.isValidEmail(email)) {
            Toast.show("Please input valid email.");
            return;
        }
        if (!this.phone.isValidNumber()) {
            Toast.show("Please input valid phone number.");
            return;
        }
        const params = {
            name: name,
            email: email,
            phonenumber: phonenumber,
            change_image_status: this.change_image_status
        };
        this.setState({ showLoader: true });

        let response = null;
        if (this.change_image_status == 1)
            response = await this.props.api.editProfile("profile/edit", avatar, params);
        else
            response = await this.props.api.post("profile/edit", params, true);

        if (response?.success) {
            this.setState({ user: response.data.user, name: response.data.user.name, email: response.data.user.email, phonenumber: response.data.user.phonenumber });
            this.change_image_status = 0;
            this.goBack();
        }
        else {
            this.setState({ showLoader: false });
        }
    }

    openPhotoPicker = (index) => {
        if (index == 0) {
            ImagePicker.openCamera({
                multiple: false,
                mediaType: 'photo',
                width: 500,
                height: 500,
                includeExif: true
            }).then(images => {
                this.change_image_status = 1;
                this.setState({ visiblePickerModal: false, avatar: images });
            });
        }
        else if (index == 1) {
            ImagePicker.openPicker({
                multiple: false,
                mediaType: 'photo',
                width: 500,
                height: 500,
                includeExif: true
            }).then(images => {
                this.change_image_status = 1;
                this.setState({ visiblePickerModal: false, avatar: images });
                console.log(images);
            });
        }
        else {
            this.change_image_status = 2;
            this.setState({ avatar: '', visiblePickerModal: false });
        }
    }

    render = () => {
        const { avatar, phonenumber, name, email, valid_phone, user, showLoader } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingTop: getStatusBarHeight() }}>
                <Header icon_left={"times"} callback_left={this.goBack} title={"Edit Profile"} text_right={"save"} callback_right={this.save} />
                <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingHorizontal: 20 }}>Basic Infomation</Text>
                <View style={{ marginTop: 15, marginLeft: 15, flexDirection: "row", paddingRight: 20 }}>
                    <View>
                        {avatar?.path ?
                            <Avatar
                                size='xlarge'
                                rounded
                                source={{ uri: avatar?.path }}
                                activeOpacity={0.7}
                                placeholderStyle={{ backgroundColor: "transparent" }}
                                containerStyle={{ marginHorizontal: 10, borderWidth: 1, borderColor: "#808080", width: 80, height: 80, borderRadius: 100 }}>
                            </Avatar>
                            :
                            <View style={{ width: 80, height: 80, marginHorizontal: 10, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 30 }}>{user?.name?.charAt(0).toUpperCase()}</Text>
                            </View>
                        }
                        <TouchableOpacity
                            onPress={() => this.setState({ visiblePickerModal: true })}
                            style={{ width: 40, height: 40, backgroundColor: BaseColor.primaryColor, position: "absolute", justifyContent: "center", alignItems: "center", bottom: -5, right: 0, borderRadius: 100, borderWidth: 3, borderColor: BaseColor.whiteColor }}>
                            <Icon name={"camera"} size={18} color={BaseColor.whiteColor}></Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", paddingLeft: 20 }}>
                        <TextInput style={[Styles.textinput, { fontSize: 16, paddingVertical: 15 }]}
                            value={name}
                            onChangeText={(text) => this.setState({ name: text })}
                            underlineColorAndroid="transparent"
                            placeholder="Enter Your Name"
                            placeholderTextColor={BaseColor.greyColor} />
                    </View>
                </View>
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
                        onChangePhoneNumber={(value) => this.setState({ valid_phone: this.phone.isValidNumber(), phonenumber: value })}
                        placeholderTextColor={BaseColor.greyColor}
                    />
                    <TextInput style={[Styles.textinput, { marginTop: 20, paddingVertical: 15 }]}
                        value={email}
                        onChangeText={(text) => this.setState({ email: text })}
                        underlineColorAndroid="transparent"
                        placeholder="Email"
                        placeholderTextColor={BaseColor.greyColor} />
                </View>

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

