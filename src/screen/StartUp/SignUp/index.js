import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    ScrollView,
    Platform,
    Switch,
    Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { CheckBox } from 'react-native-elements';
import { Loader } from '@components';
import { Images, BaseColor } from '@config';

import { GoogleSignin } from '@react-native-community/google-signin';
import appleAuth, { AppleButton } from '@invertase/react-native-apple-authentication';
// import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import messaging from '@react-native-firebase/messaging';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';
import * as global from "@api/global";
import * as Utils from '@utils';

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
            webClientId: Utils.GOOGLE_OAUTH_WEB_CLIENT_ID,
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
            })
    }

    getFcmToken = async () => {
        if (!messaging().isDeviceRegisteredForRemoteMessages)
            await messaging().registerDeviceForRemoteMessages();
        const device_token = await messaging().getToken();
        console.log('fcmToken', device_token)
        this.setState({ device_token });
    }

    signUp = async () => {
        const { username, email, password, con_password, termAgree, device_token } = this.state;
        if (username == '') return global.showToastMessage("Please input user name.");
        else if (!Utils.isValidEmail(email)) return global.showToastMessage("Please input valid email.");
        else if (password == '') return global.showToastMessage("Please input password.");
        else if (password != con_password) return global.showToastMessage("Password don't match.");

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
            this.props.navigation.navigate("Main");
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
                this.props.navigation.navigate("Main");
            }

        } catch (error) {
            console.log(error)
            this.setState({ showLoading: false });
            global.showToastMessage(error);
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

                    params = { name: apple_name, email: apple_email, password: "@fetch@", is_social: 3 };
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
                this.props.navigation.navigate("Main");
            }
        } catch (error) {
            global.showToastMessage(error);
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
                this.props.navigation.navigate("Main");
            }
        }
    }

    openTerms = () => {
        try {
            Linking.openURL(`${Api.SERVER_HOST}/terms-conditions-service`);
        } catch (error) {
        }
    }

    render = () => {
        const { passwordSec, termAgree, con_passwordSec, showLoading, username, email, password, con_password, is_show_apple_button } = this.state;

        if (showLoading)
            return <Loader />;

        return (
            <View style={{ flex: 1, paddingBottom: 20, paddingTop: 80, backgroundColor: BaseColor.whiteColor }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Welcome")} style={{ position: "absolute", top: 20, left: 20 }}>
                    <Icon name={"arrow-left"} size={25} color={BaseColor.primaryColor}></Icon>
                </TouchableOpacity>
                <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: BaseColor.whiteColor }}>
                    <View style={{ width: "100%", height: 80, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                        <Image placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} source={Images.logo} style={{ width: 168, height: 70 }} resizeMode={"stretch"}></Image>
                    </View>
                    <ScrollView keyboardShouldPersistTaps='always' style={{ flex: 1, marginTop: 30 }}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
                            <View style={{ width: "80%", height: 50 }}>
                                <TextInput
                                    value={username}
                                    onChangeText={(text) => this.setState({ username: text })}
                                    placeholder={"Name"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, paddingHorizontal: 20, color: BaseColor.blackColor, flex: 1, borderRadius: 100, backgroundColor: BaseColor.placeholderColor, justifyContent: "center", alignItems: "center" }} />
                            </View>
                            <View style={{ width: "80%", height: 50, marginTop: 10, justifyContent: "center", }}>
                                <TextInput
                                    value={email}
                                    onChangeText={(text) => this.setState({ email: text.toLowerCase() })}
                                    placeholder={"Email"} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, paddingHorizontal: 20, color: BaseColor.blackColor, flex: 1, borderRadius: 100, backgroundColor: BaseColor.placeholderColor, justifyContent: "center", alignItems: "center" }} />
                            </View>
                            <View style={{ width: "80%", height: 50, marginTop: 10, justifyContent: "center", }}>
                                <TextInput
                                    value={password}
                                    onChangeText={(text) => this.setState({ password: text })}
                                    placeholder={"Password"} textContentType={"password"} secureTextEntry={passwordSec} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, paddingLeft: 20, paddingRight: 45, color: BaseColor.blackColor, flex: 1, borderRadius: 100, backgroundColor: BaseColor.placeholderColor, justifyContent: "center", alignItems: "center" }} />
                                <TouchableOpacity style={{ position: "absolute", right: 0, padding: 10 }} onPress={() => this.setState({ passwordSec: !passwordSec })}>
                                    <Icon name={passwordSec ? "eye-slash" : "eye"} size={15} color={BaseColor.primaryColor} style={{ flex: 1 }}></Icon>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: "80%", height: 50, marginTop: 10, justifyContent: "center", }}>
                                <TextInput
                                    value={con_password}
                                    onChangeText={(text) => this.setState({ con_password: text })}
                                    placeholder={"Re-Type Password"} textContentType={"password"} secureTextEntry={con_passwordSec} placeholderTextColor={BaseColor.greyColor} style={{ fontSize: 15, paddingLeft: 20, paddingRight: 45, color: BaseColor.blackColor, flex: 1, borderRadius: 100, backgroundColor: BaseColor.placeholderColor, justifyContent: "center", alignItems: "center" }} />
                                <TouchableOpacity style={{ position: "absolute", right: 0, padding: 10 }} onPress={() => this.setState({ con_passwordSec: !con_passwordSec })}>
                                    <Icon name={con_passwordSec ? "eye-slash" : "eye"} size={15} color={BaseColor.primaryColor} style={{ flex: 1 }}></Icon>
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
                                <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", height: "100%" }} onPress={this.openTerms}>
                                    <Text>I agree with the terms & conditions</Text>
                                </TouchableOpacity>
                                <View style={{ flex: 1 }} />
                            </View>
                            <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 20 }} onPress={() => this.signUp()}>
                                <View style={{ flex: 1, borderRadius: 100, borderColor: BaseColor.primaryColor, borderWidth: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.primaryColor }}>SIGN UP</Text>
                                </View>
                            </TouchableOpacity>
                            {Platform.OS == "android" &&
                                <View style={{ width: "70%", height: 15, flexDirection: "row", marginTop: 5, justifyContent: "center", alignItems: "center" }}>
                                    <View style={{ flex: 1, height: 1, backgroundColor: BaseColor.greyColor }}></View>
                                    <Text style={{ marginHorizontal: 5, fontSize: 12 }}>OR</Text>
                                    <View style={{ flex: 1, height: 1, backgroundColor: BaseColor.greyColor }}></View>
                                </View>}
                            {Platform.OS == "android" ?
                                <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 5 }} onPress={this.signUpWithGoogle}>
                                    <View style={{ flex: 1, borderRadius: 100, backgroundColor: BaseColor.googleColor, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <Image source={Images.google_plus} style={{ width: 15, height: 15 }}></Image>
                                        <Text style={{ color: BaseColor.whiteColor, fontSize: 13, marginLeft: 20 }}>Sign Up with</Text>
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
                                                marginTop: 5,
                                            }}
                                            onPress={this.signUpWithApple}
                                        />
                                    }
                                </>
                            }
                            {/* <TouchableOpacity style={{ width: "70%", height: 40, marginTop: 10, }} onPress={this.signUpWithFacebook}>
                                <View style={{ flex: 1, borderRadius: 100, backgroundColor: BaseColor.faceBookColor, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Icon name={"facebook-f"} size={15} color={BaseColor.whiteColor}></Icon>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 13, marginLeft: 20 }}>Sign Up with</Text>
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