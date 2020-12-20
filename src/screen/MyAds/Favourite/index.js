import React, { Component } from 'react';
import {
    View,
    FlatList,
    ScrollView,
    RefreshControl
} from 'react-native';
import { FavouriteAds, Loader } from '@components';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';

class Favourite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            showRefresh: false,

            ads: null,
        }
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ showLoader: true });
        this.start();
    }

    start = async () => {
        const response = await this.props.api.get('ads/favouriteAds');
        if (response?.success) {
            this.setState({ ads: response.data.ads });
        }
        this.setState({ showLoader: false, showRefresh: false });
    }

    _onRefresh = () => {
        this.setState({ showRefresh: true, ads: null });
        this.start();
    }

    render = () => {
        const { ads, showLoader, showRefresh } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={showRefresh}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <FlatList
                        style={{ paddingHorizontal: 10, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={ads}
                        renderItem={(item, key) => (
                            <FavouriteAds data={item} navigation={this.props.navigation} />
                        )}
                    >
                    </FlatList>
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
export default connect(null, mapDispatchToProps)(Favourite);