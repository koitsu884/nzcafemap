/* global window.google */

import React, { Component } from 'react';
import { loadGMapScripts } from './GoogleMap';

// const google = window.google;

class DisplayMap extends Component {
    constructor(props) {
        super(props);
        this.apiKey = props.apiKey;
        this.state = {
            loading: false
        }
    }

    componentDidMount = () => {
        loadGMapScripts(this.loadMap);
    }

    loadMap = () => {
        const { lat, long, placeId } = this.props;
        var latLng = { lat: lat, lng: long };

        this.map = new window.google.maps.Map(document.getElementsByClassName('displayMap')[0], {
            center: latLng,
            zoom: 15
        });

        this.marker = new window.google.maps.Marker({
            map: this.map,
            position: latLng,
            title: placeId
        });
    }

    render() {
        return (
            <div className="displayMap"></div>
        )
    }
}

export default DisplayMap;
