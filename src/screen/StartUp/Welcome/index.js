import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import { Images, BaseColor } from '@config';
import { Loader } from '@components';
import * as Utils from '@utils';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';

const image_height = Utils.SCREEN.HEIGHT / 4;

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
            this.props.navigation.navigate("Home");
        }
    }

    render = () => {
        const { showLoading } = this.state;

        if (showLoading)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <View style={{ position: "absolute", top: 0, width: "100%", height: image_height }}>
                    <Image
                        source={Images.welcome}
                        style={{ width: "100%", height: image_height + 30 }} placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}></Image>
                </View>
                <View style={{ position: "absolute", width: "100%", height: image_height, top: 0, backgroundColor: BaseColor.blackColor, opacity: 0.3 }}></View>
                <View style={{ position: "absolute", top: 0, width: "100%", height: image_height - 30, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 30, color: BaseColor.whiteColor, fontWeight: "bold" }}>Welcome!</Text>
                </View>
                <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: image_height - 20, backgroundColor: BaseColor.whiteColor }}>
                    <View style={{ width: "100%", height: 80, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                        <Image placeholderStyle={{ backgroundColor: BaseColor.whiteColor }} source={Images.logo} style={{ width: 168, height: 60 }} resizeMode={"stretch"}></Image>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 80 }}>
                        <TouchableOpacity onPress={this.guestApp} style={{ width: "80%", height: 50 }}>
                            <View style={{ flex: 1, borderRadius: 10, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: BaseColor.dddColor }}>
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 15, fontWeight: "bold" }}>GUEST</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")} style={{ width: "80%", height: 50, marginTop: 10 }}>
                            <View style={{ flex: 1, borderRadius: 10, backgroundColor: BaseColor.whiteColor, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: BaseColor.dddColor }}>
                                <Text style={{ color: BaseColor.primaryColor, fontSize: 15, fontWeight: "bold" }}>LOGIN</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("SignUp")} style={{ width: "80%", height: 50, marginTop: 10 }}>
                            <View style={{ flex: 1, borderRadius: 10, backgroundColor: BaseColor.whiteColor, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: BaseColor.dddColor }}>
                                <Text style={{ color: BaseColor.primaryColor, fontSize: 15, fontWeight: "bold" }}>SIGN UP</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
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
export default connect(null, mapDispatchToProps)(Welcome);