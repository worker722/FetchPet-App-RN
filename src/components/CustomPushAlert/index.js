import React, { Component } from 'react';
import Alert from '@logisticinfotech/react-native-animated-alert';

import { connect } from "react-redux";
import * as Api from '@api';
import * as global from "@api/global";
import { BaseColor } from '@config';

class CustomPushAlert extends Component {
    constructor(props) {
        super(props);
    }

    onAlertHide = () => {
        this.props.setStore(global.PUSH_ALERT, null);
    }

    onPressAlert = () => {
        Alert.hideAlert();
    }

    render = () => {
        const { PUSH_ALERT } = this.props;
        if (!PUSH_ALERT) {
            return null;
        }

        const { notification, data } = PUSH_ALERT;
        const { title, body } = notification;
        let image = null;
        if (data?.data) {
            const notificationData = JSON.parse(data?.data);
            if (notificationData.notification_type == global.CHAT_MESSAGE_NOTIFICATION) {
                image = notificationData.sender?.avatar;
            }
            else if (notificationData.notification_type == global.ACCOUNT_STATUS_NOTIFICATION) {
            }
        }

        if (notification) {
            Alert.showAlert();
        }

        return (
            <>
                {image ?
                    <Alert
                        alertTitle={title}
                        alertMessage={body}
                        alertIconSource={{ uri: Api.SERVER_HOST + image }}
                        alertIconSize={60}
                        alertIconResizeMode={"cover"}
                        onAlertHide={this.onAlertHide}
                        onPressAlert={this.onPressAlert}
                        alertBGColor={BaseColor.pushAlertColor}
                    />
                    :
                    <Alert
                        alertTitle={title}
                        alertMessage={body}
                        onAlertHide={this.onAlertHide}
                        onPressAlert={this.onPressAlert}
                        alertBGColor={BaseColor.pushAlertColor}
                    />
                }
            </>
        )
    }
}

const mapStateToProps = ({ app: { PUSH_ALERT } }) => {
    return { PUSH_ALERT };
}

const mapDispatchToProps = dispatch => {
    return {
        setStore: (type, data) => dispatch({ type, data })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomPushAlert);