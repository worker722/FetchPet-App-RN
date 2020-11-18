import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import { BaseColor } from '@config';

export default class Active extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <View style={{ flex: 1 }}>
                <Text>1</Text>
            </View>
        )
    }
}