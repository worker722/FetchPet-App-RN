import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { BaseColor } from '@config';
import { Header } from '@components';
import { Utils } from '@utils';
import { TabView, TabBar } from 'react-native-tab-view';
import Active from './Active';
import Closed from './Closed';

export default class MyAds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        }
    }

    // _renderLabel = ({ route }) => (
    //     <Text style={{ textAlign: "center" }}>{route.title}</Text>
    // );

    // _renderTabBar = props => (
    //     <TabBar
    //         {...props}
    //         scrollEnabled
    //         pressColor={BaseColor.primaryColor}
    //         indicatorStyle={{ backgroundColor: "white", height: 5 }}
    //         style={{ backgroundColor: 'white', height: 45, justifyContent: 'center', alignItems: "center" }}
    //         labelStyle={{ color: BaseColor.primaryColor, alignSelf: "center" }}
    //         renderLabel={this._renderLabel}
    //     />
    // );

    // _renderScene = ({ route, jumpTo }) => {
    //     switch (route.key) {
    //         case 'active':
    //             return <Active navigation={this.props.navigation} />;
    //         case 'closed':
    //             return <Closed navigation={this.props.navigation} />;
    //     }
    // };

    // _getNavigationState = () => {
    //     return {
    //         index: this.state.index,
    //         routes: [
    //             {
    //                 key: 'active',
    //                 title: 'Active'
    //             },
    //             {
    //                 key: 'closed',
    //                 title: 'Closed'
    //             }
    //         ]
    //     }
    // }

    render = () => {
        const navigation = this.props.navigation;
        const { index } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <Header navigation={navigation} mainHeader={true} />
                <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "bold", paddingLeft: 10 }}>My Ads</Text>
                <View style={{ flex: 1, marginTop: 10 }}>
                    {/* <TabView
                        navigationState={this._getNavigationState()}
                        onIndexChange={(index) => this.setState({ index: index })}
                        renderScene={this._renderScene}
                        renderTabBar={this._renderTabBar}
                        tabBarPosition="top"
                        initialLayout={{width: Utils.screen.width}}
                    /> */}
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10, }} onPress={() => this.setState({ index: 0 })}>
                            <Text style={{ color: index == 0 ? BaseColor.primaryColor : BaseColor.greyColor }}>Active</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10 }} onPress={() => this.setState({ index: 1 })}>
                            <Text style={{ color: index == 1 ? BaseColor.primaryColor : BaseColor.greyColor }}>Closed</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, height: 5, backgroundColor: index == 0 ? BaseColor.primaryColor : "white" }}></View>
                        <View style={{ flex: 1, height: 5, backgroundColor: index == 1 ? BaseColor.primaryColor : "white" }}></View>
                    </View>
                    {this.state.index == 0 ?
                        <Active />
                        :
                        <Closed />
                    }
                </View>
            </View>
        )
    }
}