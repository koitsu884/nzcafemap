import axios from 'axios';
import Alert from '../helper/Alert';

import {
    MYPAGE_CLEAR,
    MYPAGE_SET_CAFES,
    MYPAGE_DELETE_CAFE,
    MYPAGE_SET_REVIEWS,
    MYPAGE_SET_USER,
    UPDATE_USER_PROFILE,
    SET_ERRORS,
    MYPAGE_SET_LOADING_CAFE,
    MYPAGE_SET_LOADING_REVIEW,
    MYPAGE_SET_LOADING_RATE
} from './types';

import { setCurrentUser } from './authActions';

const baseURL = process.env.REACT_APP_API_URL;

export const clearMyPage = () => {
    return {
        type: MYPAGE_CLEAR
    }
}

export const setUserProfile = (user) => {
    return {
        type: MYPAGE_SET_USER,
        payload: user
    }
}

export const updateUserProfile = (updatedUser) => {
    return {
        type: UPDATE_USER_PROFILE,
        payload: updatedUser
    }
}

export const setCafeLoading = () => {
    return {
        type: MYPAGE_SET_LOADING_CAFE
    }
}

export const setMyCafes = cafes => {
    return {
        type: MYPAGE_SET_CAFES,
        payload: cafes
    }
}

export const deleteMyCafe = id => {
    return {
        type: MYPAGE_DELETE_CAFE,
        payload: id
    }
}

export const setReviewLoading = () => {
    return {
        type: MYPAGE_SET_LOADING_REVIEW
    }
}

export const setMyReviews = (reviews, pagination) => {
    return {
        type: MYPAGE_SET_REVIEWS,
        payload: { reviews: reviews, pagination: pagination}
    }
}

export const setRateLoading = () => {
    return {
        type: MYPAGE_SET_LOADING_RATE
    }
}

export const getProfile = () => dispatch => {
    axios.get('/users/me', {
        baseURL:baseURL
    })
    .then(response => {
        dispatch(setUserProfile(response.data))
    })
    .catch(error => {
        Alert.error(error.response ? error.response.data : error)
    })
}

export const updateProfile = formdata => dispatch => {
    axios.patch(`/users`, formdata, {
        baseURL: baseURL,
    }).then(response => {
        dispatch(updateUserProfile(response.data))
        dispatch(setCurrentUser(response.data))
    }).catch(error => {
        dispatch({
            type: SET_ERRORS,
            payload: error
        });
    })
}

export const getMyCafes = (order='', page=1, pageSize=8) => dispatch => {
    dispatch(setCafeLoading());
    axios.get('/cafes/mine', {
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
            pageCount: Math.ceil(response.data.totalCount / response.data.pageSize),
        }
        dispatch({
           type: MYPAGE_SET_CAFES,
           payload: payload
       })
    })
    .catch(error => {
        Alert.error(error.response ? error.response.data : error)
    })
}

export const deleteCafe = id => dispatch => {
    dispatch(setCafeLoading());
    axios.delete('/cafes/' + id, {baseURL:baseURL})
        .then(result => {
            Alert.success('カフェ情報を削除しました');
            dispatch(deleteMyCafe(id))
        })
        .catch(error => {
            Alert.error(error.response ? error.response.data : error);
            dispatch(deleteMyCafe())
        })
}

export const getMyReviews = (order='', page=1, pageSize=10) => dispatch => {
    dispatch(setReviewLoading())
    axios.get('reviews/mine', {
        baseURL: baseURL,
        params:{
            order:order,
            page:page,
            pageSize:pageSize
        }
    })
    .then(response => {
        let pagination = {
            currentPage: response.data.currentPage,
            pageSize: response.data.pageSize,
            itemCount: response.data.totalCount,
            pageCount: Math.ceil(response.data.totalCount / response.data.pageSize),
        }

        dispatch(setMyReviews(response.data.reviews, pagination));
        // this.setState({
        //     loading:false,
        //     reviews: response.data
        // })
    })
    .catch(errors => {
        console.log(errors)
    })
}