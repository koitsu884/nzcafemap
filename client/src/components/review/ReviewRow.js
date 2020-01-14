import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../common/CloudinaryImage';
import LinkCard from '../common/LinkCard';
import PhotoGarelly from '../common/PhotoGarelly';

function renderReviewPhotos(review) {
    let count = 0;
    let photos = review.photoURLs.map(photoURL => {
        return { _id: ++count, public_id: photoURL, user: review.user}
    })

    return <PhotoGarelly photos={photos} overflowType="scrollX" />
}

export default function ReviewRow(props) {
    const { review } = props;
    return (
        <div className="reviewRow">
            <div className="reviewRow__header">
                <h3>{review.title}</h3>
            </div>
            <Link to={`/users/${review.user._id}`}className="reviewRow__user">
                <div className="reviewRow__user__image">
                    {
                        review.user.mainPhotoURL
                            ? <Image thumb={true} public_id={review.user.mainPhotoURL} alt={review.user.displayName} />
                            : <span>No Image</span>
                    }
                </div>
                {review.user.displayName}
            </Link>
            <div className="reviewRow__content">
                {review.comment}
            </div>
            {
                review.photoURLs.length > 0 ? renderReviewPhotos(review) : null
            }
            {
                review.articleInfo ? <LinkCard linkInfo={JSON.parse(review.articleInfo)} /> : null
            }
        </div>
    )
}
