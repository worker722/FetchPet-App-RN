import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config';
import { Header, LinkItem, Loader } from '@components';

import { store } from "@store";
import * as Api from '@api';
import * as Utils from '@utils';
import * as global from '@api/global';

export default class Package extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            showLoader: false
        }

        props.navigation.addListener("willFocus", (event) => {
            this.UNSAFE_componentWillMount();
        });
    }

    UNSAFE_componentWillMount = async () => {
    }

    render = () => {
        const navigation = this.props.navigation;
        const { showLoader } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: BaseColor.whiteColor }}>
                <Header navigation={navigation} mainHeader={true} />
            </View>
        )
    }
}