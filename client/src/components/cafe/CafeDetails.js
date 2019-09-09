import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getCafeDetails } from '../../actions/cafeActions';
import Spinner from '../common/Spinner';
import Image from '../common/CloudinaryImage';
import ReviewRow from '../review/ReviewRow';
import CafeRate from './CafeDetails/CafeRate';
import CafeRateAverage from './CafeDetails/CafeRateAverage';
import LatestReviewPhotos from './CafeDetails/LatestReviewPhotos';
import CafeLocation from './CafeDetails/CafeLocation';

class CafeDetails extends Component {
    componentDidMount() {
        const { params } = this.props.match;
        this.props.getCafeDetails(params.id);
        window.scrollTo(0,0);
    }

    renderDetails = () => {
        const { cafeDetails, userId, loading } = this.props;

        if (loading || !cafeDetails) return (
            <Spinner />
        )

        return (
            <Fragment>
                <h1>{cafeDetails.name}</h1>
                <div className="cafeDetails__data">
                    <div className="cafeDetails__data__garelly">
                        <div className="cafeDetails__image">
                            {cafeDetails.mainPhotoURL ? <Image public_id={cafeDetails.mainPhotoURL} alt="mainPhoto" /> : "No Image"}
                        </div>
                        <div>
                            <LatestReviewPhotos cafeId={cafeDetails._id} />
                        </div>
                    </div>
                    <div className="cafeDetails__data__rate">
                        <CafeRateAverage cafeDetails={cafeDetails} />
                        {
                            this.props.userId ?
                                <Fragment>

                                    <h4>あなたの評価</h4>
                                    <CafeRate cafeId={cafeDetails._id} userId={userId} />
                                </Fragment>
                                : null
                        }

                    </div>
                </div>
                <div className="cafeDetails__info">
                    <CafeLocation cafeDetails={cafeDetails} />
                    <div className="cafeDetails__info__hours">
                        <h4>営業時間</h4>
                        <div>
                            {cafeDetails.openingHours}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

    renderReviews = () => {
        const { reviews } = this.props;

        if (!reviews || reviews.length === 0) {
            return (
                <div>まだレビューがありません</div>
            )
        }

        return (
            <div className="cafeDetails__reviews">
                {
                    reviews.map(review => {
                        return (
                            <ReviewRow review={review} key={review._id} />
                        )
                    })
                }
                <Link to={`/cafes/${this.props.cafeDetails._id}/review/all`}>全てのレビューを読む</Link>
            </div>
        )
    }

    render() {
        return (
            <div className="cafeDetails">
                {this.renderDetails()}
                <hr />
                <h2>レビュー</h2>
                {this.renderReviews()}
                {this.props.userId
                    ? <div className="cafeDetails__addReview">
                        <Link className="btn" to={`${this.props.match.url}/review`}>レビューを書く</Link>
                    </div>
                    : null
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    cafeDetails: state.cafe.cafeDetails,
    userId: state.user.user._id,
    reviews: state.cafe.latestReviews,
    loading: state.cafe.loading
})

export default connect(mapStateToProps, { getCafeDetails })(CafeDetails);
