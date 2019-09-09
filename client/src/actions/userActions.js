import axios from 'axios';

import { 
    SET_ERRORS, 
    USER_PHOTO_UPLOADING,
    UPDATE_USER_PROFILE,
 } from './types';

const baseURL = process.env.REACT_APP_API_URL;

export const setUserPhotoUploading = (flag) => {
    return {
        type: USER_PHOTO_UPLOADING,
        payload: flag ? flag : true
    }
}

export const updateProfile = formdata => dispatch => {
    axios.put(`/users`, formdata, {
        baseURL: baseURL,
    }).then(response => {
        dispatch({
            type: UPDATE_USER_PROFILE,
            payload: response.data
        });
    }).catch(error => {
        dispatch({
            type: SET_ERRORS,
            payload: error
        });
    })
}