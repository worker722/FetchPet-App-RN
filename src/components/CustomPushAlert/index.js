import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image as RNImage,
} from "react-native";
import { Image } from 'react-native-elements';
import { styles } from "./style";

import posed from "react-native-pose";
import * as Animatable from 'react-native-animatable';

import { connect } from "react-redux";
import * as Api from '@api';
import * as global from "@api/global";
import { BaseColor, Images } from '@config';

const Modal = posed.View({
    enter: {
        y: 0,
        transition: {
            y: {
                ease: "linear",
                duration: 500,
                type: "spring",
                stiffness: 30,
            },
        },
    },
    exit: {
        y: ({ y }) => -1 * y,
        transition: {
            y: {
                ease: "linear",
                duration: 500,
                type: "spring",
                stiffness: 30,
            },
        },
    },
    props: { y: 500 },
});

const Circle = posed.View({
    big: {
        scale: 1.1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 1,
        },
    },
    normal: {
        scale: 1.0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 1,
        },
    },
});

class CustomPushAlert extends Component {
    constructor(props) {
        super(props);
    }

    hideAlert = () => {
        clearTimeout(this._interval);
        this._interval = null;
        this.props.setStore(global.PUSH_ALERT, null);
        this.props.setStore(global.PUSH_ALERT_TYPE, 'info');
    }

    onPressAlert = () => {
        try {
            const { PUSH_ALERT, NAVIGATION } = this.props;
            const { data } = PUSH_ALERT;
            const notificationData = JSON.parse(data.data);
            if (notificationData.notification_type == global.CHAT_MESSAGE_NOTIFICATION) {
                NAVIGATION.navigate("Chat", { ad_id: notificationData.room.id_ads, room_id: notificationData.room.id });
            }
        } catch (error) {
            console.log('push alert data parse', error)
        }

        this.hideAlert();
    }

    render = () => {
        const { PUSH_ALERT, PUSH_ALERT_TYPE } = this.props;
        if (!PUSH_ALERT) {
            return null;
        }

        clearTimeout(this._interval);
        this._interval = null;
        this._interval = setTimeout(this.hideAlert, 5000);

        const { notification, data } = PUSH_ALERT;
        const { title, body } = notification;
        let image = null;
        try {
            const notificationData = JSON.parse(data.data);
            if (notificationData.notification_type == global.CHAT_MESSAGE_NOTIFICATION) {
                image = notificationData.sender?.avatar;
            }
        } catch (error) {
            console.log(error)
        }

        let bgColor = BaseColor.alertInfoColor;
        if (PUSH_ALERT_TYPE == 'success') bgColor = BaseColor.alertSuccessColor;
        else if (PUSH_ALERT_TYPE == 'danger') bgColor = BaseColor.alertDangerColor;
        else if (PUSH_ALERT_TYPE == 'warning') bgColor = BaseColor.alertWarningColor;

        return (
            <TouchableWithoutFeedback>
                <Modal style={styles.container} >
                    <Animatable.View animation={"slideInDown"} iterationCount={1} duration={1000} direction="normal">
                        <View style={{ backgroundColor: BaseColor.whiteColor }}>
                            <TouchableOpacity
                                style={[styles.alertBGContainer, { backgroundColor: bgColor }]}
                                activeOpacity={0.8}
                                onPress={this.onPressAlert}
                            >
                                <View style={styles.alertMainContainer}>
                                    <Circle style={[styles.imageStyle, { width: image ? 60 : 25 }]} >
                                        {image ?
                                            <Image
                                                style={{ width: 60, height: 60, borderRadius: 100 }}
                                                resizeMode={"contain"}
                                                source={{ uri: Api.SERVER_HOST + image }}
                                            />
                                            :
                                            <RNImage
                                                style={{ width: 25, height: 25 }}
                                                source={Images.ic_bell}
                                            />
                                        }
                                    </Circle>
                                    <View style={{ flex: 1 }}>
                                        {title && title != '' && (
                                            <Text style={[styles.alertTitleStyle]}>
                                                {title}
                                            </Text>
                                        )}
                                        {body && body != '' && (
                                            <Text style={[styles.alertMessageStyle]} numberOfLines={1}>
                                                {body}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                </Modal>
            </TouchableWithoutFeedback>
        )
    }
}

const mapStateToProps = ({ app: { PUSH_ALERT, PUSH_ALERT_TYPE, NAVIGATION } }) => {
    return { PUSH_ALERT, PUSH_ALERT_TYPE, NAVIGATION };
}

const mapDispatchToProps = dispatch => {
    return {
        setStore: (type, data) => dispatch({ type, data })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomPushAlert);