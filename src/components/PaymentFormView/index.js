import React from 'react';
import {
    View,
    Image
} from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { Images, BaseColor } from '@config';
import styles from "./style";
import * as Utils from "@utils";

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
        // const { onSubmit, submitted } = this.props;
        return (
            <View style={{ paddingTop: 10 }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <View style={{ justifyContent: "center", alignItems: "center", borderRadius: 100, padding: 10, backgroundColor: BaseColor.boostColor }}>
                        <Image source={Images.ic_boost_big} style={{ width: 80, height: 80 }}></Image>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
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
                
            </View>
        );
    }
}
