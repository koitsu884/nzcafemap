import history from '../history';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
// import jwt_decode from 'jwt-decode';

import {SIGN_OUT, SET_CURRENT_USER, SET_ERRORS} from './types';
import {clearError} from './errorActions';

const baseURL = process.env.REACT_APP_API_URL;

export const signUp = (formData) => dispatch => {
    formData.confirmPassword = undefined;
    axios.post('/users', formData, {baseURL: baseURL})
    .then( result => {
        // const token = result.headers['x-auth-token'];
        // setAuthToken(token);
        // localStorage.setItem('jwtToken', token)
        // dispatch(setCurrentUser(result.data));
        dispatch(clearError());
        sessionStorage.setItem('email', formData.email);
        history.push('/static/emailsent');
    })
    .catch( error => {
        dispatch({
            type: SET_ERRORS,
            payload: error
        });
    })
}

export const signIn = (formData) => dispatch => {
    axios.post('/auth', formData, {baseURL: baseURL})
        .then( result => {
            const token = result.headers['x-auth-token'];
            setAuthToken(token);
            localStorage.setItem('jwtToken', token)
            dispatch(setCurrentUser(result.data));
            dispatch(clearError());
            history.push('/');
        })
        .catch( error => {
            console.log(error);
            dispatch({
                type: SET_ERRORS,
                payload: error
            });
        })
}

export const signOut = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');

    history.push('/');
    return {
        type: SIGN_OUT
    }
};

export const setCurrentUser = (user) => {
    return {
        type: SET_CURRENT_USER,
        payload: user
    }
}
