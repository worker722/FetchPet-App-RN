
import React, { Component } from "react";
import { LogBox, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "@navigation";
import { store, persistor } from "@store";
import { getStatusBarHeight } from 'react-native-status-bar-height';

LogBox.ignoreAllLogs(true);

export default class index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <View style={{ height: getStatusBarHeight(true) }}></View>
                    <App />
                </PersistGate>
            </Provider>
        );
    }
}