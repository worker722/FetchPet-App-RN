import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config';
import { Header, LinkItem, Loader } from '@components';

import RNRestart from 'react-native-restart';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence } from "@store";
import * as Api from '@api';
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
        const param = { user_id: store.getState().auth.login.user.id };
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
        RNRestart.Restart();
    }

    editProfile = () => {
        const is_social = store.getState().auth.login.user.is_social;
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
        const is_social = store.getState().auth.login.user.is_social;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: BaseColor.whiteColor }}>
                <Header navigation={navigation} mainHeader={true} />
                <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "bold", paddingLeft: 10 }}>Profile</Text>
                <TouchableOpacity onPress={this.editProfile} style={{ flexDirection: "row", width: "100%", marginBottom: 15, justifyContent: "center", marginTop: 10 }}>
                    {user?.avatar ?
                        <Image
                            source={{ uri: Api.SERVER_HOST + user?.avatar }}
                            activeOpacity={0.7}
                            placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                            PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                            style={{ marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.dddColor, width: 80, height: 80, borderRadius: 100 }}>
                        </Image>
                        :
                        <View style={{ marginHorizontal: 10, width: 80, height: 80, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: BaseColor.whiteColor, fontSize: 30 }}>{user?.name?.charAt(0).toUpperCase()}</Text>
                        </View>
                    }
                    <View style={{ justifyContent: "center", flex: 1, paddingLeft: 10 }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
                        <Text style={{ color: BaseColor.greyColor }}>View & Edit Profile</Text>
                    </View>
                </TouchableOpacity>

                {is_social == -1 ?
                    <LinkItem title={"Logout"} subtitle={""} icon_left={"sign-out-alt"} icon_right={"angle-right"} action={this.logOut} />
                    :
                    <LinkItem title={"Setting"} subtitle={"Privacy & Logout"} icon_left={"cog"} icon_right={"angle-right"} action={this.goSetting} />
                }
                <LinkItem title={"Help & Support"} subtitle={"Help center and legal terms"} icon_left={"info"} icon_right={"angle-right"} action={this.goHelp} />
                <LinkItem title={"Switch as Buyer"} subtitle={""} icon_left={"info"} icon_right={"angle-right"} action={this.switchUserMode} />
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