import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Switch,
    TextInput,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image } from 'react-native-elements';

import { Images, BaseColor } from '../../../config';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rememberMe: false,
            passwordSecure: true,
        }
    }

    toggleRememberMe = (value) => {
        this.setState({ rememberMe: value })
    }

    login = () => {
        this.props.navigation.navigate("Home");
    }

    render = () => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ position: "absolute", top: 0, width: "100%", height: 200 }}>
                    <Image
                        source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQA1CPdgmCrD4Q68677We1wsLOaCsDbgwk6hQ&usqp=CAU" }}
                        style={{ width: "100%", height: 230 }} placeholderStyle={{ backgroundColor: "transparent" }}></Image>
                </View>
                <View style={{ position: "absolute", width: "100%", height: 200, top: 0, backgroundColor: "#000", opacity: 0.3 }}></View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Welcome")} style={{ position: "absolute", top: 20, left: 20, width: "100%", height: 170 }}>
                    <Icon name={"arrow-left"} size={20} color={"#fff"}></Icon>
                </TouchableOpacity>
                <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 180, backgroundColor: "#fff" }}>
                    <View style={{ width: "100%", height: 80, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                        <Image placeholderStyle={{ backgroundColor: "transparent" }} source={Images.logo} style={{ width: 168, height: 60 }} resizeMode={"stretch"}></Image>
                    </View>
                    <ScrollView style={{ flex: 1, marginTop: 30 }}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
                            <View onPress={() => this.props.navigation.navigate("Login")} style={{ width: "80%", height: 50 }}>
                                <TextInput placeholder={"Email"} placeholderTextColor={"#fff"} style={{ fontSize: 15, paddingHorizontal: 20, color: "#fff", flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                </TextInput>
                            </View>
                            <View style={{ width: "80%", height: 50, marginTop: 20, justifyContent: "center", }}>
                                <TextInput placeholder={"Password"} textContentType={"password"} secureTextEntry={this.state.passwordSecure} placeholderTextColor={"#fff"} style={{ fontSize: 15, paddingHorizontal: 20, color: "#fff", flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                </TextInput>
                                <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => this.state.passwordSecure ? this.setState({ passwordSecure: false }) : this.setState({ passwordSecure: true })}>
                                    <Icon name={this.state.passwordSecure ? "eye-slash" : "eye"} size={15} color={"#fff"} style={{ flex: 1 }}></Icon>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: "80%", height: 30, marginTop: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Switch
                                    value={this.state.rememberMe}
                                    onValueChange={(value) => this.toggleRememberMe(value)}
                                />
                                <Text style={{ marginLeft: 10, textAlign: "left", flex: 1 }}>Remember Me</Text>
                            </View>
                            <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 20 }} onPress={() => this.login()}>
                                <View style={{ flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "#fff", fontSize: 15 }}>LOGIN</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: "70%", height: 15, flexDirection: "row", marginTop: 5, justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flex: 1, height: 1, backgroundColor: "#000" }}></View>
                                <Text style={{ marginHorizontal: 5, fontSize: 12 }}>OR</Text>
                                <View style={{ flex: 1, height: 1, backgroundColor: "#000" }}></View>
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
                                <View style={{ flex: 1, borderRadius: 10, backgroundColor: "#fff", borderWidth: 1, borderColor: "#808080", justifyContent: "center", alignItems: "center" }}>
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