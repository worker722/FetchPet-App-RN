import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { BaseColor } from '@config';
import { Header, Loader, HomeAds } from '@components';
import * as Utils from '@utils';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as global from '@api/global';

class FilterResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            showRefresh: false,

            pets: []
        }
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const response = await this.props.api.post("filter/get", this.props.navigation.state.params);
        if (response?.success) {
            this.setState({ pets: response.data.pets });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    _onRefresh = () => {
        this.setState({ showRefresh: true });
        this.start();
    }

    favouriteAds = async (index, item, value) => {
        let { pets } = this.state;
        pets[index].is_fav = value;
        this.setState({ pets });
        const param = { ad_id: item.id, is_fav: value };
        await this.props.api.post('ads/ad_favourite', param);
    }

    render = () => {
        const { showLoader, showRefresh, pets } = this.state;
        const { navigation } = this.props;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                <Header navigation={navigation} mainHeader={true} />
                <ScrollView style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <FlatList
                        style={{ paddingHorizontal: 10, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={pets}
                        renderItem={(item, key) => (
                            <HomeAds data={item} onFavourite={this.favouriteAds} navigation={navigation} />
                        )}
                    />
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
export default connect(null, mapDispatchToProps)(FilterResult);