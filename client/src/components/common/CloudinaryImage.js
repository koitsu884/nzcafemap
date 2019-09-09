import React, { Fragment, useState, useEffect } from 'react'
import Spinner from './Spinner';

const cloudinaryName = process.env.REACT_APP_CLOUDINARY_NAME;

const buildUrl = (public_id, version, thumb, width) => {
    let translate = null;
    if (thumb) {
        translate = 'c_thumb,w_200';
    }
    else if (width) {
        translate = 'c_scale,w_' + width;
    }

    let path = version ? `v${version}/${public_id}` : public_id;

    return `https://res.cloudinary.com/${cloudinaryName}/image/upload${translate ? '/' + translate : ''}/${path}`;
}

const CloudinaryImage = ({
    onLoad,
    public_id,
    version,
    className,
    thumb,
    width,
    alt,
    title }) => {

    const [loading, setLoading] = useState(true);
    const imagePath = buildUrl(public_id, version, thumb, width);
    // setLoading(true);
    useEffect(() => {
        setLoading(true);
    }, [public_id])

    return (
        <Fragment>
            {loading ? <Spinner /> : <img className={className} alt={alt} title={title} src={imagePath} />}
            <div className="hidden">
                <img onLoad={() => setLoading(false)} src={imagePath} alt="hidden" />
            </div>
        </Fragment>
    )
}

export default CloudinaryImage; 
