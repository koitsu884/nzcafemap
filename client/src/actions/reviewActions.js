import axios from 'axios';
import Swal from 'sweetalert2';

import { SET_NEW_REVIEWS } from './types';
import history from '../history';

const baseURL = process.env.REACT_APP_API_URL;

export const addReview = (review) => dispatch => {
    axios.post('/reviews', review, { baseURL: baseURL })
        .then(result => {
            Swal.fire({
                title: 'Success!',
                text: 'レビューを追加しました',
                animation: 'false'
            })
            history.push('/cafes/' + review.cafe);
        })
        .catch(error => {
            Swal.fire({
                title: 'Error!',
                type: 'error',
                text: error.response ? error.response.data : error,
                animation: 'false'
            })
        })
}