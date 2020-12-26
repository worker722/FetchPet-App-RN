import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator,
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config';
import * as Api from '@api';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class BlockedUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_show: true
        }
    }

    unblock = async () => {
        this.setState({ is_show: false });
        await this.props.api.post("inbox/unblock", { user_id: this.props.data.item.id });
    }

    render = () => {
        const { is_show } = this.state;
        const { item } = this.props.data;

        if (!is_show)
            return null;

        return (
            <View style={{ marginTop: 6, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 1, justifyContent: "center", alignItems: "center", flexDirection: "row", borderWidth: 1, borderColor: BaseColor.dddColor, borderRadius: 10 }}>
                {item.avatar ?
                    <Image
                        source={{ uri: Api.SERVER_HOST + item.avatar }}
                        placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                        PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                        style={{ width: 70, height: 70, borderRadius: 100, borderColor: BaseColor.dddColor, borderWidth: 1 }}
                    >
                    </Image>
                    :
                    <View style={{ width: 70, height: 70, borderRadius: 100, backgroundColor: BaseColor.primaryColor, borderColor: BaseColor.dddColor, borderWidth: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: BaseColor.whiteColor, fontSize: 25 }}>{item.name?.charAt(0).toUpperCase()}</Text>
                    </View>
                }
                <Text style={{ fontSize: 20, marginLeft: 20 }}>{item.name}</Text>
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity
                    onPress={this.unblock}
                    style={{ paddingHorizontal: 15, paddingVertical: 10, backgroundColor: BaseColor.primaryColor, borderRadius: 5 }}>
                    <Text style={{ color: BaseColor.whiteColor, fontSize: 12 }}>UnBlock</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(BlockedUser);