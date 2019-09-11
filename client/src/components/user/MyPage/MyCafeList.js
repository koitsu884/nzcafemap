import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { getMyCafes, deleteCafe } from '../../../actions/myPageActions';

import EditCafePhoto from '../../cafe/EditCafePhoto';
import EditIcon from '../../common/SvgIcons/SvgEdit';
import DeleteIcon from '../../common/SvgIcons/SvgDelete';
import CafeCardSimple from '../../cafe/CafeCardSimple';
import Spinner from '../../common/Spinner';

Modal.setAppElement("#root")

class MyCafeList extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
            selectedCafeId: null
        };
    }

    componentDidMount() {
        this.props.getMyCafes();
    }

    openModal = cafeId => {
        this.setState({ 
            selectedCafeId: cafeId,
            modalIsOpen: true 
        });
    }

    afterOpenModal = () => {}

    onPhotoSelected = () => {
        this.closeModal();
        this.props.getMyCafes();
    }

    onCancelUpload = () => {
        this.closeModal();
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false });
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
                    {!cafe.mainPhotoURL ? <button type="button" onClick={() => this.openModal(cafe._id)} className="btn btn--secondary myCafeList__container__uploadPhotoButton">写真を設定する</button> : null}
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
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    contentLabel="Setting main photo"
                    style={{ overlay: { zIndex: 1000 } }}
                >
                    <EditCafePhoto id={this.state.selectedCafeId} onPhotoSelected={this.onPhotoSelected} onCancel={this.onCancelUpload} />
                </Modal>
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