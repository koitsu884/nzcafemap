import axios from 'axios';

import { SET_NEW_CAFES, SET_NEW_REVIEWS } from './types';

const baseURL = process.env.REACT_APP_API_URL;

export const getNewCafes = () => dispatch => {
    axios.get('/cafes/latest', {baseURL: baseURL})
    .then(result => {
        dispatch({
           type: SET_NEW_CAFES,
           payload: result.data
       })
    })
    .catch(error => {
        dispatch({
            type: SET_NEW_CAFES,
            payload: []
        })
    })
}

export const getNewReviews = () => dispatch => {
    axios.get('/reviews/latest', {baseURL: baseURL})
    .then(result => {
        console.log(result);
        dispatch({
           type: SET_NEW_REVIEWS,
           payload: result.data
       })
    })
    .catch(error => {
        dispatch({
            type: SET_NEW_REVIEWS,
            payload: []
        })
    })
}