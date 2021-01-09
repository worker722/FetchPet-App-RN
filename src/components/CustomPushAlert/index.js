import React, { Component } from 'react';
import Alert from '@logisticinfotech/react-native-animated-alert';

import { connect } from "react-redux";
import * as global from "@api/global";
import { BaseColor } from '@config';

class CustomPushAlert extends Component {
    constructor(props) {
        super(props);
    }

    onPressHide = () => {
        Alert.hideAlert();
    }

    onAlertHide = () => {
        this.props.setStore(global.PUSH_ALERT, null);
    }

    render = () => {
        const { PUSH_ALERT } = this.props;
        if (PUSH_ALERT) {
            Alert.showAlert();
        }

        return (
            <Alert
                alertTitle={PUSH_ALERT?.title}
                alertMessage={PUSH_ALERT?.body}
                onAlertHide={this.onAlertHide}
                alertBGColor={BaseColor.pushAlertColor}
            />
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