import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions
} from 'react-native';
import { BaseColor } from '@config';
import { Header, LinkItem } from '@components';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Active from './Active';
import Closed from './Closed';
import { Avatar } from 'react-native-elements';
export default class MyAds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                {
                    key: 'active',
                    title: 'Active'
                },
                {
                    key: 'closed',
                    title: 'Closed'
                }
            ]
        }
    }

    _renderLabel = ({ route }) => (
        <Text style={{ textAlign: "center" }}>{route.title}</Text>
    );

    _renderTabBar = props => (
        <TabBar
            {...props}
            // scrollEnabled
            pressColor={BaseColor.primaryColor}
            indicatorStyle={{ backgroundColor: BaseColor.primaryColor, bottom: 0, height: 5 }}
            style={{ backgroundColor: 'white', height: 45, width: "100%", justifyContent: 'center', alignItems: "center" }}
            labelStyle={{ color: BaseColor.primaryColor }}
            renderLabel={this._renderLabel}
            initialLayout={{ height: 0, width: Dimensions.get('window').width }}
            swipeEnabled={true}
        />
    );

    renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'active':
                return <Active />;
            case 'closed':
                return <Closed />;
        }
    };

    render = () => {
        const navigation = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <Header navigation={navigation} mainHeader={true} />
                <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "bold", paddingLeft: 10 }}>Profile</Text>
                <View style={{ flex: 1, marginTop: 10 }}>
                    <TabView
                        navigationState={{ index: this.state.index, routes: this.state.routes }}
                        onIndexChange={(index) => this.setState({ index: index })}
                        renderScene={this.renderScene}
                        tabBarPosition="top"
                        renderTabBar={this._renderTabBar}
                    />
                </View>
            </View>
        )
    }
}