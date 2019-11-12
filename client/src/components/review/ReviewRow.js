import React from 'react';
import Image from '../common/CloudinaryImage';
import LinkCard from '../common/LinkCard';
import PhotoGarelly from '../common/PhotoGarelly';

function renderReviewPhotos(review) {
    let count = 0;
    let photos = review.photoURLs.map(photoURL => {
        return { _id: ++count, public_id: photoURL, user: review.user}
    })

    return <PhotoGarelly photos={photos} overflowType="scrollX" />
    // let imageElements = photoURLs.map(photoURL => {
    //     return <Image className="reviewRow__photos__image" thumb={true} public_id={photoURL} alt={photoURL} key={photoURL} />
    // })
    // return (
    //     <div className="reviewRow__photos">
    //         {imageElements}
    //     </div>
    // )
}

export default function ReviewRow(props) {
    const { review } = props;
    return (
        <div className="reviewRow">
            <div className="reviewRow__header">
                <h3>{review.title}</h3>
            </div>
            <div className="reviewRow__user">
                <div className="reviewRow__user__image">
                    {
                        review.user.mainPhotoURL
                            ? <Image thumb={true} public_id={review.user.mainPhotoURL} alt={review.user.displayName} />
                            : 'No Image'
                    }
                </div>
                {review.user.displayName}
            </div>
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
