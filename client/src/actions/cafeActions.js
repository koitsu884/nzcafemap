import axios from 'axios';
import history from '../history';
import Swal from 'sweetalert2';

import { SEARCH_CAFES, SET_CAFES, SET_CAFE_DETAILS, CAFE_SET_LOADING } from './types';

const baseURL = process.env.REACT_APP_API_URL;

export const setCafeLoading = (value) => {
    return {
        type: CAFE_SET_LOADING,
        payload: value
    }
}

export const createCafe = newCafe => dispatch => {
    dispatch(setCafeLoading(true))

    axios.post('/cafes', newCafe, {baseURL: baseURL})
    .then( result => {
        Swal.fire({
            title: 'Success!',
            text: 'カフェ情報を追加しました',
            animation: 'false'
        })
        dispatch(setCafeLoading(false))
        history.push('/mypage');
    })
    .catch( error => {
        Swal.fire({
            title: 'Error!',
            type: 'error',
            text: error.response ? error.response.data : error,
            animation: 'false'
        })
        dispatch(setCafeLoading(false))
    })
}

export const updateCafe = (id, newCafe) => dispatch => {
    dispatch(setCafeLoading(true));
    axios.put('/cafes/' + id, newCafe, {baseURL: baseURL})
    .then( result => {
        Swal.fire({
            title: 'Success!',
            text: 'カフェ情報を更新しました',
            animation: 'false'
        })
        dispatch(setCafeLoading(false))
        history.push('/mypage');
    })
    .catch( error => {
        Swal.fire({
            title: 'Error!',
            type: 'error',
            text: error.response ? error.response.data : error,
            animation: 'false'
        })
        dispatch(setCafeLoading(false))
    })
}

export const setFilter = (filters, order='', page=1, pageSize=24) => dispatch => {
    dispatch({
        type: SEARCH_CAFES,
        payload: {filters: filters, page:page, pageSize:pageSize}
    });

    axios.post('/cafes/search', filters, {
        baseURL: baseURL,
        params:{
            order:order,
            page:page,
            pageSize:pageSize
        }
    })
    .then(response => {
        let payload = {
            cafes: response.data.cafes,
            currentPage: response.data.currentPage,
            pageSize: response.data.pageSize,
            itemCount: response.data.totalCount,
        }
        dispatch({
           type: SET_CAFES,
           payload: payload
       })
    })
    .catch(error => {
        Swal.fire({
            title: 'Error!',
            type: 'error',
            text: error.response ? error.response.data : error,
            animation: 'false'
        })
        dispatch(setCafeLoading(false))
    })
}

export const getCafeDetails = id => dispatch => {
    dispatch(setCafeLoading(true))
    axios.get('/cafes/' + id, {baseURL: baseURL})
    .then(result => {
        dispatch({
            type: SET_CAFE_DETAILS,
            payload: result.data
        })
    })
    .catch(error => {
        Swal.fire({
            title: 'Error!',
            type: 'error',
            text: error.response ? error.response.data : error,
            animation: 'false'
        })
        dispatch(setCafeLoading(false))
    })
}


