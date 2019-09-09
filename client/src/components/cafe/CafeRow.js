import React from 'react'
import Image from '../common/CloudinaryImage';

export default function CafeRow(props) {
    const {cafe} = props;
    return (
        <div className="cafeRow">
            {/* {cafe.photo ? <img className="cafeRow__image image" src={cafe.photo} alt={cafe.name} /> : <p className="cafeRow__image">No image</p>} */}
            {
                cafe.mainPhotoURL ?
                (
                    <Image  className="cafeRow__image" public_id={cafe.mainPhotoURL} thumb={true} />
                ) 
                : <p className="cafeRow__image">No image</p>
            }
            <h3 className="cafeRow__name">{cafe.name}</h3>
            <div className="cafeRow__area">{cafe.area}</div>
            <div className="cafeRow__address">{cafe.address}</div>
        </div>
    )
}
