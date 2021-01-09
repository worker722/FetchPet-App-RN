
import React, { Component } from "react";
import {
    LogBox,
    View,
    StatusBar,
    Platform,
} from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppSeller, AppBuyer } from "@navigation";
import { store, persistor } from "@store";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { BaseColor } from '@config';

LogBox.ignoreAllLogs(true);

export default class index extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        if (Platform.OS == "android")
            StatusBar.setBackgroundColor(BaseColor.primaryDarkColor, true);
        StatusBar.setBarStyle("light-content");
    }

    render() {
        const IS_BUYER_MODE = store.getState().app.IS_BUYER_MODE;

        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {Platform.OS != "android" &&
                        <View style={{ height: getStatusBarHeight(true), backgroundColor: BaseColor.primaryDarkColor }} />}
                    {IS_BUYER_MODE ?
                        <AppBuyer /> :
                        <AppSeller />
                    }
                </PersistGate>
            </Provider>
        );
    }
}