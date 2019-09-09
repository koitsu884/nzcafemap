import { SIGN_OUT, SET_CURRENT_USER, EDIT_USER_PHOTO, USER_PHOTO_UPLOADING, DELETE_USER_PHOTO } from '../actions/types';

const INITIAL_STATE = {
    isSignedIn: null,
    user: {},
    uploading: false
};

export default (state = INITIAL_STATE, action) => {
    let tempUser;
    switch (action.type) {
        case SIGN_OUT:
            return { ...state, isSignedIn: false, user: {} };
        case SET_CURRENT_USER:
            localStorage.setItem('user', JSON.stringify(action.payload))
            return {
                ...state,
                isSignedIn: true,
                user: action.payload
            }
        case USER_PHOTO_UPLOADING:
            return {
                ...state,
                uploading: action.payload
            }
        case EDIT_USER_PHOTO:
            tempUser = Object.assign({}, state.user);
            tempUser.mainPhotoURL = action.payload;
            localStorage.setItem('user', JSON.stringify(tempUser));

            return {
                ...state,
                user: tempUser,
                uploading: false
            }
        case DELETE_USER_PHOTO:
            tempUser = Object.assign({}, state.user);
            tempUser.mainPhotoURL = undefined;
            localStorage.setItem('user', JSON.stringify(tempUser));

            return {
                ...state,
                user: tempUser,
                uploading: false
            }
        default:
            return state;
    }
};