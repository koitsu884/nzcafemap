import axios from 'axios';
import Alert from '../helper/Alert';

import {
    PHOTO_SET_UPLOADING,
    PHOTO_SET_COUNT,
    DELETE_CAFE_PHOTO,
    DELETE_USER_PHOTO,
    EDIT_USER_PHOTO,
    EDIT_CAFE_PHOTO
} from './types';

const baseURL = process.env.REACT_APP_API_URL;

export const setPhotoUploading = (flag = true) => {
    return {
        type: PHOTO_SET_UPLOADING,
        payload: flag
    }
}

export const setPhotoCount = count => {
    return {
        type: PHOTO_SET_COUNT,
        payload: count
    }
}

export const editMainPhoto = (recordType, id, formData) => dispatch => {
    dispatch(setPhotoUploading());
    axios.post(getPhotoUrl(recordType, id), formData, {
        baseURL: baseURL,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(response => {
        Alert.success('写真をアップロードしました')
        dispatch({
            type: getSetActionName(recordType),
            payload: response.data //Should be image uri
        });
        dispatch(setPhotoUploading(false));
    }).catch(error => {
        Alert.error(error.response ? error.response.data : error);
        dispatch(setPhotoUploading(false));
    })
}


export const deleteMainPhoto = (recordType, id) => dispatch => {
    dispatch(setPhotoUploading());
    axios.delete(getPhotoUrl(recordType, id), {
        baseURL: baseURL
    }).then(response => {
        Alert.success('写真を削除しました');
        dispatch({
            type: getDeleteActionName(recordType)
        });
        dispatch(setPhotoUploading(false));
    }).catch(error => {
        Alert.error(error.response ? error.response.data : error);
        dispatch(setPhotoUploading(false));
    })
}

export const multiplePhotoUpload = (recordType, id, files) => async dispatch => {
    dispatch(setPhotoUploading());
    let failed = [];
    let count = 1;

    for (var file of files) {
        let fd = new FormData();
        fd.append('photo', file, 'photo_' + count);
        dispatch(setPhotoCount(count));
        try{
            await axios.post(getPhotoUrl(recordType, id), fd, {
                baseURL: baseURL,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            count++;
        } catch(error) {
            failed.push(file.name);
        }
    }

    if (failed.length > 0) {
        console.log("Faild to upload some files");
        console.log(failed);
    }
    dispatch(setPhotoUploading(false));
    dispatch(setPhotoCount(0));
}

/*-----------------------------------
Private functions
------------------------------------*/
const getPhotoUrl = (recordType, id) => {
    if (recordType === 'users')
        return '/users/photo';
    else
        return `/${recordType}/${id}/photo`;
}

const getSetActionName = (recordType) => {
    switch (recordType) {
        case 'users':
            return EDIT_USER_PHOTO;
        case 'cafes':
            return EDIT_CAFE_PHOTO;
        default:
            return '';
    }
}

const getDeleteActionName = (recordType) => {
    switch (recordType) {
        case 'users':
            return DELETE_USER_PHOTO
        case 'cafes':
            return DELETE_CAFE_PHOTO
        default:
            return ''
    }
}