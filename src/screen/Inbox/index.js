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

const chatItems = [
    {
        index: 0,
        avatar: '',
        pet: '',
        name: 'Ben K',
        latest_chat: 'Hi, I am Ben K',
        latest_time: '18:38',
    },
    {
        index: 1,
        avatar: '',
        pet: '',
        name: 'Ben K',
        latest_chat: 'Hi, I am Ben K',
        latest_time: '18:38',
    },
    {
        index: 2,
        avatar: '',
        pet: '',
        name: 'Ben K',
        latest_chat: 'Hi, I am Ben K',
        latest_time: '18:38',
    },
    {
        index: 3,
        avatar: '',
        pet: '',
        name: 'Ben K',
        latest_chat: 'Hi, I am Ben K',
        latest_time: '18:38',
    },
    {
        index: 4,
        avatar: '',
        pet: '',
        name: 'Ben K',
        latest_chat: 'Hi, I am Ben K',
        latest_time: '18:38',
    }
]
class Inbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatInbox: [],
        }
    }

    componentWillMount = async () => {
        const response = await this.props.api.get('inbox');
        if (response?.success) {
            let inbox = response.data.inbox;
            inbox.sort((a, b) => {
                if (b.created_at >= a.created_at)
                    return 1;
                else if (b.created_at < a.created_at)
                    return -1;
            });
            this.setState({ chatInbox: inbox });
        }
    }

    render = () => {
        const { chatInbox } = this.state;

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
                        >
                        </FlatList>
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