import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Switch,
    TextInput,
    ScrollView,
    Platform,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { GoogleSignin } from '@react-native-community/google-signin';
import appleAuth, { AppleButton } from '@invertase/react-native-apple-authentication';
// import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import messaging from '@react-native-firebase/messaging';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SetPrefrence, GetPrefrence } from "@store";
import * as global from "@api/global";
import * as Api from '@api';
import { Loader } from '@components';
import { Images, BaseColor } from '@config';
import * as Utils from '@utils';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rememberMe: false,
            passwordSecure: true,
            email: '',
            password: '',
            showLoading: false,
            device_token: '',
            is_show_apple_button: false,
        }
    }

    UNSAFE_componentWillMount = async () => {
        GoogleSignin.configure({
            webClientId: Utils.GOOGLE_AUTH_WEB_CLIENT_ID,
            offlineAccess: true
        });

        let is_show_apple_button = await GetPrefrence(global.PREF_SHOW_APPLE_BUTTON);
        if (is_show_apple_button == 1)
            this.setState({ is_show_apple_button: true });
    }

    componentDidMount = async () => {
        await messaging().hasPermission()
            .then(async enabled => {
                if (enabled) {
                    this.getFcmToken();
                }
                else {
                    await messaging().requestPermission()
                        .then(async () => {
                            this.getFcmToken();
                        })
                        .catch(error => {
                        });
                }
            }).catch(error => {
                console.log(error)
            })
    }

    getFcmToken = async () => {
        if (!messaging().isDeviceRegisteredForRemoteMessages)
            await messaging().registerDeviceForRemoteMessages();
        const device_token = await messaging().getToken();
        console.log('fcmToken', device_token)
        this.setState({ device_token });
    }

    toggleRememberMe = async (value) => {
        this.setState({ rememberMe: value });
    }

    login = async () => {
        const { email, password, rememberMe, device_token } = this.state;
        if (!Utils.isValidEmail(email) || password == '') {
            global.showToastMessage("Invalid email or password.");
            return;
        }

        this.setState({ showLoading: true });

        let params = { email: email, password: password };

        if (Platform.OS == "android")
            params = Object.assign(params, { device_token: device_token });
        else
            params = Object.assign(params, { iphone_device_token: device_token });

        const response = await this.props.api.post("login", params, true);

        this.setState({ showLoading: false });

        if (response?.success) {
            SetPrefrence(global.PREF_REMEMBER_ME, rememberMe ? 1 : 0);
            this.props.navigation.navigate("Main");
        }
    }

    loginWithGoogle = async () => {
        try {
            const { rememberMe, device_token } = this.state;

            this.setState({ showLoading: true });

            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            let params = { email: userInfo.user.email, password: "@fetch@", is_social: 1 };

            if (Platform.OS == "android")
                params = Object.assign(params, { device_token: device_token });
            else
                params = Object.assign(params, { iphone_device_token: device_token });

            const response = await this.props.api.post("login", params, true);

            this.setState({ showLoading: false });

            if (response?.success) {
                SetPrefrence(global.PREF_REMEMBER_ME, rememberMe ? 1 : 0);
                this.props.navigation.navigate("Main");
            }
        } catch (error) {
            console.log(error)
            this.setState({ showLoading: false });
            global.showToastMessage(error);
        }
    }

    loginWithApple = async () => {
        try {
            const { rememberMe, device_token } = this.state;

            this.setState({ showLoading: true });

            let params = null;
            let is_apple_exist = false;
            let apple_name = '';
            let apple_email = '';

            const name = await GetPrefrence(global.PREF_APPLE_NAME);
            const email = await GetPrefrence(global.PREF_APPLE_EMAIL);
            if (name && email) {
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
                        global.showToastMessage("Please share your email.");
                        this.setState({ showLoading: false });
                        return;
                    }

                    apple_name = `${fullName.givenName} ${fullName.familyName}`;
                    apple_email = email;

                    params = { email: email, password: "@fetch@", is_social: 3 };
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

            const response = await this.props.api.post("login", params, true);

            this.setState({ showLoading: false });

            if (response?.success) {
                SetPrefrence(global.PREF_REMEMBER_ME, rememberMe ? 1 : 0);
                if (!is_apple_exist) {
                    SetPrefrence(global.PREF_APPLE_EMAIL, apple_email);
                    SetPrefrence(global.PREF_APPLE_NAME, apple_name);
                }
                this.props.navigation.navigate("Main");
            }
        } catch (error) {
            console.log(error);
            this.setState({ showLoading: false });
        }
    }

    loginWithFacebook = async () => {
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
    }

    _responseInfoCallback = async (error, result) => {
        const { rememberMe, device_token } = this.state;
        if (error) {
            console.log(error);
        } else {
            if (result.email == '' || result.name == '')
                return;

            this.setState({ showLoading: true });

            let params = { email: result.email, password: "@fetch@", is_social: 2 };

            if (Platform.OS == "android")
                params = Object.assign(params, { device_token: device_token });
            else
                params = Object.assign(params, { iphone_device_token: device_token });

            const response = await this.props.api.post("login", params, true);

            this.setState({ showLoading: false });

            if (response?.success) {
                SetPrefrence(global.PREF_REMEMBER_ME, rememberMe ? 1 : 0);
                this.props.navigation.navigate("Main");
            }
        }
    }

    render = () => {
        const navigation = this.props.navigation;
        const { showLoading, rememberMe, passwordSecure, email, password, is_show_apple_button } = this.state;

        if (showLoading)
            return <Loader />;

        return (
            <View style={{ flex: 1, paddingBottom: 20, paddingTop: 80, backgroundColor: BaseColor.whiteColor }}>
                <TouchableOpacity onPress={() => navigation.navigate("Welcome")} style={{ position: "absolute", top: 20, left: 20 }}>
                    <Icon name={"arrow-left"} size={25} color={BaseColor.primaryColor}></Icon>
                </TouchableOpacity>
                <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: BaseColor.whiteColor }}>
                    <View style={{ width: "100%", height: 80, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                        <Image placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} source={Images.logo} style={{ width: 168, height: 70 }} resizeMode={"stretch"}></Image>
                    </View>
                    <ScrollView keyboardShouldPersistTaps='always' style={{ flex: 1, marginTop: 30 }}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
                            <View style={{ width: "80%", height: 50 }}>
                                <TextInput value={email} onChangeText={(text) => this.setState({ email: text.toLowerCase() })} placeholder={"Email"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, paddingHorizontal: 20, color: BaseColor.blackColor, flex: 1, borderRadius: 100, backgroundColor: BaseColor.placeholderColor, justifyContent: "center", alignItems: "center" }}>
                                </TextInput>
                            </View>
                            <View style={{ width: "80%", height: 50, marginTop: 20, justifyContent: "center", }}>
                                <TextInput value={password} onChangeText={(text) => this.setState({ password: text })} placeholder={"Password"} textContentType={"password"} secureTextEntry={passwordSecure} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, paddingHorizontal: 20, color: BaseColor.blackColor, flex: 1, borderRadius: 10, backgroundColor: BaseColor.placeholderColor, justifyContent: "center", alignItems: "center" }}>
                                </TextInput>
                                <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => passwordSecure ? this.setState({ passwordSecure: false }) : this.setState({ passwordSecure: true })}>
                                    <Icon name={passwordSecure ? "eye-slash" : "eye"} size={15} color={BaseColor.primaryColor} style={{ flex: 1 }}></Icon>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: "80%", height: 30, marginTop: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Switch
                                    value={rememberMe}
                                    onValueChange={(value) => this.toggleRememberMe(value)}
                                    thumbColor={Platform.OS == "android" ? BaseColor.dddColor : BaseColor.whiteColor}
                                    trackColor={{ true: BaseColor.primaryColor, false: BaseColor.placeholderColor }}
                                />
                                <Text style={{ marginLeft: 10, textAlign: "left", flex: 1 }}>Remember Me</Text>
                            </View>
                            <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 20 }} onPress={() => this.login()}>
                                <View style={{ flex: 1, borderRadius: 100, borderColor: BaseColor.primaryColor, borderWidth: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.primaryColor, fontSize: 14 }}>LOGIN</Text>
                                </View>
                            </TouchableOpacity>
                            {Platform.OS == "android" &&
                                <View style={{ width: "70%", height: 15, flexDirection: "row", marginTop: 5, justifyContent: "center", alignItems: "center" }}>
                                    <View style={{ flex: 1, height: 1, backgroundColor: BaseColor.greyColor }}></View>
                                    <Text style={{ marginHorizontal: 5, fontSize: 12 }}>OR</Text>
                                    <View style={{ flex: 1, height: 1, backgroundColor: BaseColor.greyColor }}></View>
                                </View>
                            }
                            {Platform.OS == "android" ?
                                <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 5 }} onPress={() => this.loginWithGoogle()}>
                                    <View style={{ flex: 1, borderRadius: 100, backgroundColor: BaseColor.googleColor, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <Image source={Images.google_plus} style={{ width: 15, height: 15 }}></Image>
                                        <Text style={{ color: BaseColor.whiteColor, fontSize: 13, marginLeft: 20 }}>Login with</Text>
                                    </View>
                                </TouchableOpacity>
                                :
                                <>
                                    {is_show_apple_button && appleAuth.isSupported && appleAuth.isSignUpButtonSupported &&
                                        <AppleButton
                                            buttonStyle={AppleButton.Style.BLACK}
                                            buttonType={AppleButton.Type.SIGN_IN}
                                            style={{
                                                width: '70%',
                                                height: 40,
                                                borderRadius: 100,
                                                shadowColor: '#555',
                                                shadowOpacity: 0.5,
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 3
                                                },
                                                marginTop: 5,
                                            }}
                                            onPress={this.loginWithApple}
                                        />
                                    }
                                </>
                            }
                            {/* <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 10, }} onPress={this.loginWithFacebook}>
                                <View style={{ flex: 1, borderRadius: 100, backgroundColor: BaseColor.faceBookColor, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Icon name={"facebook-f"} size={15} color={BaseColor.whiteColor}></Icon>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 13, marginLeft: 20 }}>Login with</Text>
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
export default connect(null, mapDispatchToProps)(Login);