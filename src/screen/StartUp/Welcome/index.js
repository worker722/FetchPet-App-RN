import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import { Images, BaseColor } from '@config';
import { Loader } from '@components';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as global from '@api/global';

class Welcome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoading: false
        }
    }

    guestApp = async () => {
        this.setState({ showLoading: true });

        const params = { guest: true };
        const response = await this.props.api.post("login", params, true);

        this.setState({ showLoading: false });

        if (response?.success) {
            this.props.setStore(global.PUSH_ALERT, { notification: { title: "Welcome Guest!" } });
            this.props.setStore(global.PUSH_ALERT_TYPE, 'info');
            this.props.setStore(global.IS_BUYER_MODE);

            this.props.navigation.navigate("Main");
        }
    }

    render = () => {
        const { showLoading } = this.state;

        if (showLoading)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor, justifyContent: "center", alignItems: "center" }}>
                <Image placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} source={Images.logo} style={{ width: 210, height: 70 }} resizeMode={"stretch"}></Image>
                <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 80 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")} style={{ width: "80%", height: 50 }}>
                        <View style={{ flex: 1, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: BaseColor.dddColor }}>
                            <Text style={{ color: BaseColor.whiteColor, fontSize: 15, fontWeight: "bold" }}>LOGIN</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("SignUp")} style={{ width: "80%", height: 50, marginTop: 15 }}>
                        <View style={{ flex: 1, borderRadius: 100, backgroundColor: BaseColor.whiteColor, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: BaseColor.dddColor }}>
                            <Text style={{ color: BaseColor.primaryColor, fontSize: 15, fontWeight: "bold" }}>SIGN UP</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: "70%", height: 15, flexDirection: "row", marginTop: 20, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: BaseColor.greyColor }}></View>
                        <Text style={{ marginHorizontal: 5, fontSize: 12 }}>OR</Text>
                        <View style={{ flex: 1, height: 1, backgroundColor: BaseColor.greyColor }}></View>
                    </View>
                    <TouchableOpacity onPress={this.guestApp} style={{ width: "80%", height: 50, marginTop: 15 }}>
                        <View style={{ flex: 1, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: BaseColor.dddColor }}>
                            <Text style={{ color: BaseColor.whiteColor, fontSize: 15, fontWeight: "bold" }}>Visit as Guest</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
export default connect(null, mapDispatchToProps)(Welcome);