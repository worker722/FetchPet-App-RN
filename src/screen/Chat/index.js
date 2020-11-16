import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import { BaseColor } from '../../config';

export default class Chat extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 30, color: BaseColor.primaryColor }}>Chat</Text>
            </View>
        )
    }
}