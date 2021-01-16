import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
} from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

import { BaseColor } from '@config';
import { Header, Loader, PaymentFormView } from '@components';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { ApplePayButton } from 'react-native-rn-apple-pay-button';
import stripe from 'tipsi-stripe';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as global from '@api/global';

const PAYMENT_METHOD = { card: 0, google: 1, apple: 2 };

class Package extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoader: false,

            is_card_pay: false,
            is_check_card: false,

            checkout_type: '',
            ad_id: -1,

            boost_cards: [
                {
                    index: 0,
                    label: "1 Day in 1.97$",
                    amount: 1.97,
                    type: 0,
                    checkout_type: 1
                },
                {
                    index: 1,
                    label: "7 Days in 9.97$",
                    amount: 9.97,
                    type: 1,
                    checkout_type: 1
                },
                {
                    index: 2,
                    label: "30 Days in 26.88$",
                    amount: 26.88,
                    type: 2,
                    checkout_type: 1
                }
            ],

            subscription_cards: [
                {
                    index: 0,
                    label: "7 Days in 5$",
                    amount: 5,
                    type: 0,
                    checkout_type: 0
                },
                {
                    index: 1,
                    label: "1 Month in 10$",
                    amount: 10,
                    type: 1,
                    checkout_type: 0
                },
                {
                    index: 2,
                    label: "6 Months in 50$",
                    amount: 50,
                    type: 2,
                    checkout_type: 0
                }
            ],

            selectedCard: null,
        }
    }

    UNSAFE_componentWillMount = async () => {
        const { checkout_type, ad_id } = this.props.route.params;
        this.setState({ checkout_type, ad_id });
        const { boost_cards, subscription_cards } = this.state;
        this.setState({ selectedCard: checkout_type == global._CHECKOUT_BOOST_ADS ? boost_cards[0] : subscription_cards[0] });

        const response = await this.props.api.get("payment/config");
        if (response?.success) {
            try {
                const { stripe_pk, google_merchantId, apple_merchantId } = response.data;
                stripe.setOptions({
                    publishableKey: stripe_pk,
                    merchantId: Platform.OS == "android" ? google_merchantId : apple_merchantId, // Optional(google/apple pay)
                    androidPayMode: 'test' //test, production, // Android only
                });
            } catch (error) {
            }
        }
    }

    onSelectPAYMENT_METHOD = (type) => {
        if (type == PAYMENT_METHOD.CARD) {
            this.setState({ is_card_pay: true });
        }
    }

    processPayment = async (stripeToken) => {
        if (!stripeToken)
            return;

        this.setState({ is_check_card: false, showLoader: true });

        const { selectedCard, ad_id, checkout_type } = this.state;
        const params = { card: selectedCard, stripeToken, ad_id };
        const response = await this.props.api.post("payment/checkout", params);
        if (response?.success) {
            let title = '';
            let body = '';
            if (checkout_type == global._CHECKOUT_BOOST_ADS) {
                title = "Thank you for your boosting ads";
                body = "Your ads will on the top of list from now";
            }
            else if (checkout_type == global._CHECKOUT_SUBSCRIPTION) {
                title = "Thank you for your subscribe";
                body = "You can sell more ads from now";

                this.props.setStore(global.IS_VALID_SUBSCRIPTION, true);
            }
            this.props.setStore(global.PUSH_ALERT, { notification: { title, body } });
            this.props.navigation.goBack();
        }
        this.setState({ showLoader: false });
    }

    cardPay = (card) => {
        if (!card?.valid) {
            global.showToastMessage("Please input correct card infomation.")
            return;
        }
        this.setState({ is_check_card: true });

        try {
            let { values: { expiry } } = card;
            expiry = expiry.split("/")
            const params = {
                expMonth: parseInt(expiry[0]),
                expYear: parseInt(expiry[1]),
                currency: 'usd',
                ...card.values
            }
            stripe.createTokenWithCard(params)
                .then(res => this.processPayment(res.tokenId))
                .catch(err => {
                    console.log(err);
                });
        } catch (error) {
        }
    }

    googlePay = async (amount, description) => {
        const support_pay = await stripe.deviceSupportsAndroidPay()
        if (!support_pay) {
            return;
        }
        const { selectedCard } = this.state;

        stripe.paymentRequestWithNativePay({
            total_price: selectedCard.amount,
            currency_code: "USD",
            shipping_countries: ['USA'],
            line_items: [{
                currency_code: 'USD',
                description,
                total_price: selectedCard.amount,
                unit_price: selectedCard.amount,
                quantity: '1',
            }],
        }).then(res => {
            this.processPayment(res.tokenId);
        }).catch(err => console.log(err));
    }

    applePay = async (amount, label) => {
        stripe.openApplePaySetup();
        const support_apple_pay = await stripe.deviceSupportsApplePay()
        if (!support_apple_pay) {
            return;
        }
        const canmake = await stripe.canMakeApplePayPayments()
        if (!canmake) {
            return;
        }
        stripe.paymentRequestWithNativePay({},
            [{
                label,
                amount,
            }])
            .then(res => {
                console.log(res);
                this.processPayment(res.tokenId);
            })
            .catch(err => console.log(err));
    }

    goBack = () => {
        const { is_card_pay } = this.state;
        if (is_card_pay) {
            this.setState({ is_card_pay: false });
        }
        else {
            this.props.navigation.goBack();
        }
    }

    render = () => {
        const navigation = this.props.navigation;
        const { showLoader, checkout_type, is_card_pay, boost_cards, subscription_cards, selectedCard, is_check_card } = this.state;

        const cards = checkout_type == global._CHECKOUT_BOOST_ADS ? boost_cards : subscription_cards;
        const title = checkout_type == global._CHECKOUT_BOOST_ADS ? "Boost Your Ads" : "Subscribe";
        const pay_title = checkout_type == global._CHECKOUT_BOOST_ADS ? "Boost" : "Subscribe";

        if (showLoader)
            return (<Loader />);

        return (
            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: BaseColor.whiteColor }}>
                {is_card_pay ?
                    <>
                        <Header navigation={navigation} title={"Check Out"} icon_left={"arrow-left"} callback_left={this.goBack} />
                        <PaymentFormView callback={this.cardPay} is_loading={is_check_card} />
                    </>
                    :
                    <>
                        <Header navigation={navigation} title={title} icon_left={"arrow-left"} callback_left={this.goBack} />
                        <Text style={{ fontSize: 22, marginLeft: 10 }}>Packages</Text>
                        <Text style={{ marginTop: 20, marginLeft: 10, fontSize: 16 }}>Choose a package that you wish to</Text>
                        <RadioForm
                            formHorizontal={false}
                            animation={true}
                            style={{ marginTop: 10 }}>
                            {
                                cards.map((item, index) => (
                                    <RadioButton labelHorizontal={true} key={index} style={{ marginBottom: 15 }}>
                                        <RadioButtonInput
                                            obj={item}
                                            index={index}
                                            isSelected={selectedCard.index == index}
                                            borderWidth={1}
                                            buttonInnerColor={BaseColor.primaryColor}
                                            buttonOuterColor={selectedCard.index == index ? BaseColor.primaryColor : BaseColor.greyColor}
                                            buttonSize={20}
                                            buttonOuterSize={30}
                                            buttonStyle={{}}
                                            onPress={() => this.setState({ selectedCard: item })}
                                            buttonWrapStyle={{ marginLeft: 10 }}
                                        />
                                        <RadioButtonLabel
                                            obj={item}
                                            index={index}
                                            labelHorizontal={true}
                                            onPress={() => this.setState({ selectedCard: item })}
                                            labelStyle={{ paddingVertical: 5, fontSize: 18, color: selectedCard.index == index ? BaseColor.primaryColor : BaseColor.greyColor }}
                                        />
                                    </RadioButton>
                                ))
                            }
                        </RadioForm>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ marginTop: 20, marginBottom: 50, paddingHorizontal: 10 }}>
                            <TouchableOpacity onPress={() => this.onSelectPAYMENT_METHOD(PAYMENT_METHOD.CARD)} style={{ marginTop: 20, backgroundColor: BaseColor.primaryColor, width: "100%", height: 50, borderRadius: 5, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 17 }}>{`${pay_title} with`} <Icon name={"credit-card"} color={BaseColor.whiteColor} size={15}></Icon> Pay</Text>
                            </TouchableOpacity>
                            {Platform.OS == "android" ?
                                <TouchableOpacity onPress={() => this.onSelectPAYMENT_METHOD(PAYMENT_METHOD.GOOGLE)} style={{ marginTop: 5, backgroundColor: BaseColor.googleColor, flexDirection: "row", width: "100%", height: 50, borderRadius: 5, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 17 }}>{`${pay_title} with`} <Icon name={"google"} color={BaseColor.whiteColor} size={15}></Icon> Pay</Text>
                                </TouchableOpacity>
                                :
                                <ApplePayButton
                                    cornerRadius={5}
                                    buttonStyle="black"
                                    type="subscription"
                                    style={{ flex: 1, marginTop: 5 }}
                                    onPress={() => this.onSelectPAYMENT_METHOD(PAYMENT_METHOD.APPLE)}
                                    height={50}
                                />
                            }
                        </View>
                    </>
                }

            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch),
        setStore: (type, data) => dispatch({ type, data })
    };
};
export default connect(null, mapDispatchToProps)(Package);