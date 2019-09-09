import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { getMyCafes, deleteCafe } from '../../../actions/myPageActions';

import EditIcon from '../../common/SvgIcons/SvgEdit';
import DeleteIcon from '../../common/SvgIcons/SvgDelete';
import CafeCardSimple from '../../cafe/CafeCardSimple';
import Spinner from '../../common/Spinner';

class MyCafeList extends Component {
    componentDidMount() {
        this.props.getMyCafes();
    }

    onClickDelete = (id) => {
        Swal.fire({
            title: '確認',
            text: 'カフェ情報を削除しますか？（関連レビューも全て削除されます）',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: "キャンセル",
            animation: 'false'
        }).then((result) => {
            if (result.value) {
                this.props.deleteCafe(id);
            }
        })
    }

    renderList = cafes => {
        return cafes.map(cafe => {
            return (
                <div key={cafe._id} className="myCafeList__container">
                    <CafeCardSimple key={cafe._id} cafe={cafe} />
                    <div className="myCafeList__tools">
                        <Link to={`/cafes/${cafe._id}/edit`}>
                            <EditIcon className="myCafeList__tools--edit" />
                        </Link>
                        <DeleteIcon onClick={() => this.onClickDelete(cafe._id)} className="myCafeList__tools--delete" />
                    </div>
                </div>
            )
        });
    }

    render() {
        return (
            <Fragment>
                <div className="myCafeList">
                    {
                        this.props.loading
                            ? <Spinner />
                            : <div className="myCafeList__result">{this.renderList(this.props.cafes)}</div>
                    }
                </div>
                {
                    this.props.pagination.pageCount > 1 ?
                        <ReactPaginate
                            previousLabel={'前のページ'}
                            nextLabel={'次のページ'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={this.props.pagination.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                        />
                        : null
                }
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    // filters: state.cafe.filters,
    cafes: state.myPage.cafes,
    pagination: state.myPage.cafePagination,
    loading: state.myPage.cafeLoading
})

export default connect(mapStateToProps, { getMyCafes, deleteCafe })(MyCafeList);