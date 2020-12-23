import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { SkypeIndicator } from 'react-native-indicators';
import { BaseColor } from '@config';

export default class Loader extends Component {

    render() {
        const { size } = this.props;
        return (
            <View style={styles.container}>
                <SkypeIndicator
                    size={size && size}
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
        backgroundColor: BaseColor.whiteColor
    },
});

