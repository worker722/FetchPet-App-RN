import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { Image, PricingCard, Overlay } from 'react-native-elements';
import { BaseColor } from '@config';
import { Header, Loader, PaymentFormView } from '@components';

import { store } from "@store";
import * as Api from '@api';
import * as Utils from '@utils';
import * as global from '@api/global';

export default class Package extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoader: false,

            is_selected_card: false,

            type: '',
            callback: null,

            selectedPackage: null
        }
    }

    UNSAFE_componentWillMount = async () => {
        const { type, callback } = this.props.navigation.state.params;
        this.setState({ type, callback });
    }

    onPressCard = (type) => {
        this.setState({ is_selected_card: true });
    }

    goBack = () => {
        const { callback, is_selected_card } = this.state;
        if (is_selected_card) {
            this.setState({ is_selected_card: false });
        }
        else {
            callback(false);
            this.props.navigation.goBack(null);
        }
    }

    render = () => {
        const navigation = this.props.navigation;
        const { showLoader, type, is_selected_card } = this.state;

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: BaseColor.whiteColor }}>
                {is_selected_card ?
                    <>
                        <Header navigation={navigation} title={"Check Out"} icon_left={"arrow-left"} callback_left={this.goBack} />
                        <PaymentFormView />
                    </>
                    :
                    <>
                        <Header navigation={navigation} title={"Boost Your Ads"} icon_left={"arrow-left"} callback_left={this.goBack} />
                        <ScrollView>
                            <Text style={{ fontSize: 22, marginLeft: 10 }}>Packages</Text>
                            <Text style={{ marginTop: 10, marginLeft: 10, fontSize: 16 }}>Choose a package that you wish to</Text>
                            {type == global._CHECKOUT_BOOST_ADS ?
                                <>
                                    <PricingCard
                                        color="#4f9deb"
                                        title="$1.97"
                                        info={['One Day', 'Your ads will be on the top of list']}
                                        button={{ title: 'BOOST NOW' }}
                                        onButtonPress={() => this.onPressCard(0)}
                                        pricingStyle={{ height: 0 }}
                                        containerStyle={{ borderRadius: 15, paddingVertical: 10, paddingHorizontal: 10 }}
                                    />
                                    <PricingCard
                                        color="#4f9deb"
                                        title="$9.97"
                                        info={['One Week', 'Your ads will be on the top of list']}
                                        button={{ title: 'BOOST NOW' }}
                                        onButtonPress={() => this.onPressCard(1)}
                                        pricingStyle={{ height: 0 }}
                                        containerStyle={{ borderRadius: 15, paddingVertical: 10, paddingHorizontal: 10 }}
                                    />
                                    <PricingCard
                                        color="#4f9deb"
                                        title="$26.88"
                                        info={['One Month', 'Your ads will be on the top of list']}
                                        button={{ title: 'BOOST NOW' }}
                                        onButtonPress={() => this.onPressCard(2)}
                                        pricingStyle={{ height: 0 }}
                                        containerStyle={{ borderRadius: 15, paddingVertical: 10, paddingHorizontal: 10 }}
                                    />
                                </>
                                :
                                <>
                                    <PricingCard
                                        color="#4f9deb"
                                        title="$1.97"
                                        info={['One Day', 'You ads will be on the top of list']}
                                        button={{ title: 'BOOST NOW' }}
                                        onButtonPress={() => this.onPressCard(0)}
                                        pricingStyle={{ height: 0 }}
                                        containerStyle={{ borderRadius: 15, paddingVertical: 10, paddingHorizontal: 10 }}
                                    />
                                    <PricingCard
                                        color="#4f9deb"
                                        title="$9.97"
                                        info={['One Week', 'You ads will be on the top of list']}
                                        button={{ title: 'BOOST NOW' }}
                                        onButtonPress={() => this.onPressCard(1)}
                                        pricingStyle={{ height: 0 }}
                                        containerStyle={{ borderRadius: 15, paddingVertical: 10, paddingHorizontal: 10 }}
                                    />
                                </>
                            }
                        </ScrollView>
                    </>
                }

                <Overlay isVisible={is_selected_card}>
                    <PricingCard
                        color="#4f9deb"
                        title="$9.97"
                        info={['One Week', 'You ads will be on the top of list']}
                        button={{ title: 'BOOST NOW' }}
                        onButtonPress={() => this.onPressCard(1)}
                        pricingStyle={{ height: 0 }}
                        containerStyle={{ borderRadius: 15, paddingVertical: 10, paddingHorizontal: 10 }}
                    />
                </Overlay>

            </View>
        )
    }
}