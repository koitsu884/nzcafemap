import React from 'react'

const limitedStr = str => {
    let max = 150;
    if (str.length > max)
        return str.substr(0, max) + '...';
    return str;
}

export default function LinkCard({ linkInfo }) {
    if (!linkInfo.title)
        return <a href={linkInfo.url} target="_blank" rel="noopener noreferrer" >{linkInfo.url}</a>

    return (
        <div className="linkCard">
            <a href={linkInfo.url} target="_blank" rel="noopener noreferrer" >
                {linkInfo.image ? <img className="linkCard__image" alt="article image" sizes="300px" srcSet={linkInfo.image}></img> : null}
                <div>
                    <div className="linkCard__title">{linkInfo.title}</div>
                    <div className="linkCard__description">{limitedStr(linkInfo.description)}</div>
                </div>
            </a>
        </div>
    )
}
