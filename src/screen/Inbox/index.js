import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config';
import { Header, Loader, InboxItem } from '@components';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Api from '@api';
import * as global from "@api/global";

class Inbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatInbox: [],
            showLoader: false,
        }

        props.navigation.addListener("willFocus", (event) => {
            this.componentWillMount();
        });
    }

    componentWillMount = async () => {
        this.setState({ showLoader: true });
        const response = await this.props.api.get('inbox');
        this.setState({ showLoader: false });
        if (response?.success) {
            let inbox = response.data.inbox;
            inbox.sort((a, b) => {
                let a_end = a.message[a.message.length - 1];
                let b_end = b.message[b.message.length - 1];
                if (b_end.created_at >= a_end.created_at)
                    return 1;
                else if (b_end.created_at < a_end.created_at)
                    return -1;
            });
            this.setState({ chatInbox: inbox });
        }
    }

    render = () => {
        const { chatInbox, showLoader } = this.state;

        if (showLoader)
            return (<Loader />)

        return (
            <View style={{ flex: 1 }}>
                <Header navigation={this.props.navigation} mainHeader={true} />
                <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "bold", paddingLeft: 10 }}>Chat</Text>
                <View style={{ padding: 10, paddingTop: 0 }}>
                    <Text style={{ fontSize: 18, marginTop: 10 }}>Active Chat</Text>
                    <ScrollView>
                        <FlatList
                            style={{ marginTop: 30 }}
                            keyExtractor={(item, index) => index.toString()}
                            data={chatInbox}
                            renderItem={(item, index) => (
                                <InboxItem data={item} navigation={this.props.navigation} />
                            )}
                        />
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(Inbox);