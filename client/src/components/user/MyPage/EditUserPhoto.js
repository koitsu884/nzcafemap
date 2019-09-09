import React, {Component} from 'react'
import ImageUploader from '../../common/ImageUploader';
import { connect } from 'react-redux';
import { editMainPhoto} from '../../../actions/photoActions';


class EditUserPhoto extends Component {
    onUploadPhoto = (blob) => {
        let fd = new FormData();
        fd.append('photo', blob, 'prof.jpg');
        this.props.editMainPhoto('users', null, fd);

        //Closing modal
        this.props.onPhotoSelected();
    }

    onCancel = () => {
        this.props.onCancel();
    }

    render() {
        return (
            <div className="editUserPhoto">
                <h1 className="u-margin-bottom-medium">プロフィール写真編集</h1>
                <ImageUploader onUploadPhoto={this.onUploadPhoto} maxSize={250} />
                <button className="btn" type="button" onClick={this.onCancel}>キャンセル</button>
            </div>
        )
    }
}


export default connect(null, {editMainPhoto})(EditUserPhoto)
