import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView
} from 'react-native';

import { BaseColor } from '@config';
import Styles from './style';
import * as Utils from '@utils';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class CustomModalPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleModal: false
        }
    }

    render = () => {
        const { visibleModal } = this.state;
        const { title, data, selectedValue, onValueChange } = this.props;

        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity
                    onPress={() => this.setState({ visibleModal: true })}
                    style={{ width: "100%", height: 40, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <Text style={{ fontSize: 15 }}>{selectedValue}</Text>
                    <Icon name={"caret-down"} size={18} style={{ position: "absolute", right: 10 }} />
                </TouchableOpacity>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={visibleModal}>
                    <View style={Styles.modalContainer}>
                        <View style={[Styles.modalContentContainer, { maxHeight: Utils.SCREEN.HEIGHT / 5 * 3 }]}>
                            <View style={{ justifyContent: "center", alignItems: "center", width: "100%", marginBottom: 20 }}>
                                <Text style={{ fontSize: 20 }}>{title}</Text>
                            </View>
                            <ScrollView>
                                {data.map((item, key) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ visibleModal: false })
                                            onValueChange(item, key);
                                        }}
                                        key={key}
                                        style={{ marginHorizontal: 10, justifyContent: "center", alignItems: "center", paddingVertical: 5, borderWidth: 1, borderColor: BaseColor.whiteColor, borderBottomColor: BaseColor.dddColor, borderTopColor: key == 0 && BaseColor.dddColor }}>
                                        <Text style={{ color: BaseColor.primaryColor, marginVertical: 10, fontSize: 15 }}>{item.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <TouchableOpacity
                                onPress={() => this.setState({ visibleModal: false })}
                                style={{ backgroundColor: BaseColor.primaryColor, marginTop: 20, marginHorizontal: 10, paddingVertical: 10, borderRadius: 5, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 15 }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}