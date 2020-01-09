import React from 'react'
import SvgTwitter from '../common/SvgIcons/SvgTwitter';

const baseURL = process.env.REACT_APP_API_URL;

export default function TwitterLogin() {
    return (
        <div className="button-twitter">
            <a href={`${baseURL}/auth/twitter`}>
                <SvgTwitter className="button-twitter__icon" /><span>ツイッターでログイン</span>
            </a>
        </div>
    )
}
