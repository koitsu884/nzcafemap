import React, { useState, useEffect } from 'react'

import SvgArrowUp from '../common/SvgIcons/SvgArrowUp';

export default function ScrollToTopButton() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    })

    const handleClick = () => {
        window.scroll({
            top: 0,
            behavior: 'smooth',
        });
        // setVisible(false)
    }

    const handleScroll = () => {
        setVisible(window.pageYOffset > 100 ? true : false)
    };

    return (
        <div className={`scrollTopButton ${visible ? '' : 'hidden'}`} onClick={handleClick}>
            <SvgArrowUp />
        </div>
    )
}