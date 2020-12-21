import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    ScrollView,
    Platform,
    Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { CheckBox } from 'react-native-elements';
import Toast from 'react-native-simple-toast';

import { GoogleSignin } from 'react-native-google-signin';
import appleAuth, { AppleButton } from '@invertase/react-native-apple-authentication';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import firebase from 'react-native-firebase';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';
import * as global from "@api/global";

import { Images, BaseColor } from '@config';
import * as Utils from '@utils';
import { Loader } from '@components';

const image_height = Utils.SCREEN.HEIGHT / 4;

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
            showLoading: false,
            device_token: ''
        }
    }

    UNSAFE_componentWillMount = async () => {
        GoogleSignin.configure({
            iosClientId: 'YOUR IOS CLIENT ID',
        });

        let is_show_apple_button = await GetPrefrence(global.PREF_SHOW_APPLE_BUTTON);
        if (is_show_apple_button == 1)
            this.setState({ is_show_apple_button: true });
    }

    componentDidMount = async () => {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    firebase.messaging().getToken().then(token => {
                        console.log('fcmToken', token)
                        this.setState({ device_token: token });
                    })
                }
                else {
                    firebase.messaging().requestPermission();
                }
            }).catch(error => {
            })
    }

    signUp = async () => {
        const { username, email, password, con_password, termAgree, device_token } = this.state;
        if (username == '') return Toast.show("Please input user name.");
        else if (!Utils.isValidEmail(email)) return Toast.show("Please input valid email.");
        else if (password == '') return Toast.show("Please input password.");
        else if (password != con_password) return Toast.show("Password don't match.");

        this.setState({ showLoading: true });

        let params = {
            name: username,
            email: email,
            password: password,
            terms: termAgree,
        };

        if (Platform.OS == "android")
            params = Object.assign(params, { device_token: device_token });
        else
            params = Object.assign(params, { iphone_device_token: device_token });

        const response = await this.props.api.post("signup", params, true);
        this.setState({ showLoading: false });

        if (response?.success) {
            SetPrefrence(global.PREF_REMEMBER_ME, 1);
            this.props.navigation.navigate("Home");
        }
    }

    signUpWithGoogle = async () => {
        try {
            this.setState({ showLoading: true });

            await GoogleSignin.hasPlayServices();

            let userInfo = await GoogleSignin.signIn();
            if (userInfo.user.name == null)
                userInfo.user.name = "Fetch Lucky";

            let params = { name: userInfo.user.name, email: userInfo.user.email, password: "@fetch@", is_social: 1 };

            if (Platform.OS == "android")
                params = Object.assign(params, { device_token: this.state.device_token });
            else
                params = Object.assign(params, { iphone_device_token: this.state.device_token });

            const response = await this.props.api.post("signup", params, true);

            this.setState({ showLoading: false });

            if (response?.success) {
                SetPrefrence(global.PREF_REMEMBER_ME, 0);
                this.props.navigation.navigate("Home");
            }

        } catch (error) {
            this.setState({ showLoading: false });
        }
    }

    signUpWithApple = async () => {
        try {
            this.setState({ showLoading: true });
            const { device_token } = this.state;

            let params = null;
            let is_apple_exist = false;
            let apple_name = '';
            let apple_email = '';

            const name = await GetPrefrence(global.PREF_APPLE_NAME);
            const email = await GetPrefrence(global.PREF_APPLE_EMAIL);
            if (name != '' && email != '') {
                params = { name: name, email: email, password: "@fetch@", is_social: 3 };
                is_apple_exist = true;
            }
            else {
                const appleAuthRequestResponse = await appleAuth.performRequest({
                    requestedOperation: appleAuth.Operation.LOGIN,
                    requestedScopes: [
                        appleAuth.Scope.EMAIL,
                        appleAuth.Scope.FULL_NAME
                    ],
                });
                const { identityToken, email, fullName } = appleAuthRequestResponse;
                if (identityToken) {
                    if (!email) {
                        Toast.show("Please share your email.");
                        this.setState({ showLoading: false });
                        return;
                    }

                    apple_name = `${fullName.givenName} ${fullName.familyName}`;
                    apple_email = email;

                    params = { name: name, email: email, password: "@fetch@", is_social: 3 };
                }
                else {
                    this.setState({ showLoading: false });
                    return;
                }
            }

            if (Platform.OS == "android")
                params = Object.assign(params, { device_token: device_token });
            else
                params = Object.assign(params, { iphone_device_token: device_token });

            const response = await this.props.api.post("signup", params, true);

            this.setState({ showLoading: false });

            if (response?.success) {
                SetPrefrence(global.PREF_REMEMBER_ME, 0);
                if (!is_apple_exist) {
                    SetPrefrence(global.PREF_APPLE_EMAIL, apple_email);
                    SetPrefrence(global.PREF_APPLE_NAME, apple_name);
                }
                this.props.navigation.navigate("Home");
            }
        } catch (error) {
            this.setState({ showLoading: false });
        }
    }

    signUpWithFacebook = () => {
        try {
            LoginManager.logInWithPermissions(['public_profile', 'email']).then(
                result => {
                    if (result.isCancelled) {
                        console.log("Login cancelled");
                    } else {
                        console.warn(
                            "Login success with permissions: " +
                            JSON.stringify(result)
                        );
                        // Create a graph request asking for user information with a callback to handle the response.
                        const infoRequest = new GraphRequest(
                            '/me?fields=id,first_name,last_name,name,picture.type(large),email,gender',
                            null,
                            this._responseInfoCallback,
                        );
                        // Start the graph request.
                        new GraphRequestManager().addRequest(infoRequest).start();
                        AccessToken.getCurrentAccessToken().then((data) => {
                            console.warn('currentAccessToken', data);
                        })
                    }
                }, error => {
                    console.log('error', error);
                }
            );
        } catch (error) {
        }
    }

    _responseInfoCallback = async (error, result) => {
        if (error) {
            console.log(error);
        } else {
            if (result.email == '' || result.name == '')
                return;

            this.setState({ showLoading: true });

            let params = { name: result.name, email: result.email, password: "@fetch@", is_social: 2 };

            if (Platform.OS == "android")
                params = Object.assign(params, { device_token: this.state.device_token });
            else
                params = Object.assign(params, { iphone_device_token: this.state.device_token });

            const response = await this.props.api.post("signup", params, true);

            this.setState({ showLoading: false });

            if (response?.success) {
                SetPrefrence(global.PREF_REMEMBER_ME, 0);
                this.props.navigation.navigate("Home");
            }
        }
    }

    render = () => {
        const { passwordSec, termAgree, con_passwordSec, showLoading, username, email, password, con_password, is_show_apple_button } = this.state;

        if (showLoading)
            return <Loader />;

        return (
            <View style={{ flex: 1, paddingBottom: 20 }}>
                <View style={{ position: "absolute", top: 0, width: "100%", height: image_height }}>
                    <Image
                        source={Images.sign}
                        style={{ width: "100%", height: image_height + 30 }} placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}></Image>
                </View>
                <View style={{ position: "absolute", width: "100%", height: image_height, top: 0, backgroundColor: BaseColor.blackColor, opacity: 0.3 }}></View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Welcome")} style={{ position: "absolute", top: 20, left: 20 }}>
                    <Icon name={"arrow-left"} size={20} color={BaseColor.whiteColor}></Icon>
                </TouchableOpacity>
                <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: image_height - 20, backgroundColor: BaseColor.whiteColor }}>
                    <View style={{ width: "100%", height: 80, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                        <Image placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} source={Images.logo} style={{ width: 168, height: 60 }} resizeMode={"stretch"}></Image>
                    </View>
                    <ScrollView style={{ flex: 1, marginTop: 30 }}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
                            <View style={{ width: "80%", height: 50 }}>
                                <TextInput
                                    value={username}
                                    onChangeText={(text) => this.setState({ username: text })}
                                    placeholder={"Username*"} placeholderTextColor={BaseColor.whiteColor} style={{ fontSize: 15, paddingHorizontal: 20, color: BaseColor.whiteColor, flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }} />
                            </View>
                            <View style={{ width: "80%", height: 50, marginTop: 20, justifyContent: "center", }}>
                                <TextInput
                                    value={email}
                                    onChangeText={(text) => this.setState({ email: text })}
                                    placeholder={"Email  "} textContentType={"password"} placeholderTextColor={BaseColor.whiteColor} style={{ fontSize: 15, paddingHorizontal: 20, color: BaseColor.whiteColor, flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }} />
                            </View>
                            <View style={{ width: "80%", height: 50, marginTop: 20, justifyContent: "center", }}>
                                <TextInput
                                    value={password}
                                    onChangeText={(text) => this.setState({ password: text })}
                                    placeholder={"Password"} textContentType={"password"} secureTextEntry={passwordSec} placeholderTextColor={BaseColor.whiteColor} style={{ fontSize: 15, paddingLeft: 20, paddingRight: 45, color: BaseColor.whiteColor, flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }} />
                                <TouchableOpacity style={{ position: "absolute", right: 0, padding: 10 }} onPress={() => this.setState({ passwordSec: !passwordSec })}>
                                    <Icon name={passwordSec ? "eye-slash" : "eye"} size={15} color={BaseColor.whiteColor} style={{ flex: 1 }}></Icon>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: "80%", height: 50, marginTop: 20, justifyContent: "center", }}>
                                <TextInput
                                    value={con_password}
                                    onChangeText={(text) => this.setState({ con_password: text })}
                                    placeholder={"Retype Password"} textContentType={"password"} secureTextEntry={con_passwordSec} placeholderTextColor={BaseColor.whiteColor} style={{ fontSize: 15, paddingLeft: 20, paddingRight: 45, color: BaseColor.whiteColor, flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }} />
                                <TouchableOpacity style={{ position: "absolute", right: 0, padding: 10 }} onPress={() => this.setState({ con_passwordSec: !con_passwordSec })}>
                                    <Icon name={con_passwordSec ? "eye-slash" : "eye"} size={15} color={BaseColor.whiteColor} style={{ flex: 1 }}></Icon>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: "80%", height: 30, marginTop: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                {Platform.OS == "android" ?
                                    <CheckBox
                                        onPress={() => this.setState({ termAgree: !termAgree })}
                                        checked={termAgree}
                                        checkedColor={BaseColor.primaryColor}
                                    />
                                    :
                                    <Switch
                                        value={termAgree}
                                        onValueChange={(termAgree) => this.setState({ termAgree: termAgree })}
                                        thumbColor={Platform.OS == "android" ? BaseColor.primaryColor : BaseColor.whiteColor}
                                        trackColor={{ true: BaseColor.primaryColor, false: BaseColor.dddColor }}
                                    />}
                                <Text style={{ marginLeft: 10, textAlign: "left", flex: 1 }}>I agree with the terms & conditions</Text>
                            </View>
                            <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 20 }} onPress={() => this.signUp()}>
                                <View style={{ flex: 1, borderRadius: 7, backgroundColor: BaseColor.whiteColor, borderColor: BaseColor.dddColor, borderWidth: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 15, color: BaseColor.primaryColor }}>SIGN UP</Text>
                                </View>
                            </TouchableOpacity>
                            {is_show_apple_button &&
                                <View style={{ width: "70%", height: 15, flexDirection: "row", marginTop: 5, justifyContent: "center", alignItems: "center" }}>
                                    <View style={{ flex: 1, height: 1, backgroundColor: BaseColor.dddColor }}></View>
                                    <Text style={{ marginHorizontal: 5, fontSize: 12 }}>OR</Text>
                                    <View style={{ flex: 1, height: 1, backgroundColor: BaseColor.dddColor }}></View>
                                </View>}
                            {Platform.OS == "android" ?
                                <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 5 }} onPress={this.signUpWithGoogle}>
                                    <View style={{ flex: 1, borderRadius: 7, backgroundColor: BaseColor.googleColor, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ color: BaseColor.whiteColor, fontSize: 13 }}>Sign Up with</Text>
                                        <Icon name={"google-plus-g"} size={15} color={BaseColor.whiteColor} style={{ position: "absolute", right: 10 }}></Icon>
                                    </View>
                                </TouchableOpacity>
                                :
                                <>
                                    {is_show_apple_button && appleAuth.isSupported && appleAuth.isSignUpButtonSupported &&
                                        <AppleButton
                                            buttonStyle={AppleButton.Style.BLACK}
                                            buttonType={AppleButton.Type.SIGN_UP}
                                            style={{
                                                width: '70%',
                                                height: 40,
                                                shadowColor: '#555',
                                                shadowOpacity: 0.5,
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 3
                                                },
                                                marginTop: 10,
                                            }}
                                            onPress={this.signUpWithApple}
                                        />
                                    }
                                </>
                            }
                            {/* <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 5, }} onPress={this.signUpWithFacebook}>
                                <View style={{ flex: 1, borderRadius: 7, backgroundColor: BaseColor.faceBookColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 13 }}>Sign Up with</Text>
                                    <Icon name={"facebook-f"} size={15} color={BaseColor.whiteColor} style={{ position: "absolute", right: 10 }}></Icon>
                                </View>
                            </TouchableOpacity> */}
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