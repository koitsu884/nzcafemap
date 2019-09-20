import React from 'react';
import { Link } from 'react-router-dom';

import SvgLocation  from '../common/SvgIcons/SvgLocation';
import SvgFood  from '../common/SvgIcons/SvgFood';
import SvgSweets  from '../common/SvgIcons/SvgSweets';
import SvgVibe from '../common/SvgIcons/SvgVibe';
import SvgCoffee  from '../common/SvgIcons//SvgCoffee';

import StarRate from '../common/StarRate';


import Image from '../common/CloudinaryImage';


export default function CafeCard(props) {
    const { cafe } = props;
    return (
        <Link to={`/cafes/${cafe._id}`}>
            <div className="cafeCard">
                <h3>{cafe.name}</h3>
                <div className="cafeCard__header">
                    <div className="cafeCard__image">
                        {cafe.mainPhotoURL ? <Image public_id={cafe.mainPhotoURL} thumb={true} /> : <div>No Image</div>}
                    </div>
                    <div className="cafeCard__details">
                        <div className="cafeCard__rate"><SvgCoffee className="cafeCard__rate__icon" /><StarRate rate={cafe.rateCoffeeAve} /></div>
                        <div className="cafeCard__rate"><SvgFood className="cafeCard__rate__icon" /><StarRate rate={cafe.rateFoodAve} /></div>
                        <div className="cafeCard__rate"><SvgSweets className="cafeCard__rate__icon" /><StarRate rate={cafe.rateSweetsAve} /></div>
                        <div className="cafeCard__rate"><SvgVibe className="cafeCard__rate__icon" /><StarRate rate={cafe.rateVibeAve} /></div>
                    </div>
                </div>
                <div className="cafeCard__info">
                    <div className="cafeCard__area"><SvgLocation />{cafe.area}</div>
                </div>
            </div>
        </Link>

    )
}
