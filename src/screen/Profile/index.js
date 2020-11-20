import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { BaseColor } from '@config';
import { Header, LinkItem, Loader } from '@components';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            showLoader: false
        }
    }

    componentWillMount = async () => {
        this.setState({ showLoader: true });
        const param = { user_id: this.props.navigation.state.params.user_id };
        const response = await this.props.api.post('profile', param);
        this.setState({ showLoader: false });
        if (response.success) {
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
                <TouchableOpacity onPress={() => navigation.navigate("ProfileEdit")} style={{ flexDirection: "row", width: "100%", justifyContent: "center", marginTop: 10 }}>
                    <Avatar
                        size='large'
                        rounded
                        source={{ uri: Api.SERVER_HOST + user?.avatar }}
                        activeOpacity={0.7}
                        placeholderStyle={{ backgroundColor: "transparent" }}
                        containerStyle={{ marginHorizontal: 10, borderWidth: 1, borderColor: "#808080", width: 80, height: 80, borderRadius: 100 }}>
                    </Avatar>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
                        <Text style={{ color: "#808080" }}>View & edit Profile</Text>
                    </View>
                </TouchableOpacity>

                <LinkItem title={"Setting"} subtitle={"Privacy & Logout"} icon_left={"cog"} icon_right={"angle-right"} action={this.goSetting} is_showLine={true} />
                <LinkItem title={"Others"} subtitle={"Billing & Invoices"} icon_left={"money-bill"} icon_right={"angle-right"} action={this.goOthers} is_showLine={true} />
                <LinkItem title={"Help & Support"} subtitle={"Help center and legal terms"} icon_left={"cog"} icon_right={"angle-right"} action={this.goHelp} is_showLine={true} />
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