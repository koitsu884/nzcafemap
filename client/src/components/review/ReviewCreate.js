import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReviewEditForm from './ReviewEditForm';

class ReviewCreate extends Component {
    render() {
        if (!this.props.cafeDetails) {
            return (
                <div>カフェ情報が取得できませんでした</div>
            )
        }
        return (
            <div className="reviewForm">
                <ReviewEditForm cafeName={this.props.cafeDetails.name} cafeId={this.props.cafeDetails._id} />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    cafeDetails: state.cafe.cafeDetails
});

export default connect(mapStateToProps, null)(ReviewCreate);