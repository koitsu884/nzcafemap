import React from 'react';
import SvgStarFull from '../common/SvgIcons/SvgStarFull';
import SvgStarHalf from '../common/SvgIcons/SvgStarHalf';
import SvgStarEmpty from '../common/SvgIcons/SvgStarEmpty';

const createRateElement = ({rate}) => {
    let temp = +rate * 10;
    let fullNum = Math.floor(temp / 10);
    let halfNum = temp % 10 >= 5 ? 1 : 0;
    const items = [];
    for (let i = 0; i < 5; i++) {
        if (i < fullNum) {
            items.push(<span key={i + 1} className="starRate__star"><SvgStarFull /></span>)
        }
        else if (i === fullNum && halfNum > 0) {
            items.push(<span key={i + 1} className="starRate__star "><SvgStarHalf /></span>)
        }
        else {
            items.push(<span key={i + 1} className="starRate__star star__empty"><SvgStarEmpty /></span>)
        }
    }

    return items;
}

export default function StarRate(rate) {
    return (
        <span className="starRate">
            {createRateElement(rate)}
        </span>
    )
}
