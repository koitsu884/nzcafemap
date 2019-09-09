import React, {Fragment} from 'react'

import StarRate from '../../common/StarRate';

import SvgCoffee from '../../common/SvgIcons/SvgCoffee';
import SvgFood from '../../common/SvgIcons/SvgFood';
import SvgVibe from '../../common/SvgIcons/SvgVibe';

export default function CafeRateAverage({ cafeDetails }) {
    if (!cafeDetails.rateCount) {
        return null;
    }

    return (
        <Fragment>
            <h3>評価平均 ({cafeDetails.rateCount})</h3>
            <div className="cafeDetails__data__rate__container">
                <div>
                    <div className="cafeDetails__data__rate__title"><SvgCoffee />コーヒー</div>
                    <StarRate className="cafeDetails__data__rate__value" rate={cafeDetails.rateCoffeeAve} />
                </div>
                <div>
                    <div className="cafeDetails__data__rate__title"><SvgFood />食事</div>
                    <StarRate rate={cafeDetails.rateFoodAve} />
                </div>
                <div>
                    <div className="cafeDetails__data__rate__title"><SvgVibe />雰囲気・サービス</div>
                    <StarRate rate={cafeDetails.rateVibeAve} />
                </div>
            </div>
            <hr />
        </Fragment>
    )

}
