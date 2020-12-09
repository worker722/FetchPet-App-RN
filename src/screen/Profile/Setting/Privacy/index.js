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
import Toast from 'react-native-simple-toast';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';

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

    goBack = () => {
        this.props.navigation.goBack(null);
    }

    setPhonenumberStatus = () => {
        this.setState({
            is_showPhonenumber: !this.state.is_showPhonenumber
        })
    }

    showPasswordModal = () => {
        this.setState({ visiblePasswordModal: true });
    }

    changePassword = async () => {
        const { currentPwd, newPwd, reNewPwd } = this.state;
        if (currentPwd == '') return Toast.show("Please input old password.");
        if (newPwd == '') return Toast.show("Please new password.");
        if (newPwd != reNewPwd) return Toast.show("New Password don't match.");

        this.setState({ showLoader: true });
        const params = { currentPwd: currentPwd, password: reNewPwd };
        const response = await this.props.api.post("changepassword", params);
        console.log(response);
        this.setState({ showLoader: false });
        if (response?.success) {
            this.setState({ visiblePasswordModal: false, currentPwd: '', newPwd: '', reNewPwd: '' })
        }
    }

    render = () => {
        const { is_showPhonenumber, visiblePasswordModal, showLoader, currentPwd, newPwd, reNewPwd } = this.state;
        const is_social = store.getState().auth.login.user.is_social;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
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
                            <TextInput value={currentPwd} placeholder={"Old password"} style={Styles.textinput} onChangeText={(text) => this.setState({ currentPwd: text })} />
                            <TextInput value={newPwd} placeholder={"New password"} style={Styles.textinput} onChangeText={(text) => this.setState({ newPwd: text })} />
                            <TextInput value={reNewPwd} placeholder={"Re-type new password"} style={Styles.textinput} onChangeText={(text) => this.setState({ reNewPwd: text })} />
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