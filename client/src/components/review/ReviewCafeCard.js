import React from 'react';
import { Link } from 'react-router-dom';

import SvgLocation from '../common/SvgIcons/SvgLocation';
import SvgFood from '../common/SvgIcons/SvgFood';
import SvgSweets from '../common/SvgIcons/SvgSweets';
import SvgVibe from '../common/SvgIcons/SvgVibe';
import SvgCoffee from '../common/SvgIcons//SvgCoffee';

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
                    {reviewWithCafe.cafe.mainPhotoURL ? <Image public_id={reviewWithCafe.cafe.mainPhotoURL} /> : <div>No Image</div>}
                </div>
                <div className="reviewCafeCard__name">
                    <h3>{reviewWithCafe.cafe.name}</h3>
                </div>
                <div className="reviewCafeCard__info">
                    {renderLocation(reviewWithCafe.cafe.area)}
                    <div className="reviewCafeCard__info__rate">
                        <div className="reviewCafeCard__info__rate__item"><SvgCoffee className="reviewCafeCard__info__rate__item__icon" /><StarRate rate={reviewWithCafe.cafe.rateCoffeeAve} /></div>
                        <div className="reviewCafeCard__info__rate__item"><SvgFood className="reviewCafeCard__info__rate__item__icon" /><StarRate rate={reviewWithCafe.cafe.rateFoodAve} /></div>
                        <div className="reviewCafeCard__info__rate__item"><SvgSweets className="reviewCafeCard__info__rate__item__icon" /><StarRate rate={reviewWithCafe.cafe.rateSweetsAve} /></div>
                        <div className="reviewCafeCard__info__rate__item"><SvgVibe className="reviewCafeCard__info__rate__item__icon" /><StarRate rate={reviewWithCafe.cafe.rateVibeAve} /></div>
                    </div>
                </div>
                <hr />
                <div className="reviewCafeCard__user">
                    <div className="reviewCafeCard__user__header">
                        {reviewWithCafe.user.mainPhotoURL ? <Image public_id={reviewWithCafe.user.mainPhotoURL} thumb={true} alt={reviewWithCafe.user.displayName} title={reviewWithCafe.user.displayName} /> : null}
                        <h5 className="reviewCafeCard__user__title">{reviewWithCafe.title}</h5>
                    </div>
                    <div className="reviewCafeCard__user__comment">{reviewWithCafe.comment.length > 50 ? reviewWithCafe.comment.substr(0, 50) + '...' : reviewWithCafe.comment}</div>
                </div>
            </div>
        </Link>
    )
}
