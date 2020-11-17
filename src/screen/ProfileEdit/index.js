import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class ProfileEdit extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Profile edit</Text>
            </View>
        )
    }
}