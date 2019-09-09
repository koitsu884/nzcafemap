import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import PhotoGarelly from '../common/PhotoGarelly';
import Spinner from '../common/Spinner';
import { getGarellyPhotos } from '../../actions/garellyActions';

const PHOTO_READ_LIMIT = 20;

class CafePhotoGarelly extends Component {
    componentDidMount() {
        const { cafe } = this.props;
        if (cafe) {
            this.props.getGarellyPhotos(cafe._id, 0, PHOTO_READ_LIMIT, true);
        }
    }

    readNextPhotos = () => {
        const { cafe, photos } = this.props;
        this.props.getGarellyPhotos(cafe._id, photos.length, PHOTO_READ_LIMIT);
    }

    renderNextButton = () => {
        if (this.props.complete) return null;

        return (
            <button type="button" className="btn" onClick={this.readNextPhotos} disabled={this.props.loading}>更に読み込む</button>
        )
    }

    render() {
        if (!this.props.cafe) {
            return <div>カフェデータが読み込まれていません</div>
        }
        return (
            <Fragment>
                <div className="cafePhotoGarelly">
                    <PhotoGarelly photos={this.props.photos} />
                    {this.props.loading ? <Spinner /> : null}
                </div>
                {this.renderNextButton()}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    cafe: state.cafe.cafeDetails,
    photos: state.garelly.photos,
    loading: state.garelly.loading,
    complete: state.garelly.complete
})

export default connect(mapStateToProps, { getGarellyPhotos })(CafePhotoGarelly);

