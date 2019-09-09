import React, {Fragment} from 'react';
import Image from '../common/CloudinaryImage';

const renderReviewImages = (photoURLs) => {
    return (
        <Fragment>
            
            <div className="reviewCardSimple__reviewImages">
                <hr />
                <div className="reviewCardSimple__reviewImages__container">
                {
                    photoURLs.map(photoURL => {
                        return <Image key={photoURL} public_id={photoURL} thumb={true} />
                    })
                }
                </div>
            </div>
        </Fragment>
    )
}

export default function ReviewCardSimple({review}) {
    return (
        <div className="reviewCardSimple">
            <div className="reviewCardSimple__cafe">
                <div className="reviewCardSimple__cafe__image">
                    {review.cafe.mainPhotoURL ? <Image public_id={review.cafe.mainPhotoURL} thumb={true} /> : 'No Image'}
                </div>
                <div className="reviewCardSimple__cafe__title">{review.cafe.name}</div>
            </div>
            <div className="reviewCardSimple__review">
                <div className="reviewCardSimple__review__title">{review.title}</div>
                <div>{review.comment}</div>
                {
                    review.photoURLs.length > 0 ? renderReviewImages(review.photoURLs) : null
                }
            </div>
        </div>
    )
}
