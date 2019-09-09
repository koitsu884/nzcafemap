import React, { Component } from 'react'

export class PlaceSearch extends Component {
    constructor(props) {
        super(props);
        this.apiKey = props.apiKey;
        this.state = {
            placeID: "",
            placeDetails: null,
            loading: false
        }
    }

    onScriptLoad = () => {
        this.map = new window.google.maps.Map(document.getElementsByClassName('placeSearch__result--map')[0], {
            center: { lat: -36.848461, lng: 174.763336 }, //Auckland
            zoom: 15
        });

        this.marker = new window.google.maps.Marker({
            map: this.map,
            anchorPoint: new window.google.maps.Point(0, -29),
            visible: false
        });

        var input = document.getElementById('placesearch');
        this.autocomplete = new window.google.maps.places.Autocomplete(input);
        this.autocomplete.setTypes(['establishment']);
        this.autocomplete.bindTo('bounds', this.map);
        this.autocomplete.setComponentRestrictions({'country': ['nz']});
        this.autocomplete.setFields(['address_components', 'geometry', 'place_id', 'icon', 'name', 'opening_hours']);
        this.autocomplete.addListener('place_changed', this.onPlaceChanged);
    }

    onPlaceChanged = () => {
        var place = this.autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            this.map.fitBounds(place.geometry.viewport);
        } else {
            this.map.setCenter(place.geometry.location);
            this.map.setZoom(17);  // Why 17? Because it looks good.
        }
        this.marker.setPosition(place.geometry.location);
        this.marker.setVisible(true);

        this.setState({
            placeDetails: place
        });

        this.props.onPlaceChanged(place);
    }

    componentDidMount() {
        if (!window.google) {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places&language=ja`;
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
            s.addEventListener('load', e => {
                this.onScriptLoad();
            })
        } else {
            this.onScriptLoad();
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="placeSearch">
                    <input className="form__input" id="placesearch" type="text" placeholder="店名を入力してください" />
                    <div className="placeSearch__result--map" id="map"></div>
                </div>
            </ React.Fragment>
        )
    }
}

export const convertPlaceToDetails = (place) => {
    let placeDetails = {};
    let streetNumber = '';
    let streetName = '';

    placeDetails.placeID = place.place_id;
    placeDetails.name = place.name;
    placeDetails.long = place.geometry ? place.geometry.location.lng() : null;
    placeDetails.lat = place.geometry ? place.geometry.location.lat() : null;
    placeDetails.openingHours = place.opening_hours ? place.opening_hours.weekday_text.join('\n') : '';

    place.address_components.forEach(address_component => {
        if(address_component.types.includes('street_number'))
            streetNumber = address_component.long_name;
        else if(address_component.types.includes('route'))
            streetName = address_component.long_name;
        else if(address_component.types.includes('sublocality'))
            placeDetails.suburb = address_component.long_name;
        else if(address_component.types.includes('administrative_area_level_1'))
            placeDetails.region = address_component.long_name;
        else if(address_component.types.includes('locality'))
            placeDetails.city = address_component.long_name;
    })

    placeDetails.street = streetNumber + ' ' + streetName;

    return placeDetails;
}
