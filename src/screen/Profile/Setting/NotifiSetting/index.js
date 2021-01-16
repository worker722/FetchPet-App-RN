import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import { Header, LinkItem, Loader } from '@components';
import { BaseColor } from '@config';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store } from "@store";
import * as Api from '@api';
import * as global from "@api/global";

class NotifiSetting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_showNotificaton: true,
            is_showAdsNotificaton: true,
        }
    }

    UNSAFE_componentWillMount = async () => {
        const user_meta = store.getState().auth.login?.user?.meta;
        let is_showNotificaton = true;
        let is_showAdsNotificaton = true;
        user_meta?.forEach((item, key) => {
            if (item.meta_key == global._SHOW_NOTIFICATION)
                is_showNotificaton = item.meta_value == 1 ? true : false;
            else if (item.meta_key == global._SHOW_ADS_NOTIFICATION)
                is_showAdsNotificaton = item.meta_value == 1 ? true : false;
        });
        this.setState({ is_showNotificaton, is_showAdsNotificaton });
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    setNotificationStatus = async (type) => {
        const { is_showNotificaton, is_showAdsNotificaton } = this.state;
        let params = null;
        if (type == 0) {
            params = { key: global._SHOW_NOTIFICATION, value: is_showNotificaton ? 0 : 1 };
            this.setState({ is_showNotificaton: !is_showNotificaton });
        }
        else if (type == 1) {
            params = { key: global._SHOW_ADS_NOTIFICATION, value: is_showAdsNotificaton ? 0 : 1 };
            this.setState({ is_showAdsNotificaton: !is_showAdsNotificaton });
        }
        await this.props.api.post("profile/setting", params, true);
    }

    render = () => {
        const { is_showNotificaton, is_showAdsNotificaton, showLoader } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: BaseColor.whiteColor }}>
                <Header icon_left={"arrow-left"} callback_left={this.goBack} title={"Notificatoin"} />
                <LinkItem title={"Message"} subtitle={""} icon_right={"angle-right"} action={() => this.setNotificationStatus(0)} is_switch={true} switch_val={is_showNotificaton} />
                <LinkItem title={"Ads"} subtitle={""} icon_right={"angle-right"} action={() => this.setNotificationStatus(1)} is_switch={true} switch_val={is_showAdsNotificaton} />
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(NotifiSetting);