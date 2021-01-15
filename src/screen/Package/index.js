import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Platform,
    Image
} from 'react-native';
import { PricingCard, Overlay } from 'react-native-elements';
import { BaseColor, Images } from '@config';
import { Header, Loader, PaymentFormView } from '@components';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { ApplePayButton } from 'react-native-rn-apple-pay-button';
import stripe from 'tipsi-stripe';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Api from '@api';
import * as Utils from '@utils';
import * as global from '@api/global';

const PaymentMethod = { card: 0, google: 1, apple: 2 };

class Package extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoader: false,

            visiblePMethodModal: false,
            is_card_pay: false,
            is_check_card: false,

            type: '',
            ad_id: -1,

            boost_cards: [
                {
                    title: 1.97,
                    amount: 1.97,
                    currency: "usd",
                    price: "One Day",
                    info: ['Your ads will be on the top of list'],
                    button: "BOOST NOW",
                    type: 0,
                    checkout_type: 1
                },
                {
                    title: 9.97,
                    amount: 9.97,
                    currency: "usd",
                    price: "One Week",
                    info: ['Your ads will be on the top of list'],
                    button: "BOOST NOW",
                    type: 1,
                    checkout_type: 1
                },
                {
                    title: 26.88,
                    amount: 26.88,
                    currency: "usd",
                    price: "One Month",
                    info: ['Your ads will be on the top of list'],
                    button: "BOOST NOW",
                    type: 2,
                    checkout_type: 1
                }
            ],

            subscription_cards: [
                {
                    title: 5,
                    amount: 5,
                    currency: "usd",
                    price: "One WeeK",
                    info: ['You can sell no limit ads'],
                    button: "Buy Now",
                    type: 0,
                    checkout_type: 0
                },
                {
                    title: 10,
                    amount: 10,
                    currency: "usd",
                    price: "One Month",
                    info: ['You can sell no limit ads'],
                    button: "Buy Now",
                    type: 1,
                    checkout_type: 0
                },
                {
                    title: 50,
                    amount: 50,
                    currency: "usd",
                    price: "One Year",
                    info: ['You can sell no limit ads'],
                    button: "Buy Now",
                    type: 2,
                    checkout_type: 0
                }
            ],

            selectedCard: null
        }
    }

    UNSAFE_componentWillMount = async () => {
        const { type, ad_id } = this.props.navigation.state.params;
        this.setState({ type, ad_id });

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

    onPressCard = (item) => {
        this.setState({ selectedCard: item, visiblePMethodModal: true });
    }

    onSelectPaymentMethod = (type) => {
        this.setState({ visiblePMethodModal: false });
        if (type == PaymentMethod.card) {
            this.setState({ is_card_pay: true });
        }
    }

    processPayment = async (stripeToken) => {
        if (!stripeToken)
            return;

        this.setState({ is_check_card: false, showLoader: true });

        const { selectedCard, ad_id } = this.state;
        const params = { card: selectedCard, stripeToken, ad_id };
        const response = await this.props.api.post("payment/checkout", params);
        if (response?.success) {
            this.props.setStore(global.PUSH_ALERT, { notification: { title: "Your ads boosted successfully.", body: "Your ad will be viewed from the top to anyone nearby." } });
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
            this.refs.toast.show(Utils.translate('stripe.no-support-google-pay'));
            this.loadingFalse;
            return;
        }
        stripe.paymentRequestWithNativePay({
            total_price: amount,
            currency_code: "EUR",
            shipping_countries: ['FR'],
            line_items: [{
                currency_code: 'EUR',
                description,
                total_price: amount,
                unit_price: amount,
                quantity: '1',
            }],
        }).then(res => {
            this.processPayment(res.tokenId);
        }).catch(err => this.loadingFalse);
    }

    applePay = async (amount, label) => {
        stripe.openApplePaySetup();
        const support_apple_pay = await stripe.deviceSupportsApplePay()
        if (!support_apple_pay) {
            this.refs.toast.show(Utils.translate('stripe.no-support-apple-pay'));
            this.loadingFalse;
            return;
        }
        const canmake = await stripe.canMakeApplePayPayments()
        if (!canmake) {
            this.loadingFalse;
            this.refs.toast.show(Utils.translate('stripe.no-available-apple-pay'));
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
            .catch(err => {
                this.loadingFalse
            });
    }

    goBack = () => {
        const { is_card_pay } = this.state;
        if (is_card_pay) {
            this.setState({ is_card_pay: false });
        }
        else {
        }
    }

    render = () => {
        const navigation = this.props.navigation;
        const { showLoader, type, is_card_pay, boost_cards, subscription_cards, visiblePMethodModal, selectedCard, is_check_card } = this.state;

        const cards = type == global._CHECKOUT_BOOST_ADS ? boost_cards : subscription_cards;

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
                        <Header navigation={navigation} title={"Boost Your Ads"} icon_left={"arrow-left"} callback_left={this.goBack} />
                        <ScrollView>
                            <Text style={{ fontSize: 22, marginLeft: 10 }}>Packages</Text>
                            <Text style={{ marginTop: 10, marginLeft: 10, fontSize: 16 }}>Choose a package that you wish to</Text>
                            {
                                cards.map((item, index) => (
                                    <PricingCard
                                        key={index}
                                        color="#4f9deb"
                                        title={`$ ${item.title}`}
                                        price={item.price}
                                        info={item.info}
                                        button={{ title: item.button }}
                                        onButtonPress={() => this.onPressCard(item)}
                                        pricingStyle={{ height: 0 }}
                                        containerStyle={{ borderRadius: 15, paddingVertical: 10, paddingHorizontal: 10 }}
                                    />
                                ))
                            }
                        </ScrollView>
                    </>
                }

                <Overlay isVisible={visiblePMethodModal} overlayStyle={{ borderRadius: 10, width: "90%" }} onBackdropPress={() => this.setState({ visiblePMethodModal: false })}>
                    {selectedCard &&
                        <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 20 }}>Select a payment method</Text>
                            <TouchableOpacity onPress={() => this.onSelectPaymentMethod(PaymentMethod.card)} style={{ marginTop: 20, backgroundColor: BaseColor.primaryColor, width: "100%", height: 50, borderRadius: 5, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: BaseColor.whiteColor, fontSize: 17 }}>Boost with <Icon name={"credit-card"} color={BaseColor.whiteColor} size={15}></Icon> Pay</Text>
                            </TouchableOpacity>
                            {Platform.OS == "android" ?
                                <TouchableOpacity onPress={() => this.onSelectPaymentMethod(PaymentMethod.google)} style={{ marginTop: 5, backgroundColor: BaseColor.googleColor, flexDirection: "row", width: "100%", height: 50, borderRadius: 5, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor, fontSize: 17 }}>Boost with <Icon name={"google"} color={BaseColor.whiteColor} size={15}></Icon> Pay</Text>
                                </TouchableOpacity>
                                :
                                <ApplePayButton
                                    cornerRadius={5}
                                    buttonStyle="black"
                                    type="subscription"
                                    style={{ flex: 1, marginTop: 5 }}
                                    onPress={() => this.onSelectPaymentMethod(PaymentMethod.apple)}
                                    height={50}
                                />
                            }
                        </View>
                    }
                </Overlay>

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