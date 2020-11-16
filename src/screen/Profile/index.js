import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import { BaseColor } from '../../config';

export default class Profile extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 30, color: BaseColor.primaryColor }}>Profile</Text>
            </View>
        )
    }
}