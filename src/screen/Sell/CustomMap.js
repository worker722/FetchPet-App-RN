import React, { Component } from 'react';
import {
    View
} from 'react-native';
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default class CustomMap extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ position: "absolute", top: 10, justifyContent: "center", alignItems: "center", width: "100%", height: 50 }}>
                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        // currentLocation={true}
                        fetchDetails={true}
                        nearbyPlacesAPId={"GooglePlacesSearch"}
                        onPress={(data, details = null) => {
                            console.log(data, details);
                        }}
                        query={{
                            key: 'AIzaSyAmnk3Obj7VDY1GfuZ_A6ep8voAGqJfayE',
                            language: 'en',
                        }}
                    />
                </View>
                <MapView
                    style={{ flex: 1 }}
                >
                </MapView>
            </View>
        )
    }
}