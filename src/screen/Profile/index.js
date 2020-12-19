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

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store } from "@store";
import * as Api from '@api';

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
        this.setState({ showLoader: false });
        if (response?.success) {
            this.setState({ user: response.data.user });
        }
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

    render = () => {
        const navigation = this.props.navigation;
        const { user, showLoader } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Header navigation={navigation} mainHeader={true} />
                <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "bold", paddingLeft: 10 }}>Profile</Text>
                <TouchableOpacity onPress={() => navigation.navigate("ProfileEdit")} style={{ flexDirection: "row", width: "100%", marginBottom: 15, justifyContent: "center", marginTop: 10 }}>
                    {user?.avatar ?
                        <Image
                            source={{ uri: Api.SERVER_HOST + user?.avatar }}
                            activeOpacity={0.7}
                            PlaceholderStyle={{ backgroundColor: "white" }}
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
                        <Text style={{ color: "#808080" }}>View & edit Profile</Text>
                    </View>
                </TouchableOpacity>

                <LinkItem title={"Setting"} subtitle={"Privacy & Logout"} icon_left={"cog"} icon_right={"angle-right"} action={this.goSetting} />
                <LinkItem title={"Help & Support"} subtitle={"Help center and legal terms"} icon_left={"cog"} icon_right={"angle-right"} action={this.goHelp} />
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(Profile);