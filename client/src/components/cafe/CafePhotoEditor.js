import React, { Component } from 'react'
import Modal from 'react-modal';
import EditCafePhoto from './EditCafePhoto';
import Spinner from '../common/Spinner';
import Swal from 'sweetalert2';
import Image from '../common/CloudinaryImage';

import { deleteMainPhoto } from '../../actions/photoActions';
import { connect} from 'react-redux';

Modal.setAppElement("#root")

class CafePhotoEditor extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false
        };
    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        // this.subtitle.style.color = '#f00';
    }

    onPhotoSelected = () => {
        this.closeModal();
    }

    onCancelUpload = () => {
        this.closeModal();
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    }

    onDeletePhoto = () => {
        Swal.fire({
            title: '確認',
            text: '本当に写真を削除しますか？',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: "キャンセル",
            animation: 'false'
        }).then((result) => {
            if (result.value) {
                this.props.deleteMainPhoto('cafes', this.props.cafeDetails._id);
            }
        })
    }


    renderPhoto = () => {
        if (this.props.uploading) {
            return (
                <Spinner />
            )
        }
        if (this.props.cafeDetails && this.props.cafeDetails.mainPhotoURL) {
            let { mainPhotoURL} = this.props.cafeDetails;
            return (
                <Image public_id={mainPhotoURL} alt="main_image" />
            )
        }

        return (
            <div className="no-image"></div>
        )
    }


    render() {
        return (
            <div className="userPhotoEditor">
                <h3>メインフォト</h3>
                <div className="userPhotoEditor__photo">
                    {this.renderPhoto()}
                </div>
                <button className="btn" type="button" onClick={this.openModal} disabled={this.props.uploading}>編集</button>
                <button className="btn" type="button" onClick={this.onDeletePhoto} disabled={this.props.uploading || (this.props.cafeDetails && !this.props.cafeDetails.photo)}>削除</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    contentLabel="Test"
                    style={{overlay:{zIndex: 1000}}}
                >
                    <EditCafePhoto id={this.props.cafeID} onPhotoSelected={this.onPhotoSelected} onCancel={this.onCancelUpload} />
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    uploading: state.photo.uploading,
    cafeDetails: state.cafe.cafeDetails
})


export default connect(mapStateToProps, {deleteMainPhoto})(CafePhotoEditor);