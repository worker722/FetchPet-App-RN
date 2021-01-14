import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config';
import { Header, LinkItem, Loader } from '@components';

import RNRestart from 'react-native-restart';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence } from "@store";
import * as Api from '@api';
import * as Utils from '@utils';
import * as global from '@api/global';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            showLoader: false
        }

        props.navigation.addListener("willFocus", (event) => {
            this.UNSAFE_componentWillMount();
        });
    }

    UNSAFE_componentWillMount = async () => {
        this.setState({ showLoader: true });
        const param = { user_id: store.getState().auth.login?.user?.id };
        const response = await this.props.api.post('profile', param);
        if (response?.success) {
            this.setState({ user: response.data.user });
        }
        this.setState({ showLoader: false });
    }

    goSetting = () => {
        this.props.navigation.navigate("Setting");
    }

    goOthers = () => {
        this.props.navigation.navigate("Other");
    }

    goHelp = () => {
        this.props.navigation.navigate("Help");
    }

    switchUserMode = () => {
        this.props.setStore(global.IS_BUYER_MODE, null);
        // setTimeout(() => {
        //     RNRestart.Restart();
        // }, 1000);
    }

    editProfile = () => {
        const is_social = store.getState().auth.login?.user?.is_social;
        if (is_social != -1) {
            this.props.navigation.navigate("ProfileEdit");
        }
    }

    logOut = async () => {
        await SetPrefrence(global.PREF_REMEMBER_ME, 0);
        this.props.setStore(global.LOGIN, null);
        this.props.navigation.navigate('Welcome');
    }

    render = () => {
        const navigation = this.props.navigation;
        const { user, showLoader } = this.state;
        const is_social = store.getState().auth.login?.user?.is_social;
        const IS_BUYER_MODE = store.getState().app;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: BaseColor.whiteColor }}>
                <Header navigation={navigation} mainHeader={true} />
                <ScrollView>
                    <View style={{ marginTop: 10, marginLeft: 15, paddingRight: 20, justifyContent: "center", alignItems: "center" }}>
                        {user?.avatar ?
                            <Image
                                source={{ uri: Api.SERVER_HOST + user?.avatar }}
                                activeOpacity={0.7}
                                placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                                PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                                containerStyle={{ marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.greyColor, width: 90, height: 90, borderRadius: 100 }}>
                            </Image>
                            :
                            <View style={{ marginHorizontal: 10, width: 90, height: 90, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 30 }}>{user?.name?.charAt(0).toUpperCase()}</Text>
                            </View>
                        }
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: 10, marginTop: 10 }}>
                        <Text style={{ fontSize: 22, color: BaseColor.primaryColor }}>{user?.name}</Text>
                        <Text style={{ fontSize: 13 }}>Member since {Utils.DATE2STR(user?.created_at, 'MMM YYYY')}</Text>
                        <TouchableOpacity onPress={this.editProfile} style={{ marginTop: 10, justifyContent: "center", alignItems: "center", borderColor: BaseColor.dddColor, backgroundColor: BaseColor.whiteColor, borderWidth: 1, borderRadius: 5, paddingVertical: 8, paddingHorizontal: 45 }}>
                            <Text style={{ color: BaseColor.primaryColor }}>Edit Info</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10, marginBottom: 40, borderRadius: 10, borderColor: BaseColor.dddColor, borderWidth: 1, justifyContent: "center", alignItems: "center", paddingVertical: 30 }}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 20 }}>{user?.follower.length}</Text>
                            <Text>Followers</Text>
                        </View>
                        <View style={{ backgroundColor: BaseColor.dddColor, marginHorizontal: 10, width: 1, height: "100%" }}></View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 20 }}>{user?.review.length}</Text>
                            <Text>Reviews</Text>
                        </View>
                        <View style={{ backgroundColor: BaseColor.dddColor, marginHorizontal: 10, width: 1, height: "100%" }}></View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 20 }}>{user?.ads.length}</Text>
                            <Text>Total ads</Text>
                        </View>
                        <View style={{ position: "absolute", bottom: -20, justifyContent: "center", alignItems: "center", padding: 2, borderWidth: 1, borderColor: BaseColor.primaryColor, borderRadius: 100 }}>
                            <TouchableOpacity onPress={this.switchUserMode} style={{ borderRadius: 100, paddingVertical: 8, paddingHorizontal: 25, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: BaseColor.whiteColor }}>{IS_BUYER_MODE ? "Switch as a Seller" : "Switch as a Buyer"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {is_social == -1 ?
                        <LinkItem title={"Logout"} subtitle={""} icon_left={"sign-out-alt"} icon_right={"angle-right"} action={this.logOut} />
                        :
                        <LinkItem title={"Setting"} subtitle={"Privacy & Logout"} icon_left={"cog"} icon_right={"angle-right"} action={this.goSetting} />
                    }
                    <LinkItem title={"Help & Support"} subtitle={"Help center and legal terms"} icon_left={"info"} icon_right={"angle-right"} action={this.goHelp} />
                </ScrollView>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch),
        setStore: (type, data) => dispatch({ type, data })
    };
};
export default connect(null, mapDispatchToProps)(Profile);