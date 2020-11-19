import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    TextInput,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { CheckBox } from 'react-native-elements';
import { Image } from 'react-native-elements';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';
import { Loader } from '@components';

import Toast from 'react-native-simple-toast';

import { Images, BaseColor } from '@config';
import * as Utils from '@utils';

const image_height = Utils.screen.height / 4;

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            termAgree: false,
            passwordSec: true,
            con_passwordSec: true,
            username: '',
            email: '',
            password: '',
            con_password: '',
            showLoading: false
        }
    }

    componentWillMount = async () => {
        GoogleSignin.configure({
            iosClientId: 'YOUR IOS CLIENT ID',
        })
    }

    signUp = async () => {
        const { username, email, password, con_password, termAgree } = this.state;
        if (username == '') return Toast.show("Please input User name");
        else if (!Utils.isValidEmail(email)) return Toast.show("Please input valid email");
        else if (password == '') return Toast.show("Please input password");
        else if (password != con_password) return Toast.show("Password don't match.");

        this.setState({ showLoading: true });

        const param = {
            name: username,
            email: email,
            password: password,
            terms: termAgree
        }

        const response = await this.props.api.post("signup", param);
        this.setState({ showLoading: false });

        if (response.success) {
            SetPrefrence('rememberMe', 0);
            this.props.navigation.navigate("Home");
        }
    }

    googleSignup = async () => {
        try {
            this.setState({ showLoading: true });

            await GoogleSignin.hasPlayServices();
            let userInfo = await GoogleSignin.signIn();
            if (userInfo.user.name == null)
                userInfo.user.name = "lucky-fetch";
            const params = { name: userInfo.user.name, email: userInfo.user.email, password: "@fetch@", is_social: 1 };
            const response = await this.props.api.post("signup", params);

            this.setState({ showLoading: false });

            if (response?.success) {
                SetPrefrence('rememberMe', 0);
                this.props.navigation.navigate("Home");
            }

        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Toast.show(error + '');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Toast.show(error + '');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Toast.show(error + '');
            } else {
                Toast.show(error + '');
                console.log(error)
            }
        }
    }

    render = () => {
        const { passwordSec, termAgree, con_passwordSec, showLoading } = this.state;

        if (showLoading)
            return <Loader />;

        return (
            <View style={{ flex: 1, paddingBottom: 20 }}>
                <View style={{ position: "absolute", top: 0, width: "100%", height: image_height }}>
                    <Image
                        source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQA1CPdgmCrD4Q68677We1wsLOaCsDbgwk6hQ&usqp=CAU" }}
                        style={{ width: "100%", height: image_height + 30 }} placeholderStyle={{ backgroundColor: "transparent" }}></Image>
                </View>
                <View style={{ position: "absolute", width: "100%", height: image_height, top: 0, backgroundColor: "#000", opacity: 0.3 }}></View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Welcome")} style={{ position: "absolute", top: 20, left: 20 }}>
                    <Icon name={"arrow-left"} size={20} color={"#fff"}></Icon>
                </TouchableOpacity>
                <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: image_height - 20, backgroundColor: "#fff" }}>
                    <View style={{ width: "100%", height: 80, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                        <Image placeholderStyle={{ backgroundColor: "transparent" }} source={Images.logo} style={{ width: 168, height: 60 }} resizeMode={"stretch"}></Image>
                    </View>
                    <ScrollView style={{ flex: 1, marginTop: 30 }}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
                            <View style={{ width: "80%", height: 50 }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ username: text })}
                                    placeholder={"Username*"} placeholderTextColor={"#fff"} style={{ fontSize: 15, paddingHorizontal: 20, color: "#fff", flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }} />
                            </View>
                            <View style={{ width: "80%", height: 50, marginTop: 20, justifyContent: "center", }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ email: text })}
                                    placeholder={"Email  "} textContentType={"password"} placeholderTextColor={"#fff"} style={{ fontSize: 15, paddingHorizontal: 20, color: "#fff", flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }} />
                            </View>
                            <View style={{ width: "80%", height: 50, marginTop: 20, justifyContent: "center", }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ password: text })}
                                    placeholder={"Password"} textContentType={"password"} secureTextEntry={passwordSec} placeholderTextColor={"#fff"} style={{ fontSize: 15, paddingLeft: 20, paddingRight: 45, color: "#fff", flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }} />
                                <TouchableOpacity style={{ position: "absolute", right: 0, padding: 10 }} onPress={() => this.setState({ passwordSec: !passwordSec })}>
                                    <Icon name={passwordSec ? "eye-slash" : "eye"} size={15} color={"#fff"} style={{ flex: 1 }}></Icon>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: "80%", height: 50, marginTop: 20, justifyContent: "center", }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ con_password: text })}
                                    placeholder={"Retype Password"} textContentType={"password"} secureTextEntry={con_passwordSec} placeholderTextColor={"#fff"} style={{ fontSize: 15, paddingLeft: 20, paddingRight: 45, color: "#fff", flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }} />
                                <TouchableOpacity style={{ position: "absolute", right: 0, padding: 10 }} onPress={() => this.setState({ con_passwordSec: !con_passwordSec })}>
                                    <Icon name={con_passwordSec ? "eye-slash" : "eye"} size={15} color={"#fff"} style={{ flex: 1 }}></Icon>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: "80%", height: 30, marginTop: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <CheckBox
                                    onPress={() => this.setState({ termAgree: !termAgree })}
                                    checked={termAgree}
                                    checkedColor={BaseColor.primaryColor}
                                />
                                <Text style={{ marginLeft: 10, textAlign: "left", flex: 1 }}>I agree with the terms & conditions</Text>
                            </View>
                            <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 20 }} onPress={() => this.signUp()}>
                                <View style={{ flex: 1, borderRadius: 10, backgroundColor: BaseColor.whiteColor, borderColor: BaseColor.dddColor, borderWidth: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "#fff", fontSize: 15, color: BaseColor.primaryColor }}>SIGN UP</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: "70%", height: 15, flexDirection: "row", marginTop: 5, justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flex: 1, height: 1, backgroundColor: BaseColor.dddColor }}></View>
                                <Text style={{ marginHorizontal: 5, fontSize: 12 }}>OR</Text>
                                <View style={{ flex: 1, height: 1, backgroundColor: BaseColor.dddColor }}></View>
                            </View>
                            <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 5 }} onPress={() => this.googleSignup()}>
                                <View style={{ flex: 1, borderRadius: 10, backgroundColor: BaseColor.googleColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 13 }}>Sign Up with</Text>
                                    <Icon name={"google-plus-g"} size={15} color={"#fff"} style={{ position: "absolute", right: 10 }}></Icon>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 10, }}>
                                <View style={{ flex: 1, borderRadius: 10, backgroundColor: BaseColor.faceBookColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 13 }}>Sign Up with</Text>
                                    <Icon name={"facebook-f"} size={15} color={"#fff"} style={{ position: "absolute", right: 10 }}></Icon>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 10, }}>
                                <View style={{ flex: 1, borderRadius: 10, backgroundColor: "#fff", borderWidth: 1, borderColor: BaseColor.dddColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "#000", fontSize: 13 }}>Sign Up with</Text>
                                    <Icon name={"apple"} size={15} color={"#000"} style={{ position: "absolute", right: 10 }}></Icon>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(SignUp);