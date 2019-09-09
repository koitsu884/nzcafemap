import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

import Spinner from '../common/Spinner';
import ReviewRow from './ReviewRow';

const baseURL = process.env.REACT_APP_API_URL;

class ReviewList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviewList: null,
            loading: false,
            page: 1,
            pageSize: 10,
            itemCount: 0,
            pageCount: 1
        }
    }

    handlePageClick = data => {
        let selected = data.selected;
        this.setState({ page: selected + 1 }, this.getReviews);
    }

    getReviews() {
        const { cafeDetails } = this.props;
        if (cafeDetails) {
            axios.get(`cafes/${cafeDetails._id}/reviews`, {
                baseURL: baseURL,
                params: {
                    page: this.state.page,
                    pageSize: this.state.pageSize
                }
            })
                .then(response => {
                    this.setState({
                        reviewList: response.data.reviews,
                        page: response.data.currentPage,
                        itemCount: response.data.totalCount,
                        pageCount: Math.ceil(response.data.totalCount / this.state.pageSize)
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    componentDidMount() {
        this.getReviews();
    }

    renderReviewList(reviewList) {
        let contents = reviewList.map(review => {
            return <ReviewRow review={review} key={review._id} cafeDetails={this.props.cafeDetails} />
        })

        return (
            <div>
                {contents}
                {
                    this.state.pageCount > 1 ?
                        <ReactPaginate
                            previousLabel={'前のページ'}
                            nextLabel={'次のページ'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                        />
                        : null
                }
            </div>
        )
    }

    render() {
        if (!this.props.cafeDetails) return null;

        let content = this.state.reviewList ? this.renderReviewList(this.state.reviewList) : <Spinner />;
        return (
            <div className="reviewList">
                <h1>{this.props.cafeDetails.name} のレビュー</h1>
                <div className="reviewList__result">
                    {content}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    cafeDetails: state.cafe.cafeDetails
})

export default connect(mapStateToProps, null)(ReviewList);