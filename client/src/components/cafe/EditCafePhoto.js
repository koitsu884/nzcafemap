import React, {Component, Fragment} from 'react'
import ImageUploader from '../common/ImageUploader';
import { connect } from 'react-redux';
import { editMainPhoto} from '../../actions/photoActions';
import Spinner from '../common/Spinner';
// import { EDIT_CAFE_PHOTO} from '../../actions/types';


class EditCafePhoto extends Component {
    componentWillReceiveProps = nextProps => {
        if(this.props.uploading && !nextProps.uploading){
            //Closing modal
            this.props.onPhotoSelected();
        }
    }

    onUploadPhoto = (blob) => {
        let fd = new FormData();
        fd.append('photo', blob, 'main.jpg');
        // this.props.editMainPhoto(`/cafes/${this.props.id}/photo`, EDIT_CAFE_PHOTO, fd);
        this.props.editMainPhoto('cafes', this.props.id, fd);
        //Closing modal
        // this.props.onPhotoSelected();
    }

    onCancel = () => {
        this.props.onCancel();
    }

    render() {
        return (
            <div className="editUserPhoto">
                <h1 className="u-margin-bottom-medium">メインフォト編集</h1>
                {
                    this.props.uploading ? <Spinner /> : (
                        <Fragment>
                            <ImageUploader aspect={3/2} onUploadPhoto={this.onUploadPhoto} maxSize={1024} />
                            <div className="u-text-right">
                                <button className="btn btn--secondary u-margin-auto" type="button" onClick={this.onCancel}>キャンセル</button>
                            </div>
                        </Fragment>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    uploading: state.photo.uploading,
});

export default connect(mapStateToProps, {editMainPhoto})(EditCafePhoto)
