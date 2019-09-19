import axios from 'axios';

import Alert from '../helper/Alert';
import {MAP_SET_FILTER, MAP_SET_LOADING, MAP_SET_CAFES} from '../actions/types';

const baseURL = process.env.REACT_APP_API_URL;

export const setMapLoading = () => {
    return {
        type: MAP_SET_LOADING
    }
}


export const setFilter = (filters) => dispatch => {
    dispatch({
        type: MAP_SET_FILTER,
        payload: filters
    });

    axios.post('/cafes/search', filters, {
        baseURL: baseURL,
        params:{
            page:1,
            pageSize:30
        }
    })
    .then(response => {
        dispatch({
           type: MAP_SET_CAFES,
           payload: response.data.cafes
       })
    })
    .catch(error => {
        Alert.error(error.response ? error.response.data : error)
        dispatch({
            type: MAP_SET_CAFES,
            payload: null
        })
    })
}