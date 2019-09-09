import React from 'react'
import { Link } from 'react-router-dom';

import Image from '../common/CloudinaryImage';

export default function CafeCardSimple({ cafe }) {
    return (
        <Link to={`/cafes/${cafe._id}`}>
            <div className="cafeCardSimple">
                <div className="cafeCardSimple__image">
                    {cafe.mainPhotoURL ? <Image public_id={cafe.mainPhotoURL} thumb={true} /> : <div>No Image</div>}
                </div>
                <div>
                    <div className="cafeCardSimple__title">{cafe.name}</div>
                    <h4>{cafe.area}</h4>
                    <div>{cafe.address}</div>
                </div>
            </div>
        </Link>
    )
}
