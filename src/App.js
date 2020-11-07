
import React, { Component } from 'react';
import {LogBox} from 'react-native';
import App from "./navigation";


LogBox.ignoreAllLogs(true);

export default class index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <App />
        );
    }
}