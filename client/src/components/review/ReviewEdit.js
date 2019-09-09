import React, { Component } from 'react'
import ReviewEditForm from './ReviewEditForm';

export default class ReviewEdit extends Component {

    render() {
        const { reviewId } = this.props.match.params;
        return (
            <div className="reviewForm">
                <ReviewEditForm id={reviewId} />
            </div>
        )
    }
}
