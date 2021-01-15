import React from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { Images, BaseColor } from '@config';

export default class PaymentFormView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardData:
            {
                valid: false
            }
        };
    }

    render() {
        const { callback, is_loading } = this.props;
        const { cardData } = this.state;

        return (
            <View style={{ paddingTop: 10 }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <View style={{ justifyContent: "center", alignItems: "center", borderRadius: 100, padding: 10, backgroundColor: BaseColor.boostColor }}>
                        <Image source={Images.ic_boost_big} style={{ width: 80, height: 80 }}></Image>
                    </View>
                </View>
                <View style={{ marginVertical: 20 }}>
                    <CreditCardInput
                        requiresName
                        allowScroll={true}
                        onChange={(cardData) => this.setState({ cardData })}
                        labels={
                            {
                                number: "Card Number",
                                expiry: "Expired",
                                cvc: "CVC",
                                name: "Full Name",
                            }
                        }
                    />
                </View>
                {!is_loading ?
                    <TouchableOpacity onPress={() => callback(cardData)} style={{ marginTop: 20, width: "90%", marginHorizontal: "5%", height: 45, justifyContent: "center", alignItems: "center", backgroundColor: BaseColor.primaryColor, borderRadius: 5 }}>
                        <Text style={{ color: BaseColor.whiteColor, fontSize: 20 }}>Confirm</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity activeOpacity={1} style={{ marginTop: 20, width: "90%", marginHorizontal: "5%", height: 45, justifyContent: "center", alignItems: "center", backgroundColor: BaseColor.primaryColor, borderRadius: 5 }}>
                        <ActivityIndicator color={BaseColor.whiteColor}></ActivityIndicator>
                    </TouchableOpacity>
                }

            </View>
        );
    }
}
