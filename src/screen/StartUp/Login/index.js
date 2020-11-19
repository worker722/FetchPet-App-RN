import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Switch,
    TextInput,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image } from 'react-native-elements';
import Toast from 'react-native-simple-toast';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';

import { Images, BaseColor } from '@config';
import * as Utils from '@utils';

const image_height = Utils.screen.height / 4;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rememberMe: false,
            passwordSecure: true,
            email: '',
            password: '',
            is_busy: false
        }
    }

    toggleRememberMe = async (value) => {
        this.setState({ rememberMe: value });
    }

    login = async () => {
        const { email, password, rememberMe } = this.state;
        if (!Utils.isValidEmail(email) || password == '') {
            Toast.show("Invalid email/password.");
            return;
        }
        this.setState({ is_busy: true });

        const params = { email: email, password: password };
        const response = await this.props.api.post("login", params);
        this.setState({ is_busy: false });
        if (response.success) {
            SetPrefrence('rememberMe', rememberMe ? 1 : 0);
            this.props.navigation.navigate("Home");
        }
    }

    render = () => {
        const navigation = this.props.navigation;
        const { is_busy, rememberMe, passwordSecure } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ position: "absolute", top: 0, width: "100%", height: image_height }}>
                    <Image
                        source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQA1CPdgmCrD4Q68677We1wsLOaCsDbgwk6hQ&usqp=CAU" }}
                        style={{ width: "100%", height: image_height + 30 }} placeholderStyle={{ backgroundColor: "transparent" }}></Image>
                </View>
                <View style={{ position: "absolute", width: "100%", height: image_height, top: 0, backgroundColor: "#000", opacity: 0.3 }}></View>
                <TouchableOpacity onPress={() => navigation.navigate("Welcome")} style={{ position: "absolute", top: 20, left: 20 }}>
                    <Icon name={"arrow-left"} size={20} color={"#fff"}></Icon>
                </TouchableOpacity>
                <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: image_height - 20, backgroundColor: "#fff" }}>
                    <View style={{ width: "100%", height: 80, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                        <Image placeholderStyle={{ backgroundColor: "transparent" }} source={Images.logo} style={{ width: 168, height: 60 }} resizeMode={"stretch"}></Image>
                    </View>
                    <ScrollView style={{ flex: 1, marginTop: 30 }}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
                            <View style={{ width: "80%", height: 50 }}>
                                <TextInput onChangeText={(text) => this.setState({ email: text })} placeholder={"Email"} placeholderTextColor={"#fff"} style={{ fontSize: 15, paddingHorizontal: 20, color: "#fff", flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                </TextInput>
                            </View>
                            <View style={{ width: "80%", height: 50, marginTop: 20, justifyContent: "center", }}>
                                <TextInput onChangeText={(text) => this.setState({ password: text })} placeholder={"Password"} textContentType={"password"} secureTextEntry={passwordSecure} placeholderTextColor={"#fff"} style={{ fontSize: 15, paddingHorizontal: 20, color: "#fff", flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                </TextInput>
                                <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => passwordSecure ? this.setState({ passwordSecure: false }) : this.setState({ passwordSecure: true })}>
                                    <Icon name={passwordSecure ? "eye-slash" : "eye"} size={15} color={"#fff"} style={{ flex: 1 }}></Icon>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: "80%", height: 30, marginTop: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Switch
                                    value={rememberMe}
                                    onValueChange={(value) => this.toggleRememberMe(value)}
                                    thumbColor={BaseColor.primaryColor}
                                    trackColor={{ true: BaseColor.primaryColor, false: BaseColor.dddColor }}
                                />
                                <Text style={{ marginLeft: 10, textAlign: "left", flex: 1 }}>Remember Me</Text>
                            </View>
                            <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 20 }} onPress={() => this.login()}>
                                <View style={{ flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    {!is_busy ?
                                        <Text style={{ color: "#fff", fontSize: 15 }}>LOGIN</Text>
                                        :
                                        <ActivityIndicator
                                            color={"white"}
                                            size={20} />
                                    }
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: "70%", height: 15, flexDirection: "row", marginTop: 5, justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flex: 1, height: 1, backgroundColor: BaseColor.dddColor }}></View>
                                <Text style={{ marginHorizontal: 5, fontSize: 12 }}>OR</Text>
                                <View style={{ flex: 1, height: 1, backgroundColor: BaseColor.dddColor }}></View>
                            </View>
                            <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 5 }}>
                                <View style={{ flex: 1, borderRadius: 10, backgroundColor: BaseColor.googleColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 13 }}>Login With Google</Text>
                                    <Icon name={"google-plus-g"} size={15} color={"#fff"} style={{ position: "absolute", right: 10 }}></Icon>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 10, }}>
                                <View style={{ flex: 1, borderRadius: 10, backgroundColor: BaseColor.faceBookColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 13 }}>Login With Facebook</Text>
                                    <Icon name={"facebook-f"} size={15} color={"#fff"} style={{ position: "absolute", right: 10 }}></Icon>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 10, }}>
                                <View style={{ flex: 1, borderRadius: 10, backgroundColor: "#fff", borderWidth: 1, borderColor: BaseColor.dddColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "#000", fontSize: 13 }}>Login With Apple</Text>
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
export default connect(null, mapDispatchToProps)(Login);