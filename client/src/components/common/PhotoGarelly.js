import React, { Component, Fragment } from 'react'
import Modal from 'react-modal';

import SvgArrowLeft from '../common/SvgIcons/SvgArrowLeft';
import SvgArrowRight from '../common/SvgIcons/SvgArrowRight';
import Image from './CloudinaryImage';

Modal.setAppElement("#root")

class PhotoGarelly extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            selectedIndex: 0
        };
    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    }

    openModalWithPhoto = (index) => {
        this.setState({ selectedIndex: +index, modalIsOpen: true })
    }

    renderPhotos = () => {
        return this.props.photos.map((photo, index) => {
            return (
                <div key={photo._id} onClick={() => this.openModalWithPhoto(index)}>
                    <Image
                        className="photoGarelly__item"
                        thumb={true}
                        public_id={photo.public_id}
                        version={photo.version}
                    />
                </div>
            )
        })
    }

    viewrLeftClick = () => {
        let index = this.state.selectedIndex - 1;
        this.setState({
            selectedIndex: index < 0 ? 0 : index
        })
    }

    viewerRightClick = () => {
        let index = this.state.selectedIndex + 1;
        if (index === this.props.photos.length)
            index--;

        this.setState({
            selectedIndex: index
        })
    }

    getSelectedPhotoUserImage = () => {
        const user = this.props.photos[this.state.selectedIndex].user;
        return (
            user.mainPhotoURL ?
                <Image
                    public_id={user.mainPhotoURL}
                    thumb={true}
                    alt={user.displayName}
                    title={user.displayName}
                />
                : <div>No Image</div>
        )
    }

    getSelectedPhotoUserName = () => {
        const user = this.props.photos[this.state.selectedIndex].user;
        return user.displayName;
    }

    renderViewer = () => {
        return (
            <div className="photoViewer">
                <div className="photoViewer__arrowContainer" onClick={this.viewrLeftClick}>
                    {this.state.selectedIndex > 0 ? <div className="photoViewer__arrowContainer__button">
                       <SvgArrowLeft />
                    </div> : null}
                </div>
                <div className="photoViewer__image">
                    <Image
                        public_id={this.props.photos[this.state.selectedIndex].public_id}
                        version={this.props.photos[this.state.selectedIndex].version}
                    />
                </div>
                <div className="photoViewer__arrowContainer" onClick={this.viewerRightClick} >
                    {
                        this.state.selectedIndex < this.props.photos.length - 1
                            ? <div className="photoViewer__arrowContainer__button">
                                <SvgArrowRight />
                            </div>
                            : null
                    }
                </div>
                <div className="photoViewer__user">
                    <div className="photoViewer__user__image">
                        {this.getSelectedPhotoUserImage()}
                    </div>
                    <div>
                        {this.getSelectedPhotoUserName()}
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Fragment>
                <div className="photoGarelly">
                    {this.renderPhotos()}
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    // onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    contentLabel="Photo"
                    className="photoGarelly__modal"
                    style={{ overlay: { zIndex: 100 } }}
                >
                    {
                        this.props.photos && this.props.photos.length > 0 ?
                            this.renderViewer() : null
                    }
                </Modal>
            </Fragment>
        )
    }
}

export default PhotoGarelly;