import axios from 'axios';
import Alert from '../helper/Alert';

import {
    GARELLY_ADD_PHOTOS,
    GARELLY_SET_LOADING,
    GARELLY_CLEAR_PHOTOS,
    GARELLY_SET_COMPLETE
} from './types';

const baseURL = process.env.REACT_APP_API_URL;

export const setGarellyLoading = flag => {
    return {
        type: GARELLY_SET_LOADING,
        payload: flag
    }
}

export const addGarellyPhotos = photos => {
    return {
        type: GARELLY_ADD_PHOTOS,
        payload: photos
    }
}

export const clearGarellyPhotos = () => {
    return {
        type: GARELLY_CLEAR_PHOTOS
    }
}

export const setGarellyComplete = () => {
    return {
        type: GARELLY_SET_COMPLETE
    }
}

export const getGarellyPhotos = (cafeId, from, limit, clear=false) => dispatch => {
    if(clear){
        dispatch(clearGarellyPhotos())
    }
    dispatch(setGarellyLoading(true));
    axios.get(`/cafes/${cafeId}/photos`, {
        baseURL: baseURL,
        params: {
            from: from,
            limit: limit
        }
    })
    .then(response => {
        dispatch(addGarellyPhotos(response.data))
        if(response.data.length < limit){
            dispatch(setGarellyComplete());
        }
    })
    .catch(error => {
        Alert.error(error.response ? error.response.data : error);
    })
}