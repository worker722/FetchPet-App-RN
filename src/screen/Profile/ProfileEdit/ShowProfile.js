import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    RefreshControl,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Header, Loader } from '@components';
import { Avatar } from 'react-native-elements';
import { BaseColor } from '@config';
import Styles from './style';
import Toast from 'react-native-simple-toast';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';

class ShowProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoader: false,
            showRefresh: false,
            user: null,
        }
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const param = { user_id: this.props.navigation.state.params.user_id };
        const response = await this.props.api.post('profile', param);
        if (response?.success) {
            this.setState({ user: response.data.user });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    _onRefresh = async () => {
        this.setState({ showRefresh: true });
        this.start();
    }

    goBack = () => {
        this.props.navigation.goBack(null);
    }

    render = () => {
        const { user, showLoader, showRefresh } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1 }}>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={showRefresh}
                        onRefresh={this._onRefresh}
                    />
                }>
                    <Header icon_left={"arrow-left"} callback_left={this.goBack} title={"Show Profile"} />
                    <Text style={{ fontSize: 18, color: BaseColor.primaryColor, paddingHorizontal: 20 }}>Basic Infomation</Text>
                    <View style={{ marginTop: 15, marginLeft: 15, flexDirection: "row", paddingRight: 20 }}>
                        <View>
                            {user?.avatar ?
                                <Avatar
                                    size='xlarge'
                                    rounded
                                    source={{ uri: Api.SERVER_HOST + user?.avatar }}
                                    activeOpacity={0.7}
                                    placeholderStyle={{ backgroundColor: "transparent" }}
                                    containerStyle={{ marginHorizontal: 10, borderWidth: 1, borderColor: "#808080", width: 80, height: 80, borderRadius: 100 }}>
                                </Avatar>
                                :
                                <View style={{ width: 80, height: 80, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 30 }}>{user?.name?.charAt(0).toUpperCase()}</Text>
                                </View>
                            }
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                    <Text style={{ fontSize: 18 }}>21</Text>
                                    <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Following</Text>
                                </View>
                                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                    <Text style={{ fontSize: 18 }}>66</Text>
                                    <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Followers</Text>
                                </View>
                                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                    <Text style={{ fontSize: 18 }}>54</Text>
                                    <Text style={{ color: BaseColor.greyColor, fontSize: 13 }}>Total ads</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch)
    };
};
export default connect(null, mapDispatchToProps)(ShowProfile);

