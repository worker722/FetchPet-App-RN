import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { BaseColor } from '@config';
import { Header } from '@components';
import Active from './Active';
import Closed from './Closed';
import Favourite from './Favourite';

export default class MyAds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTabIndex: 0
        }

        props.navigation.addListener("willFocus", (event) => {
            this.UNSAFE_componentWillMount();
        });
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ currentTabIndex: 0 });
    }

    render = () => {
        const navigation = this.props.navigation;
        const { currentTabIndex } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <Header navigation={navigation} mainHeader={true} />
                <Text style={{ color: BaseColor.primaryColor, fontSize: 20, fontWeight: "bold", paddingLeft: 10 }}>My Ads</Text>
                <View style={{ flex: 1, marginTop: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10, }} onPress={() => this.setState({ currentTabIndex: 0 })}>
                            <Text style={{ color: currentTabIndex == 0 ? BaseColor.primaryColor : BaseColor.greyColor }}>Favourite</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10, }} onPress={() => this.setState({ currentTabIndex: 1 })}>
                            <Text style={{ color: currentTabIndex == 1 ? BaseColor.primaryColor : BaseColor.greyColor }}>Active</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10 }} onPress={() => this.setState({ currentTabIndex: 2 })}>
                            <Text style={{ color: currentTabIndex == 2 ? BaseColor.primaryColor : BaseColor.greyColor }}>Closed</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, height: 5, borderRadius: 100, backgroundColor: currentTabIndex == 0 ? BaseColor.primaryColor : BaseColor.whiteColor }}></View>
                        <View style={{ flex: 1, height: 5, borderRadius: 100, backgroundColor: currentTabIndex == 1 ? BaseColor.primaryColor : BaseColor.whiteColor }}></View>
                        <View style={{ flex: 1, height: 5, borderRadius: 100, backgroundColor: currentTabIndex == 2 ? BaseColor.primaryColor : BaseColor.whiteColor }}></View>
                    </View>
                    {currentTabIndex == 0 && <Favourite navigation={this.props.navigation} />}
                    {currentTabIndex == 1 && <Active navigation={this.props.navigation} />}
                    {currentTabIndex == 2 && <Closed navigation={this.props.navigation} />}
                </View>
            </View>
        )
    }
}