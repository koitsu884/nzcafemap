import React, {Component} from 'react'
import ImageUploader from '../common/ImageUploader';
import { connect } from 'react-redux';
import { editMainPhoto} from '../../actions/photoActions';
// import { EDIT_CAFE_PHOTO} from '../../actions/types';


class EditCafePhoto extends Component {
    onUploadPhoto = (blob) => {
        let fd = new FormData();
        fd.append('photo', blob, 'main.jpg');
        // this.props.editMainPhoto(`/cafes/${this.props.id}/photo`, EDIT_CAFE_PHOTO, fd);
        this.props.editMainPhoto('cafes', this.props.id, fd);

        //Closing modal
        this.props.onPhotoSelected();
    }

    onCancel = () => {
        this.props.onCancel();
    }

    render() {
        return (
            <div className="editUserPhoto">
                <h1 className="u-margin-bottom-medium">メインフォト編集</h1>
                <ImageUploader aspect={3/2} onUploadPhoto={this.onUploadPhoto} maxSize={640} />
                <button className="btn" type="button" onClick={this.onCancel}>キャンセル</button>
            </div>
        )
    }
}


export default connect(null, {editMainPhoto})(EditCafePhoto)
