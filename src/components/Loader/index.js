import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { SkypeIndicator } from 'react-native-indicators';
import { BaseColor } from '@config';

export default class Loader extends Component {

    render() {
        return (
            <View style={styles.container}>
                <SkypeIndicator
                    color={BaseColor.primaryColor}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

