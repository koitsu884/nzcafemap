import React from 'react';
import { Link } from 'react-router-dom';

import SvgCoffee from '../../common/SvgIcons/SvgCoffee';
import SvgFood from '../../common/SvgIcons/SvgFood';
import SvgVibe from '../../common/SvgIcons/SvgVibe';
import SvgLocation from '../../common/SvgIcons/SvgLocation';

import Image from '../common/CloudinaryImage';
import StarRate from '../common/StarRate';

const renderLocation = (area) => {
    let areaItems = area.split(' - ');

    return (
        <div className="reviewCafeCard__info__area"> 
            <SvgLocation /><p>{areaItems[1]}</p>
        </div>
    )
}

export default function ReviewCafeCard({ reviewWithCafe }) {
    return (
        <Link to={`/cafes/${reviewWithCafe.cafe._id}`}>
            <div className="reviewCafeCard">
                <div className="reviewCafeCard__image">
                    {reviewWithCafe.cafe.mainPhotoURL ? <Image public_id={reviewWithCafe.cafe.mainPhotoURL}  /> : <div>No Image</div>}
                </div>
                <div className="reviewCafeCard__name">
                    <h3>{reviewWithCafe.cafe.name}</h3>
                </div>
                <div className="reviewCafeCard__info">
                    {renderLocation(reviewWithCafe.cafe.area)}
                    <div className="reviewCafeCard__info__rate"><SvgCoffee className="reviewCafeCard__info__rate__icon" /><StarRate rate={reviewWithCafe.cafe.rateCoffeeAve}/></div>
                    <div className="reviewCafeCard__info__rate"><SvgFood className="reviewCafeCard__info__rate__icon" /><StarRate rate={reviewWithCafe.cafe.rateFoodAve} /></div>
                    <div className="reviewCafeCard__info__rate"><SvgVibe className="reviewCafeCard__info__rate__icon" /><StarRate rate={reviewWithCafe.cafe.rateVibeAve} /></div>
                </div>
                <hr />
                <div className="reviewCafeCard__user">
                    {reviewWithCafe.user.mainPhotoURL ? <Image public_id={reviewWithCafe.user.mainPhotoURL} thumb={true} alt={reviewWithCafe.user.displayName} title={reviewWithCafe.user.displayName} /> : null}
                    <p>{reviewWithCafe.title}</p>
                </div>
            </div>
        </Link>
    )
}
