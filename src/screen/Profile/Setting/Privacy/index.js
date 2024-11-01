import React, { Component } from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Header, LinkItem, Loader } from '@components';
import Styles from './style';
import { BaseColor } from '@config';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store } from "@store";
import * as Api from '@api';
import * as global from "@api/global";

class Privacy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_showPhonenumber: true,
            visiblePasswordModal: false,
            showLoader: false,

            currentPwd: '',
            newPwd: '',
            reNewPwd: ''
        }
    }

    UNSAFE_componentWillMount = async () => {
        const user_meta = store.getState().auth.login?.user?.meta;
        let is_showPhonenumber = false;
        user_meta?.forEach((item, key) => {
            if (item.meta_key == global._SHOW_PHONE_ON_ADS)
                is_showPhonenumber = item.meta_value == 1 ? true : false;
        });
        this.setState({ is_showPhonenumber });
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    setPhonenumberStatus = async () => {
        const params = { key: global._SHOW_PHONE_ON_ADS, value: this.state.is_showPhonenumber ? 0 : 1 };
        this.setState({ is_showPhonenumber: !this.state.is_showPhonenumber });
        await this.props.api.post("profile/setting", params, true);
    }

    showPasswordModal = () => {
        this.setState({ visiblePasswordModal: true });
    }

    changePassword = async () => {
        const { currentPwd, newPwd, reNewPwd } = this.state;
        if (currentPwd == '') return global.showToastMessage("Please input old password.");
        if (newPwd == '') return global.showToastMessage("Please new password.");
        if (newPwd != reNewPwd) return global.showToastMessage("New Password don't match.");

        this.setState({ showLoader: true });
        const params = { currentPwd: currentPwd, password: reNewPwd };
        const response = await this.props.api.post("changepassword", params);
        this.setState({ showLoader: false });
        if (response?.success) {
            this.setState({ visiblePasswordModal: false, currentPwd: '', newPwd: '', reNewPwd: '' })
        }
    }

    render = () => {
        const { is_showPhonenumber, visiblePasswordModal, showLoader, currentPwd, newPwd, reNewPwd } = this.state;
        const is_social = store.getState().auth.login?.user?.is_social;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: BaseColor.whiteColor }}>
                <Header icon_left={"arrow-left"} callback_left={this.goBack} title={"Privacy"} />

                <LinkItem title={"Show my phone number in ads"} subtitle={""} icon_right={"angle-right"} action={this.setPhonenumberStatus} is_switch={true} switch_val={is_showPhonenumber} />
                {is_social == 0 &&
                    <LinkItem title={"Change password"} subtitle={""} icon_right={"angle-right"} action={this.showPasswordModal} />
                }

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={visiblePasswordModal}>
                    <View style={Styles.modalContainer}>
                        <View style={Styles.modalContentContainer}>
                            <Text style={{ fontSize: 20, marginBottom: 20 }}>Change passwrod</Text>
                            <TextInput value={currentPwd} secureTextEntry={true} placeholder={"Old password"} style={Styles.textinput} onChangeText={(text) => this.setState({ currentPwd: text })} />
                            <TextInput value={newPwd} secureTextEntry={true} placeholder={"New password"} style={Styles.textinput} onChangeText={(text) => this.setState({ newPwd: text })} />
                            <TextInput value={reNewPwd} secureTextEntry={true} placeholder={"Re-type new password"} style={Styles.textinput} onChangeText={(text) => this.setState({ reNewPwd: text })} />
                            <View style={{ flexDirection: "row", marginTop: 20 }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ visiblePasswordModal: false, currentPwd: '', newPwd: '', reNewPwd: '' })}
                                    style={{ flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: BaseColor.dddColor, backgroundColor: BaseColor.whiteColor, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.primaryColor }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.changePassword}
                                    style={{ flex: 1, paddingVertical: 10, marginLeft: 10, backgroundColor: BaseColor.primaryColor, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor }}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(Privacy);