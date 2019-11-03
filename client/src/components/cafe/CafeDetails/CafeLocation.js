import React from 'react';
import SvgLocation from '../../common/SvgIcons/SvgLocation';
import DisplayMap from '../../googlemap/DisplayMap';
const apiKey = process.env.REACT_APP_GOOGLEAPI_KEY;

export default function CafeLocation({cafeDetails}) {
    return (
        <div className="cafeDetails__location">
            <div className="cafeDetails__location__area"><SvgLocation />{cafeDetails.area}</div>
            <div className="cafeDetails__location__address">住所: {cafeDetails.address}</div>
            <a href={`https://www.google.com/maps/place/?q=place_id:${cafeDetails.placeID}`}  target="_blank" rel="noopener noreferrer" >
                <DisplayMap apiKey={apiKey} google={window.google} className="cafeDetails__location__map" long={cafeDetails.long} lat={cafeDetails.lat} placeId={cafeDetails.placeID} />
            </a>
        </div>
    )
}
