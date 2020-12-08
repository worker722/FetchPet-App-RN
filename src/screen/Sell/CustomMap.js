import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Utils from '@utils';
import { BaseColor } from '@config';
import * as Animatable from 'react-native-animatable';

export default class CustomMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region: null,
            userLocation: '',
            animType: null
        };
    }

    componentWillMount = () => {
        this.getCurrentLocation();
    }

    pickLocation = () => {
        const navigation = this.props.navigation;
        navigation.state.params.selectLocation(this.state.region);
        navigation.goBack(null);
    }

    getCurrentLocation = () => {
        const currentRegion = this.props.navigation.state.params.currentRegion;
        if (currentRegion) {
            this.setState({
                region: {
                    latitude: currentRegion.latitude,
                    longitude: currentRegion.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                }
            });
            this.getUserLocation(currentRegion.latitude, currentRegion.longitude);
        }
        else {
            Utils.getCurrentLocation().then(
                (data) => {
                    this.setState({
                        region: {
                            latitude: data.latitude,
                            longitude: data.longitude,
                            latitudeDelta: 0.001,
                            longitudeDelta: 0.001
                        }
                    });
                    this.getUserLocation(data.latitude, data.longitude);
                }
            );
        }
    }

    onAddressSelected = (location) => {
        this.setState({
            region: {
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            }
        });
        this.getUserLocation(location.lat, location.lng);
    }

    onMapRegionChange = (region) => {
        this.setState({ region });
        this.getUserLocation(region.latitude, region.longitude);
    }

    getUserLocation = (latitude, longitude) => {
        Utils.getAddressByCoords(latitude, longitude, false, (userLocation) => {
            this.setState({ userLocation, animType: 'fadeInUp' });
        })
    }

    render = () => {
        const { region, userLocation, animType } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    region={region}
                    showsUserLocation={true}
                    onRegionChange={(reg) => this.onMapRegionChange(reg)}>
                    {region &&
                        <Marker
                            coordinate={region} />}
                </MapView>
                <View style={{ position: "absolute", top: 30, left: 15, right: 15 }}>
                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        autoFocus={false}
                        returnKeyType={'search'}
                        listViewDisplayed='auto'
                        fetchDetails={true}
                        renderDescription={row => row.description}
                        onPress={(data, details = null) => {
                            this.onAddressSelected(details.geometry.location);
                        }}
                        currentLocation={true}
                        currentLocationLabel="Current location"
                        nearbyPlacesAPI='GooglePlacesSearch'
                        debounce={300}
                        query={{
                            key: Utils.GOOGLE_API_KEY,
                            language: 'en',
                        }}
                        styles={{
                            textInput: {
                                borderColor: BaseColor.dddColor,
                                borderWidth: 1,
                                borderRadius: 10,
                            },
                        }}
                    />
                </View>
                {animType &&
                    <View style={{ position: "absolute", padding: 20, bottom: 0, width: "100%", borderWidth: 1, borderColor: BaseColor.dddColor, backgroundColor: BaseColor.whiteColor, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <Animatable.View animation={animType} iterationCount={1} direction="normal">
                            <Text style={{ color: BaseColor.greyColor }}>Location</Text>
                            <Text style={{ fontSize: 17, marginTop: 10 }}>{userLocation}</Text>
                            <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end", marginTop: 15 }}>
                                <TouchableOpacity
                                    onPress={this.pickLocation}
                                    style={{ backgroundColor: BaseColor.primaryColor, borderRadius: 5, padding: 10, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ color: BaseColor.whiteColor }}>Pick This Location</Text>
                                </TouchableOpacity>
                            </View>
                        </Animatable.View>
                    </View>
                }
            </View>
        )
    }
}