import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

import Spinner from '../../common/Spinner';
import Pagination from '../../common/Pagination';
import Alert from '../../../helper/Alert';
import { getMyReviews } from '../../../actions/myPageActions';

import DeleteIcon from '../../common/SvgIcons/SvgDelete';
import ReviewCardSimple from '../../review/ReviewCardSimple';

const baseURL = process.env.REACT_APP_API_URL;

class MyReviewList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews: null,
            loading: true
        }
    }

    componentDidMount() {
        this.getMyReviews();
    }

    getMyReviews = () => {
        this.props.getMyReviews();
    }

    handleDelete = id => {
        Alert.confirm('このレビューを本当に削除しますか？')
        .then((result) => {
            if (result.value) {
                axios.delete('reviews/' + id, {baseURL:baseURL}).then(response => {
                    this.getMyReviews();
                })
                .catch(errors => {
                    console.log(errors);
                })
            }
        })
    }

    renderReviews = () => {
        if (this.props.loading) {
            return <Spinner />
        }
        return this.props.reviews.map(review => {
            return (
                <div key={review._id}>
                    <ReviewCardSimple review={review} />
                    <DeleteIcon onClick={() => this.handleDelete(review._id)} className="icon-sm icon-delete" />
                </div>
            )
        })
    }

    handlePageClick = selectedPage => {
        let order = '';
        this.props.getMyReviews(order, selectedPage);
    }

    render() {
        return (
            <Fragment>
                <div className="myReviewList">
                    {this.renderReviews()}
                </div>
                <Pagination
                    itemCount={this.props.pagination.itemCount}
                    pageSize={this.props.pagination.pageSize}
                    onPageChange={this.handlePageClick}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    reviews: state.myPage.reviews,
    pagination: state.myPage.reviewPagination,
    loading: state.myPage.reviewLoading
})

export default connect(mapStateToProps, { getMyReviews })(MyReviewList);