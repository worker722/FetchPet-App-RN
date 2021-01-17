import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    ScrollView,
    RefreshControl
} from 'react-native';
import { BaseColor } from '@config';
import { Header, Loader, NotificationItem } from '@components';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';

class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notification: null,
            showLoader: false,
            showRefresh: false
        }

        props.navigation.addListener("focus", (event) => {
            this.UNSAFE_componentWillMount();
        });
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const response = await this.props.api.get("notification");
        this.setState({ showLoader: false, showRefresh: false });
        if (response?.success) {
            this.setState({ notification: response.data.notification });
        }
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    _onRefresh = () => {
        this.setState({ showRefresh: true });
        this.start();
    }

    render = () => {
        const { showLoader, showRefresh, notification } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, marginBottom: 10, backgroundColor: BaseColor.whiteColor }}>
                <Header title={"Notification"} icon_left={"times-circle"} callback_left={this.goBack} />
                <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingHorizontal: 20 }}>Notification</Text>
                <ScrollView keyboardShouldPersistTaps='always'
                    refreshControl={
                        <RefreshControl refreshing={showRefresh}
                            onRefresh={this._onRefresh} />}
                >
                    <FlatList
                        style={{ paddingHorizontal: 10, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={notification}
                        renderItem={(item, key) => (
                            <NotificationItem data={item} navigation={this.props.navigation} />
                        )}
                    >
                    </FlatList>
                </ScrollView>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(Notification);