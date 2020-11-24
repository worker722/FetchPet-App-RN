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
                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        currentLocation={true}
                        fetchDetails={true}
                        styles={{flex:1}}
                        nearbyPlacesAPId={"GooglePlacesSearch"}
                        onPress={(data, details = null) => {
                            console.log(data, details);
                        }}
                        query={{
                            key: 'AIzaSyD7D5BGKn-3fNwAlg27vzGvxYM0QS9WUVg',
                            language: 'en',
                        }}
                    />
                {/* <MapView
                    style={{ flex: 1 }}
                >
                </MapView> */}
            </View>
        )
    }
}