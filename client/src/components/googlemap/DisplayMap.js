import React, { Component } from 'react'

class DisplayMap extends Component {
    constructor(props) {
        super(props);
        this.apiKey = props.apiKey;
        this.state = {
            loading: false
        }
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

    onScriptLoad = () => {
        const {lat, long, placeId} = this.props;
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
