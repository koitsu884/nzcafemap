import React, { Component } from 'react'
import Modal from 'react-modal';
import EditUserPhoto from './EditUserPhoto';
import Spinner from '../../common/Spinner';
import Swal from 'sweetalert2';
import Image from '../../common/CloudinaryImage';

// import { deleteUserPhoto } from '../../../actions/userActions';
import { deleteMainPhoto } from '../../../actions/photoActions';
import { connect} from 'react-redux';

Modal.setAppElement("#root")

class UserPhotoEditor extends Component {
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
                this.props.deleteMainPhoto('users');
            }
        })
    }


    renderPhoto = () => {
        if (this.props.uploading) {
            return (
                <Spinner />
            )
        }
        if (this.props.mainPhotoURL) {
            return (
                <Image className="image" alt="profImage" public_id={this.props.mainPhotoURL} ></Image>
                // <img src={this.props.userPhotoUrl} className="image" alt="profImage" />
            )
        }

        return (
            <div>No Image</div>
        )
    }


    render() {
        return (
            <div className="userPhotoEditor">
                <h3>プロフィール写真</h3>
                <div className="userPhotoEditor__photo">
                    {this.renderPhoto()}
                </div>
                <button className="btn" type="button" onClick={this.openModal} disabled={this.props.uploading}>編集</button>
                <button className="btn" type="button" onClick={this.onDeletePhoto} disabled={this.props.uploading || !this.props.mainPhotoURL}>削除</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    contentLabel="Test"
                    style={{ 
                        overlay: { zIndex: 1000 },
                    }}
                    className="modal-content"
                >
                    <EditUserPhoto onPhotoSelected={this.onPhotoSelected} onCancel={this.onCancelUpload} />
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    uploading: state.photo.uploading,
    mainPhotoURL: state.user.user.mainPhotoURL
})


export default connect(mapStateToProps, {deleteMainPhoto})(UserPhotoEditor);