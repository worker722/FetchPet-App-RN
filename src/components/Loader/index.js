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
                    //  size="large"
                    color={BaseColor.primaryColor}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: "#fff",
    },
});

